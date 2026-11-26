// ================= START: src/shared/utils/authService.ts =================
export interface IUser {
  id: string;
  name: string;
  phone: string;
  email: string;
  createdAt: string;
  avatar?: string; // profile photo (small JPEG data URL)
  hasValidCard?: boolean; // from the login / register API
}

export interface IPurchase {
  id: string;
  invoiceNo: string;
  date: string; // ISO purchase date
  items: { name: string; price: number; tests?: string[] }[];
  cardFee: number;
  total: number;
  hasCard: boolean;
  validUntil: string; // ISO (card 6 months / package 1 month)
  center: string;
  patientName: string;
  patient?: IPatientInfo;
}

export interface IPatientInfo {
  name: string;
  gender: string;
  age: string;
  bloodGroup: string;
  phone: string;
  email: string;
  preferredDate: string;
  note: string;
}

export interface IGuest {
  name: string;
  phone: string;
  email: string;
  password?: string;
}

export type Res<T> =
  | { ok: true; data: T }
  | {
      ok: false;
      message: string;
      fields?: Record<string, string>; // per-field messages (email, phone...)
      duplicate?: boolean; // email / phone already registered
    };

interface IStored extends IUser {
  hash: string;
}

const USE_API = process.env.NEXT_PUBLIC_AUTH_API === 'true';
const API_URL = 'https://admin.grameenkalyan.com/api';
const USERS_KEY = 'gk-users';
const SESSION_KEY = 'gk-session-user';
const TOKEN_KEY = 'gk-auth-token';
const OTP_KEY = 'gk-otp';
const ORDERS_KEY = 'gk-purchases';
export const AUTH_EVENT = 'gk-auth-changed';

/* ---------------- validation helpers ---------------- */
export const PHONE_REGEX = /^(?:\+?88)?01[3-9]\d{8}$/;
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export const normalizePhone = (value: string) =>
  value.replace(/[\s-]/g, '').replace(/^\+?88/, '');

// one input: mobile number OR email
export const parseIdentifier = (raw: string) => {
  const value = raw.trim();
  if (EMAIL_REGEX.test(value)) {
    return { type: 'email' as const, value: value.toLowerCase() };
  }
  const phone = value.replace(/[\s-]/g, '');
  if (PHONE_REGEX.test(phone)) {
    return { type: 'phone' as const, value: normalizePhone(phone) };
  }
  return null;
};

export const addMonths = (date: Date, months: number) => {
  const result = new Date(date);
  const day = result.getDate();
  result.setMonth(result.getMonth() + months);
  if (result.getDate() !== day) result.setDate(0);
  return result;
};

/* ---------------- storage helpers ---------------- */
function read<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write(key: string, value: unknown) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage blocked */
  }
}

