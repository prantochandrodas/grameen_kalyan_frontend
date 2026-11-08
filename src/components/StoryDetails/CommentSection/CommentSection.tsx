'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';

import { getAllComments } from './commentSection.helper';
import CommentCard from './CommentCard/CommentCard';

import { BASE_URL } from '@/config';
import { SuccessMessage } from '@/shared/components';

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
  formCard,
  formTitle,
  form,
  row,
  field,
  label,
  required,
  inputField,
  textareaField,
  hint,
  errorText,
  fieldFooter,
  counter,
  alertBox,
  submitBtn,
  commentContainer,
  commentCount,
  cardContainer,
} = style;

const CommentSection = ({ storyId }: { storyId: number }) => {
  const [submissionSuccessful, setSubmissionSuccessful] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [commentData, setCommentData] = useState<any[]>([]);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<IformInputs>({ mode: 'onTouched' });

  const commentLength = watch('comment')?.length ?? 0;

  const loadCommentData = useCallback(async () => {
    try {
      const res = await getAllComments(storyId);
      setCommentData(Array.isArray(res?.data) ? res.data : []);
    } catch {
      setCommentData([]);
    }
  }, [storyId]);

  useEffect(() => {
    loadCommentData();
  }, [loadCommentData]);

  const onSubmit: SubmitHandler<IformInputs> = async (data) => {
    setErrorMessage(null);
    const name = data.fullName.trim();
    const email = data.email.trim();

    try {
      // 1) create anonymous user (API may reject an existing email - that is fine,
      //    the existing user is fetched in step 2)
      const userFormData = new FormData();
      userFormData.append('name', name);
      userFormData.append('email', email);
      await fetch(`${BASE_URL}/anonymous-user`, {
        method: 'POST',
        body: userFormData,
      }).catch(() => null);

      // 2) get the user id
      const userRes = await fetch(
        `${BASE_URL}/anonymous-user?email=${encodeURIComponent(email)}`
      );
      if (!userRes.ok) throw new Error('We could not verify your details. Please try again.');
      const user = await userRes.json();
      if (!user?.user_id) throw new Error('We could not verify your details. Please try again.');

      // 3) post the comment
      const commentFormData = new FormData();
      commentFormData.append('user_id', String(user.user_id));
      commentFormData.append('comment', data.comment.trim());
      commentFormData.append('content_id', storyId.toString());

      const commentRes = await fetch(`${BASE_URL}/comments`, {
        method: 'POST',
        body: commentFormData,
      });
      if (!commentRes.ok) throw new Error('We could not post your comment. Please try again.');

      reset();
      setSubmissionSuccessful(true);
      loadCommentData();
    } catch (error: unknown) {
      setErrorMessage(
        error instanceof Error ? error.message : 'Something went wrong. Please try again.'
      );
    }
  };

  const handleModal = () => {
    setSubmissionSuccessful(false);
  };

  return (
    <section className={commentSection} aria-labelledby="comments-heading">
      <h2 id="comments-heading" className={heading}>
        Comments
      </h2>
      <div className={divider}>
        <div className={lineLeft} />
        <div className={box} />
        <div className={lineRight} />
      </div>

      <div className={formCard}>
        <h3 className={formTitle}>Leave a comment</h3>

        <form className={form} onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className={row}>
            <div className={field}>
              <label className={label} htmlFor="fullName">
                Full Name<span className={required}>*</span>
              </label>
              <input
                id="fullName"
                type="text"
                autoComplete="name"
                placeholder="Your name"
                className={inputField}
                aria-invalid={!!errors.fullName}
                {...register('fullName', {
                  required: 'Please enter your full name',
                  validate: (v) =>
                    (v.trim().length >= 3 && v.trim().length <= 20) ||
                    'Name must be 3-20 characters long',
                })}
              />
              {errors.fullName ? (
                <p className={errorText} role="alert">
                  {errors.fullName.message}
                </p>
              ) : (
                <p className={hint}>Must be 3-20 characters long.</p>
              )}
            </div>

            <div className={field}>
              <label className={label} htmlFor="email">
                Email ID<span className={required}>*</span>
              </label>
              <input
                id="email"
                type="email"
                inputMode="email"
                autoComplete="email"
                placeholder="you@example.com"
                className={inputField}
                aria-invalid={!!errors.email}
                {...register('email', {
                  required: 'Please enter your email',
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: 'Please provide a valid email address',
                  },
                })}
              />
              {errors.email ? (
                <p className={errorText} role="alert">
                  {errors.email.message}
                </p>
              ) : (
                <p className={hint}>Your email will not be published.</p>
              )}
            </div>
          </div>

          <div className={field}>
            <label className={label} htmlFor="comment">
              Comment<span className={required}>*</span>
            </label>
            <textarea
              id="comment"
              rows={5}
              placeholder="Share your thoughts..."
              className={textareaField}
              aria-invalid={!!errors.comment}
              {...register('comment', {
                required: 'Please enter a comment',
                validate: (v) =>
                  (v.trim().length >= 3 && v.trim().length <= 100) ||
                  'Comment must be 3-100 characters long',
              })}
            />
            <div className={fieldFooter}>
              {errors.comment ? (
                <p className={errorText} role="alert">
                  {errors.comment.message}
                </p>
              ) : (
                <p className={hint}>Must be 3-100 characters long.</p>
              )}
              <span className={counter}>{commentLength}/100</span>
            </div>
          </div>

          {errorMessage && (
            <p className={alertBox} role="alert">
              {errorMessage}
            </p>
          )}

          <button type="submit" className={submitBtn} disabled={isSubmitting}>
            {isSubmitting ? 'Posting…' : 'Post Comment'}
          </button>
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
        <h3 className={commentCount}>
          {commentData.length > 0
            ? `${commentData.length} Comment${commentData.length > 1 ? 's' : ''}`
            : 'No comments yet. Be the first to share your thoughts.'}
        </h3>
        {commentData.map((data) => (
          <div key={data.id} className={cardContainer}>
            <CommentCard commentData={data} />
          </div>
        ))}
      </div>
    </section>
  );
};

export default CommentSection;
