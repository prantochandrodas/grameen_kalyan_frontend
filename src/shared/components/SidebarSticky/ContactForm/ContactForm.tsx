import React, { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';

import { BASE_URL } from '@/config';
import { FormErrorMessage, SuccessMessage } from '@/shared/components';

interface IformInputs {
  name: string;
  email: string;
  subject: string;
  phone: string;
  date: string;
  message: string;
}
interface ContactFormProps {
  closeSidebar?: () => void; // optional, function to close sidebar
}
import style from './contactForm.module.scss';

const {
  contactForm,
  header,
  eyebrow,
  headingBar,
  subtitle,
  form,
  box,
  row,
  nameBox,
  errorContainer,
  subjectBox,
  emailBox,
  messageBox,
  submitBtn,
  heading,
  btnContainer,
  apiError,
} = style;

const ContactForm: React.FC<ContactFormProps> = ({ closeSidebar }) => {
  // Form Submission Successful
  const [submissionSuccessful, setSubmissionSuccessful] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<IformInputs>();

  const onSubmit: SubmitHandler<IformInputs> = async (data) => {
    const formdata = new FormData();

    formdata.append('name', data.name);
    formdata.append('subject', data.subject);
    formdata.append('email', data.email);
    formdata.append('message', data.message);
    formdata.append('phone', data.phone);
    formdata.append('date', data.date);
    try {
      const response = await fetch('https://admin.grameenkalyan.com/api/save-contact-form', {
        method: 'POST',
        body: formdata,
      });

      if (!response.ok) {
        throw new Error('Request fail');
      }

      setErrorMessage(null);
      setSubmissionSuccessful(true);
      reset();

      // show the success message first, then close the panel
      setTimeout(() => {
        setSubmissionSuccessful(false);
        closeSidebar?.();
      }, 1800);
    } catch (error: unknown) {
      const errorInstance = error instanceof Error;
      const errMessage = errorInstance ? error.message : 'Something went wrong';
      setErrorMessage(errMessage);
    }
  };

  const handleModal = () => {
    setSubmissionSuccessful(false);
    closeSidebar?.();
  };

  return (
    <div className={contactForm}>
      <div className={header}>
        <span className={eyebrow}>Get In Touch</span>
        <h3 className={heading}>Contact Us</h3>
        <span className={headingBar} />
        <p className={subtitle}>
          Send us a message and our team will get back to you soon.
        </p>
      </div>

      <form
        className={form}
        onSubmit={handleSubmit(onSubmit)}
        encType="multipart/form-data"
        noValidate
      >
        <div className={`${nameBox} ${box}`}>
          <label htmlFor="userName">Your Name</label>
          <input
            id="userName"
            type="text"
            autoComplete="name"
            placeholder="Enter your full name"
            aria-invalid={!!errors.name}
            {...register('name', { required: true })}
          />
          {errors.name?.type === 'required' && (
            <div className={errorContainer}>
              <FormErrorMessage message="Name is Required" />
            </div>
          )}
        </div>

        <div className={`${subjectBox} ${box}`}>
          <label htmlFor="userSubject">Your Subject</label>
          <input
            id="userSubject"
            type="text"
            placeholder="What is this about?"
            aria-invalid={!!errors.subject}
            {...register('subject', { required: true })}
          />
          {errors.subject?.type === 'required' && (
            <div className={errorContainer}>
              <FormErrorMessage message="Subject is Required" />
            </div>
          )}
        </div>

        <div className={`${emailBox} ${box}`}>
          <label htmlFor="userEmail">Your Email</label>
          <input
            id="userEmail"
            type="email"
            inputMode="email"
            autoComplete="email"
            placeholder="name@example.com"
            aria-invalid={!!errors.email}
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

        <div className={row}>
          <div className={box}>
            <label htmlFor="userPhone">Phone (optional)</label>
            <input
              id="userPhone"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              placeholder="01XXXXXXXXX"
              {...register('phone')}
            />
          </div>
          <div className={box}>
            <label htmlFor="userDate">Date (optional)</label>
            <input id="userDate" type="date" {...register('date')} />
          </div>
        </div>

        <div className={`${messageBox} ${box}`}>
          <label htmlFor="userMessage">Your Message</label>
          <textarea
            id="userMessage"
            rows={4}
            placeholder="Write your message here..."
            aria-invalid={!!errors.message}
            {...register('message', { required: true })}
          />
          {errors.message?.type === 'required' && (
            <div className={errorContainer}>
              <FormErrorMessage message="Message is Required" />
            </div>
          )}
        </div>

        {errorMessage && (
          <p className={apiError} role="alert">
            Something went wrong. Please check your connection and try again.
          </p>
        )}

        <div className={btnContainer}>
          <button className={submitBtn} type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Sending...' : 'Send Message'}
          </button>
        </div>
      </form>

      {submissionSuccessful && (
        <SuccessMessage
          textMessage="Message sent successfully!"
          url="/"
          closeModal={handleModal}
        />
      )}
    </div>
  );
};

export default ContactForm;