const uid = () =>
  `u_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;

const fail = (message: string): Res<never> => ({ ok: false, message });

const sha = async (text: string) => {
  try {
    const buf = await crypto.subtle.digest(
      'SHA-256',
      new TextEncoder().encode(`gk:${text}`)
    );
    return Array.from(new Uint8Array(buf))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');
  } catch {
    return `plain:${text}`;
  }
};

const strip = (u: IStored): IUser => ({
  id: u.id,
  name: u.name,
  phone: u.phone,
  email: u.email,
  createdAt: u.createdAt,
  avatar: u.avatar,
});

const setSession = (user: IUser | null, token?: string) => {
  if (user) write(SESSION_KEY, user);
  else window.localStorage.removeItem(SESSION_KEY);
  try {
    if (token) window.localStorage.setItem(TOKEN_KEY, token);
    if (!user) window.localStorage.removeItem(TOKEN_KEY);
  } catch {
    /* ignore */
  }
  window.dispatchEvent(new Event(AUTH_EVENT));
};

/* ---------------- real API (admin.grameenkalyan.com) ---------------- */
interface IApiCustomer {
  id: number | string;
  name: string;
  phone?: string | null;
  email?: string | null;
  image?: string | null;
  created_at?: string;
}

interface IApiAuth {
  token: string;
  customer: IApiCustomer;
  has_valid_card?: boolean;
}

const fromApiCustomer = (c: IApiCustomer, hasValidCard?: boolean): IUser => ({
  id: String(c.id),
  name: c.name,
  phone: c.phone || '',
  email: c.email || '',
  createdAt: c.created_at || new Date().toISOString(),
  avatar: c.image && /^(https?:|data:)/.test(c.image) ? c.image : undefined,
  hasValidCard,
});

/* ---- turn raw Laravel keys (validation.unique ...) into clear messages ---- */
const FIELD_LABEL: Record<string, string> = {
  name: 'name',
  email: 'email address',
  phone: 'mobile number',
  password: 'password',
  otp: 'OTP',
  password_confirmation: 'confirm password',
};

const isUniqueError = (text: string) =>
  /unique|already been taken|already exists/i.test(text);

const friendlyMessage = (field: string, raw: string) => {
  const text = raw.trim();
  const label = FIELD_LABEL[field] || field;
  if (/confirmed|does not match/i.test(text)) {
    return 'Password and confirm password do not match.';
  }
  if (isUniqueError(text)) return `This ${label} is already registered.`;
  if (/required/i.test(text)) return `Please enter your ${label}.`;
  if (/validation\.min|at least/i.test(text)) {
    return `Your ${label} is too short.`;
  }
  if (/validation\.(email|regex)|a valid|invalid|format/i.test(text)) {
    return `Please enter a valid ${label}.`;
  }
  if (/^validation\./i.test(text)) {
    return `Please check your ${label} and try again.`;
  }
  return text;
};

async function api<T>(
  path: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE',
  body?: unknown
): Promise<Res<T>> {
  try {
    const token = window.localStorage.getItem(TOKEN_KEY);
    const response = await fetch(`${API_URL}${path}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: body ? JSON.stringify(body) : undefined,
    });
    const json = await response.json().catch(() => ({}));
    if (!response.ok || json.success === false) {
      // Laravel validation: { message, errors: { field: ['text', ...] } }
      const fields: Record<string, string> = {};
      let duplicate = false;
      if (json.errors && typeof json.errors === 'object') {
        Object.entries(
          json.errors as Record<string, string[] | string>
        ).forEach(([field, value]) => {
          const raw = Array.isArray(value) ? value[0] : value;
          if (!raw) return;
          if (isUniqueError(String(raw))) duplicate = true;
          fields[field] = friendlyMessage(field, String(raw));
        });
      }
      const rawMessage = typeof json.message === 'string' ? json.message : '';
      return {
        ok: false,
        message:
          Object.values(fields)[0] ||
          (rawMessage && !/^validation\./i.test(rawMessage) ? rawMessage : '') ||
          'Something went wrong. Please try again.',
        fields: Object.keys(fields).length ? fields : undefined,
        duplicate,
      };
    }
    return { ok: true, data: (json.data ?? json) as T };
  } catch {
    return fail('Network error. Please check your connection.');
  }
}

/* ---------------- session ---------------- */
export const getSessionUser = (): IUser | null =>
  read<IUser | null>(SESSION_KEY, null);

// clears the session at once (instant UI), then ends the token on the server
export const logout = () => {
  let token: string | null = null;
  try {
    token = window.localStorage.getItem(TOKEN_KEY);
  } catch {
    /* ignore */
  }
  setSession(null);
  if (!token) return;
  fetch(`${API_URL}/logout`, {
    method: 'POST',
    headers: { Accept: 'application/json', Authorization: `Bearer ${token}` },
    keepalive: true, // finishes even if the page changes right after logout
  }).catch(() => undefined);
};

// patch the saved session user (e.g. after a new Health Card is bought)
export const updateSessionUser = (patch: Partial<IUser>) => {
  const current = getSessionUser();
  if (current) setSession({ ...current, ...patch });
};

/* ---------------- register / login ---------------- */
export async function registerUser(input: {
  name: string;
  phone: string;
  email: string;
  password: string;
}): Promise<Res<IUser>> {
  const r = await api<IApiAuth>('/customer/register', 'POST', {
    name: input.name.trim(),
    email: input.email.trim().toLowerCase(),
    phone: normalizePhone(input.phone),
    password: input.password,
  });
  if (!r.ok) return r;

  // no session here: after registration the user goes to the Login page
  return {
    ok: true,
    data: fromApiCustomer(r.data.customer, r.data.has_valid_card),
  };
}
export async function loginUser(
  identifier: string,
  password: string
): Promise<Res<IUser>> {
  const id = parseIdentifier(identifier);
  if (!id) return fail('Enter a valid mobile number or email');

  const r = await api<IApiAuth>(
    '/customer/login',
    'POST',
    id.type === 'email'
      ? { email: id.value, password }
      : { phone: id.value, password }
  );
  if (!r.ok) return r;

  const user = fromApiCustomer(r.data.customer, r.data.has_valid_card);
  setSession(user, r.data.token);
  return { ok: true, data: user };
}

