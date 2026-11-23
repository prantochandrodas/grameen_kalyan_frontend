// ================= START: src/components/Auth/Dashboard.tsx =================
'use client';

import React, { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import {
  FaArrowRight,
  FaCalendarAlt,
  FaChevronDown,
  FaEdit,
  FaEnvelope,
  FaExclamationTriangle,
  FaIdCard,
  FaPhoneAlt,
  FaReceipt,
  FaSignOutAlt,
  FaTimes,
  FaTrashAlt,
  FaUser,
  FaWallet,
} from 'react-icons/fa';

import { formatBDT } from '@/data/healthPackages';
import { useAuth } from '@/shared/context/AuthContext';
import {
  EMAIL_REGEX,
  IPatientInfo,
  IPurchase,
  IUser,
  PHONE_REGEX,
  deleteAccount,
  deletePurchase,
  getActiveCard,
  getPurchases,
  updatePatient,
  updateProfile,
} from '@/shared/utils/authService';

import { TextField } from './AuthUi';
import style from './auth.module.scss';

const GENDERS = ['Male', 'Female', 'Other'];
const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

const fmt = (iso: string) =>
  new Date(iso).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

const dash = (value?: string) => (value && value.trim() ? value : '—');

const getPatient = (o: IPurchase): IPatientInfo => ({
  name: o.patient?.name || o.patientName,
  gender: o.patient?.gender || '',
  age: o.patient?.age || '',
  bloodGroup: o.patient?.bloodGroup || '',
  phone: o.patient?.phone || '',
  email: o.patient?.email || '',
  preferredDate: o.patient?.preferredDate || '',
  note: o.patient?.note || '',
});

/* ---------------- generic popup (esc + scroll lock) ---------------- */
const Popup = ({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) => {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = previous;
    };
  }, [onClose]);

  return (
    <motion.div
      className={style.overlay}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      onClick={onClose}
    >
      <motion.div
        className={style.sheet}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 40 }}
        transition={{ duration: 0.28 }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          className={style.close}
          onClick={onClose}
          aria-label="Close"
        >
          <FaTimes />
        </button>
        <div className={style.gateHead}>
          <h3>{title}</h3>
        </div>
        {children}
      </motion.div>
    </motion.div>
  );
};

