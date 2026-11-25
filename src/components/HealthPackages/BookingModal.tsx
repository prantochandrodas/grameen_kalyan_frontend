// ================= START: BookingModal.tsx =================
'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import Link from 'next/link';
import {
  FaArrowLeft,
  FaCheck,
  FaCheckCircle,
  FaFilePdf,
  FaIdCard,
  FaPhoneAlt,
  FaTimes,
  FaSignInAlt,
  FaUserCheck,
  FaEnvelope,
  FaUserCircle,
  FaNotesMedical,
  FaEye,
  FaEyeSlash,
  FaChevronDown,
} from 'react-icons/fa';

import { IHealthPackage, formatBDT } from '@/data/healthPackages';
import {
  CARD_VALIDITY_MONTHS,
  CUSTOM_PACKAGE_ID,
  CardChoice,
  getCardFeeAmount,
  getCartTotals,
  getPackageCore,
} from '@/shared/utils/healthPackagePricing';
import { useAuth } from '@/shared/context/AuthContext';
import { useSetting } from '@/shared/context/SettingContext';
import {
  IPurchase,
  addMonths,
  getActiveCard,
  getPurchases,
  recordPurchase,
} from '@/shared/utils/authService';
import { IHealthCenter } from '@/shared/types/healthCenter';

import LoginForm from '@/components/Auth/LoginForm';
import HealthCenterField from './HealthCenterField';
import type { IInvoiceData } from './invoicePdf';
import style from './healthPackages.module.scss';

interface IBookingInputs {
  name: string;
  patientName: string;
  gender: string;
  age: string;
  bloodGroup: string;
  phone: string;
  patientPhone: string;
  email: string;
  password: string;
  date: string;
  note: string;
}

interface IBookingModalProps {
  items: IHealthPackage[];
  onClose: () => void;
  onSuccess: (ids: string[]) => void;
  asPage?: boolean;
  cardChoice?: CardChoice;
}

const PHONE_REGEX = /^(?:\+?88)?01[3-9]\d{8}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
const GENDERS = ['Male', 'Female', 'Other'];


const fmtDate = (value: string | Date) =>
  new Date(value).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
