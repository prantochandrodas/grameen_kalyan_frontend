// ================= START: src/components/Auth/AuthUi.tsx =================
'use client';

import React, { forwardRef, useState } from 'react';
import { FaEye, FaEyeSlash, FaLock } from 'react-icons/fa';

import style from './auth.module.scss';

interface IFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon: React.ReactNode;
  error?: string;
}

export const TextField = forwardRef<HTMLInputElement, IFieldProps>(
  ({ label, icon, error, id, ...rest }, ref) => (
    <div className={style.field}>
      <label htmlFor={id}>{label}</label>
      <div className={style.inputWrap}>
        <span className={style.inputIcon} aria-hidden="true">
          {icon}
        </span>
        <input ref={ref} id={id} aria-invalid={!!error} {...rest} />
      </div>
      {error && <small role="alert">{error}</small>}
    </div>
  )
);
TextField.displayName = 'TextField';

interface IPasswordProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: string;
  error?: string;
}

// password field with show / hide button
export const PasswordField = forwardRef<HTMLInputElement, IPasswordProps>(
  ({ label, error, id, ...rest }, ref) => {
    const [show, setShow] = useState(false);
    return (
      <div className={style.field}>
        <label htmlFor={id}>{label}</label>
        <div className={style.inputWrap}>
          <span className={style.inputIcon} aria-hidden="true">
            <FaLock />
          </span>
          <input
            ref={ref}
            id={id}
            type={show ? 'text' : 'password'}
            className={style.hasToggle}
            aria-invalid={!!error}
            {...rest}
          />
          <button
            type="button"
            className={style.eye}
            onClick={() => setShow((s) => !s)}
            aria-label={show ? 'Hide password' : 'Show password'}
          >
            {show ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>
        {error && <small role="alert">{error}</small>}
      </div>
    );
  }
);
PasswordField.displayName = 'PasswordField';

// ?next=/path support (safe, same-site paths only)
export const getNextPath = (fallback = '/dashboard') => {
  if (typeof window === 'undefined') return fallback;
  const next = new URLSearchParams(window.location.search).get('next');
  return next && next.startsWith('/') && !next.startsWith('//') ? next : fallback;
};
// ================== END: src/components/Auth/AuthUi.tsx ==================