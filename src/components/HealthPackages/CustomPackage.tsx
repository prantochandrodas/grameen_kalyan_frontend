'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import {
  FaArrowRight,
  FaCheck,
  FaIdCard,
  FaSearch,
  FaTimes,
  FaUserCheck,
  FaUserPlus,
} from 'react-icons/fa';

import { IHealthPackage, formatBDT } from '@/data/healthPackages';
import {
  CARD_VALIDITY_MONTHS,
  CustomerMode,
  buildCustomPackage,
  getCardFeeAmount,
  getCartTotals,
  getCustomTests,
} from '@/shared/utils/healthPackagePricing';

import style from './healthPackages.module.scss';

interface ICustomPackageProps {
  onClose: () => void;
  onBook: (pkg: IHealthPackage) => void;
}

const CustomPackage = ({ onClose, onBook }: ICustomPackageProps) => {
  const [mode, setMode] = useState<CustomerMode | null>(null);
  const [selected, setSelected] = useState<string[]>([]);
  const [query, setQuery] = useState('');
  const closeRef = useRef(onClose);
  closeRef.current = onClose;

  const allTests = useMemo(() => getCustomTests(), []);
  const cardFee = getCardFeeAmount();

  // close on Esc + lock page scroll
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

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? allTests.filter((t) => t.name.toLowerCase().includes(q)) : allTests;
  }, [allTests, query]);

  const chosen = useMemo(
    () => allTests.filter((t) => selected.includes(t.key)),
    [allTests, selected]
  );

  const pkg = useMemo(
    () => (mode && chosen.length ? buildCustomPackage(chosen, mode) : null),
    [mode, chosen]
  );
  const totals = useMemo(() => (pkg ? getCartTotals([pkg]) : null), [pkg]);

  const toggle = (key: string) =>
    setSelected((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );

  const changeType = () => {
    setMode(null);
    setSelected([]);
    setQuery('');
  };

  return (
    <motion.div
      className={style.modalOverlay}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      onClick={onClose}
    >
      <motion.div
        className={`${style.modalSheet} ${style.cpSheet}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="cp-title"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 40 }}
        transition={{ duration: 0.3 }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          className={style.modalClose}
          onClick={onClose}
          aria-label="Close"
        >
          <FaTimes />
        </button>

        {!mode ? (
          /* ---------------- Step 1: who are you? ---------------- */
          <div className={style.cpBody}>
            <div className={style.modalHead}>
              <span className={style.eyebrow}>Customize Package</span>
              <h3 id="cp-title">Build your own package</h3>
            </div>
            <p className={style.cpLead}>
              First tell us which one describes you. It decides the test rates
              you will see.
            </p>

            <div className={style.cpTypes} role="radiogroup" aria-label="Customer type">
              <button
                type="button"
                role="radio"
                aria-checked={false}
                className={style.cpType}
                onClick={() => setMode('member')}
              >
                <span className={style.cpTypeIcon} aria-hidden="true">
                  <FaUserCheck />
                </span>
                <span className={style.cpTypeText}>
                  <strong>Existing member</strong>
                  <small>
                    I bought a package within the last {CARD_VALIDITY_MONTHS}{' '}
                    months.
                  </small>
                  <em>Discount rate on every test · No card fee</em>
                </span>
                <FaArrowRight aria-hidden="true" />
              </button>

              <button
                type="button"
                role="radio"
                aria-checked={false}
                className={style.cpType}
                onClick={() => setMode('regular')}
              >
                <span className={style.cpTypeIcon} aria-hidden="true">
                  <FaUserPlus />
                </span>
                <span className={style.cpTypeText}>
                  <strong>New user or card expired</strong>
                  <small>
                    First time here, or my last package was bought more than{' '}
                    {CARD_VALIDITY_MONTHS} months ago.
                  </small>
                  <em>
                    Regular rate
                    {cardFee > 0 && ` · One-time card fee ${formatBDT(cardFee)}`}
                  </em>
                </span>
                <FaArrowRight aria-hidden="true" />
              </button>
            </div>
          </div>
        ) : (
          /* ---------------- Step 2: choose tests ---------------- */
          <>
            <div className={style.cpBody}>
              <div className={style.modalHead}>
                <span className={style.eyebrow}>Customize Package</span>
                <h3 id="cp-title">Choose your tests</h3>
              </div>

              <div className={style.cpMode}>
                <span>
                  {mode === 'member' ? <FaUserCheck /> : <FaUserPlus />}
                  {mode === 'member'
                    ? 'Existing member · Discount rate'
                    : 'New / expired · Regular rate'}
                </span>
                <button type="button" onClick={changeType}>
                  Change
                </button>
              </div>

              <p className={`${style.cardNote} ${style.cpNotice}`}>
                <FaIdCard aria-hidden="true" />
                <span>
                  {mode === 'member'
                    ? 'No card fee. Our team will verify your previous purchase before confirming.'
                    : `One-time Health Card fee ${
                        cardFee > 0 ? formatBDT(cardFee) : ''
                      } is added once to your total (valid ${CARD_VALIDITY_MONTHS} months).`}
                </span>
              </p>

              <div className={style.cpSearch}>
                <FaSearch aria-hidden="true" />
                <input
                  type="text"
                  autoComplete="off"
                  placeholder="Search a test (e.g. CBC, TSH)"
                  aria-label="Search tests"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
                {query && (
                  <button
                    type="button"
                    onClick={() => setQuery('')}
                    aria-label="Clear search"
                  >
                    <FaTimes />
                  </button>
                )}
              </div>

              <div className={style.cpToolbar}>
                <span>
                  {visible.length} {visible.length === 1 ? 'test' : 'tests'}
                </span>
                {selected.length > 0 && (
                  <button type="button" onClick={() => setSelected([])}>
                    Clear selection
                  </button>
                )}
              </div>

              <ul className={style.cpList}>
                {visible.length === 0 && (
                  <li className={style.cpEmpty}>No test found for “{query}”</li>
                )}
                {visible.map((t) => {
                  const on = selected.includes(t.key);
                  return (
                    <li key={t.key}>
                      <label
                        className={`${style.cpRow} ${on ? style.cpRowOn : ''}`}
                      >
                        <input
                          type="checkbox"
                          checked={on}
                          onChange={() => toggle(t.key)}
                        />
                        <span className={style.cpCheck} aria-hidden="true">
                          <FaCheck />
                        </span>
                        <span className={style.cpName}>{t.name}</span>
                        <span className={style.cpRate}>
                          {mode === 'member' ? (
                            <>
                              {t.rate > t.price && <s>{formatBDT(t.rate)}</s>}
                              <b>{t.price === 0 ? 'FREE' : formatBDT(t.price)}</b>
                            </>
                          ) : (
                            <b>{formatBDT(t.rate)}</b>
                          )}
                        </span>
                      </label>
                    </li>
                  );
                })}
              </ul>
            </div>

            <div className={style.cpFoot}>
              <div className={style.cpSum}>
                <span>
                  {chosen.length} {chosen.length === 1 ? 'test' : 'tests'}{' '}
                  selected
                </span>
                <strong>
                  {formatBDT(
                    totals
                      ? mode === 'member'
                        ? totals.packagesPrice
                        : totals.packagesRate
                      : 0
                  )}
                </strong>
                {totals && totals.cardFee > 0 && (
                  <small>
                    Incl. {formatBDT(totals.cardFee)} one-time card fee
                  </small>
                )}
                {mode === 'member' && totals && totals.saved > 0 && (
                  <small>You save {formatBDT(totals.saved)}</small>
                )}
              </div>
              <button
                type="button"
                className={`${style.btn} ${style.btnPrimary} ${style.cpBook}`}
                disabled={!pkg}
                onClick={() => pkg && onBook(pkg)}
              >
                Book Now
                <FaArrowRight />
              </button>
            </div>
          </>
        )}
      </motion.div>
    </motion.div>
  );
};

export default CustomPackage;