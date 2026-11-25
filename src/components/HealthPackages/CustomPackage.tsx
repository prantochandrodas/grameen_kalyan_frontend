'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  FaArrowRight,
  FaCheck,
  FaIdCard,
  FaSearch,
  FaTimes,
  FaUserCheck,
  FaUserMd,
  FaUserPlus,
} from 'react-icons/fa';

import { IHealthPackage, formatBDT } from '@/data/healthPackages';
import {
  CARD_VALIDITY_MONTHS,
  CUSTOM_CONSULT_KEY,
  CardChoice,
  CustomerMode,
  buildCustomPackage,
  getCardFeeAmount,
  getCartTotals,
  getCustomTests,
} from '@/shared/utils/healthPackagePricing';
import { useHealthPackages } from '@/shared/context/HealthPackagesContext';

import style from './healthPackages.module.scss';

interface ICustomPackageProps {
  onClose: () => void;
  onBook: (pkg: IHealthPackage, cardChoice: CardChoice) => void;
}

const CustomPackage = ({ onClose, onBook }: ICustomPackageProps) => {
  const [mode, setMode] = useState<CustomerMode | null>(null);
  const [selected, setSelected] = useState<string[]>([]);
  const [query, setQuery] = useState('');
  const [askCard, setAskCard] = useState(false);
  const [wantCard, setWantCard] = useState<boolean | null>(null);
  const [askDoctor, setAskDoctor] = useState(false);

  const { packages } = useHealthPackages();
  const allTests = useMemo(() => getCustomTests(packages), [packages]);
  const cardFee = getCardFeeAmount() || 150;
  const consultTest = allTests.find((t) => t.key === CUSTOM_CONSULT_KEY) || null;
  // existing member OR new user who takes the card = discount rate
  const isDiscount = mode === 'member' || wantCard === true;
  // card fee is added once, only when a new user says Yes
  const appliedCardFee = mode === 'regular' && wantCard === true ? cardFee : 0;

  // lock page scroll (the popup closes ONLY with the close button)
  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
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
    setWantCard(null);
    setAskCard(false);
    setSelected([]);
    setQuery('');
  };

  // New user / card expired -> Health Card Yes / No -> tests popup
  const chooseCard = (yes: boolean) => {
    setWantCard(yes);
    setMode('regular');
    setAskCard(false);
  };

  // send the package to the booking page (doctor consultation is optional)
  const finishBooking = (withDoctor: boolean) => {
    if (!mode) return;
    const alreadyHas = !!consultTest && selected.includes(consultTest.key);
    const tests =
      withDoctor && consultTest && !alreadyHas ? [...chosen, consultTest] : chosen;
    if (!tests.length) return;
    const cardChoice: CardChoice =
      mode === 'member' ? 'member' : wantCard ? 'yes' : 'no';
    setAskDoctor(false);
    onBook(buildCustomPackage(tests, mode), cardChoice);
  };

  // Book Now -> ask about doctor consultation (skipped if it is already selected)
  const handleBook = () => {
    if (!pkg) return;
    if (consultTest && !selected.includes(consultTest.key)) setAskDoctor(true);
    else finishBooking(false);
  };

  return (
    <motion.div
      className={style.modalOverlay}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <motion.div
        className={`${style.modalSheet} ${style.cpSheet} ${
          askCard ? style.cpSheetSm : ''
        }`}
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

        {askCard ? (
          /* ---------------- Step 1b: Health Card Yes / No ---------------- */
          <div className={style.cpBody}>
            <span className={style.cpAskIcon} aria-hidden="true">
              <FaIdCard />
            </span>
            <div className={style.modalHead}>
              <span className={style.eyebrow}>Health Card</span>
              <h3 id="cp-title">Do you want a Health Card?</h3>
            </div>
            <p className={style.cpLead}>
              One-time card fee {formatBDT(cardFee)}, valid {CARD_VALIDITY_MONTHS}{' '}
              months. With the card you get the discount rate on every test.
            </p>

            <div className={style.cpChoices}>
              <button
                type="button"
                className={`${style.cpChoice} ${style.cpChoicePrimary}`}
                onClick={() => chooseCard(true)}
              >
                <FaCheck aria-hidden="true" />
                <span>
                  <b>Yes, I want the card</b>
                  <small>
                    Discount rate on every test · One-time fee {formatBDT(cardFee)}
                  </small>
                </span>
                <FaArrowRight aria-hidden="true" />
              </button>
              <button
                type="button"
                className={style.cpChoice}
                onClick={() => chooseCard(false)}
              >
                <FaTimes aria-hidden="true" />
                <span>
                  <b>No, thanks</b>
                  <small>Regular rate · No card fee · Valid 1 month</small>
                </span>
                <FaArrowRight aria-hidden="true" />
              </button>
            </div>

            <button
              type="button"
              className={style.cpAskLink}
              onClick={() => setAskCard(false)}
            >
              Back
            </button>
          </div>
        ) : !mode ? (
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
                onClick={() => setAskCard(true)}
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
                  <em>Health Card option · Card fee {formatBDT(cardFee)}</em>
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
                    : wantCard
                    ? 'Health Card · Discount rate'
                    : 'No card · Regular rate'}
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
                    : wantCard
                    ? `One-time Health Card fee ${formatBDT(
                        cardFee
                      )} is added once to your total (valid ${CARD_VALIDITY_MONTHS} months).`
                    : 'No Health Card. Regular rate applies and the package is valid for 1 month.'}
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
                          {isDiscount ? (
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
                      ? (isDiscount ? totals.packagesPrice : totals.packagesRate) +
                          appliedCardFee
                      : 0
                  )}
                </strong>
                {totals && appliedCardFee > 0 && (
                  <small>
                    Incl. {formatBDT(appliedCardFee)} one-time card fee
                  </small>
                )}
                {isDiscount && totals && totals.saved > 0 && (
                  <small>You save {formatBDT(totals.saved)}</small>
                )}
              </div>
              <button
                type="button"
                className={`${style.btn} ${style.btnPrimary} ${style.cpBook}`}
                disabled={!pkg}
                onClick={handleBook}
              >
                Book Now
                <FaArrowRight />
              </button>
            </div>
          </>
        )}
      </motion.div>

      {/* ---------------- Doctor consultation popup (on Book Now) ---------------- */}
      {askDoctor && consultTest && (
        <div className={`${style.modalOverlay} ${style.cpAskOverlay}`}>
          <motion.div
            className={`${style.modalSheet} ${style.cpSheetSm}`}
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="cp-doc-title"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
          >
            <span className={style.cpAskIcon} aria-hidden="true">
              <FaUserMd />
            </span>
            <div className={style.modalHead}>
              <span className={style.eyebrow}>Doctor Consultation</span>
              <h3 id="cp-doc-title">Add a doctor consultation?</h3>
            </div>
            <p className={style.cpLead}>
              Meet a health center doctor (MBBS) for{' '}
              <strong>
                {formatBDT(isDiscount ? consultTest.price : consultTest.rate)}
              </strong>
              . It is added to your total only if you say Yes.
            </p>

            <div className={style.cpChoices}>
              <button
                type="button"
                className={`${style.cpChoice} ${style.cpChoicePrimary}`}
                onClick={() => finishBooking(true)}
              >
                <FaCheck aria-hidden="true" />
                <span>
                  <b>Yes, add consultation</b>
                  <small>
                    + {formatBDT(isDiscount ? consultTest.price : consultTest.rate)} added to total
                  </small>
                </span>
                <FaArrowRight aria-hidden="true" />
              </button>
              <button
                type="button"
                className={style.cpChoice}
                onClick={() => finishBooking(false)}
              >
                <FaTimes aria-hidden="true" />
                <span>
                  <b>No, continue without it</b>
                  <small>No consultation fee</small>
                </span>
                <FaArrowRight aria-hidden="true" />
              </button>
            </div>

            <button
              type="button"
              className={style.cpAskLink}
              onClick={() => setAskDoctor(false)}
            >
              Back to tests
            </button>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};

export default CustomPackage;