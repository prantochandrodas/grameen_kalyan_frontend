// ================= START: HealthCenterField.tsx =================
'use client';

import React, { KeyboardEvent, useEffect, useRef, useState } from 'react';
import {
  FaCheckCircle,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaSearch,
  FaTimes,
} from 'react-icons/fa';

import { getDataByKeyword } from '@/components/Healthcare/MapSection/mapSection.helper';
import { IHealthCenter } from '@/shared/types/healthCenter';

import style from './healthPackages.module.scss';

interface IHealthCenterFieldProps {
  value: IHealthCenter | null;
  onChange: (center: IHealthCenter | null) => void;
  error?: boolean;
}

const MIN_CHARS = 2;
const MAX_RESULTS = 20;

const norm = (text: string) => text.trim().toLowerCase().replace(/\s+/g, ' ');

// bold the part of the name that matches what the user typed
const highlight = (text: string, term: string) => {
  const i = term ? text.toLowerCase().indexOf(term.toLowerCase()) : -1;
  if (i < 0) return text;
  return (
    <>
      {text.slice(0, i)}
      <mark>{text.slice(i, i + term.length)}</mark>
      {text.slice(i + term.length)}
    </>
  );
};

const HealthCenterField = ({
  value,
  onChange,
  error,
}: IHealthCenterFieldProps) => {
  const [query, setQuery] = useState(value?.name ?? '');
  const [results, setResults] = useState<IHealthCenter[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [active, setActive] = useState(-1);

  const wrapRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const requestId = useRef(0);
  const skipSearch = useRef(false);

  const term = query.trim();
  const showList = open && !value && term.length >= MIN_CHARS;

  const choose = (center: IHealthCenter) => {
    skipSearch.current = center.name !== query;
    setQuery(center.name);
    setResults([]);
    setSearched(false);
    setLoading(false);
    setOpen(false);
    setActive(-1);
    onChange(center);
  };

  // debounced search (name / upazila / district / division handled by the API keyword)
  useEffect(() => {
    if (skipSearch.current) {
      skipSearch.current = false;
      return undefined;
    }

    if (term.length < MIN_CHARS) {
      setResults([]);
      setSearched(false);
      setLoading(false);
      return undefined;
    }

    requestId.current += 1;
    const id = requestId.current;
    setLoading(true);

    const timer = setTimeout(async () => {
      try {
        const res = await getDataByKeyword(term);
        if (id !== requestId.current) return;
        const list: IHealthCenter[] = Array.isArray(res?.data) ? res.data : [];

        // the full center name was typed -> select it automatically
        const exact = list.find((item) => norm(item.name) === norm(term));
        if (exact) {
          choose(exact);
          return;
        }

        setResults(list.slice(0, MAX_RESULTS));
        setActive(-1);
        setSearched(true);
      } catch (e) {
        if (id === requestId.current) {
          setResults([]);
          setSearched(true);
        }
      } finally {
        if (id === requestId.current) setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  // close the list on outside click
  useEffect(() => {
    const onOutside = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', onOutside);
    return () => document.removeEventListener('mousedown', onOutside);
  }, []);

  // keep the highlighted row visible with arrow keys
  useEffect(() => {
    if (active < 0) return;
    document
      .getElementById(`hp-center-${active}`)
      ?.scrollIntoView({ block: 'nearest' });
  }, [active]);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const next = e.target.value;
    setQuery(next);
    setOpen(true);
    if (value && norm(next) !== norm(value.name)) onChange(null);
  };

  const clear = () => {
    setQuery('');
    setResults([]);
    setSearched(false);
    setActive(-1);
    setOpen(false);
    onChange(null);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setOpen(true);
      setActive((p) => (p < results.length - 1 ? p + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setOpen(true);
      setActive((p) => (p > 0 ? p - 1 : results.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault(); // never submit the booking form from this field
      const picked = results[active] ?? results[0];
      if (showList && picked) choose(picked);
    } else if (e.key === 'Escape' && showList) {
      e.stopPropagation(); // close the list, keep the modal open
      setOpen(false);
    }
  };

  return (
    <div className={style.field} ref={wrapRef}>
      <label htmlFor="hpCenter">Health Center</label>

      <div className={style.centerInputWrap}>
        <FaSearch className={style.centerIcon} aria-hidden="true" />
        <input
          id="hpCenter"
          ref={inputRef}
          className={style.centerInput}
          type="text"
          autoComplete="off"
          placeholder="Search health center, upazila or district"
          role="combobox"
          aria-expanded={showList}
          aria-controls="hp-center-list"
          aria-autocomplete="list"
          aria-activedescendant={active >= 0 ? `hp-center-${active}` : undefined}
          aria-invalid={!!error && !value}
          value={query}
          onChange={handleInput}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
        />
        {loading ? (
          <span className={style.centerSpinner} aria-hidden="true" />
        ) : (
          query && (
            <button
              type="button"
              className={style.centerClear}
              onClick={clear}
              aria-label="Clear health center"
            >
              <FaTimes />
            </button>
          )
        )}
      </div>

      {showList && (
        <ul
          id="hp-center-list"
          className={style.centerList}
          role="listbox"
          aria-label="Health centers"
        >
          {loading && results.length === 0 && (
            <li className={style.centerEmpty}>Searching...</li>
          )}

          {!loading && searched && results.length === 0 && (
            <li className={style.centerEmpty}>
              No health center found for “{term}”
            </li>
          )}

          {results.map((center, i) => (
            <li
              key={center.id}
              id={`hp-center-${i}`}
              role="option"
              aria-selected={i === active}
              className={`${style.centerItem} ${
                i === active ? style.centerItemActive : ''
              }`}
              onMouseDown={(e) => e.preventDefault()}
              onMouseEnter={() => setActive(i)}
              onClick={() => choose(center)}
            >
              <FaMapMarkerAlt aria-hidden="true" />
              <span className={style.centerItemBody}>
                <span className={style.centerName}>
                  {highlight(center.name, term)}
                </span>
                {center.address && (
                  <span className={style.centerMeta}>{center.address}</span>
                )}
              </span>
              {center.division_name && (
                <span className={style.centerDivision}>
                  {center.division_name}
                </span>
              )}
            </li>
          ))}
        </ul>
      )}

      {value ? (
        <div className={style.centerSelected}>
          <FaCheckCircle aria-hidden="true" />
          <div>
            <strong>{value.name}</strong>
            {value.address && <span>{value.address}</span>}
            {value.contact_info && (
              <span>
                <FaPhoneAlt aria-hidden="true" /> {value.contact_info}
              </span>
            )}
          </div>
        </div>
      ) : error ? (
        <small>Please select a health center from the list</small>
      ) : (
        <span className={style.centerHint}>
          Where would you like to take the tests?
        </span>
      )}
    </div>
  );
};

export default HealthCenterField;
// ================== END: HealthCenterField.tsx ==================