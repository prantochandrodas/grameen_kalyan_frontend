// ================= START: src/components/Auth/LoginForm.tsx =================
'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { FaArrowRight, FaUser } from 'react-icons/fa';

import { loginUser, parseIdentifier } from '@/shared/utils/authService';

import { PasswordField, TextField } from './AuthUi';
import style from './auth.module.scss';

interface IInputs {
  identifier: string;
  password: string;
}

interface ILoginFormProps {
  onSuccess: () => void;
  defaultIdentifier?: string;
}

const LoginForm = ({ onSuccess, defaultIdentifier = '' }: ILoginFormProps) => {
  const [apiError, setApiError] = useState('');
  const {
    register,
    handleSubmit,
    setFocus,
    formState: { errors, isSubmitting },
  } = useForm<IInputs>({ defaultValues: { identifier: defaultIdentifier } });

  // email is already filled (after registration) -> go straight to password
  useEffect(() => {
    if (defaultIdentifier) setFocus('password');
  }, [defaultIdentifier, setFocus]);

  const onSubmit = async (data: IInputs) => {
    setApiError('');
    const res = await loginUser(data.identifier, data.password);
    if (!res.ok) {
      setApiError(res.message);
      return;
    }
    onSuccess();
  };

  return (
    <form className={style.form} onSubmit={handleSubmit(onSubmit)} noValidate>
      <TextField
        id="lgId"
        label="Mobile Number or Email"
        icon={<FaUser />}
        type="text"
        inputMode="text"
        autoComplete="username"
        autoCapitalize="none"
        placeholder="01XXXXXXXXX or name@example.com"
        error={errors.identifier?.message}
        {...register('identifier', {
          required: 'Enter your mobile number or email',
          validate: (v) =>
            !!parseIdentifier(v) || 'Enter a valid mobile number or email',
        })}
      />

      <PasswordField
        id="lgPw"
        label="Password"
        autoComplete="current-password"
        placeholder="Enter your password"
        error={errors.password?.message}
        {...register('password', { required: 'Password is required' })}
      />

      <div className={style.rowEnd}>
        <Link href="/forgot-password" className={style.link}>
          Forgot Password?
        </Link>
      </div>

      {apiError && (
        <p className={style.errorBox} role="alert">
          {apiError}
        </p>
      )}

      <button type="submit" className={style.btn} disabled={isSubmitting}>
        {isSubmitting ? 'Logging in...' : 'Login'}
        {isSubmitting ? (
          <span className={style.dSpin} aria-hidden="true" />
        ) : (
          <FaArrowRight aria-hidden="true" />
        )}
      </button>
    </form>
  );
};

export default LoginForm;
// ================== END: src/components/Auth/LoginForm.tsx ==================