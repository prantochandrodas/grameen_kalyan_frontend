'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

import { IMAGE_BASE_URL } from '@/config';

import { IBoardMemberData } from './boardMember.type';
import style from './boardMemberCard.module.scss';

const {
  memberCard,
  contentContainer,
  descContainer,
  memberName,
  desig,
  imageContainer,
  img,
  reverseDescContainer,
  reverseMemberCard,
  reverseImageContainer,
} = style;

interface IBoardMemberCardProps {
  memberData: IBoardMemberData;
}

const BoardMemberCard = ({ memberData }: IBoardMemberCardProps) => {
  return (
    <>
      {memberData.reverse ? (
        <div className={`${memberCard} ${reverseMemberCard}`}>
          <div className={`${imageContainer} ${reverseImageContainer}`}>
            <Image
              className={img}
              src={IMAGE_BASE_URL + memberData.image}
              width={1000}
              height={1000}
              priority
              alt="Yunus"
            />
          </div>
          <div className={contentContainer}>
            <motion.div
              style={{ position: 'relative' }}
              initial={{ opacity: 0, bottom: '-5rem' }}
              whileInView={{ opacity: 1, bottom: '0' }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className={`${descContainer} ${reverseDescContainer}`}
            >
              <p>{memberData.description}</p>
            </motion.div>
            <motion.h5
              style={{ position: 'relative' }}
              initial={{ opacity: 0, bottom: '-5rem' }}
              whileInView={{ opacity: 1, bottom: '0' }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className={memberName}
            >
              {memberData.name}
            </motion.h5>
            <motion.span
              style={{ position: 'relative' }}
              initial={{ opacity: 0, bottom: '-5rem' }}
              whileInView={{ opacity: 1, bottom: '0' }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className={desig}
            >
              {memberData.designation}
            </motion.span>
          </div>
        </div>
      ) : null}
      {!memberData.reverse ? (
        <div className={memberCard}>
          <div className={contentContainer}>
            <motion.div
              style={{ position: 'relative' }}
              initial={{ opacity: 0, bottom: '-5rem' }}
              whileInView={{ opacity: 1, bottom: '0' }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className={`${descContainer} ${reverseDescContainer}`}
            >
              <p>{memberData.description}</p>
            </motion.div>
            <motion.h5
              style={{ position: 'relative' }}
              initial={{ opacity: 0, bottom: '-5rem' }}
              whileInView={{ opacity: 1, bottom: '0' }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className={memberName}
            >
              {memberData.name}
            </motion.h5>
            <motion.span
              style={{ position: 'relative' }}
              initial={{ opacity: 0, bottom: '-5rem' }}
              whileInView={{ opacity: 1, bottom: '0' }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className={desig}
            >
              {memberData.designation}
            </motion.span>
          </div>
          <div className={imageContainer}>
            <Image
              className={img}
              src={IMAGE_BASE_URL + memberData.image}
              width={1000}
              height={1000}
              priority
              alt="Yunus"
            />
          </div>
        </div>
      ) : null}
    </>
  );
};

export default BoardMemberCard;
