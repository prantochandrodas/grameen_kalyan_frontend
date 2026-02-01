'use client';

import React, { useEffect, useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';

import { getAllComments } from './commentSection.helper';
import CommentCard from './CommentCard/CommentCard';

import { BASE_URL } from '@/config';
import { FormErrorMessage, SuccessMessage } from '@/shared/components';

interface IformInputs {
  fullName: string;
  email: string;
  comment: string;
}

import style from './commentSection.module.scss';

const {
  commentSection,
  heading,
  divider,
  lineLeft,
  box,
  lineRight,
  formContainer,
  commentContainer,
  form,
  fullNameBox,
  emailBox,
  commentBox,
  required,
  submitBtn,
  cardContainer,
  fullNameInput,
  commentInput,
  emailInput,
} = style;

const CommentSection = ({ storyId }: { storyId: number }) => {
  const [submissionSuccessful, setSubmissionSuccessful] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [commentData, setCommentData] = useState<any[] | undefined>();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<IformInputs>();

  const onSubmit: SubmitHandler<IformInputs> = async (data) => {
    const userFormData = new FormData();
    const commentFormData = new FormData();

    // User Form Submit
    try {
      userFormData.append('name', data.fullName);
      userFormData.append('email', data.email);

      const responseUser = await fetch(BASE_URL + '/anonymous-user', {
        method: 'POST',
        body: userFormData,
      });

      if (!responseUser.ok) {
        throw new Error('Request fail');
      }
    } catch (error: unknown) {
      const errorInstance = error instanceof Error;
      const errMessage = errorInstance ? error.message : 'Something went wrong';
      setErrorMessage(errMessage);
    }

    // Get user
    const anonymousUser = async () => {
      try {
        const responseUserData = await fetch(
          BASE_URL + `/anonymous-user?email=${data.email}`
        );

        if (!responseUserData.ok) {
          throw new Error('Failed to fetch data');
        }

        return responseUserData.json();
      } catch (error: unknown) {
        const errorInstance = error instanceof Error;
        const errMessage = errorInstance
          ? error.message
          : 'Something went wrong';
        return errMessage;
      }
    };
    const userId = await anonymousUser();

    // Comment Form Submit
    try {
      commentFormData.append('user_id', userId.user_id);
      commentFormData.append('comment', data.comment);
      commentFormData.append('content_id', storyId.toString());

      const responseComment = await fetch(BASE_URL + '/comments', {
        method: 'POST',
        body: commentFormData,
      });

      if (!responseComment.ok) {
        throw new Error('Request fail');
      }
      setSubmissionSuccessful(true);
    } catch (error: unknown) {
      const errorInstance = error instanceof Error;
      const errMessage = errorInstance ? error.message : 'Something went wrong';
      setErrorMessage(errMessage);
    }
  };

  const loadCommentData = async () => {
    const commentsData = await getAllComments(storyId);

    setCommentData(commentsData.data);
  };

  useEffect(() => {
    loadCommentData();
  }, []);

  const handleModal = () => {
    setSubmissionSuccessful(false);
  };

  return (
    <div className={commentSection}>
      <h2 className={heading}>Comments</h2>
      <div className={divider}>
        <div className={lineLeft} />
        <div className={box} />
        <div className={lineRight} />
      </div>

      <div className={formContainer}>
        <form
          className={form}
          onSubmit={handleSubmit(onSubmit)}
          encType="multipart/form-data"
        >
          <div className={`${fullNameBox} ${box}`}>
            <label htmlFor="fullName">
              Full Name<span className={required}>*</span>:
            </label>
            <div className={fullNameInput}>
              <input
                id="fullName"
                type="text"
                {...register('fullName', { required: true })}
              />
              {errors.fullName?.type === 'required' && (
                <div>
                  <FormErrorMessage message="Please enter your full-name" />
                </div>
              )}
            </div>
            <p>Must be 3-20 characters long.</p>
          </div>
          <div className={`${emailBox} ${box}`}>
            <label htmlFor="email">
              Email ID<span className={required}>*</span>:
            </label>
            <div className={emailInput}>
              <input
                id="email"
                type="text"
                {...register('email', {
                  required: true,
                  pattern:
                    /^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/i,
                })}
              />
              {errors.email?.type === 'required' && (
                <div>
                  <FormErrorMessage message="Please an email" />
                </div>
              )}
              {errors.email?.type === 'pattern' && (
                <div>
                  <FormErrorMessage message="Please Provide a valid email address" />
                </div>
              )}
            </div>
            <p>Email should be valid email.</p>
          </div>
          <div className={`${commentBox} ${box}`}>
            <label htmlFor="comment">
              Comment<span className={required}>*</span>:
            </label>
            <div className={commentInput}>
              <textarea
                id="comment"
                rows={6}
                {...register('comment', { required: true })}
              />
              {errors.comment?.type === 'required' && (
                <div>
                  <FormErrorMessage message="Please enter a comment" />
                </div>
              )}
            </div>
            <p>Must be 3-100 characters long.</p>
          </div>
          <input
            className={submitBtn}
            type="submit"
            value="Post Comment"
            disabled={isSubmitting}
          />
        </form>
        {submissionSuccessful && (
          <SuccessMessage
            textMessage="Comment submitted successfully!"
            url={`/stories/${storyId}/${storyId}`}
            closeModal={handleModal}
          />
        )}
      </div>

      <div className={commentContainer}>
        {commentData?.map((data) => (
          <div key={data.id} className={cardContainer}>
            <CommentCard commentData={data} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommentSection;
