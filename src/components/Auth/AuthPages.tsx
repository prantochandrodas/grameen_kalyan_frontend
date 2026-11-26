// ================= START: src/components/Auth/AuthPages.tsx =================
'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import {
  FaArrowRight,
  FaCheck,
  FaCheckCircle,
  FaEnvelope,
  FaHeartbeat,
  FaIdCard,
  FaInfoCircle,
  FaKey,
  FaLock,
  FaPhoneAlt,
  FaShieldAlt,
  FaStethoscope,
  FaUser,
  FaUserPlus,
} from 'react-icons/fa';

import { useAuth } from '@/shared/context/AuthContext';
import {
  EMAIL_REGEX,
  PHONE_REGEX,
  forgotPassword,
  registerUser,
  resetPassword,
  verifyResetOtp,
} from '@/shared/utils/authService';

import LoginForm from './LoginForm';
import { PasswordField, TextField, getNextPath } from './AuthUi';
import style from './auth.module.scss';

/* ---------- shared layout ---------- */
type Variant = 'login' | 'register' | 'forgot';

const SHELL_COPY: Record<
  Variant,
  { icon: React.ReactNode; eyebrow: string; heading: string; text: string }
> = {
  login: {
    icon: <FaStethoscope />,
    eyebrow: 'Secure sign in',
    heading: 'Welcome back to better health.',
    text: 'Login to book health packages, track every purchase and keep your Health Card details in one place.',
  },
  register: {
    icon: <FaUserPlus />,
    eyebrow: 'New account',
    heading: 'Start your healthcare journey.',
    text: 'Create a free account to book checkups, save your purchases and manage your Health Card.',
  },
  forgot: {
    icon: <FaKey />,
    eyebrow: 'Account recovery',
    heading: 'Get back into your account.',
    text: 'Verify with a one time OTP sent to your email and continue where you left off.',
  },
};

const Shell = ({
  variant,
  title,
  sub,
  children,
}: {
  variant: Variant;
  title: string;
  sub: string;
  children: React.ReactNode;
}) => {
  const copy = SHELL_COPY[variant];
  return (
    <main className={style.page}>
      <div className={style.shell}>
        <aside className={style.aside}>
          <span className={style.asideBadge}>
            <FaHeartbeat aria-hidden="true" /> Grameen Kalyan
          </span>
          <span className={style.asideIcon} aria-hidden="true">
            {copy.icon}
          </span>
          <h2>{copy.heading}</h2>
          <p>{copy.text}</p>
          <ul className={style.asideList}>
            <li>
              <FaCheckCircle aria-hidden="true" /> See all purchased packages
            </li>
            <li>
              <FaIdCard aria-hidden="true" /> Health Card validity at a glance
            </li>
            <li>
              <FaShieldAlt aria-hidden="true" /> Secure login with OTP
            </li>
          </ul>
          <span className={style.asideEcg} aria-hidden="true" />
        </aside>
        <section className={style.main}>
          <p className={style.eyebrow}>{copy.eyebrow}</p>
          <h1 className={style.title}>{title}</h1>
          <p className={style.sub}>{sub}</p>
          {children}
          <p className={style.secureNote}>
            <FaLock aria-hidden="true" /> Your information is kept private and
            secure.
          </p>
        </section>
      </div>
    </main>
  );
};

// already logged in -> go to the dashboard
const useGuestOnly = () => {
  const router = useRouter();
  const { user, ready } = useAuth();
  useEffect(() => {
    if (ready && user) router.replace(getNextPath());
  }, [ready, user, router]);
};

