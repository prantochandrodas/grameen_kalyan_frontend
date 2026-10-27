'use client';

import React, { useEffect, useRef, useState } from 'react';
import {
    FaGlobeAsia,
    FaChevronDown,
    FaCheck,
    FaInfoCircle,
    FaSearch,
} from 'react-icons/fa';

import style from './languageSwitcher.module.scss';

declare global {
    interface Window {
        googleTranslateElementInit?: () => void;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        google?: any;
    }
}

const LANGUAGES = [
    { code: 'en', label: 'English', en: 'English', flag: 'gb' },
    { code: 'bn', label: 'বাংলা', en: 'Bengali', flag: 'bd' },
    { code: 'zh-CN', label: '中文', en: 'Mandarin Chinese', flag: 'cn' },
    { code: 'hi', label: 'हिन्दी', en: 'Hindi', flag: 'in' },
    { code: 'es', label: 'Español', en: 'Spanish', flag: 'es' },
    { code: 'fr', label: 'Français', en: 'French', flag: 'fr' },
    { code: 'pt', label: 'Português', en: 'Portuguese', flag: 'pt' },
    { code: 'de', label: 'Deutsch', en: 'German', flag: 'de' },
    { code: 'it', label: 'Italiano', en: 'Italian', flag: 'it' },
    { code: 'ru', label: 'Русский', en: 'Russian', flag: 'ru' },
    { code: 'ar', label: 'العربية', en: 'Arabic', flag: 'sa' },
    { code: 'ur', label: 'اردو', en: 'Urdu', flag: 'pk' },
    { code: 'ja', label: '日本語', en: 'Japanese', flag: 'jp' },
    { code: 'ko', label: '한국어', en: 'Korean', flag: 'kr' },
    { code: 'zh-TW', label: '粵語 (繁體)', en: 'Cantonese', flag: 'hk' },
    { code: 'th', label: 'ไทย', en: 'Thai', flag: 'th' },
    { code: 'ms', label: 'Bahasa Melayu', en: 'Malay', flag: 'my' },
    { code: 'id', label: 'Indonesia', en: 'Indonesian', flag: 'id' },
    { code: 'tr', label: 'Türkçe', en: 'Turkish', flag: 'tr' },
    { code: 'vi', label: 'Tiếng Việt', en: 'Vietnamese', flag: 'vn' },
    { code: 'fa', label: 'فارسی', en: 'Persian', flag: 'ir' },
    { code: 'tl', label: 'Tagalog', en: 'Filipino', flag: 'ph' },
    { code: 'pl', label: 'Polski', en: 'Polish', flag: 'pl' },
    { code: 'sw', label: 'Kiswahili', en: 'Swahili', flag: 'ke' },
    { code: 'nl', label: 'Nederlands', en: 'Dutch', flag: 'nl' },
    { code: 'ro', label: 'Română', en: 'Romanian', flag: 'ro' },
    { code: 'sr', label: 'Српски', en: 'Serbian', flag: 'rs' },
    { code: 'el', label: 'Ελληνικά', en: 'Greek', flag: 'gr' },
    { code: 'hu', label: 'Magyar', en: 'Hungarian', flag: 'hu' },
    { code: 'sv', label: 'Svenska', en: 'Swedish', flag: 'se' },
    { code: 'cs', label: 'Čeština', en: 'Czech', flag: 'cz' },
    { code: 'bg', label: 'Български', en: 'Bulgarian', flag: 'bg' },
    { code: 'hr', label: 'Hrvatski', en: 'Croatian', flag: 'hr' },
    { code: 'da', label: 'Dansk', en: 'Danish', flag: 'dk' },
    { code: 'fi', label: 'Suomi', en: 'Finnish', flag: 'fi' },
    { code: 'no', label: 'Norsk', en: 'Norwegian', flag: 'no' },
    { code: 'uk', label: 'Українська', en: 'Ukrainian', flag: 'ua' },
    { code: 'ha', label: 'Hausa', en: 'Hausa', flag: 'ng' },
    { code: 'su', label: 'Basa Sunda', en: 'Sundanese', flag: 'id' },
    { code: 'my', label: 'မြန်မာ', en: 'Burmese', flag: 'mm' },
    { code: 'ne', label: 'नेपाली', en: 'Nepali', flag: 'np' },
    { code: 'om', label: 'Afaan Oromoo', en: 'Oromo', flag: 'et' },
    { code: 'so', label: 'Soomaali', en: 'Somali', flag: 'so' },
    { code: 'zu', label: 'isiZulu', en: 'Zulu', flag: 'za' },
    { code: 'af', label: 'Afrikaans', en: 'Afrikaans', flag: 'za' },
    { code: 'ta', label: 'தமிழ்', en: 'Tamil', flag: 'in' },
    { code: 'mr', label: 'मराठी', en: 'Marathi', flag: 'in' },
    { code: 'te', label: 'తెలుగు', en: 'Telugu', flag: 'in' },
    { code: 'pa', label: 'ਪੰਜਾਬੀ', en: 'Punjabi', flag: 'in' },
    { code: 'gu', label: 'ગુજરાતી', en: 'Gujarati', flag: 'in' },
    { code: 'kn', label: 'ಕನ್ನಡ', en: 'Kannada', flag: 'in' },
    { code: 'ml', label: 'മലയാളം', en: 'Malayalam', flag: 'in' },
];

