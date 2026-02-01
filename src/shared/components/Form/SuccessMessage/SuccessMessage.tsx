'use client';

import React from 'react';
import { useRouter, usePathname } from 'next/navigation';

import { Button } from '../../Button';
import successSvg from '@/assets/icons/success.svg';

import style from './successMessage.module.scss';
import Image from 'next/image';

const {
  successMessage,
  messageContainer,
  message,
  btnContainer,
  text,
  iconContainer,
  img,
} = style;

interface ISuccessMessageProps {
  textMessage: string;
  url: string;
  closeModal: any;
}

const SuccessMessage = ({
  textMessage,
  url,
  closeModal,
}: ISuccessMessageProps) => {
  const router = useRouter();
  const pathName = usePathname();

  const handleButton = () => {
    closeModal();
    router.refresh();
  };

  return (
    <div className={successMessage}>
      <div className={messageContainer}>
        <div className={message}>
          <div className={iconContainer}>
            <Image className={img} src={successSvg} alt="success icon" />
          </div>
          <h2 className={text}>{textMessage}</h2>
        </div>
        <div className={btnContainer} onClick={() => handleButton()}>
          <Button text="Continue" url={url} />
        </div>
      </div>
    </div>
  );
};

export default SuccessMessage;
