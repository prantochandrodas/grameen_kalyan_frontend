import React from 'react';

import style from './formErrorMessage.module.scss';

const { errorMsgContainer } = style;

interface IFormErrorMessageProps {
  message: string;
}

const FormErrorMessage = ({ message }: IFormErrorMessageProps) => {
  return (
    <div className={errorMsgContainer}>
      <h2>{message}</h2>
    </div>
  );
};

export default FormErrorMessage;
