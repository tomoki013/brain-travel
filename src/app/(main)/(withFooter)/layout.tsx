"use client";

import React from 'react';
import { usePathname } from 'next/navigation';
import Footer from '@/components/layout/Footer';
import Header from '@/components/layout/Header';

export default function WithFooterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  return (
    <>
      {pathname !== '/' && <Header />}
      {children}
      <Footer />
    </>
  );
}
