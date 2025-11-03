import React from 'react';
import Footer from '@/components/layout/Footer';
import Header from '@/components/layout/Header';

export default function WithFooterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
}
