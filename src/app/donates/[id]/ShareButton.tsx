'use client';

import { useState } from 'react';
import { FaShareAlt, FaCheck } from 'react-icons/fa';
import style from './DonateDetails.module.scss';

export default function ShareButton({ title }: { title: string }) {
    const [copied, setCopied] = useState(false);

    const handleShare = async () => {
        const url = window.location.href;

        if (navigator.share) {
            try {
                await navigator.share({ title, url });
            } catch {
                // user cancelled — nothing to do
            }
            return;
        }

        try {
            await navigator.clipboard.writeText(url);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            // clipboard blocked — ignore
        }
    };

    return (
        <button
            type="button"
            className={style.shareBtn}
            onClick={handleShare}
            aria-label="Share this cause"
        >
            {copied ? <FaCheck /> : <FaShareAlt />}
            <span>{copied ? 'Copied' : 'Share'}</span>
        </button>
    );
}