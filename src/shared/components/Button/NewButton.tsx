import React from 'react';

import { IbuttonProps } from './button.type';

import style from './newbutton.module.scss';
import Link from 'next/link';

const { btn, btnSecond } = style;

const NewButton = ({ text, url, btnSecondary }: IbuttonProps) => {
    return (
        <Link
            className={btnSecondary ? `${btn} ${btnSecond}` : `${btn}`}
            href={url}
        >
            {text}
        </Link>
    );
};

export default NewButton;
