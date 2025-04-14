import React from 'react';
import Login_page from '@/components/auth/login';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Login - StayHere',
  description: 'Login to StayHere',
};

const page = () => {
  return <Login_page />;
};

export default page;