/* ---------------- edit patient information ---------------- */
const PatientModal = ({
  userId,
  order,
  onClose,
  onSaved,
}: {
  userId: string;
  order: IPurchase;
  onClose: () => void;
  onSaved: () => void;
}) => {
  const [apiError, setApiError] = useState('');
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<IPatientInfo>({ defaultValues: getPatient(order) });

  const onSubmit = async (d: IPatientInfo) => {
    setApiError('');
    const res = await updatePatient(userId, order.id, {
      ...d,
      name: d.name.trim(),
      age: String(d.age).trim(),
      phone: d.phone.trim(),
      email: d.email.trim(),
      note: d.note.trim(),
    });
    if (!res.ok) {
      setApiError(res.message);
      return;
    }
    onSaved();
  };

  return (
    <Popup title="Edit patient information" onClose={onClose}>
      <form className={style.form} onSubmit={handleSubmit(onSubmit)} noValidate>
        <TextField
          id="ptName"
          label="Patient Name"
          icon={<FaUser />}
          type="text"
          placeholder="Patient full name"
          error={errors.name?.message}
          {...register('name', { required: 'Patient name is required' })}
        />

        <div className={style.twoCol}>
          <div className={style.field}>
            <label htmlFor="ptGender">Gender</label>
            <select id="ptGender" {...register('gender')}>
              <option value="">Select</option>
              {GENDERS.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </div>
          <div className={style.field}>
            <label htmlFor="ptAge">Age</label>
            <input
              id="ptAge"
              type="number"
              inputMode="numeric"
              placeholder="Age"
              aria-invalid={!!errors.age}
              {...register('age', {
                validate: (v) =>
                  v === '' ||
                  (Number(v) >= 0 && Number(v) <= 120) ||
                  'Enter a valid age (0-120)',
              })}
            />
            {errors.age && <small role="alert">{errors.age.message}</small>}
          </div>
        </div>

        <div className={style.field}>
          <label htmlFor="ptBlood">Blood Group</label>
          <select id="ptBlood" {...register('bloodGroup')}>
            <option value="">Select (optional)</option>
            {BLOOD_GROUPS.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        </div>

        <TextField
          id="ptPhone"
          label="Contact Phone"
          icon={<FaPhoneAlt />}
          type="tel"
          inputMode="tel"
          placeholder="01XXXXXXXXX"
          error={errors.phone?.message}
          {...register('phone', {
            validate: (v) =>
              v === '' || PHONE_REGEX.test(v.replace(/[\s-]/g, '')) ||
              'Enter a valid mobile number',
          })}
        />
        <TextField
          id="ptEmail"
          label="Email"
          icon={<FaEnvelope />}
          type="email"
          inputMode="email"
          autoCapitalize="none"
          placeholder="name@example.com"
          error={errors.email?.message}
          {...register('email', {
            validate: (v) =>
              v === '' || EMAIL_REGEX.test(v) || 'Enter a valid email',
          })}
        />

        <div className={style.field}>
          <label htmlFor="ptNote">Note</label>
          <textarea id="ptNote" rows={3} placeholder="Optional" {...register('note')} />
        </div>

        {apiError && (
          <p className={style.errorBox} role="alert">
            {apiError}
          </p>
        )}

        <button type="submit" className={style.btn} disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : 'Save changes'}
        </button>
      </form>
    </Popup>
  );
};

/* ---------------- confirm delete ---------------- */
const ConfirmModal = ({
  title,
  text,
  label,
  busy,
  onCancel,
  onConfirm,
}: {
  title: string;
  text: string;
  label: string;
  busy: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}) => (
  <Popup title={title} onClose={onCancel}>
    <div className={style.confirmBody}>
      <span className={style.confirmIcon} aria-hidden="true">
        <FaExclamationTriangle />
      </span>
      <p>{text}</p>
      <div className={style.confirmBtns}>
        <button type="button" className={style.btnGhost} onClick={onCancel}>
          Cancel
        </button>
        <button
          type="button"
          className={style.btnDanger}
          onClick={onConfirm}
          disabled={busy}
        >
          {busy ? 'Deleting...' : label}
        </button>
      </div>
    </div>
  </Popup>
);

/* ---------------- account details form ---------------- */
interface IProfileInputs {
  name: string;
  phone: string;
  email: string;
}

const ProfileForm = ({
  user,
  onDone,
}: {
  user: IUser;
  onDone: (message: string) => void;
}) => {
  const [apiError, setApiError] = useState('');
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<IProfileInputs>({
    defaultValues: { name: user.name, phone: user.phone, email: user.email },
  });

  const onSubmit = async (d: IProfileInputs) => {
    setApiError('');
    const res = await updateProfile(user.id, d);
    if (!res.ok) {
      setApiError(res.message);
      return;
    }
    reset({
      name: res.data.name,
      phone: res.data.phone,
      email: res.data.email,
    });
    onDone('Profile updated successfully');
  };

  return (
    <form className={style.form} onSubmit={handleSubmit(onSubmit)} noValidate>
      <TextField
        id="pfName"
        label="Full Name"
        icon={<FaUser />}
        type="text"
        autoComplete="name"
        error={errors.name?.message}
        {...register('name', {
          required: 'Your name is required',
          minLength: { value: 2, message: 'Name is too short' },
        })}
      />
      <TextField
        id="pfPhone"
        label="Mobile Number"
        icon={<FaPhoneAlt />}
        type="tel"
        inputMode="tel"
        autoComplete="tel"
        error={errors.phone?.message}
        {...register('phone', {
          required: 'Mobile number is required',
          pattern: {
            value: PHONE_REGEX,
            message: 'Enter a valid Bangladeshi mobile number',
          },
        })}
      />
      <TextField
        id="pfEmail"
        label="Email"
        icon={<FaEnvelope />}
        type="email"
        inputMode="email"
        autoComplete="email"
        autoCapitalize="none"
        error={errors.email?.message}
        {...register('email', {
          validate: (v) =>
            v === '' || EMAIL_REGEX.test(v) || 'Please provide a valid email address',
        })}
      />

      {apiError && (
        <p className={style.errorBox} role="alert">
          {apiError}
        </p>
      )}

      <button
        type="submit"
        className={style.btn}
        disabled={isSubmitting || !isDirty}
      >
        {isSubmitting ? 'Saving...' : 'Save changes'}
      </button>
    </form>
  );
};

/* ---------------- dashboard ---------------- */
type Tab = 'purchases' | 'profile';

const Dashboard = () => {
  const router = useRouter();
  const { user, ready, logout } = useAuth();
  const [tab, setTab] = useState<Tab>('purchases');
  const [orders, setOrders] = useState<IPurchase[] | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [editing, setEditing] = useState<IPurchase | null>(null);
  const [removing, setRemoving] = useState<IPurchase | null>(null);
  const [deletingAccount, setDeletingAccount] = useState(false);
  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState('');

  const userId = user ? user.id : '';

  const load = useCallback(async () => {
    if (!userId) return;
    const list = await getPurchases(userId);
    setOrders(
      [...list].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      )
    );
  }, [userId]);

  useEffect(() => {
    if (ready && !user) router.replace('/login?next=/dashboard');
  }, [ready, user, router]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    if (!toast) return undefined;
    const timer = window.setTimeout(() => setToast(''), 3200);
    return () => window.clearTimeout(timer);
  }, [toast]);

  if (!ready || !user) {
    return (
      <main className={style.page}>
        <p className={style.loadingText}>Loading your account…</p>
      </main>
    );
  }

  const list = orders || [];
  const cardUntil = getActiveCard(list);
  const spent = list.reduce((sum, o) => sum + o.total, 0);
  const now = Date.now();

  const removeOrder = async () => {
    if (!removing) return;
    setBusy(true);
    const res = await deletePurchase(user.id, removing.id);
    setBusy(false);
    setToast(res.ok ? 'Purchase record deleted' : res.message);
    setRemoving(null);
    if (res.ok) await load();
  };

  const removeAccount = async () => {
    setBusy(true);
    const res = await deleteAccount(user.id);
    setBusy(false);
    if (!res.ok) {
      setToast(res.message);
      setDeletingAccount(false);
      return;
    }
    router.push('/');
  };

  return (
    <main className={style.page}>
      <div className={style.dWrap}>
        {/* ---------- hero ---------- */}
        <section className={style.dHero}>
          <div className={style.dHeroTop}>
            <span className={style.dAvatar} aria-hidden="true">
              {user.name.trim().charAt(0).toUpperCase() || 'U'}
            </span>
            <div className={style.dWho}>
              <small>Welcome back</small>
              <h1>{user.name}</h1>
              <ul className={style.dChips}>
                <li>
                  <FaPhoneAlt aria-hidden="true" />
                  {user.phone}
                </li>
                {user.email && (
                  <li>
                    <FaEnvelope aria-hidden="true" />
                    {user.email}
                  </li>
                )}
              </ul>
            </div>
          </div>

          <div className={`${style.dCard} ${cardUntil ? '' : style.dCardOff}`}>
            <FaIdCard aria-hidden="true" />
            <div>
              <strong>
                {cardUntil ? 'Health Card is active' : 'No active Health Card'}
              </strong>
              <span>
                {cardUntil
                  ? `Valid until ${fmt(cardUntil)}`
                  : 'Take a Health Card with your next package for the discount rate.'}
              </span>
            </div>
          </div>

          <div className={style.dHeroActions}>
            <button
              type="button"
              className={style.dGhost}
              onClick={() => setTab('profile')}
            >
              <FaEdit aria-hidden="true" />
              Edit profile
            </button>
            <button
              type="button"
              className={style.dGhost}
              onClick={() => {
                logout();
                router.push('/');
              }}
            >
              <FaSignOutAlt aria-hidden="true" />
              Logout
            </button>
          </div>
        </section>

        {/* ---------- stats ---------- */}
        <div className={style.dStats}>
          <div className={style.dStat}>
            <span className={style.dStatIcon}>
              <FaReceipt aria-hidden="true" />
            </span>
            <div>
              <small>Purchases</small>
              <strong>{list.length}</strong>
            </div>
          </div>
          <div className={style.dStat}>
            <span className={style.dStatIcon}>
              <FaWallet aria-hidden="true" />
            </span>
            <div>
              <small>Total spent</small>
              <strong>{formatBDT(spent)}</strong>
            </div>
          </div>
          <div className={style.dStat}>
            <span className={style.dStatIcon}>
              <FaCalendarAlt aria-hidden="true" />
            </span>
            <div>
              <small>Last purchase</small>
              <strong>{list.length ? fmt(list[0].date) : '—'}</strong>
            </div>
          </div>
        </div>

        {/* ---------- tabs ---------- */}
        <div className={style.dTabs} role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={tab === 'purchases'}
            onClick={() => setTab('purchases')}
          >
            My purchases <em>{list.length}</em>
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={tab === 'profile'}
            onClick={() => setTab('profile')}
          >
            My profile
          </button>
        </div>

        {/* ---------- purchases ---------- */}
        {tab === 'purchases' && (
          <section aria-label="My purchased packages">
            <div className={style.sectionHead}>
              <h2>Purchased packages</h2>
              <Link
                href="/health-packages"
                className={`${style.btn} ${style.btnSmall}`}
              >
                Buy package
                <FaArrowRight aria-hidden="true" />
              </Link>
            </div>

            {orders === null ? (
              <p className={style.loadingText}>Loading your purchases…</p>
            ) : list.length === 0 ? (
              <div className={style.empty}>
                <p>You have not purchased any package yet.</p>
                <Link
                  href="/health-packages"
                  className={`${style.btn} ${style.btnSmall}`}
                >
                  Browse healthcare packages
                </Link>
              </div>
            ) : (
              <ul className={style.dOrders}>
                {list.map((o) => {
                  const active = new Date(o.validUntil).getTime() > now;
                  const isOpen = expanded === o.id;
                  const p = getPatient(o);
                  const rows: [string, string][] = [
                    ['Patient name', p.name],
                    ['Gender', p.gender],
                    ['Age', p.age ? `${p.age} years` : ''],
                    ['Blood group', p.bloodGroup],
                    ['Contact phone', p.phone],
                    ['Email', p.email],
                    [
                      'Preferred date',
                      p.preferredDate ? fmt(p.preferredDate) : '',
                    ],
                    ['Center', o.center],
                  ];
                  return (
                    <li className={style.dOrder} key={o.id}>
                      <div className={style.dOrderTop}>
                        <div>
                          <strong>{o.invoiceNo}</strong>
                          <span>
                            Purchased on {fmt(o.date)} · {o.center}
                          </span>
                        </div>
                        <span
                          className={`${style.chip} ${active ? '' : style.chipOff}`}
                        >
                          {active ? 'Active' : 'Expired'}
                        </span>
                      </div>

                      <ul className={style.orderItems}>
                        {o.items.map((item) => (
                          <li key={item.name}>
                            <span>{item.name}</span>
                            <b>{formatBDT(item.price)}</b>
                          </li>
                        ))}
                        {o.cardFee > 0 && (
                          <li>
                            <span>Health Card (6 months)</span>
                            <b>{formatBDT(o.cardFee)}</b>
                          </li>
                        )}
                      </ul>

                      <button
                        type="button"
                        className={style.dToggle}
                        aria-expanded={isOpen}
                        onClick={() => setExpanded(isOpen ? null : o.id)}
                      >
                        Patient details
                        <FaChevronDown aria-hidden="true" />
                      </button>

                      {isOpen && (
                        <>
                          <dl className={style.dInfo}>
                            {rows.map(([label, value]) => (
                              <div key={label}>
                                <dt>{label}</dt>
                                <dd>{dash(value)}</dd>
                              </div>
                            ))}
                            {p.note && (
                              <div className={style.dInfoWide}>
                                <dt>Note</dt>
                                <dd>{p.note}</dd>
                              </div>
                            )}
                          </dl>
                        </>
                      )}

                      <div className={style.orderFoot}>
                        <span>
                          {o.hasCard ? 'Card' : 'Package'} valid until{' '}
                          {fmt(o.validUntil)}
                        </span>
                        <strong>{formatBDT(o.total)}</strong>
                      </div>

                      <div className={style.dActions}>
                        <button
                          type="button"
                          className={style.dEdit}
                          onClick={() => setEditing(o)}
                        >
                          <FaEdit aria-hidden="true" />
                          Edit patient
                        </button>
                        <button
                          type="button"
                          className={style.dDelete}
                          onClick={() => setRemoving(o)}
                        >
                          <FaTrashAlt aria-hidden="true" />
                          Delete
                        </button>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>
        )}

        {/* ---------- profile ---------- */}
        {tab === 'profile' && (
          <section className={style.dProfileGrid} aria-label="My profile">
            <div className={style.dPanel}>
              <h2>Account details</h2>
              <p className={style.hint}>
                Update your name, mobile number or email.
              </p>
              <ProfileForm user={user} onDone={setToast} />
            </div>

            <div className={style.dPanel}>
              <h2>Account</h2>
              <dl className={style.dInfo}>
                <div>
                  <dt>Member since</dt>
                  <dd>{fmt(user.createdAt)}</dd>
                </div>
                <div>
                  <dt>Total purchases</dt>
                  <dd>{list.length}</dd>
                </div>
              </dl>

              <div className={style.dDanger}>
                <strong>Delete account</strong>
                <p>
                  This permanently removes your profile and all purchase
                  records. This cannot be undone.
                </p>
                <button
                  type="button"
                  className={style.btnDanger}
                  onClick={() => setDeletingAccount(true)}
                >
                  <FaTrashAlt aria-hidden="true" />
                  Delete my account
                </button>
              </div>
            </div>
          </section>
        )}
      </div>

      {/* ---------- popups ---------- */}
      <AnimatePresence>
        {editing && (
          <PatientModal
            key="edit"
            userId={user.id}
            order={editing}
            onClose={() => setEditing(null)}
            onSaved={async () => {
              setEditing(null);
              setToast('Patient information updated');
              await load();
            }}
          />
        )}
        {removing && (
          <ConfirmModal
            key="remove"
            title="Delete this purchase?"
            text={`Purchase ${removing.invoiceNo} will be removed from your dashboard. This cannot be undone.`}
            label="Delete purchase"
            busy={busy}
            onCancel={() => setRemoving(null)}
            onConfirm={removeOrder}
          />
        )}
        {deletingAccount && (
          <ConfirmModal
            key="account"
            title="Delete your account?"
            text="Your profile and all purchase records will be permanently deleted."
            label="Yes, delete account"
            busy={busy}
            onCancel={() => setDeletingAccount(false)}
            onConfirm={removeAccount}
          />
        )}
      </AnimatePresence>

      {toast && (
        <div className={style.toast} role="status">
          {toast}
        </div>
      )}
    </main>
  );
};

export default Dashboard;
// ================== END: src/components/Auth/Dashboard.tsx ==================