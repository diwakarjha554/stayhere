import React from 'react';
import { Metadata } from 'next';
import Dashboard from '@/components/admin/dashboard';

export const metadata: Metadata = {
  title: 'Dashboard - StayHere',
  description: 'Dashboard page for StayHere admin panel',
};

const page = () => {
  return <Dashboard />;
};

export default page;
