'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  FaArrowRight,
  FaCheck,
  FaEye,
  FaEyeSlash,
  FaIdCard,
  FaRedo,
  FaSearch,
  FaTag,
  FaTimes,
  FaUserCheck,
  FaUserMd,
} from 'react-icons/fa';

import { IHealthPackage, formatBDT } from '@/data/healthPackages';
import {
  CARD_VALIDITY_MONTHS,
  CardChoice,
  CustomerMode,
  ICustomTest,
  buildCustomPackage,
  getCartTotals,
} from '@/shared/utils/healthPackagePricing';
import { fetchCustomTests } from '@/shared/utils/healthPackagesApi';
import { EMAIL_REGEX, loginUser } from '@/shared/utils/authService';
import { useAuth } from '@/shared/context/AuthContext';
import { useCharges } from '@/shared/hook/useCharges';

import style from './healthPackages.module.scss';

interface ICustomPackageProps {
  onClose: () => void;
  onBook: (pkg: IHealthPackage, cardChoice: CardChoice) => void;
}

type Plan = 'regular' | 'card' | 'member';
type MemberStep = 'email' | 'checking' | 'active' | 'expired';

const CustomPackage = ({ onClose, onBook }: ICustomPackageProps) => {
  // regular = new customer, no card | card = new customer takes card | member = existing member
  const [plan, setPlan] = useState<Plan>('regular');
  const [selected, setSelected] = useState<string[]>([]);
  const [query, setQuery] = useState('');
  const [askDoctor, setAskDoctor] = useState(false);

  // tests from /api/tests
  const [allTests, setAllTests] = useState<ICustomTest[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  // existing member verification
  const { user } = useAuth();
  const [step, setStep] = useState<MemberStep>('email');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  // card fee + doctor charge both come from the API
  const { cardFee, doctor: doctorCharge } = useCharges();
  const doctorStatus = doctorCharge?.status ?? 0;
  const doctorAmount = doctorCharge?.amount ?? 0;
  // status 1 = added to subtotal | 2 = optional (asked on Book Now) | 3 = free
  const doctorNow = doctorStatus === 1 ? doctorAmount : 0;
  const mode: CustomerMode = plan === 'member' ? 'member' : 'regular';
  const memberReady = plan === 'member' && step === 'active';
  // tests are shown only for new customers or a verified member
  const showTests = plan !== 'member' || memberReady;
  // card taker OR verified member = discount rate, otherwise regular rate
  const isDiscount = plan === 'card' || memberReady;
  // card fee is added once, only when a new customer takes the card
  const appliedCardFee = plan === 'card' ? cardFee : 0;

  const notice =
    plan === 'member'
      ? memberReady
        ? 'Your Micro Health insurance Card is active. Discount rate on every test, no card fee.'
        : 'Sign in with your email and password to see your member discount rate.'
      : plan === 'card'
      ? `On time micro health insurance card ${formatBDT(
          cardFee
        )} is added once to your total (valid ${CARD_VALIDITY_MONTHS} months).`
      : 'No micro health insurance card. Regular rate applies and the package is valid for 1 month.';

  const plans: { id: Plan; icon: React.ReactNode; title: string; sub: string }[] =
    [
      {
        id: 'regular',
        icon: <FaTag />,
        title: 'New customer',
        sub: 'No card · Regular rate',
      },
      {
        id: 'card',
        icon: <FaIdCard />,
        title: 'Get Micro Health insurance Card',
        sub: `Discount rate · ${formatBDT(cardFee)} one-time`,
      },
      {
        id: 'member',
        icon: <FaUserCheck />,
        title: 'Existing member',
        sub: 'Sign in · Discount rate',
      },
    ];

  // lock page scroll (the popup closes ONLY with the close button)
  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, []);

  // load the test list
  const loadTests = useCallback(async () => {
    setLoading(true);
    setLoadError(false);
    const list = await fetchCustomTests();
    if (list) setAllTests(list);
    else setLoadError(true);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadTests();
  }, [loadTests]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? allTests.filter((t) => t.name.toLowerCase().includes(q)) : allTests;
  }, [allTests, query]);

  const chosen = useMemo(
    () => allTests.filter((t) => selected.includes(t.key)),
    [allTests, selected]
  );

  const pkg = useMemo(
    () => (showTests && chosen.length ? buildCustomPackage(chosen, mode) : null),
    [showTests, mode, chosen]
  );
  const totals = useMemo(() => (pkg ? getCartTotals([pkg]) : null), [pkg]);

  const toggle = (key: string) =>
    setSelected((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );

  // switching the option keeps the selected tests, only the rates change
  const choosePlan = (next: Plan) => {
    setPlan(next);
    setError('');
  };

  /* ---------- existing member: has_valid_card comes from the login API ---------- */
  const runCheck = (hasValidCard?: boolean) => {
    setStep(hasValidCard ? 'active' : 'expired');
  };

  // already logged in -> no sign in needed, use the saved has_valid_card
  useEffect(() => {
    if (plan === 'member' && user && step === 'email') {
      runCheck(user.hasValidCard);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [plan, user, step]);

  // existing member: email + password sign in -> then check the Health Card
  const signIn = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError('');
    const value = email.trim().toLowerCase();
    if (!EMAIL_REGEX.test(value)) {
      setError('Enter a valid email address.');
      return;
    }
    if (!password) {
      setError('Enter your password.');
      return;
    }
    setBusy(true);
    setStep('checking');
    const res = await loginUser(value, password);
    setBusy(false);
    if (!res.ok) {
      setStep('email');
      setError(res.message);
      return;
    }
    setPassword('');
    runCheck(res.data.hasValidCard);
  };

  // send the package to the booking page
  const finishBooking = (withDoctor: boolean) => {
    if (!showTests || !chosen.length) return;
    const cardChoice: CardChoice =
      plan === 'member' ? 'member' : plan === 'card' ? 'yes' : 'no';

    let doctor: IHealthPackage['doctor'];
    if (doctorStatus === 1 || (doctorStatus === 2 && withDoctor)) {
      doctor = { rate: doctorAmount, price: doctorAmount };
    } else if (doctorStatus === 3) {
      doctor = { rate: 0, price: 0, free: true };
    }

    setAskDoctor(false);
    onBook(buildCustomPackage(chosen, mode, doctor), cardChoice);
  };

  // Book Now -> status 2 asks Yes / No, status 1 and 3 go straight on
  const handleBook = () => {
    if (!pkg) return;
    if (doctorStatus === 2 && doctorAmount > 0) setAskDoctor(true);
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

        <>
          <div className={style.cpBody}>
            <div className={style.modalHead}>
              <span className={style.eyebrow}>Customize Package</span>
              <h3 id="cp-title">Choose your tests</h3>
            </div>

            {/* ---------- 3 options ---------- */}
            <div
              className={style.cpPlans}
              role="radiogroup"
              aria-label="Customer type"
            >
              {plans.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  role="radio"
                  aria-checked={plan === p.id}
                  className={`${style.cpPlan} ${
                    plan === p.id ? style.cpPlanOn : ''
                  }`}
                  onClick={() => choosePlan(p.id)}
                >
                  <span className={style.cpPlanHead}>
                    <span className={style.cpPlanIcon} aria-hidden="true">
                      {p.icon}
                    </span>
                    <strong>{p.title}</strong>
                  </span>
                  <small className={style.cpPlanSub}>{p.sub}</small>
                </button>
              ))}
            </div>

            <p className={`${style.cardNote} ${style.cpNotice}`}>
              <FaIdCard aria-hidden="true" />
              <span>{notice}</span>
            </p>

            {/* ---------- existing member: verify ---------- */}
            {plan === 'member' && !memberReady && (
              <div className={style.cpVerify}>
                {step === 'checking' && (
                  <p className={style.cpVerifyText} role="status">
                    <FaRedo className={style.cpSpin} aria-hidden="true" />{' '}
                    Checking your Health Card…
                  </p>
                )}

                {step === 'email' && (
                  <form
                    onSubmit={signIn}
                    noValidate
                    className={style.cpVerifyForm}
                  >
                    <h4 className={style.cpVerifyTitle}>
                      <FaUserCheck aria-hidden="true" /> Member sign in
                    </h4>
                    <p className={style.cpVerifyText}>
                      Sign in with the email and password of your Grameen Kalyan
                      account to check your Health Card.
                    </p>

                    <input
                      type="email"
                      inputMode="email"
                      autoComplete="email"
                      className={style.cpVerifyInput}
                      placeholder="Email address"
                      aria-label="Email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />

                    <div className={style.cpPwWrap}>
                      <input
                        type={showPw ? 'text' : 'password'}
                        autoComplete="current-password"
                        className={`${style.cpVerifyInput} ${style.cpPwInput}`}
                        placeholder="Password"
                        aria-label="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                      <button
                        type="button"
                        className={style.cpPwEye}
                        onClick={() => setShowPw((s) => !s)}
                        aria-label={showPw ? 'Hide password' : 'Show password'}
                      >
                        {showPw ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>

                    {error && (
                      <p className={style.cpVerifyError} role="alert">
                        {error}
                      </p>
                    )}

                    <button
                      type="submit"
                      className={`${style.cpVerifyBtn} ${style.cpVerifyBtnFull}`}
                      disabled={busy}
                    >
                      {busy ? 'Signing in…' : 'Sign in & check card'}
                    </button>

                    <div className={style.cpVerifyLinks}>
                      <Link href="/forgot-password">Forgot password?</Link>
                      <button
                        type="button"
                        className={style.cpLinkBtn}
                        onClick={() => choosePlan('regular')}
                      >
                        I am a new customer
                      </button>
                    </div>
                  </form>
                )}

                {step === 'expired' && (
                  <>
                    <h4 className={style.cpVerifyTitle}>
                      <FaIdCard aria-hidden="true" /> No active Health Card found
                    </h4>
                    <p className={style.cpVerifyText}>
                      Your previous card is not valid any more. Get a new Health
                      Card to continue and enjoy the discount rate on every test.
                    </p>
                    <div className={style.cpChoices}>
                      <button
                        type="button"
                        className={`${style.cpChoice} ${style.cpChoicePrimary}`}
                        onClick={() => choosePlan('card')}
                      >
                        <FaCheck aria-hidden="true" />
                        <span>
                          <b>Get Micro Health insurance Card</b>
                          <small>
                            Discount rate · One-time fee {formatBDT(cardFee)}
                          </small>
                        </span>
                        <FaArrowRight aria-hidden="true" />
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* ---------- tests ---------- */}
            {showTests && (
              <>
                {loading ? (
                  <ul className={style.cpList} aria-busy="true">
                    {[0, 1, 2, 3, 4].map((i) => (
                      <li key={i} className={style.cpSkelRow} />
                    ))}
                  </ul>
                ) : loadError ? (
                  <div className={style.cpEmpty}>
                    Could not load the tests.{' '}
                    <button
                      type="button"
                      className={style.cpLinkBtn}
                      onClick={loadTests}
                    >
                      Retry
                    </button>
                  </div>
                ) : (
                  <>
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
                        <li className={style.cpEmpty}>
                          {query ? `No test found for “${query}”` : 'No tests available'}
                        </li>
                      )}
                      {visible.map((t) => {
                        const on = selected.includes(t.key);
                        return (
                          <li key={t.key}>
                            <label
                              className={`${style.cpRow} ${
                                on ? style.cpRowOn : ''
                              }`}
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
                                    {t.rate > t.price && (
                                      <s>{formatBDT(t.rate)}</s>
                                    )}
                                    <b>
                                      {t.price === 0 ? 'FREE' : formatBDT(t.price)}
                                    </b>
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
                  </>
                )}
              </>
            )}
          </div>

          <div className={style.cpFoot}>
            <div className={style.cpSum}>
              <span>
                {chosen.length} {chosen.length === 1 ? 'test' : 'tests'} selected
              </span>
              <strong>
                {formatBDT(
                  totals
                    ? (isDiscount ? totals.packagesPrice : totals.packagesRate) +
                        appliedCardFee +
                        doctorNow
                    : 0
                )}
              </strong>
              {totals && (
                <small>
                  Tests{' '}
                  {formatBDT(
                    isDiscount ? totals.packagesPrice : totals.packagesRate
                  )}
                  {doctorStatus === 1 && doctorAmount > 0
                    ? ` + Doctor ${formatBDT(doctorAmount)}`
                    : ''}
                  {doctorStatus === 3 ? ' + Doctor FREE' : ''}
                  {doctorStatus === 2 ? ' · Doctor optional' : ''}
                </small>
              )}
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
      </motion.div>

      {/* ---------------- Doctor consultation popup (on Book Now) ---------------- */}
      {askDoctor && doctorStatus === 2 && (
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
                {formatBDT(doctorAmount)}
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
                    + {formatBDT(doctorAmount)} added to total
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