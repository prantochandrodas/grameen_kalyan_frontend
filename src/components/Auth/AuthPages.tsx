// ================= START: src/components/Auth/AuthPages.tsx =================
'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import {
  FaArrowRight,
  FaCheckCircle,
  FaEnvelope,
  FaHeartbeat,
  FaIdCard,
  FaPhoneAlt,
  FaShieldAlt,
  FaUser,
} from 'react-icons/fa';

import { useAuth } from '@/shared/context/AuthContext';
import {
  EMAIL_REGEX,
  PHONE_REGEX,
  parseIdentifier,
  registerUser,
  sendOtp,
  verifyOtp,
} from '@/shared/utils/authService';

import LoginForm from './LoginForm';
import { PasswordField, TextField, getNextPath } from './AuthUi';
import style from './auth.module.scss';

/* ---------- shared layout ---------- */
const Shell = ({
  title,
  sub,
  children,
}: {
  title: string;
  sub: string;
  children: React.ReactNode;
}) => (
  <main className={style.page}>
    <div className={style.shell}>
      <aside className={style.aside}>
        <span className={style.asideBadge}>
          <FaHeartbeat aria-hidden="true" /> Grameen Kalyan
        </span>
        <h2>Your health, one secure account.</h2>
        <p>
          Book health packages, track every purchase and keep your Health Card
          details in one place.
        </p>
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
      </aside>
      <section className={style.main}>
        <h1 className={style.title}>{title}</h1>
        <p className={style.sub}>{sub}</p>
        {children}
      </section>
    </div>
  </main>
);

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
  useGuestOnly();

  return (
    <Shell
      title="Login to My Account"
      sub="Use your mobile number or email address."
    >
      <LoginForm onSuccess={() => router.push(getNextPath())} />
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
  useGuestOnly();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<IRegisterInputs>();

  const onSubmit = async (data: IRegisterInputs) => {
    setApiError('');
    const res = await registerUser(data);
    if (!res.ok) {
      setApiError(res.message);
      return;
    }
    router.push(getNextPath());
  };

  return (
    <Shell
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

        {apiError && (
          <p className={style.errorBox} role="alert">
            {apiError}
          </p>
        )}

        <button type="submit" className={style.btn} disabled={isSubmitting}>
          {isSubmitting ? 'Creating account...' : 'Create Account'}
          <FaArrowRight aria-hidden="true" />
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

/* ---------- Forgot password (OTP) ---------- */
export const ForgotPasswordPage = () => {
  const router = useRouter();
  useGuestOnly();

  const [step, setStep] = useState<'request' | 'verify'>('request');
  const [mode, setMode] = useState<'login' | 'reset'>('login');
  const [identifier, setIdentifier] = useState('');
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [demoCode, setDemoCode] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [wait, setWait] = useState(0);

  // resend timer
  useEffect(() => {
    if (wait <= 0) return undefined;
    const timer = window.setTimeout(() => setWait((w) => w - 1), 1000);
    return () => window.clearTimeout(timer);
  }, [wait]);

  const request = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError('');
    if (!parseIdentifier(identifier)) {
      setError('Enter a valid mobile number or email');
      return;
    }
    setBusy(true);
    const res = await sendOtp(identifier);
    setBusy(false);
    if (!res.ok) {
      setError(res.message);
      return;
    }
    setDemoCode(res.data.demoCode || null);
    setCode('');
    setStep('verify');
    setWait(30);
  };

  const verify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!/^\d{6}$/.test(code)) {
      setError('Enter the 6 digit OTP');
      return;
    }
    if (mode === 'reset') {
      if (password.length < 6) {
        setError('Use at least 6 characters for the new password');
        return;
      }
      if (password !== confirm) {
        setError('Passwords do not match');
        return;
      }
    }
    setBusy(true);
    const res = await verifyOtp(
      identifier,
      code,
      mode === 'reset' ? password : undefined
    );
    setBusy(false);
    if (!res.ok) {
      setError(res.message);
      return;
    }
    router.push(getNextPath());
  };

  return (
    <Shell
      title="Forgot Password"
      sub={
        step === 'request'
          ? 'Enter your mobile number or email. We will send a one time OTP.'
          : `Enter the 6 digit OTP sent to ${identifier.trim()}.`
      }
    >
      {step === 'request' ? (
        <form className={style.form} onSubmit={request} noValidate>
          <TextField
            id="fpId"
            label="Mobile Number or Email"
            icon={<FaUser />}
            type="text"
            inputMode="text"
            autoCapitalize="none"
            placeholder="01XXXXXXXXX or name@example.com"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
          />
          {error && (
            <p className={style.errorBox} role="alert">
              {error}
            </p>
          )}
          <button type="submit" className={style.btn} disabled={busy}>
            {busy ? 'Sending OTP...' : 'Send OTP'}
            <FaArrowRight aria-hidden="true" />
          </button>
        </form>
      ) : (
        <form className={style.form} onSubmit={verify} noValidate>
          {demoCode && (
            <p className={style.demoBox}>
              Demo mode: no SMS is sent. Your OTP is <b>{demoCode}</b>
            </p>
          )}

          <input
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

          <div className={style.seg} role="tablist" aria-label="After OTP">
            <button
              type="button"
              role="tab"
              aria-selected={mode === 'login'}
              onClick={() => setMode('login')}
            >
              Login one time
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={mode === 'reset'}
              onClick={() => setMode('reset')}
            >
              Set new password
            </button>
          </div>

          {mode === 'reset' && (
            <>
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
            </>
          )}

          {error && (
            <p className={style.errorBox} role="alert">
              {error}
            </p>
          )}

          <button type="submit" className={style.btn} disabled={busy}>
            {busy
              ? 'Verifying...'
              : mode === 'reset'
              ? 'Verify & Set Password'
              : 'Verify & Login'}
            <FaArrowRight aria-hidden="true" />
          </button>

          <p className={style.switchLine} style={{ margin: 0 }}>
            Did not get the code?{' '}
            <button
              type="button"
              className={style.link}
              disabled={wait > 0 || busy}
              onClick={() => request()}
            >
              {wait > 0 ? `Resend in ${wait}s` : 'Resend OTP'}
            </button>
          </p>
          <p className={style.switchLine} style={{ margin: 0 }}>
            <button
              type="button"
              className={style.link}
              onClick={() => {
                setStep('request');
                setError('');
              }}
            >
              Change mobile / email
            </button>
          </p>
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