const BookingModal = ({
  items,
  onClose,
  onSuccess,
  asPage = false,
  cardChoice,
}: IBookingModalProps) => {

  const [done, setDone] = useState(false);
  const [apiError, setApiError] = useState(false);
  const [center, setCenter] = useState<IHealthCenter | null>(null);
  const [centerError, setCenterError] = useState(false);
  const [invoice, setInvoice] = useState<IInvoiceData | null>(null);
  const [downloading, setDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState(false);
  const { user, logout } = useAuth();
  const setting = useSetting();
  const [showLogin, setShowLogin] = useState(false);
  const [showPw, setShowPw] = useState(false);
  // which package's test list is open (null = all hidden)
  const [openPkg, setOpenPkg] = useState<string | null>(null);
  const [wantCard, setWantCard] = useState<boolean | null>(
    cardChoice === 'yes' ? true : cardChoice === 'no' ? false : null
  );
  const [cardError, setCardError] = useState(false);
  const [activeCardUntil, setActiveCardUntil] = useState<string | null>(null);
  const [newAccount, setNewAccount] = useState(false);
  const [purchaseInfo, setPurchaseInfo] = useState<{
    hasCard: boolean;
    validUntil: string;
  } | null>(null);
  const firstField = useRef<HTMLInputElement | null>(null);
  const closeRef = useRef(onClose);
  closeRef.current = onClose;

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<IBookingInputs>();

  const { ref: nameRef, ...nameProps } = register('name', { required: true });
  const bloodValue = watch('bloodGroup');

  // "Same as me": copy the booking person's name / phone to the patient
  const copyUserToPatient = () => {
    setValue('patientName', (getValues('name') || '').trim(), {
      shouldValidate: true,
    });
    setValue('patientPhone', (getValues('phone') || '').trim(), {
      shouldValidate: true,
    });
  };

  const cartTotals = getCartTotals(items);
  const { packagesPrice, packagesRate } = cartTotals;
  const isCustom = items.some((pkg) => pkg.id === CUSTOM_PACKAGE_ID);
  // Health Card Yes / No question: Customize Package only
  const needsCardChoice = isCustom && !activeCardUntil && cardChoice !== 'member';
  const CARD_FEE = getCardFeeAmount() || 150;
  // existing packages: always discount rate + normal card fee (as before)
  // custom package: card Yes (or active card) = discount rate, card No = regular rate
  const hasDiscount = !isCustom || !needsCardChoice || wantCard === true;
  const cardFee = isCustom
    ? needsCardChoice && wantCard
      ? CARD_FEE
      : 0
    : cartTotals.cardFee;
  const total = (hasDiscount ? packagesPrice : packagesRate) + cardFee;
  const saved = hasDiscount ? packagesRate - packagesPrice : 0;
  const unitPrice = (pkg: IHealthPackage) => {
    const core = getPackageCore(pkg);
    return hasDiscount ? core.price : core.rate;
  };

  // popup mode only: close on Esc, lock page scroll, focus the first field
  useEffect(() => {
    if (asPage) return undefined;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeRef.current();
    };
    document.addEventListener('keydown', onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const timer = window.setTimeout(() => firstField.current?.focus(), 300);

    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = previous;
      window.clearTimeout(timer);
    };
  }, [asPage]);

  // logged-in user: auto fill Your Name / Phone / Email
  useEffect(() => {
    if (!user) return;
    setValue('name', user.name);
    setValue('phone', user.phone);
    setValue('email', user.email);
  }, [user, setValue]);

  // logged-in user: is the 6 month Health Card still active?
  useEffect(() => {
    if (!user) {
      setActiveCardUntil(null);
      return undefined;
    }
    let live = true;
    getPurchases(user.id).then((list) => {
      if (live) setActiveCardUntil(getActiveCard(list));
    });
    return () => {
      live = false;
    };
  }, [user]);

  const scrollToCenter = () =>
    document
      .getElementById('hpCenter')
      ?.scrollIntoView({ block: 'center', behavior: 'smooth' });

  // other fields are invalid -> still tell the user if the center is missing
  const onInvalid = () => {
    if (!center) setCenterError(true);
    if (needsCardChoice && wantCard === null) setCardError(true);
  };

  const onSubmit = async (data: IBookingInputs) => {
    // account phone: own phone, or the patient phone when it is left blank
    const userPhone = (data.phone || '').trim() || data.patientPhone.trim();
    setApiError(false);

    if (!center) {
      setCenterError(true);
      scrollToCenter();
      return;
    }

    if (needsCardChoice && wantCard === null) {
      setCardError(true);
      document
        .getElementById('hpCard')
        ?.scrollIntoView({ block: 'center', behavior: 'smooth' });
      return;
    }

    // invoice number (also sent to the admin so both sides can match it)
    const now = new Date();
    const stamp = `${String(now.getFullYear()).slice(2)}${String(
      now.getMonth() + 1
    ).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`;
    const number = `GK-HP-${stamp}-${Math.floor(1000 + Math.random() * 9000)}`;
    // card = 6 months, no card = package 1 month (from purchase date)
    const hasCard = isCustom ? (needsCardChoice ? !!wantCard : true) : cardFee > 0;
    const validUntil =
      isCustom && activeCardUntil
        ? new Date(activeCardUntil)
        : addMonths(now, hasCard ? CARD_VALIDITY_MONTHS : 1);
    const dateFormat: Intl.DateTimeFormatOptions = {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    };

    const lines = items.map(
      (pkg, i) => `${i + 1}. ${pkg.name} - ${formatBDT(unitPrice(pkg))}`
    );
    const message = [
      'Health package booking request',
      `Invoice No: ${number}`,
      '',
      `Booked By: ${data.name.trim()}`,
      `Booked By Phone: ${userPhone}`,
      `Booked By Email: ${data.email.trim()}`,
      `Patient Name: ${data.patientName.trim()}`,
      `Patient Phone: ${data.patientPhone.trim()}`,
      `Gender: ${data.gender}`,
      `Age: ${data.age.trim()}`,
      data.bloodGroup ? `Blood Group: ${data.bloodGroup}` : '',
      '',
      `Social Business Health Center: ${center.name}`,
      center.address ? `Address: ${center.address}` : '',
      center.contact_info ? `Contact: ${center.contact_info}` : '',
      '',
      ...lines,
      cardFee > 0
        ? `Health Card Registration (one-time, ${CARD_VALIDITY_MONTHS} months) - ${formatBDT(cardFee)}`
        : '',
      isCustom
        ? activeCardUntil
          ? `Health Card: existing, valid until ${fmtDate(validUntil)}`
          : cardChoice === 'member'
          ? 'Existing member: discount rate, no card fee (previous purchase to be verified)'
          : `Health Card: ${wantCard ? 'Yes' : 'No'} - ${
              wantCard ? 'card' : 'package'
            } valid until ${fmtDate(validUntil)}`
        : `${hasCard ? 'Health Card' : 'Package'} valid until ${fmtDate(validUntil)}`,
      user ? `Customer Account: ${user.phone}` : 'Customer: new (account auto created)',
      '',
      `Total: ${formatBDT(total)}`,
      data.note ? `\nNote: ${data.note}` : '',
    ]
      .filter((line, i, all) => line !== '' || all[i - 1] !== '')
      .join('\n');

    const formdata = new FormData();
    formdata.append('name', data.name);
    formdata.append(
      'subject',
      `Health Package Booking: ${items.map((pkg) => pkg.name).join(', ')}`
    );
    formdata.append('email', data.email);
    formdata.append('phone', userPhone);
    formdata.append('date', data.date || '');
    formdata.append('message', message);

    try {
      const response = await fetch(
        'https://admin.grameenkalyan.com/api/save-contact-form',
        { method: 'POST', body: formdata }
      );
      if (!response.ok) throw new Error('Request fail');

      setInvoice({
        number,
        issuedAt: now.toLocaleDateString('en-GB', dateFormat),
        customer: {
          name: data.name.trim(),
          patientName: data.patientName.trim(),
          gender: data.gender,
          age: data.age.trim(),
          bloodGroup: data.bloodGroup,
          phone: userPhone,
          email: data.email.trim(),
          preferredDate: data.date
            ? new Date(`${data.date}T00:00:00`).toLocaleDateString(
                'en-GB',
                dateFormat
              )
            : '',
          note: data.note.trim(),
        },
        center: {
          name: center.name,
          address: center.address || '',
          contact: center.contact_info || '',
        },
        items: items.map((pkg) => {
          const core = getPackageCore(pkg);
          return {
            name: pkg.name,
            testCount: core.testCount,
            rate: core.rate,
            price: hasDiscount ? core.price : core.rate,
            tests: core.tests.map((test) => test.name),
          };
        }),
        cardFee,
        totalRate: packagesRate + cardFee,
        total,
        saved,
      });
      // save the purchase for the dashboard (new customer -> account auto created)
      const purchase: IPurchase = {
        id: number,
        invoiceNo: number,
        date: now.toISOString(),
        items: items.map((pkg) => ({
          name: pkg.name,
          price: unitPrice(pkg),
          ...(isCustom
            ? { tests: getPackageCore(pkg).tests.map((test) => test.name) }
            : {}),
        })),
        cardFee,
        total,
        hasCard,
        validUntil: validUntil.toISOString(),
        center: center.name,
        patientName: data.patientName.trim(),
        patient: {
          name: data.patientName.trim(),
          gender: data.gender,
          age: data.age.trim(),
          bloodGroup: data.bloodGroup || '',
          phone: data.patientPhone.trim(),
          email: (data.email || '').trim(),
          preferredDate: data.date || '',
          note: (data.note || '').trim(),
        },
      };
      const rec = await recordPurchase(
        purchase,
        {
          name: data.name.trim(),
          phone: userPhone,
          email: (data.email || '').trim(),
          password: (data.password || '').trim(),
        },
        user
      );
      if (rec.ok && rec.data.isNewAccount) setNewAccount(true);
      setPurchaseInfo({ hasCard, validUntil: validUntil.toISOString() });
      setDone(true);
      onSuccess(items.map((pkg) => pkg.id));
    } catch (error) {
      setApiError(true);
    }
  };

  const handleDownload = async () => {
    if (!invoice || downloading) return;
    setDownloading(true);
    setDownloadError(false);
    try {
      const { downloadInvoicePdf } = await import('./invoicePdf');
      await downloadInvoicePdf(invoice);
    } catch (error) {
      setDownloadError(true);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <motion.div
      className={asPage ? style.pageRoot : style.modalOverlay}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      onClick={asPage ? undefined : onClose}
    >
      <motion.div
        className={
          asPage
            ? `${style.pageSheet} ${!done ? style.pageSheetWide : ''}`
            : style.modalSheet
        }
        role="dialog"
        aria-modal="true"
        aria-labelledby="hp-modal-title"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 40 }}
        transition={{ duration: 0.3 }}
        onClick={(e) => e.stopPropagation()}
      >
        {asPage ? (
          <button type="button" className={style.pageBack} onClick={onClose}>
            <FaArrowLeft aria-hidden="true" />
            Back to packages
          </button>
        ) : (
          <button
            type="button"
            className={style.modalClose}
            onClick={onClose}
            aria-label="Close"
          >
            <FaTimes />
          </button>
        )}

        {done && invoice ? (
          <div className={style.success}>
            <span className={style.successIcon}>
              <FaCheck />
            </span>
            <h3>Booking Request Sent</h3>
            <p>
              Thank you! Our team will contact you shortly to confirm your
              health package. Your invoice is ready to download.
            </p>

            <div className={style.invoiceCard}>
              <div className={style.invoiceTop}>
                <strong>INVOICE</strong>
                <span>{invoice.number}</span>
              </div>
              <div className={style.invoiceBody}>
                <div className={style.invoiceRow}>
                  <span>Date</span>
                  <b>{invoice.issuedAt}</b>
                </div>
                <div className={style.invoiceRow}>
                  <span>Booked By</span>
                  <b>{invoice.customer.name}</b>
                </div>
                <div className={style.invoiceRow}>
                  <span>Patient Name</span>
                  <b>{invoice.customer.patientName}</b>
                </div>
                <div className={style.invoiceRow}>
                  <span>Gender / Age / Blood</span>
                  <b>
                    {invoice.customer.gender} · {invoice.customer.age} yrs
                    {invoice.customer.bloodGroup
                      ? ` · ${invoice.customer.bloodGroup}`
                      : ''}
                  </b>
                </div>
                <div className={style.invoiceRow}>
                  <span>Social Business Health Center</span>
                  <b>{invoice.center.name}</b>
                </div>
                <div className={style.invoicePackages}>
                  <span>
                    {invoice.items.length === 1
                      ? 'Package'
                      : `Packages (${invoice.items.length})`}
                  </span>
                  <ul>
                    {invoice.items.map((item) => (
                      <li key={item.name}>
                        <b>{item.name}</b>
                        <em>{formatBDT(item.price)}</em>
                      </li>
                    ))}
                    {invoice.cardFee > 0 && (
                      <li>
                        <b>Health Card Registration (one-time)</b>
                        <em>{formatBDT(invoice.cardFee)}</em>
                      </li>
                    )}
                  </ul>
                </div>
                <div className={`${style.invoiceRow} ${style.invoiceTotal}`}>
                  <span>Total Amount</span>
                  <b>{formatBDT(invoice.total)}</b>
                </div>
              </div>
            </div>


            {purchaseInfo && (
              <div className={style.validityBox}>
                <FaIdCard aria-hidden="true" />
                <span>
                  {purchaseInfo.hasCard
                    ? `Your Health Card is valid for ${CARD_VALIDITY_MONTHS} months, until ${fmtDate(purchaseInfo.validUntil)}.`
                    : `Your package is valid for 1 month, until ${fmtDate(purchaseInfo.validUntil)}.`}
                </span>
              </div>
            )}

            {newAccount && (
              <div className={style.accountBox}>
                <FaCheckCircle aria-hidden="true" />
                <span>
                  We created your account using your email. To open your user
                  panel, go to{' '}
                  <Link href="/forgot-password">Forgot Password</Link>, enter
                  your email, verify the OTP sent to it and login.
                </span>
              </div>
            )}

            {downloadError && (
              <p className={style.apiError} role="alert">
                Could not create the PDF. Please try again.
              </p>
            )}

            <div className={style.successActions}>
              <button
                type="button"
                className={`${style.btn} ${style.btnPrimary}`}
                onClick={handleDownload}
                disabled={downloading}
              >
                <FaFilePdf />
                {downloading ? 'Preparing PDF...' : 'Download Invoice (PDF)'}
              </button>
              {user ? (
                <Link href="/dashboard" className={`${style.btn} ${style.btnGhost}`}>
                  My Dashboard
                </Link>
              ) : (
                <Link
                  href="/forgot-password"
                  className={`${style.btn} ${style.btnGhost}`}
                >
                  Login to see my purchases
                </Link>
              )}
            </div>
          </div>
        ) : (
          <div className={style.confirmGrid}>
            <div className={style.confirmLeft}>
            <div className={style.modalHead}>
              <span className={style.eyebrow}>Book Your Grameen Kalyan Checkup</span>
              <h3 id="hp-modal-title">Confirm Your Package</h3>
            </div>

            <div className={style.includeList}>
              {items.map((pkg) => {
                const core = getPackageCore(pkg);
                const isOpen = openPkg === pkg.id;
                return (
                  <section
                    key={pkg.id}
                    className={`${style.includeItem} ${
                      isOpen ? style.includeOpen : ''
                    }`}
                  >
                    <button
                      type="button"
                      className={style.includeHead}
                      aria-expanded={isOpen}
                      aria-controls={`hp-tests-${pkg.id}`}
                      onClick={() => setOpenPkg(isOpen ? null : pkg.id)}
                    >
                      <span className={style.includeName}>
                        <b>{pkg.name}</b>
                        <small>
                          {core.testCount} tests included ·{' '}
                          {isOpen ? 'Hide' : 'View'} list
                        </small>
                      </span>
                      <em>{formatBDT(unitPrice(pkg))}</em>
                      <FaChevronDown
                        className={style.includeChevron}
                        aria-hidden="true"
                      />
                    </button>
                    <div
                      id={`hp-tests-${pkg.id}`}
                      className={style.includeBody}
                      aria-hidden={!isOpen}
                    >
                      <div className={style.includeInner}>
                        <ul className={style.includeTests}>
                          {core.tests.map((test) => (
                            <li key={test.name}>
                              <FaCheck aria-hidden="true" />
                              <span>{test.name}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </section>
                );
              })}
            </div>

            <ul className={style.summary}>
              {items.map((pkg) => (
                <li key={pkg.id}>
                  <span>{pkg.name}</span>
                  <b>{formatBDT(unitPrice(pkg))}</b>
                </li>
              ))}
              {cardFee > 0 && (
                <li className={style.summaryFee}>
                  <span>
                    Health Card Registration
                    <em>
                      One-time fee · valid {CARD_VALIDITY_MONTHS} months
                    </em>
                  </span>
                  <b>{formatBDT(cardFee)}</b>
                </li>
              )}
              <li className={style.summaryTotal}>
                <span>
                  Total
                  {saved > 0 && <em>You save {formatBDT(saved)}</em>}
                </span>
                <b>{formatBDT(total)}</b>
              </li>
            </ul>

            {cardFee > 0 && items.length > 1 && (
              <p className={`${style.cardNote} ${style.summaryNote}`}>
                <FaCheck aria-hidden="true" />
                <span>
                  Card fee is charged only once for all {items.length} packages.
                </span>
              </p>
            )}


            {isCustom && (needsCardChoice ? (
              <div
                id="hpCard"
                className={`${style.cardChoice} ${cardError ? style.cardChoiceError : ''}`}
                role="group"
                aria-labelledby="hpCardTitle"
              >
                <div className={style.cardChoiceHead}>
                  <span className={style.cardChoiceIcon} aria-hidden="true">
                    <FaIdCard />
                  </span>
                  <div>
                    <strong id="hpCardTitle">Do you want a Health Card?</strong>
                    <p>
                      Take the card ({formatBDT(CARD_FEE)}, {CARD_VALIDITY_MONTHS}{' '}
                      months) to get the discount rate. Without it, regular rate
                      applies.
                    </p>
                  </div>
                </div>
                <div className={style.yesNo}>
                  <button
                    type="button"
                    aria-pressed={wantCard === true}
                    onClick={() => {
                      setWantCard(true);
                      setCardError(false);
                    }}
                  >
                    <b>Yes, I want the card</b>
                    <small>
                      Discount rate · {formatBDT(CARD_FEE)} · {CARD_VALIDITY_MONTHS} months
                    </small>
                  </button>
                  <button
                    type="button"
                    aria-pressed={wantCard === false}
                    onClick={() => {
                      setWantCard(false);
                      setCardError(false);
                    }}
                  >
                    <b>No, thanks</b>
                    <small>Regular rate · no card fee · valid 1 month</small>
                  </button>
                </div>
                {cardError && (
                  <small className={style.cardChoiceMsg} role="alert">
                    Please choose Yes or No to continue
                  </small>
                )}
              </div>
            ) : (
              <p className={`${style.cardNote} ${style.summaryNote}`}>
                <FaCheckCircle aria-hidden="true" />
                <span>
                  {activeCardUntil
                    ? `Your Health Card is active until ${fmtDate(activeCardUntil)}. No card fee.`
                    : 'Existing member discount rate. No card fee. Our team will verify your previous purchase.'}
                </span>
              </p>
            ))}
            </div>

            <div className={style.confirmRight}>
            {user ? (
              <div className={style.loggedBox}>
                <span className={style.loggedAvatar} aria-hidden="true">
                  <FaUserCheck />
                </span>
                <div>
                  <strong>{user.name}</strong>
                  <small>Logged in · your details are filled in</small>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    logout();
                    setValue('name', '');
                    setValue('phone', '');
                    setValue('email', '');
                  }}
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className={style.loginBox}>
                <div className={style.loginHead}>
                  <div>
                    <strong>Already have an account?</strong>
                    <small>Login to auto-fill your saved details</small>
                  </div>
                  <button
                    type="button"
                    className={style.loginToggle}
                    aria-expanded={showLogin}
                    onClick={() => setShowLogin((v) => !v)}
                  >
                    <FaSignInAlt aria-hidden="true" />
                    {showLogin ? 'Close' : 'Login'}
                  </button>
                </div>
                {showLogin && (
                  <div className={style.loginBody}>
                    <LoginForm onSuccess={() => setShowLogin(false)} />
                  </div>
                )}
              </div>
            )}

            <form
              className={style.form}
              onSubmit={handleSubmit(onSubmit, onInvalid)}
              noValidate
            >
              <HealthCenterField
                value={center}
                error={centerError}
                onChange={(next) => {
                  setCenter(next);
                  if (next) setCenterError(false);
                }}
              />


              <div className={style.formSection}>
                <span className={style.formSectionIcon} aria-hidden="true">
                  <FaUserCircle />
                </span>
                <div>
                  <h4>Your Account</h4>
                  <p>The person who is booking this package</p>
                </div>
              </div>

              <div className={style.fieldRow}>
                <div className={style.field}>
                  <label htmlFor="hpName">
                    Your Name <span className={style.req} aria-hidden="true">*</span>
                  </label>
                  <input
                    id="hpName"
                    type="text"
                    autoComplete="name"
                    placeholder="Enter your full name"
                    aria-invalid={!!errors.name}
                    {...nameProps}
                    ref={(el) => {
                      nameRef(el);
                      firstField.current = el;
                    }}
                  />
                  {errors.name && <small>Your name is required</small>}
                </div>

                <div className={style.field}>
                  <label htmlFor="hpUserPhone">
                    Your Phone <span className={style.optional}>(optional)</span>
                  </label>
                  <input
                    id="hpUserPhone"
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    placeholder="01XXXXXXXXX"
                    aria-invalid={!!errors.phone}
                    {...register('phone', {
                      validate: (v) =>
                        !v ||
                        PHONE_REGEX.test(v.trim()) ||
                        'Enter a valid Bangladeshi mobile number',
                    })}
                  />
                  {errors.phone && <small>{errors.phone.message}</small>}
                </div>
              </div>

              <div className={user ? undefined : style.fieldRow}>
                <div className={style.field}>
                  <label htmlFor="hpEmail">
                    Email <span className={style.req} aria-hidden="true">*</span>
                  </label>
                  <input
                    id="hpEmail"
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    placeholder="name@example.com"
                    aria-invalid={!!errors.email}
                    {...register('email', {
                      required: 'Email is required to open your user panel',
                      pattern: {
                        value: EMAIL_REGEX,
                        message: 'Please provide a valid email address',
                      },
                    })}
                  />
                  {errors.email && <small>{errors.email.message}</small>}
                </div>

                {!user && (
                  <div className={style.field}>
                    <label htmlFor="hpPassword">
                      Password <span className={style.req} aria-hidden="true">*</span>
                    </label>
                    <div className={style.pwWrap}>
                      <input
                        id="hpPassword"
                        type={showPw ? 'text' : 'password'}
                        autoComplete="new-password"
                        placeholder="Min 6 characters"
                        aria-invalid={!!errors.password}
                        {...register('password', {
                          required: 'Password is required',
                          minLength: {
                            value: 6,
                            message: 'Use at least 6 characters',
                          },
                        })}
                      />
                      <button
                        type="button"
                        className={style.pwToggle}
                        onClick={() => setShowPw((v) => !v)}
                        aria-label={showPw ? 'Hide password' : 'Show password'}
                      >
                        {showPw ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>
                    {errors.password && <small>{errors.password.message}</small>}
                  </div>
                )}
              </div>

              {!user && (
                <p className={style.emailHint}>
                  <FaEnvelope aria-hidden="true" />
                  Your password creates your account so you can login and see
                  your user panel. If you forget it, we send an OTP to this
                  email (SMS is not available yet).
                </p>
              )}

              <div className={`${style.formSection} ${style.formSectionPatient}`}>
                <span className={style.formSectionIcon} aria-hidden="true">
                  <FaNotesMedical />
                </span>
                <div>
                  <h4>Patient Details</h4>
                  <p>The person who will take the tests</p>
                </div>
                <button
                  type="button"
                  className={style.sameBtn}
                  onClick={copyUserToPatient}
                >
                  Same as me
                </button>
              </div>

              <div className={style.fieldRow}>
                <div className={style.field}>
                  <label htmlFor="hpPatient">
                    Patient Name <span className={style.req} aria-hidden="true">*</span>
                  </label>
                  <input
                    id="hpPatient"
                    type="text"
                    autoComplete="off"
                    placeholder="Patient full name"
                    aria-invalid={!!errors.patientName}
                    {...register('patientName', {
                      required: 'Patient name is required',
                    })}
                  />
                  {errors.patientName && (
                    <small>{errors.patientName.message}</small>
                  )}
                </div>

                <div className={style.field}>
                  <label htmlFor="hpPhone">
                    Patient Phone <span className={style.req} aria-hidden="true">*</span>
                  </label>
                  <input
                    id="hpPhone"
                    type="tel"
                    inputMode="tel"
                    autoComplete="off"
                    placeholder="01XXXXXXXXX"
                    aria-invalid={!!errors.patientPhone}
                    {...register('patientPhone', {
                      required: 'Patient phone is required',
                      pattern: {
                        value: PHONE_REGEX,
                        message: 'Enter a valid Bangladeshi mobile number',
                      },
                    })}
                  />
                  {errors.patientPhone && (
                    <small>{errors.patientPhone.message}</small>
                  )}
                </div>
              </div>

              <div className={style.fieldRow}>
                <div className={style.field}>
                  <label htmlFor="hpGender">
                    Patient Gender <span className={style.req} aria-hidden="true">*</span>
                  </label>
                  <select
                    id="hpGender"
                    defaultValue=""
                    aria-invalid={!!errors.gender}
                    {...register('gender', {
                      required: 'Select gender',
                    })}
                  >
                    <option value="" disabled>
                      Select
                    </option>
                    {GENDERS.map((g) => (
                      <option key={g} value={g}>
                        {g}
                      </option>
                    ))}
                  </select>
                  {errors.gender && <small>{errors.gender.message}</small>}
                </div>

                <div className={style.field}>
                  <label htmlFor="hpAge">
                    Patient Age <span className={style.req} aria-hidden="true">*</span>
                  </label>
                  <input
                    id="hpAge"
                    type="number"
                    inputMode="numeric"
                    min={0}
                    max={120}
                    placeholder="e.g. 32"
                    aria-invalid={!!errors.age}
                    {...register('age', {
                      required: 'Age is required',
                      validate: (v) =>
                        (Number(v) >= 0 && Number(v) <= 120) ||
                        'Enter a valid age (0-120)',
                    })}
                  />
                  {errors.age && <small>{errors.age.message}</small>}
                </div>
              </div>

              <div className={style.fieldRow}>
                <div className={style.field}>
                  <label htmlFor="hpBlood">
                    Patient Blood Group <span className={style.optional}>(optional)</span>
                  </label>
                  <select
                    id="hpBlood"
                    className={bloodValue ? '' : style.selectEmpty}
                    defaultValue=""
                    aria-invalid={!!errors.bloodGroup}
                    {...register('bloodGroup')}
                  >
                    <option value="">Select</option>
                    {BLOOD_GROUPS.map((group) => (
                      <option key={group} value={group}>
                        {group}
                      </option>
                    ))}
                  </select>
                </div>

                <div className={style.field}>
                  <label htmlFor="hpDate">
                    Preferred Date <span className={style.optional}>(optional)</span>
                  </label>
                  <input
                    id="hpDate"
                    type="date"
                    min={new Date().toISOString().split('T')[0]}
                    {...register('date')}
                  />
                </div>
              </div>

              <div className={style.field}>
                <label htmlFor="hpNote">Note (optional)</label>
                <textarea
                  id="hpNote"
                  rows={2}
                  maxLength={300}
                  placeholder="Anything we should know?"
                  {...register('note')}
                />
              </div>

              <p className={style.reqNote}>
                <span className={style.req} aria-hidden="true">*</span> Required
                fields
              </p>

              {apiError && (
                <p className={style.apiError} role="alert">
                  Something went wrong. Please check your connection and try
                  again.
                </p>
              )}

              <button
                type="submit"
                className={`${style.btn} ${style.btnPrimary} ${style.submit}`}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Sending...' : 'Send Booking Request'}
              </button>

              <p className={style.callLine}>
                <FaPhoneAlt aria-hidden="true" />
                Prefer a call?
                <a href={`tel:${setting.contact_number_two}`}>
                  {setting.contact_number_two}
                </a>
              </p>
            </form>
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default BookingModal;
// ================== END: BookingModal.tsx ==================