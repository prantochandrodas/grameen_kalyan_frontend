// ================= START: src/components/Auth/AuthGateModal.tsx =================
'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { FaArrowRight, FaTimes, FaUserPlus } from 'react-icons/fa';

import LoginForm from './LoginForm';
import style from './auth.module.scss';

interface IAuthGateModalProps {
  onClose: () => void;
  onContinue: () => void;
}

const AuthGateModal = ({ onClose, onContinue }: IAuthGateModalProps) => {
  const [tab, setTab] = useState<'existing' | 'new'>('existing');
  const closeRef = useRef(onClose);
  closeRef.current = onClose;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeRef.current();
    };
    document.addEventListener('keydown', onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = previous;
    };
  }, []);

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
        aria-labelledby="gate-title"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 40 }}
        transition={{ duration: 0.3 }}
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
          <h3 id="gate-title">Continue to booking</h3>
          <p>Are you an existing user or a new customer?</p>
        </div>

        <div className={style.seg} role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={tab === 'existing'}
            onClick={() => setTab('existing')}
          >
            Existing user
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={tab === 'new'}
            onClick={() => setTab('new')}
          >
            New customer
          </button>
        </div>

        {tab === 'existing' ? (
          <div className={style.gateBody}>
            <LoginForm onSuccess={onContinue} />
          </div>
        ) : (
          <div className={style.newBox}>
            <span className={style.newIcon} aria-hidden="true">
              <FaUserPlus />
            </span>
            <h4>Book as a new customer</h4>
            <p>
              No password needed now. We will create your account automatically
              from your phone / email. Later, login anytime with Forgot
              Password (OTP) to see all your purchases.
            </p>
            <button type="button" className={style.btn} onClick={onContinue}>
              Continue to Confirm Package
              <FaArrowRight aria-hidden="true" />
            </button>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default AuthGateModal;
// ================== END: src/components/Auth/AuthGateModal.tsx ==================