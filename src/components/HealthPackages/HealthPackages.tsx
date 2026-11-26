// ================= START: HealthPackages.tsx =================
'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
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
  FaPhoneAlt,
  FaRedo,
  FaShoppingBag,
  FaShoppingCart,
  FaSlidersH,
  FaTint,
  FaUserClock,
  FaUserMd,
} from 'react-icons/fa';

import {
  IHealthPackage,
  IPackageFilter,
  PackageIconKey,
  formatBDT,
} from '@/data/healthPackages';
import { getHealthPackagesData } from '@/shared/utils/healthPackagesApi';
import { useHealthPackages } from '@/shared/context/HealthPackagesContext';
import {
  getHealthPackageCart,
  saveHealthPackageCart,
} from '@/shared/utils/healthPackageCart';
import {
  CARD_VALIDITY_MONTHS,
  getCardFee,
  getCardFeeAmount,
  getCartTotals,
  getPackageCore,
} from '@/shared/utils/healthPackagePricing';

import { useCharges } from '@/shared/hook/useCharges';
import { useCheckout } from '@/components/Auth/useCheckout';
import CustomPackage from './CustomPackage';
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
  const { tests, doctor, rate, price, save, percent, testCount } =
    getPackageCore(pkg);
  const cardFee = getCardFee(pkg);

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
          {pkg.image && (
            <Image
              className={style.cardImg}
              src={pkg.image}
              alt={pkg.name}
              fill
              sizes="(max-width: 700px) 100vw, (max-width: 1180px) 50vw, (max-width: 1599px) 33vw, 25vw"
              style={{ objectPosition: pkg.imagePosition || 'center' }}
            />
          )}
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

        {/* <ul className={style.perks}>
          {pkg.perks.map((perk) => (
            <li key={perk}>
              <FaCheck aria-hidden="true" />
              {perk}
            </li>
          ))}
        </ul> */}

        {/* tests */}
        <ul className={style.tests}>
          {tests.map((item) => (
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

        {/* Doctor Consultation Charge (outside the test list) */}
        {doctor && (
          <div className={style.doctorRow}>
            <span className={style.doctorLabel}>
              <FaUserMd aria-hidden="true" />
              Doctor Consultation Charge
            </span>
            <span className={style.rate}>
              {doctor.rate > doctor.price && <s>{formatBDT(doctor.rate)}</s>}
              {doctor.price === 0 ? (
                <em className={style.free}>FREE</em>
              ) : (
                <b className={style.ratePrice}>{formatBDT(doctor.price)}</b>
              )}
            </span>
          </div>
        )}

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

          {cardFee && (
            <p className={style.cardNote}>
              <FaIdCard aria-hidden="true" />
              <span>
                + {formatBDT(cardFee.price)} one-time Health Card fee, paid only
                once for all your packages ({CARD_VALIDITY_MONTHS} months)
              </span>
            </p>
          )}

          <div className={style.actions}>
            <button
              type="button"
              className={`${style.btn} ${style.btnPrimary} ${style.btnBuy}`}
              onClick={() => onBuy(pkg.id)}
            >
              Buy Now
              <FaArrowRight aria-hidden="true" />
            </button>
            <button
              type="button"
              className={`${style.btn} ${style.btnGhost} ${style.btnIcon} ${
                inCart ? style.btnAdded : ''
              }`}
              aria-pressed={inCart}
              aria-label={inCart ? 'Remove from cart' : 'Add to cart'}
              title={inCart ? 'Added to cart' : 'Add to cart'}
              onClick={() => onToggle(pkg.id)}
            >
              {inCart ? <FaCheck aria-hidden="true" /> : <FaShoppingCart aria-hidden="true" />}
            </button>
          </div>
        </footer>
      </motion.div>
    </article>
  );
};

/* ------------------------------ Main section ------------------------------ */
const HealthPackages = () => {
  const { cardFee: CARD_FEE } = useCharges();
  const { packages: serverPackages, filters: serverFilters } =
    useHealthPackages();
  const [packages, setPackages] = useState<IHealthPackage[]>(serverPackages);
  const [filters, setFilters] = useState<IPackageFilter[]>(serverFilters);
  const [loadState, setLoadState] = useState<
    'ready' | 'loading' | 'error' | 'empty'
  >(serverPackages.length ? 'ready' : 'loading');

  const loadPackages = useCallback(async () => {
    setLoadState('loading');
    const data = await getHealthPackagesData();
    if (data.packages.length) {
      setPackages(data.packages);
      setFilters(data.filters);
      setLoadState('ready');
    } else {
      setLoadState(data.failed ? 'error' : 'empty');
    }
  }, []);

  // server list was empty (API blocked/slow on the server) -> load in the browser
  useEffect(() => {
    if (!serverPackages.length) loadPackages();
  }, [serverPackages.length, loadPackages]);
  const [filter, setFilter] = useState<string>('all');
  const [cart, setCart] = useState<string[]>([]);
  const [cartReady, setCartReady] = useState(false);
  const [customizing, setCustomizing] = useState(false);
  const { startCheckout, checkoutGate, gateOpen } = useCheckout();

  // load the saved cart once the package list is available
  useEffect(() => {
    if (!packages.length) return; // list not loaded yet - keep the saved cart
    try {
      const saved = getHealthPackageCart();
      setCart(saved.filter((id) => packages.some((pkg) => pkg.id === id)));
    } catch (e) {
      // storage blocked or corrupted - start with an empty cart
    }
    setCartReady(true);
  }, [packages]);

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
        ? packages
        : packages.filter((pkg) => pkg.category === filter),
    [filter, packages]
  );

  const cartItems = useMemo(
    () =>
      cart
        .map((id) => packages.find((pkg) => pkg.id === id))
        .filter(Boolean) as IHealthPackage[],
    [cart, packages]
  );

  const cartTotals = useMemo(() => getCartTotals(cartItems), [cartItems]);

  const toggleCart = (id: string) =>
    setCart((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
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

          {/* ---------- Card fee notice + Customize package (50 / 50 on desktop) ---------- */}
          <div className={style.promoRow}>
          <div className={style.cardFeeNotice} role="note">
            <span className={style.cardFeeIcon} aria-hidden="true">
              <FaIdCard />
            </span>
            <div>
              <strong>
                On time micro health insurance card: {formatBDT(CARD_FEE)}
              </strong>
              <p>
                Pay it <b>only once</b> and book as many packages as you need
                within {CARD_VALIDITY_MONTHS} months. Package prices below do
                not include the card fee, and it is added to your total just
                one time.
              </p>
            </div>
          </div>

          {/* ---------- Customize package ---------- */}
          <div className={style.customCta}>
            <div className={style.customCtaText}>
              <span className={style.customCtaIcon} aria-hidden="true">
                <FaSlidersH />
              </span>
              <div>
                <strong>Can’t find the right package?</strong>
                <p>Pick only the tests you need and build your own package.</p>
              </div>
            </div>
            <button
              type="button"
              className={`${style.btn} ${style.customCtaBtn}`}
              onClick={() => setCustomizing(true)}
            >
              <FaSlidersH aria-hidden="true" />
              Customize Package
            </button>
          </div>
          </div>

          {/* ---------- Filters ---------- */}
          {loadState === 'ready' && (
          <div className={style.filters} role="tablist" aria-label="Packages">
            {filters.map((item) => {
              const count =
                item.key === 'all'
                  ? packages.length
                  : packages.filter((p) => p.category === item.key).length;
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
          )}

          {/* ---------- Loading skeleton ---------- */}
          {loadState === 'loading' && (
            <div className={style.cards} aria-busy="true" aria-live="polite">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className={`${style.card} ${style.skeletonCard}`}>
                  <span className={style.skMedia} />
                  <span className={`${style.skLine} ${style.skTitle}`} />
                  <span className={style.skLine} />
                  <span className={style.skLine} />
                  <span className={style.skLine} />
                  <span className={`${style.skLine} ${style.skBtn}`} />
                </div>
              ))}
            </div>
          )}

          {/* ---------- Error / empty state ---------- */}
          {(loadState === 'error' || loadState === 'empty') && (
            <div className={style.stateBox} role="status">
              <span className={style.stateIcon} aria-hidden="true">
                {loadState === 'error' ? <FaRedo /> : <FaHandHoldingHeart />}
              </span>
              <h3>
                {loadState === 'error'
                  ? 'Could not load the packages'
                  : 'Packages are coming soon'}
              </h3>
              <p>
                {loadState === 'error'
                  ? 'Please check your internet connection and try again.'
                  : 'We are updating our health packages. Please check back shortly.'}
              </p>
              <div className={style.stateActions}>
                <button
                  type="button"
                  className={`${style.btn} ${style.btnPrimary}`}
                  onClick={loadPackages}
                >
                  <FaRedo aria-hidden="true" />
                  Try Again
                </button>
                <a
                  className={`${style.btn} ${style.btnGhost}`}
                  href="tel:+8801334944640"
                >
                  <FaPhoneAlt aria-hidden="true" />
                  Call Us
                </a>
              </div>
            </div>
          )}

          {/* ---------- Cards ---------- */}
          {loadState === 'ready' &&
            (visible.length ? (
              <div className={style.cards}>
                {visible.map((pkg, index) => (
                  <PackageCard
                    key={pkg.id}
                    pkg={pkg}
                    index={index}
                    inCart={cart.includes(pkg.id)}
                    onToggle={toggleCart}
                    onBuy={(id) => startCheckout({ ids: [id] })}
                  />
                ))}
              </div>
            ) : (
              <p className={style.note}>No packages in this category yet.</p>
            ))}

          <p className={style.note}>
            All prices are in Bangladeshi Taka (BDT).
          </p>
        </div>

        {/* ---------- Floating cart bar ---------- */}
        <AnimatePresence>
          {cartItems.length > 0 && !gateOpen && !customizing && (
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
                  <span>
                    Total: {formatBDT(cartTotals.total)}
                    {cartTotals.cardFee > 0 &&
                      ` (incl. ${formatBDT(cartTotals.cardFee)} card fee, once)`}
                  </span>
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
                  onClick={() => startCheckout({ ids: cart })}
                >
                  Book Now
                  <FaArrowRight />
                </button>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* ---------- Side cart (right edge, vertically centered) ---------- */}
        {!gateOpen && !customizing && (
          <Link
            href="/cart"
            className={`${style.sideCart} ${
              cartItems.length ? style.sideCartActive : ''
            }`}
            aria-label={`Open cart, ${cartItems.length} ${
              cartItems.length === 1 ? 'package' : 'packages'
            }, total ${formatBDT(cartTotals.total)}`}
          >
            <span className={style.sideCartTop}>
              <FaShoppingBag aria-hidden="true" />
              <small key={cartItems.length}>
                {cartItems.length} {cartItems.length === 1 ? 'Item' : 'Items'}
              </small>
            </span>
            <span className={style.sideCartTotal}>
              ৳{cartTotals.total.toLocaleString('en-US')}
            </span>
          </Link>
        )}

        {/* ---------- Existing user / new customer popup ---------- */}
        {checkoutGate}

        {/* ---------- Customize package modal ---------- */}
        <AnimatePresence>
          {customizing && (
            <CustomPackage
              key="custom"
              onClose={() => setCustomizing(false)}
              onBook={(pkg, cardChoice) => {
                setCustomizing(false);
                startCheckout({ ids: [], custom: pkg, cardChoice });
              }}
            />
          )}
        </AnimatePresence>

      </section>
    </MotionConfig>
  );
};

export default HealthPackages;
// ================== END: HealthPackages.tsx ==================