/* ---------- Login ---------- */
export const LoginPage = () => {
  const router = useRouter();
  const [justRegistered, setJustRegistered] = useState(false);
  const [justReset, setJustReset] = useState(false);
  const [prefill, setPrefill] = useState('');
  useGuestOnly();

  // from "Create Account": success message (registered=1) and/or pre-filled email
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('registered') === '1') setJustRegistered(true);
    if (params.get('reset') === '1') setJustReset(true);
    try {
      const saved = window.sessionStorage.getItem('gk-registered-id');
      if (saved) setPrefill(saved);
      window.sessionStorage.removeItem('gk-registered-id');
    } catch {
      /* ignore */
    }
  }, []);

  return (
    <Shell
      variant="login"
      title="Login to My Account"
      sub="Use your mobile number or email address."
    >
      {justRegistered && (
        <p className={style.successBox} role="status">
          <FaCheckCircle aria-hidden="true" />
          <span>
            Account created successfully! Please login to continue.
          </span>
        </p>
      )}
      {justReset && (
        <p className={style.successBox} role="status">
          <FaCheckCircle aria-hidden="true" />
          <span>
            Password updated successfully! Please login with your new
            password.
          </span>
        </p>
      )}
      <LoginForm
        key={prefill}
        defaultIdentifier={prefill}
        registerHref="/register"
        onSuccess={() => router.push(getNextPath())}
      />
      <div className={style.divider}>
        <span>New customer?</span>
      </div>
      <Link href="/register" className={style.btnGhost}>
        Create your account
      </Link>
    </Shell>
  );
};

/* ---------- Create account ---------- */
interface IRegisterInputs {
  name: string;
  phone: string;
  email: string;
  password: string;
}

export const RegisterPage = () => {
  const router = useRouter();
  const [apiError, setApiError] = useState('');
  const [existsMsg, setExistsMsg] = useState('');
  useGuestOnly();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<IRegisterInputs>();

  // keep ?next=/path when sending the user to Login
  const loginHref = () => {
    const n = getNextPath('');
    return n ? `/login?next=${encodeURIComponent(n)}` : '/login';
  };

  const onSubmit = async (data: IRegisterInputs) => {
    setApiError('');
    setExistsMsg('');
    const res = await registerUser(data);
    if (!res.ok) {
      const f = res.fields || {};
      const keys = ['name', 'phone', 'email', 'password'] as const;
      const shown = keys.filter((k) => f[k]);

      // each server message goes under its own field
      shown.forEach((k) => setError(k, { type: 'server', message: f[k] }));

      if (res.duplicate && (f.email || f.phone)) {
        // already registered -> friendly "login instead" card
        setExistsMsg(
          f.email && f.phone
            ? 'This email and mobile number are already registered with Grameen Kalyan.'
            : f.email
            ? 'This email address is already registered with Grameen Kalyan.'
            : 'This mobile number is already registered with Grameen Kalyan.'
        );
        try {
          window.sessionStorage.setItem(
            'gk-registered-id',
            data.email.trim().toLowerCase()
          );
        } catch {
          /* ignore */
        }
      } else if (!shown.length) {
        setApiError(res.message);
      }
      return;
    }

    // registration done -> Login page with a success message
    try {
      window.sessionStorage.setItem(
        'gk-registered-id',
        data.email.trim().toLowerCase()
      );
    } catch {
      /* ignore */
    }
    const next = getNextPath(''); // keep ?next=/path if there was one
    router.push(`/login?registered=1${next ? `&next=${encodeURIComponent(next)}` : ''}`);
  };

  return (
    <Shell
      variant="register"
      title="Create Your Account"
      sub="It takes less than a minute. Your purchases will be saved here."
    >
      <form className={style.form} onSubmit={handleSubmit(onSubmit)} noValidate>
        <TextField
          id="rgName"
          label="Full Name"
          icon={<FaUser />}
          type="text"
          autoComplete="name"
          placeholder="Enter your full name"
          error={errors.name?.message}
          {...register('name', {
            required: 'Your name is required',
            minLength: { value: 2, message: 'Name is too short' },
          })}
        />
        <TextField
          id="rgPhone"
          label="Mobile Number"
          icon={<FaPhoneAlt />}
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          placeholder="01XXXXXXXXX"
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
          id="rgEmail"
          label="Email"
          icon={<FaEnvelope />}
          type="email"
          inputMode="email"
          autoComplete="email"
          autoCapitalize="none"
          placeholder="name@example.com"
          error={errors.email?.message}
          {...register('email', {
            required: 'Email is required',
            pattern: {
              value: EMAIL_REGEX,
              message: 'Please provide a valid email address',
            },
          })}
        />
        <PasswordField
          id="rgPw"
          label="Password"
          autoComplete="new-password"
          placeholder="At least 6 characters"
          error={errors.password?.message}
          {...register('password', {
            required: 'Password is required',
            minLength: { value: 6, message: 'Use at least 6 characters' },
          })}
        />

        {existsMsg && (
          <div className={style.infoBox} role="alert">
            <FaInfoCircle aria-hidden="true" />
            <div>
              <strong>Account already exists</strong>
              <span>{existsMsg} Please login to continue.</span>
            </div>
            <Link href={loginHref()} className={style.infoLink}>
              Login
              <FaArrowRight aria-hidden="true" />
            </Link>
          </div>
        )}

        {apiError && (
          <p className={style.errorBox} role="alert">
            {apiError}
          </p>
        )}

        <button type="submit" className={style.btn} disabled={isSubmitting}>
          {isSubmitting ? 'Creating account...' : 'Create Account'}
          {isSubmitting ? (
            <span className={style.dSpin} aria-hidden="true" />
          ) : (
            <FaArrowRight aria-hidden="true" />
          )}
        </button>
      </form>

      <p className={style.switchLine}>
        Already have an account?{' '}
        <Link href="/login" className={style.link}>
          Login
        </Link>
      </p>
    </Shell>
  );
};

