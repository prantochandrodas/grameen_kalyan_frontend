import React from 'react';

const GOLD = 'var(--icon-accent, #c9a13b)';

const Svg = ({ children }: { children: React.ReactNode }) => (
    <svg
        viewBox="0 0 64 64"
        width="100%"
        height="100%"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
    >
        {children}
    </svg>
);

export const TargetIcon = () => (
    <Svg>
        <circle cx="28" cy="36" r="20" />
        <circle cx="28" cy="36" r="12" />
        <circle cx="28" cy="36" r="4" />
        <path d="M28 36 L52 12" stroke={GOLD} />
        <path d="M52 12 L54 4 M52 12 L60 10 M46 10 L54 18" stroke={GOLD} />
    </Svg>
);

export const CoinsIcon = () => (
    <Svg>
        <ellipse cx="24" cy="20" rx="14" ry="5" />
        <path d="M10 20 v8 a14 5 0 0 0 28 0 v-8" />
        <path d="M10 32 v8 a14 5 0 0 0 28 0 v-8" />
        <path d="M10 44 v8 a14 5 0 0 0 28 0 v-8" />
        <path d="M48 36 V16" stroke={GOLD} />
        <path d="M48 22 c0-7 6-9 11-9 c0 7-4 9-11 9z" stroke={GOLD} />
        <path d="M48 28 c0-6-5-7-9-7 c0 6 3 7 9 7z" stroke={GOLD} />
    </Svg>
);

export const InvestorIcon = () => (
    <Svg>
        <circle cx="26" cy="20" r="9" />
        <path d="M7 56 c0-12 8-19 19-19 c3 0 6 .6 8 1.6" />
        <circle cx="46" cy="46" r="11" stroke={GOLD} />
        <text
            x="46"
            y="52"
            textAnchor="middle"
            fontSize="15"
            fontWeight="700"
            fill={GOLD}
            stroke="none"
        >
            $
        </text>
    </Svg>
);

export const GrowthIcon = () => (
    <Svg>
        <rect x="8" y="40" width="9" height="16" />
        <rect x="23" y="30" width="9" height="26" />
        <rect x="38" y="20" width="9" height="36" />
        <path d="M6 26 L22 14 L32 21 L56 6" stroke={GOLD} />
        <path d="M45 5 H57 V17" stroke={GOLD} />
    </Svg>
);

export const TeamIcon = () => (
    <Svg>
        <circle cx="32" cy="20" r="7" />
        <path d="M18 54 c0-10 6-16 14-16 s14 6 14 16z" />
        <circle cx="13" cy="26" r="5" stroke={GOLD} />
        <path d="M3 50 c0-7 4-12 10-12" stroke={GOLD} />
        <circle cx="51" cy="26" r="5" stroke={GOLD} />
        <path d="M61 50 c0-7-4-12-10-12" stroke={GOLD} />
    </Svg>
);

export const WorkerIcon = () => (
    <Svg>
        <circle cx="32" cy="30" r="9" />
        <path d="M20 27 a12 12 0 0 1 24 0z" />
        <path d="M16 27 H48" />
        <path d="M32 15 V21" stroke={GOLD} />
        <path d="M12 58 c0-10 8-17 20-17 s20 7 20 17z" />
    </Svg>
);

export const JoyIcon = () => (
    <Svg>
        <circle cx="32" cy="36" r="16" />
        <circle cx="26" cy="32" r="1.5" fill="currentColor" />
        <circle cx="38" cy="32" r="1.5" fill="currentColor" />
        <path d="M24 39 q8 8 16 0" />
        <path
            d="M32 12 V6 M16 20 L12 16 M48 20 L52 16 M8 36 H2 M56 36 H62"
            stroke={GOLD}
        />
    </Svg>
);