import type { IInvoiceData } from '@/components/HealthPackages/invoicePdf';

const API_BASE = 'https://admin.grameenkalyan.com/api';

interface IApiOrderItem {
  package_name?: string;
  test_name?: string;
  price: string;
  discount: string;
  final_price: string;
  tests?: { id: number; name: string }[];
}

export interface IOrderResponse {
  success: boolean;
  message: string;
  quick_no: string;
  invoice: {
    quick_no: string;
    date: string;
    expire_date: string;
    preferred_date: string | null;
    note: string | null;
    patient: { name: string; gender: string; blood_group: string | null };
    customer: { name: string; phone: string; email: string };
    health_center: { name: string; address: string; contact_info: string };
    summary: {
      subtotal: number;
      discount: number;
      card_charge: number;
      doctor_charge: number;
      total_amount: number;
    };
    items: IApiOrderItem[];
  };
}

type OrderResult =
  | { ok: true; data: IOrderResponse }
  | { ok: false; message: string };

// POST /api/customer/check-email -> { exists: true | false }
export const checkEmailExists = async (
  email: string
): Promise<boolean | null> => {
  try {
    const body = new FormData();
    body.append('email', email);
    const res = await fetch(`${API_BASE}/customer/check-email`, {
      method: 'POST',
      headers: { Accept: 'application/json' },
      body,
    });
    const json = await res.json();
    return typeof json.exists === 'boolean' ? json.exists : null;
  } catch {
    return null;
  }
};

// POST /api/orders
export const placeOrder = async (
  body: Record<string, unknown>
): Promise<OrderResult> => {
  try {
    const res = await fetch(`${API_BASE}/orders`, {
      method: 'POST',
      headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const json = await res.json().catch(() => ({}));

    if (!res.ok || json.success === false || !json.invoice) {
      const first =
        json.errors && typeof json.errors === 'object'
          ? Object.values(json.errors as Record<string, string[] | string>)[0]
          : '';
      const text = Array.isArray(first) ? first[0] : first;
      return {
        ok: false,
        message:
          text ||
          (typeof json.message === 'string' && json.message) ||
          'Could not place the order. Please try again.',
      };
    }
    return { ok: true, data: json as IOrderResponse };
  } catch {
    return {
      ok: false,
      message: 'Network error. Please check your connection and try again.',
    };
  }
};

const fmt = (iso: string) =>
  new Date(iso).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

// order response -> the same invoice data the PDF + success card already use
export const mapOrderInvoice = (
  order: IOrderResponse,
  extra: { age: string; phone: string }
): IInvoiceData => {
  const inv = order.invoice;
  const s = inv.summary;
  const items: IInvoiceData['items'] = [];

  inv.items
    .filter((i) => i.package_name)
    .forEach((i) =>
      items.push({
        name: i.package_name as string,
        testCount: (i.tests || []).length,
        rate: Number(i.price),
        price: Number(i.final_price),
        tests: (i.tests || []).map((t) => t.name),
      })
    );

  const testItems = inv.items.filter((i) => i.test_name);
  if (testItems.length) {
    items.push({
      name: 'Customized Package',
      testCount: testItems.length,
      rate: testItems.reduce((sum, i) => sum + Number(i.price), 0),
      price: testItems.reduce((sum, i) => sum + Number(i.final_price), 0),
      tests: testItems.map((i) => i.test_name as string),
    });
  }

  if (Number(s.doctor_charge) > 0) {
    items.push({
      name: 'Doctor Consultation Charge',
      testCount: 0,
      rate: Number(s.doctor_charge),
      price: Number(s.doctor_charge),
      tests: [],
    });
  }

  const gender = inv.patient.gender || '';

  return {
    number: inv.quick_no,
    issuedAt: fmt(inv.date),
    customer: {
      name: inv.customer.name,
      patientName: inv.patient.name,
      gender: gender.charAt(0).toUpperCase() + gender.slice(1),
      age: extra.age,
      bloodGroup: inv.patient.blood_group || '',
      phone: inv.customer.phone || extra.phone,
      email: inv.customer.email,
      preferredDate: inv.preferred_date ? fmt(inv.preferred_date) : '',
      note: inv.note || '',
    },
    center: {
      name: inv.health_center.name,
      address: inv.health_center.address || '',
      contact: inv.health_center.contact_info || '',
    },
    items,
    cardFee: Number(s.card_charge),
    totalRate:
      Number(s.subtotal) + Number(s.doctor_charge) + Number(s.card_charge),
    total: Number(s.total_amount),
    saved: Number(s.discount),
  };
};