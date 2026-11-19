'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  FaArrowLeft,
  FaArrowRight,
  FaCheckCircle,
  FaClipboardCheck,
  FaIdCard,
  FaShoppingCart,
  FaTrashAlt,
} from 'react-icons/fa';

import {
  HEALTH_PACKAGES,
  IHealthPackage,
  formatBDT,
} from '@/data/healthPackages';
import {
  CARD_VALIDITY_MONTHS,
  getCartTotals,
  getPackageCore,
} from '@/shared/utils/healthPackagePricing';
import {
  HEALTH_PACKAGE_CART_EVENT,
  getHealthPackageCart,
  saveHealthPackageCart,
} from '@/shared/utils/healthPackageCart';

import BookingModal from './BookingModal';
import style from './healthPackageCart.module.scss';

const HealthPackageCart = () => {
  const [cartIds, setCartIds] = useState<string[]>([]);
  const [cartReady, setCartReady] = useState(false);
  const [storageError, setStorageError] = useState(false);
  const [booking, setBooking] = useState(false);

  useEffect(() => {
    const syncCart = () => {
      const saved = getHealthPackageCart();
      setCartIds(
        saved.filter((id) => HEALTH_PACKAGES.some((pkg) => pkg.id === id))
      );
    };

    syncCart();
    setCartReady(true);
    window.addEventListener(HEALTH_PACKAGE_CART_EVENT, syncCart);
    window.addEventListener('storage', syncCart);

    return () => {
      window.removeEventListener(HEALTH_PACKAGE_CART_EVENT, syncCart);
      window.removeEventListener('storage', syncCart);
    };
  }, []);

  const items = useMemo(
    () => cartIds
      .map((id) => HEALTH_PACKAGES.find((pkg) => pkg.id === id))
      .filter((pkg): pkg is IHealthPackage => pkg !== undefined),
    [cartIds]
  );
  const {
    packagesRate,
    cardFee,
    total,
    saved: savings,
  } = useMemo(() => getCartTotals(items), [items]);

  const updateCart = (nextIds: string[]) => {
    const validIds = nextIds
      .filter((id, index) => nextIds.indexOf(id) === index)
      .filter((id) => HEALTH_PACKAGES.some((pkg) => pkg.id === id));

    try {
      saveHealthPackageCart(validIds);
      setCartIds(validIds);
      setStorageError(false);
    } catch {
      setStorageError(true);
    }
  };

  const bookingItems = items;

  if (!cartReady) {
    return (
      <main className={style.page}>
        <div className={style.loading} role="status">
          Loading your cart…
        </div>
      </main>
    );
  }

  return (
    <main className={style.page}>
      <div className={style.container}>
        <Link href="/health-packages" className={style.backLink}>
          <FaArrowLeft aria-hidden="true" />
          Continue exploring packages
        </Link>

        <header className={style.heading}>
          <span className={style.headingIcon} aria-hidden="true">
            <FaShoppingCart />
          </span>
          <div>
            <p className={style.eyebrow}>Your health, thoughtfully planned</p>
            <h1>Your Cart</h1>
            <p className={style.headingDescription}>
              Review your selected healthcare packages before booking.
            </p>
          </div>
          <span className={style.itemCount}>
            {items.length} {items.length === 1 ? 'package' : 'packages'}
          </span>
        </header>

        {storageError && (
          <p className={style.errorMessage} role="alert">
            Your cart could not be saved in this browser. Please check your
            browser storage settings and try again.
          </p>
        )}

        {items.length === 0 ? (
          <section className={style.emptyState}>
            <span className={style.emptyIcon} aria-hidden="true">
              <FaShoppingCart />
            </span>
            <h2>Your cart is ready for a healthy start</h2>
            <p>
              You haven’t added a package yet. Explore our affordable checkups
              and choose the care that fits your family.
            </p>
            <Link href="/health-packages" className={style.primaryButton}>
              Browse healthcare packages
              <FaArrowRight aria-hidden="true" />
            </Link>
          </section>
        ) : (
          <div className={style.cartLayout}>
            <section className={style.itemsPanel} aria-label="Selected packages">
              <div className={style.panelHeading}>
                <div>
                  <h2>Selected packages</h2>
                  <p>Your package selection is saved on this device.</p>
                </div>
                <button
                  type="button"
                  className={style.clearButton}
                  onClick={() => updateCart([])}
                >
                  <FaTrashAlt aria-hidden="true" />
                  Clear cart
                </button>
              </div>

              <ul className={style.itemList}>
                {items.map((pkg) => {
                  const { price, testCount, save } = getPackageCore(pkg);
                  return (
                    <li className={style.packageCard} key={pkg.id}>
                      <div className={style.packageImage}>
                        <Image
                          src={pkg.image}
                          alt=""
                          fill
                          sizes="(max-width: 600px) 88px, 112px"
                          style={{ objectPosition: pkg.imagePosition || 'center' }}
                        />
                      </div>
                      <div className={style.packageInfo}>
                        <span className={style.category}>
                          {pkg.category.replace('-', ' ')}
                        </span>
                        <h3>{pkg.name}</h3>
                        <p>{pkg.tagline}</p>
                        <div className={style.packageMeta}>
                          <span>
                            <FaClipboardCheck aria-hidden="true" />
                            {testCount} tests
                          </span>
                          {save > 0 && (
                            <span className={style.saving}>
                              <FaCheckCircle aria-hidden="true" />
                              Save {formatBDT(save)}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className={style.packagePrice}>
                        <strong>{formatBDT(price)}</strong>
                        <span>per package</span>
                        <button
                          type="button"
                          className={style.removeButton}
                          onClick={() => updateCart(cartIds.filter((id) => id !== pkg.id))
                          }
                          aria-label={`Remove ${pkg.name} from cart`}
                        >
                          <FaTrashAlt aria-hidden="true" />
                          <span>Remove</span>
                        </button>
                      </div>
                    </li>
                  );
                })}
              </ul>

              {cardFee > 0 && (
                <div className={style.cardFeeBox}>
                  <FaIdCard aria-hidden="true" />
                  <div>
                    <strong>
                      One-time Health Card fee: {formatBDT(cardFee)}
                    </strong>
                    <p>
                      Package prices above do not include the card fee. You pay
                      it only once for all {items.length}{' '}
                      {items.length === 1 ? 'package' : 'packages'}, and it
                      stays valid for {CARD_VALIDITY_MONTHS} months.
                    </p>
                  </div>
                </div>
              )}
            </section>

            <aside className={style.summary} aria-label="Order summary">
              <h2>Order summary</h2>
              <div className={style.summaryLine}>
                <span>Selected packages</span>
                <strong>{items.length}</strong>
              </div>
              <div className={style.summaryLine}>
                <span>Packages total cost</span>
                <strong>{formatBDT(packagesRate)}</strong>
              </div>
              <div className={style.summaryLine}>
                <span>Discounts & savings</span>
                <strong className={style.savingAmount}>
                  {savings > 0 ? `− ${formatBDT(savings)}` : formatBDT(0)}
                </strong>
              </div>
              {cardFee > 0 && (
                <div className={style.summaryLine}>
                  <span>
                    Health Card fee
                    <small className={style.feeNote}>
                      One-time · valid {CARD_VALIDITY_MONTHS} months
                    </small>
                  </span>
                  <strong>{formatBDT(cardFee)}</strong>
                </div>
              )}
              <div className={style.totalLine}>
                <span>Estimated total</span>
                <strong>{formatBDT(total)}</strong>
              </div>
              <p className={style.priceNote}>
                The Health Card fee is charged only once, even with multiple
                packages. Final details will be confirmed by our care team.
              </p>
              <button
                type="button"
                className={style.primaryButton}
                onClick={() => setBooking(true)}
                disabled={!items.length}
              >
                Continue to booking
                <FaArrowRight aria-hidden="true" />
              </button>
              <div className={style.trustNote}>
                <FaCheckCircle aria-hidden="true" />
                <span>Doctor consultation included with your package</span>
              </div>
            </aside>
          </div>
        )}
      </div>

      {booking && bookingItems.length > 0 && (
        <BookingModal
          items={bookingItems}
          onClose={() => setBooking(false)}
          onSuccess={(ids) => updateCart(cartIds.filter((id) => !ids.includes(id)))
          }
        />
      )}
    </main>
  );
};

export default HealthPackageCart;
