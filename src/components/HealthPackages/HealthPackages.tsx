// ================= START: HealthPackages.tsx =================
'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion, MotionConfig } from 'framer-motion';
import { IconType } from 'react-icons';
import {
  FaArrowRight,
  FaBaby,
  FaCheck,
  FaChild,
  FaFemale,
  FaHandHoldingHeart,
  FaHeartbeat,
  FaIdCard,
  FaPercent,
  FaShoppingCart,
  FaTint,
  FaUserClock,
  FaUserMd,
} from 'react-icons/fa';

import {
  HEALTH_PACKAGES,
  PACKAGE_FILTERS,
  IHealthPackage,
  PackageIconKey,
  formatBDT,
  getPackageTotals,
} from '@/data/healthPackages';
import {
  getHealthPackageCart,
  saveHealthPackageCart,
} from '@/shared/utils/healthPackageCart';

import BookingModal from './BookingModal';
import style from './healthPackages.module.scss';

const ICONS: Record<PackageIconKey, IconType> = {
  baby: FaBaby,
  female: FaFemale,
  drop: FaTint,
  heart: FaHeartbeat,
  child: FaChild,
  care: FaHandHoldingHeart,
  senior: FaUserClock,
};

const FEATURES = [
  { icon: FaIdCard, text: 'Healthcare Card for up to 6 family members' },
  { icon: FaUserMd, text: 'Doctor consultation with every package' },
  { icon: FaPercent, text: 'Special discounted diagnostic rates' },
];

/* ---------------------------- Package card ---------------------------- */
interface IPackageCardProps {
  pkg: IHealthPackage;
  index: number;
  inCart: boolean;
  onToggle: (id: string) => void;
  onBuy: (id: string) => void;
}

const PackageCard = ({
  pkg,
  index,
  inCart,
  onToggle,
  onBuy,
}: IPackageCardProps) => {
  const Icon = ICONS[pkg.icon];
  const { rate, price, save, percent, testCount } = getPackageTotals(pkg);

  return (
    <article className={style.card}>
      <motion.div
        className={style.cardInner}
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 0.5, delay: 0.08 * (index % 4) }}
      >
        {/* header image (16:5) */}
        <div className={style.cardMedia}>
          <Image
            className={style.cardImg}
            src={pkg.image}
            alt={pkg.name}
            fill
            sizes="(max-width: 700px) 100vw, (max-width: 1180px) 50vw, (max-width: 1599px) 33vw, 25vw"
            style={{ objectPosition: pkg.imagePosition || 'center' }}
          />
          {save > 0 && (
            <span className={style.ribbon}>
              Save {save.toLocaleString('en-US')}
            </span>
          )}
          <span className={style.testsChip}>
            {testCount} {testCount === 1 ? 'Test' : 'Tests'}
          </span>
        </div>

        {/* title */}
        <header className={style.cardHead}>
          <span className={style.iconWrap} aria-hidden="true">
            <Icon />
          </span>
          <div className={style.headText}>
            <h3>{pkg.name}</h3>
            <p>{pkg.tagline}</p>
          </div>
        </header>

        <ul className={style.perks}>
          {pkg.perks.map((perk) => (
            <li key={perk}>
              <FaCheck aria-hidden="true" />
              {perk}
            </li>
          ))}
        </ul>

        {/* tests */}
        <ul className={style.tests}>
          {pkg.tests.map((item) => (
            <li key={item.name}>
              <span>{item.name}</span>
              <span className={style.rate}>
                {item.rate > item.price && <s>{formatBDT(item.rate)}</s>}
                {item.price === 0 ? (
                  <em className={style.free}>FREE</em>
                ) : (
                  <b className={style.ratePrice}>{formatBDT(item.price)}</b>
                )}
              </span>
            </li>
          ))}
        </ul>

        {/* price + actions */}
        <footer className={style.cardFoot}>
          <div className={style.totalRow}>
            <span>Total Cost:</span>
            <s>{formatBDT(rate)}</s>
          </div>
          <div className={style.priceRow}>
            <span>Discounted Price:</span>
            <strong>{formatBDT(price)}</strong>
          </div>
          {save > 0 && (
            <span className={style.saveNote}>
              You save {formatBDT(save)} ({percent}%)
            </span>
          )}

          <div className={style.actions}>
            <button
              type="button"
              className={`${style.btn} ${style.btnGhost} ${
                inCart ? style.btnAdded : ''
              }`}
              aria-pressed={inCart}
              onClick={() => onToggle(pkg.id)}
            >
              {inCart ? <FaCheck /> : <FaShoppingCart />}
              {inCart ? 'Added' : 'Add to Cart'}
            </button>
            <button
              type="button"
              className={`${style.btn} ${style.btnPrimary}`}
              onClick={() => onBuy(pkg.id)}
            >
              <FaArrowRight />
              Buy Now
            </button>
          </div>
        </footer>
      </motion.div>
    </article>
  );
};

