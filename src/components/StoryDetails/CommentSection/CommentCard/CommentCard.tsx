import React from 'react';

import { IComment } from '@/shared/types/comment';
import style from './commentCard.module.scss';

const { commentCard, header, userName, commentDate, comment } = style;

interface ICommentCard {
  commentData: IComment;
}

const CommentCard = ({ commentData }: ICommentCard) => {
  const originalTimestamp = commentData.created_at;

  // Parse the original timestamp string into a Date object
  const originalDate = new Date(originalTimestamp);

  // Extract individual components
  const year = originalDate.getFullYear();
  const month = (originalDate.getMonth() + 1).toString().padStart(2, '0'); // Adding 1 because months are 0-indexed
  const day = originalDate.getDate().toString().padStart(2, '0');
  const hours = originalDate.getUTCHours().toString().padStart(2, '0');
  const minutes = originalDate.getUTCMinutes().toString().padStart(2, '0');
  const seconds = originalDate.getUTCSeconds().toString().padStart(2, '0');

  // Create the formatted date string
  const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

  return (
    <div className={commentCard}>
      <div className={header}>
        <p className={userName}>{commentData.user_name}</p>
        <p className={commentDate}>{formattedDate}</p>
      </div>
      <div className={comment}>
        <p>{commentData.comment}</p>
      </div>
    </div>
  );
};

export default CommentCard;
