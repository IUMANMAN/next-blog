'use client';

import BackToTop from './BackToTop';

export default function AppWrapper({ children }) {
  return (
    <>
      {children}
      <BackToTop />
    </>
  );
} 