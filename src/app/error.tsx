'use client';

// Error components must be Client Components

import { useEffect } from 'react';

const Error = ({ error, reset }: { error: Error; reset: () => void }) => {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: '2rem',
        height: 'calc(100svh - 16rem)',
      }}
    >
      <h2 style={{ fontSize: '3rem' }}>Something went wrong!</h2>
      <button
        style={{
          fontSize: '1.8rem',
          paddingTop: '.5rem',
          paddingBottom: '.5rem',
          paddingLeft: '2rem',
          paddingRight: '2rem',
          cursor: 'pointer',
        }}
        onClick={
          // Attempt to recover by trying to re-render the segment
          () => reset()
        }
      >
        Try again
      </button>
    </div>
  );
};

export default Error;