/* ------------------------------ Main section ------------------------------ */
const HealthPackages = () => {
  const [filter, setFilter] = useState<string>('all');
  const [cart, setCart] = useState<string[]>([]);
  const [cartReady, setCartReady] = useState(false);
  const [booking, setBooking] = useState<string[] | null>(null);

  // load the saved cart once
  useEffect(() => {
    try {
      const saved = getHealthPackageCart();
      setCart(saved.filter((id) => HEALTH_PACKAGES.some((pkg) => pkg.id === id)));
    } catch (e) {
      // storage blocked or corrupted - start with an empty cart
    }
    setCartReady(true);
  }, []);

  // keep the cart saved
  useEffect(() => {
    if (!cartReady) return;
    try {
      saveHealthPackageCart(cart);
    } catch (e) {
      // ignore storage errors
    }
  }, [cart, cartReady]);

  const visible = useMemo(
    () =>
      filter === 'all'
        ? HEALTH_PACKAGES
        : HEALTH_PACKAGES.filter((pkg) => pkg.category === filter),
    [filter]
  );

  const cartItems = useMemo(
    () =>
      cart
        .map((id) => HEALTH_PACKAGES.find((pkg) => pkg.id === id))
        .filter(Boolean) as IHealthPackage[],
    [cart]
  );

  const cartTotal = cartItems.reduce(
    (sum, pkg) => sum + getPackageTotals(pkg).price,
    0
  );

  const toggleCart = (id: string) =>
    setCart((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );

  const bookingItems = useMemo(
    () =>
      (booking || [])
        .map((id) => HEALTH_PACKAGES.find((pkg) => pkg.id === id))
        .filter(Boolean) as IHealthPackage[],
    [booking]
  );

  return (
    <MotionConfig reducedMotion="user">
      <section
        className={`${style.healthPackages} ${
          cartItems.length ? style.hasCart : ''
        }`}
      >
        <div className={style.decor} aria-hidden="true">
          <span className={style.glowLeft} />
          <span className={style.dotsRight} />
        </div>

        <div className={style.container}>
          {/* ---------- Title ---------- */}
          <motion.div
            className={style.titleWrap}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <span className={style.eyebrow}>Affordable Checkups for your loved ones</span>
            <h2 className={style.title}>
              Our Healthcare <span>Packages</span>
            </h2>
            <span className={style.titleBar} />
            <p className={style.lead}>
              Choose a package made for you and your family. Quality diagnostic
              tests and doctor consultation at special discounted prices.
            </p>
          </motion.div>

          {/* ---------- Highlights ---------- */}
          <ul className={style.features}>
            {FEATURES.map(({ icon: Icon, text }) => (
              <li key={text}>
                <span aria-hidden="true">
                  <Icon />
                </span>
                {text}
              </li>
            ))}
          </ul>

          {/* ---------- Filters ---------- */}
          <div className={style.filters} role="tablist" aria-label="Packages">
            {PACKAGE_FILTERS.map((item) => {
              const count =
                item.key === 'all'
                  ? HEALTH_PACKAGES.length
                  : HEALTH_PACKAGES.filter((p) => p.category === item.key)
                      .length;
              return (
                <button
                  key={item.key}
                  type="button"
                  role="tab"
                  aria-selected={filter === item.key}
                  className={`${style.chip} ${
                    filter === item.key ? style.chipActive : ''
                  }`}
                  onClick={() => setFilter(item.key)}
                >
                  {item.label}
                  <span>{count}</span>
                </button>
              );
            })}
          </div>

          {/* ---------- Cards ---------- */}
          <div className={style.cards}>
            {visible.map((pkg, index) => (
              <PackageCard
                key={pkg.id}
                pkg={pkg}
                index={index}
                inCart={cart.includes(pkg.id)}
                onToggle={toggleCart}
                onBuy={(id) => setBooking([id])}
              />
            ))}
          </div>

          <p className={style.note}>
            All prices are in Bangladeshi Taka (BDT).
          </p>
        </div>

        {/* ---------- Floating cart bar ---------- */}
        <AnimatePresence>
          {cartItems.length > 0 && !booking && (
            <div className={style.cartWrap}>
              <motion.div
                className={style.cartBar}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 40 }}
                transition={{ duration: 0.3 }}
              >
                <span className={style.cartIcon} aria-hidden="true">
                  <FaShoppingCart />
                  <b>{cartItems.length}</b>
                </span>
                <div className={style.cartInfo}>
                  <strong>
                    {cartItems.length}{' '}
                    {cartItems.length === 1 ? 'package' : 'packages'} selected
                  </strong>
                  <span>Total: {formatBDT(cartTotal)}</span>
                </div>
                <button
                  type="button"
                  className={style.cartClear}
                  onClick={() => setCart([])}
                >
                  Clear
                </button>
                <button
                  type="button"
                  className={`${style.btn} ${style.btnPrimary} ${style.cartBook}`}
                  onClick={() => setBooking(cart)}
                >
                  Book Now
                  <FaArrowRight />
                </button>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* ---------- Booking modal ---------- */}
        <AnimatePresence>
          {booking && bookingItems.length > 0 && (
            <BookingModal
              key="booking"
              items={bookingItems}
              onClose={() => setBooking(null)}
              onSuccess={(ids) =>
                setCart((prev) => prev.filter((id) => !ids.includes(id)))
              }
            />
          )}
        </AnimatePresence>
      </section>
    </MotionConfig>
  );
};

export default HealthPackages;
// ================== END: HealthPackages.tsx ==================