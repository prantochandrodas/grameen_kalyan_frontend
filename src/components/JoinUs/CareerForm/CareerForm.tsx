'use client';

import React, { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';

import { BASE_URL } from '@/config';
import { FormErrorMessage, SuccessMessage } from '@/shared/components';
import { ICareerFormProps } from './careerForm.type';

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
  heading,
  formContainer,
  box,
  departmentBox,
  nameBox,
  emailBox,
  phoneBox,
  resumeBox,
  form,
  errorContainer,
  submitBtn,
} = style;

const CareerForm = ({ departmentsData }: ICareerFormProps) => {
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

    formdata.append('department', data.department);
    formdata.append('name', data.name);
    formdata.append('email', data.email);
    formdata.append('phone', data.phone);
    formdata.append('upload_cv', data.resumeFile[0]);

    try {
      const response = await fetch(BASE_URL + '/save-career-form', {
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
    <div className={careerForm}>
      <h1 className={heading}>Join Us</h1>
      <div className={formContainer}>
        <form
          className={form}
          onSubmit={handleSubmit(onSubmit)}
          encType="multipart/form-data"
        >
          <div className={`${departmentBox} ${box}`}>
            <label htmlFor="department">Department:</label>
            <select
              id="department"
              {...register('department', { required: true })}
            >
              <option>Select Department</option>
              {departmentsData.map((data) => (
                <option key={data.id} value={data.name}>
                  {data.name}
                </option>
              ))}
            </select>
            {errors.name?.type === 'required' && (
              <div className={errorContainer}>
                <FormErrorMessage message="Department is Required" />
              </div>
            )}
          </div>
          <div className={`${nameBox} ${box}`}>
            <label htmlFor="candidateName">Name:</label>
            <input
              id="candidateName"
              type="text"
              {...register('name', { required: true })}
            />
            {errors.name?.type === 'required' && (
              <div className={errorContainer}>
                <FormErrorMessage message="Name is Required" />
              </div>
            )}
          </div>
          <div className={`${emailBox} ${box}`}>
            <label htmlFor="candidateEmail">Email:</label>
            <input
              id="candidateEmail"
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
          <div className={`${phoneBox} ${box}`}>
            <label htmlFor="candidatePhone">Phone:</label>
            <input
              id="candidatePhone"
              type="text"
              {...register('phone', { required: true, pattern: /^[0-9]+$/i })}
            />
            {errors.email?.type === 'required' && (
              <div className={errorContainer}>
                <FormErrorMessage message="Phone number is Required" />
              </div>
            )}
            {errors.email?.type === 'pattern' && (
              <div className={errorContainer}>
                <FormErrorMessage message="Please enter a valid phone number" />
              </div>
            )}
          </div>
          <div className={`${resumeBox} ${box}`}>
            <label htmlFor="candidateResume">Upload Resume:</label>
            <input
              id="candidateResume"
              type="file"
              {...register('resumeFile', { required: true })}
            />
            {errors.resumeFile?.type === 'required' && (
              <div className={errorContainer}>
                <FormErrorMessage message="Please Upload your resume" />
              </div>
            )}
          </div>
          <input className={submitBtn} type="submit" disabled={isSubmitting} />
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
  );
};

export default CareerForm;
