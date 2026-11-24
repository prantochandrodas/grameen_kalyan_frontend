// ================= START: src/components/Auth/purchaseInvoice.ts =================
import type { IInvoiceData } from '@/components/HealthPackages/invoicePdf';
import { getDataByKeyword } from '@/components/Healthcare/MapSection/mapSection.helper';
import { HEALTH_PACKAGES } from '@/data/healthPackages';
import type { IHealthCenter } from '@/shared/types/healthCenter';
import type { IPurchase, IUser } from '@/shared/utils/authService';
import { getPackageCore } from '@/shared/utils/healthPackagePricing';

const DATE_FORMAT: Intl.DateTimeFormatOptions = {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
};

const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-GB', DATE_FORMAT);

const same = (a: string, b: string) =>
  a.trim().toLowerCase() === b.trim().toLowerCase();

// the center list is loaded once, so the next download is instant
let centersCache: IHealthCenter[] | null = null;

// address + contact are not saved with a purchase -> find the center by its name
// (a slow or failed request never blocks the download: waits 4s at most)
const findCenter = async (name: string): Promise<IHealthCenter | null> => {
  try {
    if (!centersCache) {
      const res = (await Promise.race([
        getDataByKeyword(''),
        new Promise((resolve) => {
          setTimeout(() => resolve(null), 4000);
        }),
      ])) as { data?: IHealthCenter[] } | null;
      if (res && Array.isArray(res.data) && res.data.length) {
        centersCache = res.data;
      }
    }
    return (centersCache || []).find((c) => same(c.name, name)) || null;
  } catch {
    return null;
  }
};

// saved purchase -> the same invoice data the booking page uses
export const buildPurchaseInvoice = async (
  o: IPurchase,
  user: IUser
): Promise<IInvoiceData> => {
  const p = o.patient;
  const center = await findCenter(o.center);

  const items = o.items.map((item) => {
    const pkg = HEALTH_PACKAGES.find((x) => same(x.name, item.name));
    const core = pkg ? getPackageCore(pkg) : null;
    const tests =
      item.tests && item.tests.length
        ? item.tests
        : core
        ? core.tests.map((t) => t.name)
        : [];
    return {
      name: item.name,
      testCount: tests.length,
      rate: core ? Math.max(core.rate, item.price) : item.price,
      price: item.price,
      tests,
    };
  });

  const packagesRate = items.reduce((sum, i) => sum + i.rate, 0);
  const packagesPrice = items.reduce((sum, i) => sum + i.price, 0);

  return {
    number: o.invoiceNo,
    issuedAt: fmtDate(o.date),
    customer: {
      name: user.name,
      patientName: p?.name || o.patientName,
      gender: p?.gender || '-',
      age: p?.age || '-',
      bloodGroup: p?.bloodGroup || '',
      phone: user.phone || p?.phone || '',
      email: p?.email || user.email || '',
      preferredDate: p?.preferredDate
        ? fmtDate(`${p.preferredDate}T00:00:00`)
        : '',
      note: p?.note || '',
    },
    center: {
      name: o.center,
      address: center?.address || '',
      contact: center?.contact_info || '',
    },
    items,
    cardFee: o.cardFee,
    totalRate: packagesRate + o.cardFee,
    total: o.total,
    saved: Math.max(packagesRate - packagesPrice, 0),
  };
};

export const downloadPurchaseInvoice = async (
  o: IPurchase,
  user: IUser
): Promise<void> => {
  const data = await buildPurchaseInvoice(o, user);
  const { downloadInvoicePdf } = await import(
    '@/components/HealthPackages/invoicePdf'
  );
  await downloadInvoicePdf(data);
};
// ================== END: src/components/Auth/purchaseInvoice.ts ==================