/* ---------------- OTP (login once / set new password) ---------------- */
export async function sendOtp(
  identifier: string
): Promise<Res<{ demoCode?: string }>> {
  const id = parseIdentifier(identifier);
  if (!id) return fail('Enter a valid email address');
  if (id.type !== 'email') {
    return fail('SMS OTP is not available yet. Please use your email address.');
  }

  if (USE_API) {
    const r = await api<Record<string, unknown>>('/auth/otp/send', 'POST', {
      identifier: id.value,
    });
    return r.ok ? { ok: true, data: {} } : r;
  }

  const users = read<IStored[]>(USERS_KEY, []);
  const found = users.find((u) => u.email === id.value);
  if (!found) {
    return fail(
      'No account found with this email. Please check your email or book a package to create an account.'
    );
  }
  const code = String(Math.floor(100000 + Math.random() * 900000));
  write(OTP_KEY, { id: id.value, code, exp: Date.now() + 5 * 60 * 1000 });
  return { ok: true, data: { demoCode: code } }; // demo only - real SMS/email comes from the backend
}

export async function verifyOtp(
  identifier: string,
  code: string,
  newPassword?: string
): Promise<Res<IUser>> {
  const id = parseIdentifier(identifier);
  if (!id) return fail('Enter a valid mobile number or email');

  if (USE_API) {
    const r = await api<{ token: string; user: IUser }>(
      '/auth/otp/verify',
      'POST',
      { identifier: id.value, otp: code, password: newPassword }
    );
    if (!r.ok) return r;
    setSession(r.data.user, r.data.token);
    return { ok: true, data: r.data.user };
  }

  const saved = read<{ id: string; code: string; exp: number } | null>(
    OTP_KEY,
    null
  );
  if (!saved || saved.id !== id.value || saved.code !== code) {
    return fail('Incorrect OTP. Please check and try again.');
  }
  if (Date.now() > saved.exp) return fail('This OTP has expired. Request a new one.');

  const users = read<IStored[]>(USERS_KEY, []);
  const index = users.findIndex(
    (u) => (id.type === 'phone' ? u.phone : u.email) === id.value
  );
  if (index < 0) return fail('Account not found.');
  if (newPassword) users[index].hash = await sha(newPassword);
  write(USERS_KEY, users);
  window.localStorage.removeItem(OTP_KEY);
  setSession(strip(users[index]));
  return { ok: true, data: strip(users[index]) };
}

/* ---------------- forgot password (real API) ---------------- */
// 1) send OTP to the email
export async function forgotPassword(
  email: string
): Promise<Res<{ email: string }>> {
  const id = parseIdentifier(email);
  if (!id || id.type !== 'email') {
    return fail('Please enter a valid email address.');
  }
  const r = await api<Record<string, unknown>>(
    '/customer/forgot-password',
    'POST',
    { email: id.value }
  );
  return r.ok ? { ok: true, data: { email: id.value } } : r;
}

// 2) check the OTP
export async function verifyResetOtp(
  email: string,
  otp: string
): Promise<Res<{ email: string }>> {
  const r = await api<Record<string, unknown>>(
    '/customer/verify-otp',
    'POST',
    { email: email.trim().toLowerCase(), otp }
  );
  return r.ok ? { ok: true, data: { email } } : r;
}

// 3) set the new password
export async function resetPassword(
  email: string,
  otp: string,
  password: string,
  passwordConfirmation: string
): Promise<Res<{ email: string }>> {
  const r = await api<Record<string, unknown>>(
    '/customer/reset-password',
    'POST',
    {
      email: email.trim().toLowerCase(),
      otp,
      password,
      password_confirmation: passwordConfirmation,
    }
  );
  return r.ok ? { ok: true, data: { email } } : r;
}

/* ---------------- purchases ---------------- */
// logged-in user -> saved to that user; new customer -> account is auto created from phone/email
export async function recordPurchase(
  purchase: IPurchase,
  guest: IGuest,
  loggedIn: IUser | null
): Promise<Res<{ isNewAccount: boolean }>> {
  if (USE_API) {
    return api<{ isNewAccount: boolean }>('/auth/purchases', 'POST', {
      purchase,
      guest,
    });
  }

  const users = read<IStored[]>(USERS_KEY, []);
  let owner = loggedIn ? loggedIn.id : '';
  let isNewAccount = false;

  if (!owner) {
    const phone = normalizePhone(guest.phone);
    const email = guest.email.trim().toLowerCase();
    const found = users.find(
      (u) => email !== '' && u.email === email
    );
    if (found) {
      owner = found.id;
    } else {
      const created: IStored = {
        id: uid(),
        name: guest.name.trim(),
        phone,
        email,
        createdAt: new Date().toISOString(),
        hash: await sha(guest.password || uid()), // own password, or random (login with email OTP)
      };
      write(USERS_KEY, [...users, created]);
      owner = created.id;
      isNewAccount = true;
    }
  }

  const all = read<Record<string, IPurchase[]>>(ORDERS_KEY, {});
  all[owner] = [...(all[owner] || []), purchase];
  write(ORDERS_KEY, all);
  return { ok: true, data: { isNewAccount } };
}

