'use client';

import React, { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';

import { BASE_URL } from '@/config';
import { FormErrorMessage, SuccessMessage } from '@/shared/components';
import { ICareerFormProps } from './careerForm.type';
import joinBg from '@/assets/images/join-us.jpg';
import { motion } from 'framer-motion';

interface IformInputs {
  department: string;
  name: string;
  email: string;
  phone: string;
  resumeFile: FileList;
}

import style from './careerForm.module.scss';

const {
  careerForm,
  show,
  intro,
  eyebrow,
  heading,
  subHeading,
  formContainer,
  formCard,
  form,
  box,
  fullBox,
  errorContainer,
  fileField,
  fileText,
  fileHint,
  submitBtn,
  submitError,
} = style;

const CareerForm = ({ departmentsData }: ICareerFormProps) => {
  // Form Submission Successful
  const [submissionSuccessful, setSubmissionSuccessful] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [inView, setInView] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<IformInputs>({ mode: 'onTouched' });

  const selectedFile = watch('resumeFile')?.[0];

  const onSubmit: SubmitHandler<IformInputs> = async (data) => {
    const formdata = new FormData();

    formdata.append('department', data.department);
    formdata.append('name', data.name);
    formdata.append('email', data.email);
    formdata.append('phone', data.phone);
    formdata.append('upload_cv', data.resumeFile[0]);
    setErrorMessage(null);

    try {
      const response = await fetch(BASE_URL + '/save-career-form', {
        method: 'POST',
        body: formdata,
      });

      if (!response.ok) {
        throw new Error('Request fail');
      }

      reset();
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
    <motion.section
      className={inView ? `${careerForm} ${show}` : careerForm}
      style={{ '--join-bg': `url(${joinBg.src})` } as React.CSSProperties}
      onViewportEnter={() => setInView(true)}
      viewport={{ once: true, amount: 0.2 }}
    >
      <div className={formContainer}>
        <div className={intro}>
          <span className={eyebrow}>Get Involved</span>
          <h1 className={heading}>Join Us</h1>
          <p className={subHeading}>
            Be a part of our mission to create healthier communities and a
            brighter future.
          </p>
        </div>

        <div className={formCard}>
          <form
            className={form}
            onSubmit={handleSubmit(onSubmit)}
            encType="multipart/form-data"
            noValidate
          >
            <div className={box}>
              <label htmlFor="department">Department</label>
              <select
                id="department"
                aria-invalid={!!errors.department}
                {...register('department', {
                  required: 'Department is Required',
                })}
              >
                <option value="">Select Department</option>
                {departmentsData.map((data) => (
                  <option key={data.id} value={data.name}>
                    {data.name}
                  </option>
                ))}
              </select>
              {errors.department && (
                <div className={errorContainer}>
                  <FormErrorMessage
                    message={errors.department.message as string}
                  />
                </div>
              )}
            </div>

            <div className={box}>
              <label htmlFor="candidateName">Full Name</label>
              <input
                id="candidateName"
                type="text"
                placeholder="Your full name"
                autoComplete="name"
                aria-invalid={!!errors.name}
                {...register('name', { required: 'Name is Required' })}
              />
              {errors.name && (
                <div className={errorContainer}>
                  <FormErrorMessage message={errors.name.message as string} />
                </div>
              )}
            </div>

            <div className={box}>
              <label htmlFor="candidateEmail">Email</label>
              <input
                id="candidateEmail"
                type="email"
                placeholder="you@example.com"
                autoComplete="email"
                aria-invalid={!!errors.email}
                {...register('email', {
                  required: 'Email is Required',
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: 'Please Provide a valid email address',
                  },
                })}
              />
              {errors.email && (
                <div className={errorContainer}>
                  <FormErrorMessage message={errors.email.message as string} />
                </div>
              )}
            </div>

            <div className={box}>
              <label htmlFor="candidatePhone">Phone</label>
              <input
                id="candidatePhone"
                type="tel"
                inputMode="tel"
                placeholder="01XXXXXXXXX"
                autoComplete="tel"
                aria-invalid={!!errors.phone}
                {...register('phone', {
                  required: 'Phone number is Required',
                  pattern: {
                    value: /^\+?[0-9]{10,15}$/,
                    message: 'Please enter a valid phone number',
                  },
                })}
              />
              {errors.phone && (
                <div className={errorContainer}>
                  <FormErrorMessage message={errors.phone.message as string} />
                </div>
              )}
            </div>

            <div className={`${box} ${fullBox}`}>
              <label htmlFor="candidateResume">Upload Resume</label>
              <div className={fileField}>
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
                <span className={fileText}>
                  <strong>
                    {selectedFile
                      ? selectedFile.name
                      : 'Click to upload your resume'}
                  </strong>
                  <span className={fileHint}>PDF, DOC or DOCX · max 5MB</span>
                </span>
                <input
                  id="candidateResume"
                  type="file"
                  accept=".pdf,.doc,.docx"
                  {...register('resumeFile', {
                    required: 'Please Upload your resume',
                    validate: (files) =>
                      !files?.[0] ||
                      files[0].size <= 5 * 1024 * 1024 ||
                      'File size must be under 5MB',
                  })}
                />
              </div>
              {errors.resumeFile && (
                <div className={errorContainer}>
                  <FormErrorMessage
                    message={errors.resumeFile.message as string}
                  />
                </div>
              )}
            </div>

            <button className={submitBtn} type="submit" disabled={isSubmitting}>
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M22 2 11 13" />
                <path d="M22 2 15 22l-4-9-9-4z" />
              </svg>
              {isSubmitting ? 'Submitting...' : 'Submit Application'}
            </button>

            {errorMessage && (
              <p className={submitError} role="alert">
                Could not submit your application. Please try again.
              </p>
            )}
          </form>

          {submissionSuccessful && (
            <SuccessMessage
              textMessage="Application submitted successfully!"
              url="/join-us"
              closeModal={handleModal}
            />
          )}
        </div>
      </div>
    </motion.section>
  );
};

export default CareerForm;