const readCookieLang = (): string => {
    const m = document.cookie.match(/(?:^|;\s*)googtrans=([^;]+)/);
    if (!m) return 'en';
    const parts = decodeURIComponent(m[1]).split('/');
    return parts[2] || 'en';
};

const writeCookie = (value: string, expire = false) => {
    const exp = expire
        ? '; expires=Thu, 01 Jan 1970 00:00:00 GMT; max-age=0'
        : '';
    const host = window.location.hostname;

    // every possible domain level: www.site.com -> .www.site.com, site.com, .site.com
    const parts = host.split('.');
    const domains: string[] = [];
    for (let i = 0; i < parts.length - 1; i += 1) {
        const d = parts.slice(i).join('.');
        domains.push(d, `.${d}`);
    }

    document.cookie = `googtrans=${value}; path=/${exp}`;
    domains.forEach((d) => {
        document.cookie = `googtrans=${value}; path=/; domain=${d}${exp}`;
    });
};

const LanguageSwitcher = () => {
    const [open, setOpen] = useState(false);
    const [current, setCurrent] = useState('en');
    const [panelTop, setPanelTop] = useState(80);
    const [query, setQuery] = useState('');
    const wrapRef = useRef<HTMLDivElement>(null);
    const btnRef = useRef<HTMLButtonElement>(null);

    /* load Google Translate once */
    useEffect(() => {
        setCurrent(readCookieLang());

        // stops React "removeChild" crash when Google edits the page text
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const proto = Node.prototype as any;
        if (!proto.__gtPatched) {
            const origRemove = proto.removeChild;
            proto.removeChild = function (this: Node, child: Node) {
                if (child.parentNode !== this) return child;
                return origRemove.call(this, child);
            };
            const origInsert = proto.insertBefore;
            proto.insertBefore = function (
                this: Node,
                newNode: Node,
                ref: Node | null
            ) {
                if (ref && ref.parentNode !== this) return newNode;
                return origInsert.call(this, newNode, ref);
            };
            proto.__gtPatched = true;
        }

        const init = () => {
            if (!window.google?.translate?.TranslateElement) return;
            if (document.querySelector('select.goog-te-combo')) return;
            new window.google.translate.TranslateElement(
                {
                    pageLanguage: 'en',
                    includedLanguages: LANGUAGES.map((l) => l.code).join(','),
                    autoDisplay: false,
                },
                'google_translate_element'
            );
        };

        window.googleTranslateElementInit = init;

        if (window.google?.translate?.TranslateElement) {
            init();
            return;
        }
        if (!document.getElementById('google-translate-script')) {
            const s = document.createElement('script');
            s.id = 'google-translate-script';
            s.src =
                'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
            s.async = true;
            document.body.appendChild(s);
        }
    }, []);

    /* close on outside click / Esc / resize */
    useEffect(() => {
        if (!open) return;
        const onDown = (e: MouseEvent | TouchEvent) => {
            if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
                setOpen(false);
            }
        };
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setOpen(false);
        };
        const onResize = () => setOpen(false);
        document.addEventListener('mousedown', onDown);
        document.addEventListener('touchstart', onDown);
        document.addEventListener('keydown', onKey);
        window.addEventListener('resize', onResize);
        return () => {
            document.removeEventListener('mousedown', onDown);
            document.removeEventListener('touchstart', onDown);
            document.removeEventListener('keydown', onKey);
            window.removeEventListener('resize', onResize);
        };
    }, [open]);

    const toggle = () => {
        if (!open && btnRef.current) {
            setPanelTop(btnRef.current.getBoundingClientRect().bottom + 10);
        }
        if (!open) setQuery('');
        setOpen((o) => !o);
    };

    const changeLanguage = (code: string) => {
        setOpen(false);
        if (code === current) return;
        setCurrent(code);

        // back to original language
        if (code === 'en') {
            writeCookie('', true);
            window.location.reload();
            return;
        }

        const combo = document.querySelector<HTMLSelectElement>(
            'select.goog-te-combo'
        );
        if (combo) {
            combo.value = code;
            combo.dispatchEvent(new Event('change'));
        } else {
            // widget not ready yet: use cookie + reload
            writeCookie(`/en/${code}`);
            window.location.reload();
        }
    };

    const q = query.trim().toLowerCase();
    const filtered = LANGUAGES.filter(
        (l) =>
            !q ||
            l.label.toLowerCase().includes(q) ||
            l.en.toLowerCase().includes(q) ||
            l.code.toLowerCase().includes(q)
    );

    const active = LANGUAGES.find((l) => l.code === current) || LANGUAGES[0];

    return (
        <div ref={wrapRef} className={`${style.wrap} notranslate`} translate="no">
            <button
                ref={btnRef}
                type="button"
                className={`${style.trigger} ${open ? style.triggerOpen : ''}`}
                onClick={toggle}
                aria-haspopup="listbox"
                aria-expanded={open}
                aria-label="Select language"
            >
                <FaGlobeAsia className={style.globe} />
                <span className={style.labelFull}>{active.label}</span>
                <span className={style.labelShort}>
                    {active.code.split('-')[0].toUpperCase()}
                </span>
                <FaChevronDown
                    className={`${style.chevron} ${open ? style.chevronOpen : ''}`}
                />
            </button>

            {open && (
                <div
                    className={style.panel}
                    role="dialog"
                    aria-label="Select language"
                    style={{ '--panel-top': `${panelTop}px` } as React.CSSProperties}
                >
                    <h4 className={style.title}>Select Language</h4>
                    <p className={style.subtitle}>Translate the whole website instantly</p>

                    <div className={style.search}>
                        <FaSearch className={style.searchIcon} />
                        <input
                            type="text"
                            className={style.searchInput}
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Search language..."
                            aria-label="Search language"
                            autoComplete="off"
                        />
                    </div>

                    <ul className={style.grid} role="listbox">
                        {filtered.map((l) => (
                            <li key={l.code}>
                                <button
                                    type="button"
                                    role="option"
                                    aria-selected={l.code === current}
                                    className={`${style.item} ${l.code === current ? style.itemActive : ''
                                        }`}
                                    onClick={() => changeLanguage(l.code)}
                                >
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        className={style.flag}
                                        src={`https://flagcdn.com/w40/${l.flag}.png`}
                                        srcSet={`https://flagcdn.com/w80/${l.flag}.png 2x`}
                                        alt=""
                                        width={26}
                                        height={26}
                                        loading="lazy"
                                    />
                                    <span className={style.name}>{l.label}</span>
                                    {l.code === current && <FaCheck className={style.check} />}
                                </button>
                            </li>
                        ))}
                    </ul>

                    {filtered.length === 0 && (
                        <p className={style.empty}>No language found</p>
                    )}

                    <p className={style.note}>
                        <FaInfoCircle />
                        <span>
                            Automatic translation by Google. English is the original
                            language.
                        </span>
                    </p>
                </div>
            )}

            {/* Google Translate engine (hidden) */}
            <div id="google_translate_element" className={style.gtHidden} />
        </div>
    );
};

export default LanguageSwitcher;