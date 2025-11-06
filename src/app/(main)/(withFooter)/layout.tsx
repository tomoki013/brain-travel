"use client";

import React from 'react';
import { usePathname } from 'next/navigation';
import Footer from '@/components/layout/Footer';

export default function WithFooterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  return (
    <>
      {children}
      <Footer />
    </>
  );
}
