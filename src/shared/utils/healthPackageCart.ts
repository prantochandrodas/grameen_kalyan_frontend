export const HEALTH_PACKAGE_CART_KEY = 'gk-health-package-cart';
export const HEALTH_PACKAGE_CART_EVENT = 'gk-health-package-cart-updated';

export const getHealthPackageCart = () => {
  try {
    const saved = JSON.parse(
      window.localStorage.getItem(HEALTH_PACKAGE_CART_KEY) || '[]'
    );

    return Array.isArray(saved)
      ? saved.filter(
        (id, index, ids): id is string => typeof id === 'string' && ids.indexOf(id) === index
      )
      : [];
  } catch {
    return [];
  }
};

export const getHealthPackageCartCount = () => getHealthPackageCart().length;

export const saveHealthPackageCart = (ids: string[]) => {
  window.localStorage.setItem(HEALTH_PACKAGE_CART_KEY, JSON.stringify(ids));
  window.dispatchEvent(new Event(HEALTH_PACKAGE_CART_EVENT));
};
