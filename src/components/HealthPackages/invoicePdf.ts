// ================= START: invoicePdf.ts =================
import logoImg from '@/assets/images/logo.png';
import { formatBDT } from '@/data/healthPackages';

type RGB = [number, number, number];

export interface IInvoiceItem {
  name: string;
  testCount: number;
  rate: number;
  price: number;
  tests: string[];
}

export interface IInvoiceData {
  number: string;
  issuedAt: string;
  customer: {
    name: string;
    phone: string;
    email: string;
    preferredDate?: string;
    note?: string;
  };
  center: { name: string; address: string; contact: string };
  items: IInvoiceItem[];
  totalRate: number;
  total: number;
  saved: number;
}

const GREEN: RGB = [11, 97, 45];
const GOLD: RGB = [195, 149, 61];
const DARK: RGB = [28, 42, 34];
const GREY: RGB = [107, 122, 114];
const TINT: RGB = [238, 247, 241];
const LINE: RGB = [208, 224, 213];
const WHITE: RGB = [255, 255, 255];
const LEAF: RGB = [150, 214, 165]; // light green used for the logo leaves on the dark header

// company details (header tagline + footer contact lines)
const COMPANY = {
  name: 'Grameen Kalyan',
  tagline: 'Health Package Booking',
  hotlines: ['+8801334944640', '+880244802111', '+8809642115500'],
  email: 'contact@grameenkalyan.com',
  website: 'www.grameenkalyan.com',
  address:
    '5th Floor, Grameen Telecom Bhaban, 53/1 Box Nagar, Mirpur 1, Dhaka 1216, Bangladesh',
};

const PT = 0.3528; // 1pt in mm
const S = 4; // canvas pixels per pt (sharp text for non-latin scripts)
const FONT_STACK =
  'Inter, "Noto Sans Bengali", "Nirmala UI", "Kohinoor Bangla", sans-serif';
// characters the built-in PDF font can print; anything else (e.g. Bengali) is drawn as an image
const LATIN = /^[\u0020-\u007E\u00A0-\u00FF\u2018\u2019\u201C\u201D\u2013\u2014]*$/;

interface ILogo {
  data: string;
  ratio: number; // width / height
}

// returns null when the logo image is missing or cannot be read -> the header shows the name instead
const loadLogo = (): Promise<ILogo | null> =>
  new Promise((resolve) => {
    if (!logoImg || !logoImg.src) {
      resolve(null);
      return;
    }
    const img = new window.Image();
    img.onload = () => {
      try {
        const scale = Math.min(1, 700 / Math.max(img.naturalWidth, img.naturalHeight));
        const w = Math.max(1, Math.round(img.naturalWidth * scale));
        const h = Math.max(1, Math.round(img.naturalHeight * scale));
        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
        ctx.drawImage(img, 0, 0, w, h);

        // the dark green leaves would disappear on the green header -> make them light green
        const pixels = ctx.getImageData(0, 0, w, h);
        const d = pixels.data;
        for (let i = 0; i < d.length; i += 4) {
          if (d[i + 3] > 0 && d[i + 1] > d[i] + 15 && d[i + 1] >= d[i + 2]) {
            d[i] = LEAF[0];
            d[i + 1] = LEAF[1];
            d[i + 2] = LEAF[2];
          }
        }
        ctx.putImageData(pixels, 0, 0);

        resolve({
          data: canvas.toDataURL('image/png'),
          ratio: img.naturalWidth / img.naturalHeight || 1,
        });
      } catch (e) {
        resolve(null);
      }
    };
    img.onerror = () => resolve(null);
    img.src = logoImg.src;
  });