/* ---------- Forgot password (email -> OTP -> new password) ---------- */
type FpStep = 'request' | 'verify' | 'reset';

const FP_STEPS: { key: FpStep; label: string }[] = [
  { key: 'request', label: 'Email' },
  { key: 'verify', label: 'Verify' },
  { key: 'reset', label: 'Reset' },
];

export const ForgotPasswordPage = () => {
  const router = useRouter();
  useGuestOnly();

  const [step, setStep] = useState<FpStep>('request');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [wait, setWait] = useState(0);

  const stepIndex = FP_STEPS.findIndex((s) => s.key === step);

  // resend timer
  useEffect(() => {
    if (wait <= 0) return undefined;
    const timer = window.setTimeout(() => setWait((w) => w - 1), 1000);
    return () => window.clearTimeout(timer);
  }, [wait]);

  // jump straight into the OTP box
  useEffect(() => {
    if (step === 'verify') document.getElementById('fpOtp')?.focus();
  }, [step]);

  // step 1: send the OTP (also used by "Resend OTP")
  const sendCode = async (resend = false) => {
    setError('');
    setBusy(true);
    const res = await forgotPassword(email);
    setBusy(false);
    if (!res.ok) {
      setError(res.message);
      return;
    }
    setEmail(res.data.email);
    setCode('');
    setNotice(
      resend
        ? 'A new OTP has been sent to your email.'
        : 'If this email is registered, an OTP has been sent. Please check your inbox and spam folder.'
    );
    setStep('verify');
    setWait(30);
  };

  const onRequest = (e: React.FormEvent) => {
    e.preventDefault();
    sendCode(false);
  };

  // step 2: check the OTP
  const onVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!/^\d{6}$/.test(code)) {
      setError('Enter the 6 digit OTP.');
      return;
    }
    setBusy(true);
    const res = await verifyResetOtp(email, code);
    setBusy(false);
    if (!res.ok) {
      setError(res.message);
      return;
    }
    setNotice('');
    setStep('reset');
  };

  // step 3: save the new password, then go to Login
  const onReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (password.length < 6) {
      setError('Use at least 6 characters for the new password.');
      return;
    }
    if (password !== confirm) {
      setError('Password and confirm password do not match.');
      return;
    }
    setBusy(true);
    const res = await resetPassword(email, code, password, confirm);
    setBusy(false);
    if (!res.ok) {
      setError(res.message);
      return;
    }
    try {
      window.sessionStorage.setItem('gk-registered-id', email);
    } catch {
      /* ignore */
    }
    const next = getNextPath('');
    router.push(
      `/login?reset=1${next ? `&next=${encodeURIComponent(next)}` : ''}`
    );
  };

  const changeEmail = () => {
    setStep('request');
    setCode('');
    setNotice('');
    setError('');
  };

  const subText = {
    request:
      'Enter your registered email address. We will send a one time OTP to it.',
    verify: `Enter the 6 digit OTP sent to ${email}.`,
    reset: 'OTP verified. Create a new password for your account.',
  }[step];

  const errorBox = error && (
    <p className={style.errorBox} role="alert">
      {error}
    </p>
  );

  const spinner = <span className={style.dSpin} aria-hidden="true" />;

  return (
    <Shell
      variant="forgot"
      title={step === 'reset' ? 'Set New Password' : 'Forgot Password'}
      sub={subText}
    >
      <ol className={style.steps} aria-label="Password reset progress">
        {FP_STEPS.map((s, i) => (
          <li
            key={s.key}
            className={
              i < stepIndex ? style.stepDone : i === stepIndex ? style.stepOn : ''
            }
            aria-current={i === stepIndex ? 'step' : undefined}
          >
            <b>{i < stepIndex ? <FaCheck aria-hidden="true" /> : i + 1}</b>
            {s.label}
          </li>
        ))}
      </ol>

      {step === 'request' && (
        <form className={style.form} onSubmit={onRequest} noValidate>
          <TextField
            id="fpEmail"
            label="Email"
            icon={<FaEnvelope />}
            type="email"
            inputMode="email"
            autoComplete="email"
            autoCapitalize="none"
            placeholder="name@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {errorBox}
          <button type="submit" className={style.btn} disabled={busy}>
            {busy ? 'Sending OTP...' : 'Send OTP'}
            {busy ? spinner : <FaArrowRight aria-hidden="true" />}
          </button>
        </form>
      )}

      {step === 'verify' && (
        <form className={style.form} onSubmit={onVerify} noValidate>
          {notice && (
            <p className={style.successBox} style={{ margin: 0 }} role="status">
              <FaCheckCircle aria-hidden="true" />
              <span>{notice}</span>
            </p>
          )}

          <input
            id="fpOtp"
            className={style.otpInput}
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={6}
            placeholder="······"
            aria-label="6 digit OTP"
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
          />

          {errorBox}

          <button
            type="submit"
            className={style.btn}
            disabled={busy || code.length !== 6}
          >
            {busy ? 'Verifying...' : 'Verify OTP'}
            {busy ? spinner : <FaArrowRight aria-hidden="true" />}
          </button>

          <p className={style.switchLine} style={{ margin: 0 }}>
            Did not get the code?{' '}
            <button
              type="button"
              className={style.link}
              disabled={wait > 0 || busy}
              onClick={() => sendCode(true)}
            >
              {wait > 0 ? `Resend in ${wait}s` : 'Resend OTP'}
            </button>
          </p>
          <p className={style.switchLine} style={{ margin: 0 }}>
            <button type="button" className={style.link} onClick={changeEmail}>
              Change email
            </button>
          </p>
        </form>
      )}

      {step === 'reset' && (
        <form className={style.form} onSubmit={onReset} noValidate>
          <PasswordField
            id="fpPw"
            label="New Password"
            autoComplete="new-password"
            placeholder="At least 6 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <PasswordField
            id="fpPw2"
            label="Confirm New Password"
            autoComplete="new-password"
            placeholder="Re-enter new password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
          />
          {errorBox}
          <button type="submit" className={style.btn} disabled={busy}>
            {busy ? 'Saving...' : 'Reset Password'}
            {busy ? spinner : <FaArrowRight aria-hidden="true" />}
          </button>
        </form>
      )}

      <p className={style.switchLine}>
        Remembered your password?{' '}
        <Link href="/login" className={style.link}>
          Login
        </Link>
      </p>
    </Shell>
  );
};
// ================== END: src/components/Auth/AuthPages.tsx ==================