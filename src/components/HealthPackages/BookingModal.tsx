// ================= START: BookingModal.tsx =================
'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { FaCheck, FaFilePdf, FaPhoneAlt, FaTimes } from 'react-icons/fa';

import {
  IHealthPackage,
  formatBDT,
  getPackageTotals,
} from '@/data/healthPackages';
import { IHealthCenter } from '@/shared/types/healthCenter';

import HealthCenterField from './HealthCenterField';
import type { IInvoiceData } from './invoicePdf';
import style from './healthPackages.module.scss';

interface IBookingInputs {
  name: string;
  phone: string;
  email: string;
  date: string;
  note: string;
}

interface IBookingModalProps {
  items: IHealthPackage[];
  onClose: () => void;
  onSuccess: (ids: string[]) => void;
}

const PHONE_REGEX = /^(?:\+?88)?01[3-9]\d{8}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const BookingModal = ({ items, onClose, onSuccess }: IBookingModalProps) => {
  const [done, setDone] = useState(false);
  const [apiError, setApiError] = useState(false);
  const [center, setCenter] = useState<IHealthCenter | null>(null);
  const [centerError, setCenterError] = useState(false);
  const [invoice, setInvoice] = useState<IInvoiceData | null>(null);
  const [downloading, setDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState(false);
  const firstField = useRef<HTMLInputElement | null>(null);
  const closeRef = useRef(onClose);
  closeRef.current = onClose;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<IBookingInputs>();

  const { ref: nameRef, ...nameProps } = register('name', { required: true });

  const total = items.reduce((sum, pkg) => sum + getPackageTotals(pkg).price, 0);
  const saved = items.reduce((sum, pkg) => sum + getPackageTotals(pkg).save, 0);

  // close on Esc, lock page scroll, focus the first field
  useEffect(() => {
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
  }, []);

  const scrollToCenter = () =>
    document
      .getElementById('hpCenter')
      ?.scrollIntoView({ block: 'center', behavior: 'smooth' });

  // other fields are invalid -> still tell the user if the center is missing
  const onInvalid = () => {
    if (!center) setCenterError(true);
  };

  const onSubmit = async (data: IBookingInputs) => {
    setApiError(false);

    if (!center) {
      setCenterError(true);
      scrollToCenter();
      return;
    }

    // invoice number (also sent to the admin so both sides can match it)
    const now = new Date();
    const stamp = `${String(now.getFullYear()).slice(2)}${String(
      now.getMonth() + 1
    ).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`;
    const number = `GK-HP-${stamp}-${Math.floor(1000 + Math.random() * 9000)}`;
    const dateFormat: Intl.DateTimeFormatOptions = {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    };

    const lines = items.map(
      (pkg, i) =>
        `${i + 1}. ${pkg.name} - ${formatBDT(getPackageTotals(pkg).price)}`
    );
    const message = [
      'Health package booking request',
      `Invoice No: ${number}`,
      '',
      `Health Center: ${center.name}`,
      center.address ? `Address: ${center.address}` : '',
      center.contact_info ? `Contact: ${center.contact_info}` : '',
      '',
      ...lines,
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
    formdata.append('phone', data.phone);
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
          phone: data.phone.trim(),
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
          const totals = getPackageTotals(pkg);
          return {
            name: pkg.name,
            testCount: totals.testCount,
            rate: totals.rate,
            price: totals.price,
            tests: pkg.tests.map((test) => test.name),
          };
        }),
        totalRate: items.reduce(
          (sum, pkg) => sum + getPackageTotals(pkg).rate,
          0
        ),
        total,
        saved,
      });
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
      className={style.modalOverlay}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      onClick={onClose}
    >
      <motion.div
        className={style.modalSheet}
        role="dialog"
        aria-modal="true"
        aria-labelledby="hp-modal-title"
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
                  <span>Name</span>
                  <b>{invoice.customer.name}</b>
                </div>
                <div className={style.invoiceRow}>
                  <span>Health Center</span>
                  <b>{invoice.center.name}</b>
                </div>
                <div className={style.invoiceRow}>
                  <span>Packages</span>
                  <b>{invoice.items.length}</b>
                </div>
                <div className={`${style.invoiceRow} ${style.invoiceTotal}`}>
                  <span>Total Amount</span>
                  <b>{formatBDT(invoice.total)}</b>
                </div>
              </div>
            </div>

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
              <button
                type="button"
                className={`${style.btn} ${style.btnGhost}`}
                onClick={onClose}
              >
                Close
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className={style.modalHead}>
              <span className={style.eyebrow}>Book Your Checkup</span>
              <h3 id="hp-modal-title">Confirm Your Package</h3>
            </div>

            <ul className={style.summary}>
              {items.map((pkg) => (
                <li key={pkg.id}>
                  <span>{pkg.name}</span>
                  <b>{formatBDT(getPackageTotals(pkg).price)}</b>
                </li>
              ))}
              <li className={style.summaryTotal}>
                <span>
                  Total
                  {saved > 0 && <em>You save {formatBDT(saved)}</em>}
                </span>
                <b>{formatBDT(total)}</b>
              </li>
            </ul>

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

              <div className={style.field}>
                <label htmlFor="hpName">Your Name</label>
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
                {errors.name && <small>Name is required</small>}
              </div>

              <div className={style.fieldRow}>
                <div className={style.field}>
                  <label htmlFor="hpPhone">Phone</label>
                  <input
                    id="hpPhone"
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    placeholder="01XXXXXXXXX"
                    aria-invalid={!!errors.phone}
                    {...register('phone', {
                      required: 'Phone number is required',
                      pattern: {
                        value: PHONE_REGEX,
                        message: 'Enter a valid Bangladeshi mobile number',
                      },
                    })}
                  />
                  {errors.phone && <small>{errors.phone.message}</small>}
                </div>

                <div className={style.field}>
                  <label htmlFor="hpDate">Preferred Date (optional)</label>
                  <input
                    id="hpDate"
                    type="date"
                    min={new Date().toISOString().split('T')[0]}
                    {...register('date')}
                  />
                </div>
              </div>

              <div className={style.field}>
                <label htmlFor="hpEmail">Email</label>
                <input
                  id="hpEmail"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  placeholder="name@example.com"
                  aria-invalid={!!errors.email}
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: EMAIL_REGEX,
                      message: 'Please provide a valid email address',
                    },
                  })}
                />
                {errors.email && <small>{errors.email.message}</small>}
              </div>

              <div className={style.field}>
                <label htmlFor="hpNote">Note (optional)</label>
                <textarea
                  id="hpNote"
                  rows={2}
                  placeholder="Anything we should know?"
                  {...register('note')}
                />
              </div>

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
                <a href="tel:+880244802111">+880244802111</a>
              </p>
            </form>
          </>
        )}
      </motion.div>
    </motion.div>
  );
};

export default BookingModal;
// ================== END: BookingModal.tsx ==================