export async function downloadInvoicePdf(data: IInvoiceData): Promise<void> {
  const { jsPDF } = await import('jspdf');
  const doc = new jsPDF({ unit: 'mm', format: 'a4', compress: true });
  doc.setProperties({
    title: `Invoice ${data.number}`,
    author: 'Grameen Kalyan',
  });

  const W = 210;
  const H = 297;
  const M = 14;
  const CW = W - M * 2;
  const logo = await loadLogo();
  const probe = document.createElement('canvas').getContext(
    '2d'
  ) as CanvasRenderingContext2D;

  /* ---------- text helpers ---------- */
  const lineH = (size: number) => size * PT * 1.45;

  const measure = (text: string, size: number, bold: boolean) => {
    if (LATIN.test(text)) {
      doc.setFont('helvetica', bold ? 'bold' : 'normal');
      doc.setFontSize(size);
      return doc.getTextWidth(text);
    }
    probe.font = `${bold ? 700 : 400} ${size * S}px ${FONT_STACK}`;
    return (probe.measureText(text).width / S) * PT;
  };

  const wrap = (text: string, maxW: number, size: number, bold: boolean) => {
    const out: string[] = [];
    String(text || '')
      .split('\n')
      .forEach((para) => {
        let line = '';
        para
          .split(/\s+/)
          .filter(Boolean)
          .forEach((word) => {
            const next = line ? `${line} ${word}` : word;
            if (line && measure(next, size, bold) > maxW) {
              out.push(line);
              line = word;
            } else {
              line = next;
            }
          });
        out.push(line);
      });
    return out;
  };

  const draw = (
    text: string,
    x: number,
    y: number,
    opts: {
      size?: number;
      bold?: boolean;
      color?: RGB;
      align?: 'left' | 'right' | 'center';
    } = {}
  ) => {
    if (!text) return;
    const { size = 10, bold = false, color = DARK, align = 'left' } = opts;
    const w = measure(text, size, bold);
    let left = x;
    if (align === 'right') left = x - w;
    if (align === 'center') left = x - w / 2;

    if (LATIN.test(text)) {
      doc.setFont('helvetica', bold ? 'bold' : 'normal');
      doc.setFontSize(size);
      doc.setTextColor(color[0], color[1], color[2]);
      doc.text(text, left, y);
      return;
    }

    // non-latin text (Bengali etc.): let the browser shape it, then place as an image
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    const font = `${bold ? 700 : 400} ${size * S}px ${FONT_STACK}`;
    ctx.font = font;
    canvas.width = Math.ceil(ctx.measureText(text).width) + 4;
    canvas.height = Math.ceil(size * S * 1.7);
    ctx.font = font;
    ctx.fillStyle = `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
    ctx.textBaseline = 'alphabetic';
    ctx.fillText(text, 0, size * S * 1.2);
    doc.addImage(
      canvas.toDataURL('image/png'),
      'PNG',
      left,
      y - size * 1.2 * PT,
      (canvas.width / S) * PT,
      (canvas.height / S) * PT
    );
  };

  const fill = (c: RGB) => doc.setFillColor(c[0], c[1], c[2]);
  const stroke = (c: RGB) => doc.setDrawColor(c[0], c[1], c[2]);

  /* ---------- header band ---------- */
  const LOGO_H = 16;
  const logoW = logo ? Math.min(LOGO_H * logo.ratio, 70) : 0;
  const logoH = logo ? logoW / logo.ratio : 0;
  const logoBottom = logo ? 8 + logoH : 24;
  const infoLines: { text: string; bold?: boolean; color: RGB }[] = [
    { text: COMPANY.tagline, bold: true, color: [240, 214, 140] },
  ];
  const infoStep = lineH(8.5);
  const headerH = Math.max(logoBottom + 6 + infoLines.length * infoStep + 3, 40);

  fill(GREEN);
  doc.rect(0, 0, W, headerH, 'F');
  fill(GOLD);
  doc.rect(0, headerH, W, 1.8, 'F');

  if (logo) {
    // logo found -> show only the logo, directly on the green header (no white box, no text)
    doc.addImage(logo.data, 'PNG', M, 8, logoW, logoH);
  } else {
    // logo missing -> show the name
    draw(COMPANY.name, M, 20, { size: 22, bold: true, color: WHITE });
  }

  // under the logo: tagline, phone, email, website, address
  let hy = logoBottom + 6;
  infoLines.forEach((l) => {
    draw(l.text, M, hy, { size: l.bold ? 9.5 : 8.5, bold: l.bold, color: l.color });
    hy += infoStep;
  });

  draw('INVOICE', W - M, 19, {
    size: 26,
    bold: true,
    color: WHITE,
    align: 'right',
  });
  draw(`No: ${data.number}`, W - M, 27, {
    size: 10,
    bold: true,
    color: [240, 214, 140],
    align: 'right',
  });
  draw(`Date: ${data.issuedAt}`, W - M, 33, {
    size: 9.5,
    color: WHITE,
    align: 'right',
  });

  /* ---------- billed to / health center ---------- */
  interface ILine {
    text: string;
    size: number;
    bold?: boolean;
    color?: RGB;
  }

  const gap = 6;
  const boxW = (CW - gap) / 2;
  const textW = boxW - 12;

  const expand = (rows: ILine[]) =>
    rows.flatMap((row) =>
      wrap(row.text, textW, row.size, !!row.bold).map((t) => ({
        ...row,
        text: t,
      }))
    );

  const c = data.customer;
  const billed = expand(
    [
      { text: c.name, size: 11.5, bold: true },
      { text: `Phone: ${c.phone}`, size: 9, color: GREY },
      { text: `Email: ${c.email}`, size: 9, color: GREY },
      c.preferredDate
        ? { text: `Preferred date: ${c.preferredDate}`, size: 9, color: GREY }
        : null,
    ].filter(Boolean) as ILine[]
  );

  const center = expand(
    [
      { text: data.center.name, size: 11.5, bold: true },
      data.center.address
        ? { text: data.center.address, size: 9, color: GREY }
        : null,
      data.center.contact
        ? { text: `Contact: ${data.center.contact}`, size: 9, color: GREY }
        : null,
    ].filter(Boolean) as ILine[]
  );

  const sumH = (lines: ILine[]) =>
    lines.reduce((sum, l) => sum + lineH(l.size), 0);
  const boxH = 14 + Math.max(sumH(billed), sumH(center));

  const drawBox = (x: number, y: number, label: string, lines: ILine[]) => {
    fill(TINT);
    stroke(LINE);
    doc.setLineWidth(0.25);
    doc.roundedRect(x, y, boxW, boxH, 2.5, 2.5, 'FD');
    fill(GOLD);
    doc.rect(x, y + 4, 1.1, boxH - 8, 'F');
    draw(label, x + 6, y + 7, { size: 7.5, bold: true, color: GOLD });
    let ty = y + 13.5;
    lines.forEach((l) => {
      draw(l.text, x + 6, ty, { size: l.size, bold: l.bold, color: l.color });
      ty += lineH(l.size);
    });
  };

  let y = headerH + 12;
  drawBox(M, y, 'BILLED TO', billed);
  drawBox(M + boxW + gap, y, 'HEALTH CENTER', center);
  y += boxH + 9;

  /* ---------- package table ---------- */
  const COL_NUM = M + 4;
  const COL_NAME = M + 13;
  const COL_TESTS = W - M - 72;
  const COL_RATE = W - M - 33;
  const COL_AMOUNT = W - M - 4;
  const NAME_W = COL_TESTS - 12 - COL_NAME;

  const tableHeader = (top: number) => {
    fill(GREEN);
    doc.roundedRect(M, top, CW, 9, 2, 2, 'F');
    draw('#', COL_NUM, top + 6, { size: 8, bold: true, color: WHITE });
    draw('PACKAGE', COL_NAME, top + 6, { size: 8, bold: true, color: WHITE });
    draw('TESTS', COL_TESTS, top + 6, {
      size: 8,
      bold: true,
      color: WHITE,
      align: 'center',
    });
    draw('TOTAL COST', COL_RATE, top + 6, {
      size: 8,
      bold: true,
      color: WHITE,
      align: 'right',
    });
    draw('AMOUNT', COL_AMOUNT, top + 6, {
      size: 8,
      bold: true,
      color: WHITE,
      align: 'right',
    });
    return top + 9;
  };

  y = tableHeader(y);

  data.items.forEach((item, i) => {
    const nameLines = wrap(item.name, NAME_W, 10.5, true);
    const inclLines = wrap(
      `Includes: ${item.tests.join(', ')}`,
      NAME_W,
      7.5,
      false
    );
    const rowH =
      4 + nameLines.length * lineH(10.5) + inclLines.length * lineH(7.5) + 2.5;

    if (y + rowH > H - 40) {
      doc.addPage();
      y = tableHeader(18);
    }

    if (i % 2 === 0) {
      fill(TINT);
      doc.rect(M, y, CW, rowH, 'F');
    }

    let ty = y + 6.5;
    draw(String(i + 1), COL_NUM, ty, { size: 9.5, bold: true, color: GOLD });
    nameLines.forEach((l) => {
      draw(l, COL_NAME, ty, { size: 10.5, bold: true, color: GREEN });
      ty += lineH(10.5);
    });
    inclLines.forEach((l) => {
      draw(l, COL_NAME, ty - 0.8, { size: 7.5, color: GREY });
      ty += lineH(7.5);
    });

    draw(String(item.testCount), COL_TESTS, y + 6.5, {
      size: 9.5,
      align: 'center',
    });
    if (item.rate > item.price) {
      const label = formatBDT(item.rate);
      draw(label, COL_RATE, y + 6.5, { size: 9, color: GREY, align: 'right' });
      const w = measure(label, 9, false);
      stroke(GREY);
      doc.setLineWidth(0.2);
      doc.line(COL_RATE - w, y + 5.4, COL_RATE, y + 5.4);
    }
    draw(formatBDT(item.price), COL_AMOUNT, y + 6.5, {
      size: 10,
      bold: true,
      align: 'right',
    });

    y += rowH;
    stroke(LINE);
    doc.setLineWidth(0.2);
    doc.line(M, y, W - M, y);
  });

  /* ---------- totals ---------- */
  y += 8;
  if (y + 52 > H - 40) {
    doc.addPage();
    y = 20;
  }

  const totX = W - M - 82;
  const totW = 82;
  let ty = y;

  if (data.saved > 0) {
    draw('Total Cost', totX + 2, ty + 4, { size: 9.5, color: GREY });
    const label = formatBDT(data.totalRate);
    draw(label, W - M - 2, ty + 4, { size: 9.5, color: GREY, align: 'right' });
    const w = measure(label, 9.5, false);
    stroke(GREY);
    doc.setLineWidth(0.2);
    doc.line(W - M - 2 - w, ty + 3, W - M - 2, ty + 3);
    ty += 7;
    draw('You Save', totX + 2, ty + 4, { size: 9.5, bold: true, color: GREEN });
    draw(formatBDT(data.saved), W - M - 2, ty + 4, {
      size: 9.5,
      bold: true,
      color: GREEN,
      align: 'right',
    });
    ty += 9;
  }

  fill(GREEN);
  doc.roundedRect(totX, ty, totW, 15, 2.5, 2.5, 'F');
  fill(GOLD);
  doc.rect(totX, ty + 3, 1.4, 9, 'F');
  draw('TOTAL AMOUNT', totX + 6, ty + 9.3, {
    size: 8.5,
    bold: true,
    color: [240, 214, 140],
  });
  draw(formatBDT(data.total), W - M - 4, ty + 9.8, {
    size: 14,
    bold: true,
    color: WHITE,
    align: 'right',
  });

  // left side: what happens next
  const infoW = CW - totW - 10;
  draw('NEXT STEP', M, y + 4, { size: 7.5, bold: true, color: GOLD });
  let iy = y + 9.5;
  wrap(
    'This invoice confirms your booking request. Our team will contact you shortly. Please carry this invoice to the selected health center.',
    infoW,
    9,
    false
  ).forEach((l) => {
    draw(l, M, iy, { size: 9, color: GREY });
    iy += lineH(9);
  });

  y = Math.max(ty + 15, iy) + 8;

  /* ---------- note ---------- */
  if (c.note) {
    const noteLines = wrap(c.note, CW - 12, 9, false);
    const noteH = 13 + noteLines.length * lineH(9);
    if (y + noteH > H - 40) {
      doc.addPage();
      y = 20;
    }
    fill(TINT);
    stroke(LINE);
    doc.setLineWidth(0.25);
    doc.roundedRect(M, y, CW, noteH, 2.5, 2.5, 'FD');
    fill(GOLD);
    doc.rect(M, y + 4, 1.1, noteH - 8, 'F');
    draw('NOTE', M + 6, y + 7, { size: 7.5, bold: true, color: GOLD });
    let ny = y + 13;
    noteLines.forEach((l) => {
      draw(l, M + 6, ny, { size: 9, color: DARK });
      ny += lineH(9);
    });
  }

  /* ---------- footer on every page ---------- */
  const pages = doc.getNumberOfPages();

  // footer contact lines - each one stays on a single line (font shrinks if needed)
  const footerLines = [
    `Hotline: ${COMPANY.hotlines.join('  |  ')}`,
    `Email: ${COMPANY.email}  |  Website: ${COMPANY.website}`,
    COMPANY.address,
  ];
  const fitSize = (text: string, size: number, maxW: number) => {
    let fs = size;
    while (fs > 5.5 && measure(text, fs, false) > maxW) fs -= 0.25;
    return fs;
  };

  for (let p = 1; p <= pages; p += 1) {
    doc.setPage(p);
    fill(GOLD);
    doc.rect(M, H - 35, CW, 0.6, 'F');
    draw('Thank you for choosing Grameen Kalyan.', W / 2, H - 29, {
      size: 9.5,
      bold: true,
      color: GREEN,
      align: 'center',
    });
    let fy = H - 23.5;
    footerLines.forEach((line) => {
      draw(line, W / 2, fy, {
        size: fitSize(line, 8, CW),
        color: GREY,
        align: 'center',
      });
      fy += 4.6;
    });
    draw(
      'This is a computer-generated invoice and does not require a signature.',
      W / 2,
      H - 8.5,
      { size: 7.5, color: GREY, align: 'center' }
    );
    if (pages > 1) {
      draw(`Page ${p} of ${pages}`, W - M, H - 8.5, {
        size: 7.5,
        color: GREY,
        align: 'right',
      });
    }
  }

  doc.save(`Invoice-${data.number}.pdf`);
}
// ================== END: invoicePdf.ts ==================