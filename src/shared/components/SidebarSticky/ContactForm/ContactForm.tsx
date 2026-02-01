import React, { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';

import { BASE_URL } from '@/config';
import { FormErrorMessage, SuccessMessage } from '@/shared/components';

interface IformInputs {
  name: string;
  email: string;
  subject: string;
  message: string;
}

import style from './contactForm.module.scss';

const {
  contactForm,
  form,
  box,
  nameBox,
  errorContainer,
  subjectBox,
  emailBox,
  messageBox,
  submitBtn,
  heading,
  btnContainer,
} = style;

const ContactForm = () => {
  // Form Submission Successful
  const [submissionSuccessful, setSubmissionSuccessful] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<IformInputs>();

  const onSubmit: SubmitHandler<IformInputs> = async (data) => {
    const formdata = new FormData();

    formdata.append('name', data.name);
    formdata.append('subject', data.subject);
    formdata.append('email', data.email);
    formdata.append('message', data.message);

    try {
      const response = await fetch(BASE_URL + '/save-contact-form', {
        method: 'POST',
        body: formdata,
      });

      if (!response.ok) {
        throw new Error('Request fail');
      }

      setSubmissionSuccessful(true);
    } catch (error: unknown) {
      const errorInstance = error instanceof Error;
      const errMessage = errorInstance ? error.message : 'Something went wrong';
      setErrorMessage(errMessage);
    }
  };

  const handleModal = () => {
    setSubmissionSuccessful(false);
  };

  return (
    <div className={contactForm}>
      <h3 className={heading}>CONTACT US</h3>
      <form
        className={form}
        onSubmit={handleSubmit(onSubmit)}
        encType="multipart/form-data"
      >
        <div className={`${nameBox} ${box}`}>
          <label htmlFor="userName">Your Name:</label>
          <input
            id="userName"
            type="text"
            {...register('name', { required: true })}
          />
          {errors.name?.type === 'required' && (
            <div className={errorContainer}>
              <FormErrorMessage message="Name is Required" />
            </div>
          )}
        </div>
        <div className={`${subjectBox} ${box}`}>
          <label htmlFor="userSubject">Your Subject:</label>
          <input
            id="userSubject"
            type="text"
            {...register('subject', { required: true })}
          />
          {errors.subject?.type === 'required' && (
            <div className={errorContainer}>
              <FormErrorMessage message="Email is Required" />
            </div>
          )}
        </div>
        <div className={`${emailBox} ${box}`}>
          <label htmlFor="userEmail">Your Email:</label>
          <input
            id="userEmail"
            type="text"
            {...register('email', {
              required: true,
              pattern:
                /^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/i,
            })}
          />
          {errors.email?.type === 'required' && (
            <div className={errorContainer}>
              <FormErrorMessage message="Email is Required" />
            </div>
          )}
          {errors.email?.type === 'pattern' && (
            <div className={errorContainer}>
              <FormErrorMessage message="Please Provide a valid email address" />
            </div>
          )}
        </div>
        <div className={`${messageBox} ${box}`}>
          <label htmlFor="userMessage">Your Message:</label>
          <textarea
            id="userMessage"
            rows={5}
            {...register('message', { required: true })}
          />
          {errors.subject?.type === 'required' && (
            <div className={errorContainer}>
              <FormErrorMessage message="Email is Required" />
            </div>
          )}
        </div>
        <div className={btnContainer}>
          <input
            className={submitBtn}
            type="submit"
            value="Send"
            disabled={isSubmitting}
          />
        </div>
      </form>
      {submissionSuccessful && (
        <SuccessMessage
          textMessage="Application submitted successfully!"
          url="/"
          closeModal={handleModal}
        />
      )}
    </div>
  );
};

export default ContactForm;