export async function getPurchases(userId: string): Promise<IPurchase[]> {
  if (USE_API) {
    const r = await api<IPurchase[]>('/auth/purchases', 'GET');
    return r.ok && Array.isArray(r.data) ? r.data : [];
  }
  return read<Record<string, IPurchase[]>>(ORDERS_KEY, {})[userId] || [];
}

// valid Health Card expiry (ISO) or null
export const getActiveCard = (list: IPurchase[]): string | null => {
  const now = Date.now();
  const valid = list
    .filter((p) => p.hasCard && new Date(p.validUntil).getTime() > now)
    .sort(
      (a, b) =>
        new Date(b.validUntil).getTime() - new Date(a.validUntil).getTime()
    );
  return valid.length ? valid[0].validUntil : null;
};



/* ---------------- profile / patient / delete ---------------- */
export async function updateProfile(
  userId: string,
  input: { name: string; phone: string; email: string }
): Promise<Res<IUser>> {
  const name = input.name.trim();
  const phone = normalizePhone(input.phone);
  const email = input.email.trim().toLowerCase();

  if (USE_API) {
    const r = await api<{ user: IUser }>('/auth/profile', 'PUT', {
      name,
      phone,
      email,
    });
    if (!r.ok) return r;
    setSession(r.data.user);
    return { ok: true, data: r.data.user };
  }

  const users = read<IStored[]>(USERS_KEY, []);
  const index = users.findIndex((u) => u.id === userId);
  if (index < 0) return fail('Account not found.');
  if (users.some((u) => u.id !== userId && u.phone === phone)) {
    return fail('This mobile number is used by another account.');
  }
  if (email && users.some((u) => u.id !== userId && u.email === email)) {
    return fail('This email is used by another account.');
  }
  users[index] = { ...users[index], name, phone, email };
  write(USERS_KEY, users);
  setSession(strip(users[index]));
  return { ok: true, data: strip(users[index]) };
}

export async function updatePatient(
  userId: string,
  purchaseId: string,
  patient: IPatientInfo
): Promise<Res<boolean>> {
  if (USE_API) {
    const r = await api<Record<string, unknown>>(
      `/auth/purchases/${purchaseId}`,
      'PUT',
      { patient }
    );
    return r.ok ? { ok: true, data: true } : r;
  }
  const all = read<Record<string, IPurchase[]>>(ORDERS_KEY, {});
  all[userId] = (all[userId] || []).map((p) =>
    p.id === purchaseId ? { ...p, patient, patientName: patient.name } : p
  );
  write(ORDERS_KEY, all);
  return { ok: true, data: true };
}

export async function deletePurchase(
  userId: string,
  purchaseId: string
): Promise<Res<boolean>> {
  if (USE_API) {
    const r = await api<Record<string, unknown>>(
      `/auth/purchases/${purchaseId}`,
      'DELETE'
    );
    return r.ok ? { ok: true, data: true } : r;
  }
  const all = read<Record<string, IPurchase[]>>(ORDERS_KEY, {});
  all[userId] = (all[userId] || []).filter((p) => p.id !== purchaseId);
  write(ORDERS_KEY, all);
  return { ok: true, data: true };
}

export async function deleteAccount(userId: string): Promise<Res<boolean>> {
  if (USE_API) {
    const r = await api<Record<string, unknown>>('/auth/account', 'DELETE');
    if (!r.ok) return r;
    setSession(null);
    return { ok: true, data: true };
  }
  write(
    USERS_KEY,
    read<IStored[]>(USERS_KEY, []).filter((u) => u.id !== userId)
  );
  const all = read<Record<string, IPurchase[]>>(ORDERS_KEY, {});
  delete all[userId];
  write(ORDERS_KEY, all);
  setSession(null);
  return { ok: true, data: true };
}


/* ---------------- profile photo (add / change / remove) ---------------- */
// avatar = small JPEG data URL, or '' to remove the photo
export async function updateAvatar(
  userId: string,
  avatar: string
): Promise<Res<IUser>> {
  if (USE_API) {
    const r = await api<{ user: IUser }>('/auth/avatar', 'PUT', { avatar });
    if (!r.ok) return r;
    setSession(r.data.user);
    return { ok: true, data: r.data.user };
  }

  const users = read<IStored[]>(USERS_KEY, []);
  const index = users.findIndex((u) => u.id === userId);
  if (index < 0) return fail('Account not found.');
  const next: IStored = { ...users[index] };
  if (avatar) next.avatar = avatar;
  else delete next.avatar;
  users[index] = next;
  write(USERS_KEY, users);
  setSession(strip(next));
  return { ok: true, data: strip(next) };
}
// ================== END: src/shared/utils/authService.ts ==================