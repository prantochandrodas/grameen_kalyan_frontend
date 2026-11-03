import { IMAGE_BASE_URL } from '@/config';

const FALLBACK_HOST = 'https://admin.grameenkalyan.com';

/**
 * Returns an absolute image URL.
 * Full URLs are returned untouched, relative API paths are prefixed with the
 * image host. Returns undefined when there is nothing to show.
 */
export const toAbsoluteImageUrl = (src?: string | null): string | undefined => {
  if (!src || typeof src !== 'string') return undefined;
  if (/^https?:\/\//i.test(src)) return src;

  const host = IMAGE_BASE_URL || FALLBACK_HOST;
  return `${host}${src.startsWith('/') ? '' : '/'}${src}`;
};

/** Safe array accessor for API payloads that may be undefined or an error string */
export const asArray = <T>(value: unknown): T[] =>
  Array.isArray(value) ? (value as T[]) : [];