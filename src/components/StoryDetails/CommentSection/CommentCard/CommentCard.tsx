import React from 'react';

import { IComment } from '@/shared/types/comment';
import style from './commentCard.module.scss';

const { commentCard, avatar, body, header, userName, commentDate, comment } =
  style;

interface ICommentCard {
  commentData: IComment;
}

const CommentCard = ({ commentData }: ICommentCard) => {
  const date = new Date(commentData.created_at);
  const formattedDate = Number.isNaN(date.getTime())
    ? ''
    : date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        timeZone: 'Asia/Dhaka',
      });

  const initial = commentData.user_name?.trim().charAt(0).toUpperCase() || '?';

  return (
    <article className={commentCard}>
      <span className={avatar} aria-hidden="true">
        {initial}
      </span>
      <div className={body}>
        <div className={header}>
          <h3 className={userName}>{commentData.user_name}</h3>
          {formattedDate && (
            <time className={commentDate} dateTime={commentData.created_at}>
              {formattedDate}
            </time>
          )}
        </div>
        <p className={comment}>{commentData.comment}</p>
      </div>
    </article>
  );
};

export default CommentCard;