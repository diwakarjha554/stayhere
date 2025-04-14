import React from 'react';
import Signup_page from '@/components/auth/signup';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Signup - StayHere',
  description: 'Create a new account',
};

const page = () => {
  return <Signup_page />;
};

export default page;
