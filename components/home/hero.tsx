import Image from 'next/image';
import React from 'react';
import { Search } from './search';

const Hero = () => {
  return (
    <section className="relative h-[600px] flex items-center justify-center">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-black/50 z-10" />
        <Image
          src="/heroBg.avif"
          alt="Hero Image"
          fill
          className="object-cover object-center z-0"
          priority
        />
      </div>
      <div className="relative z-20 px-4 md:px-6">
        <div className=" mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Find Your Perfect Getaway
          </h1>
          <p className="text-xl text-white/90 mb-8">
            Discover and book unique accommodations around the world
          </p>
          <Search />
        </div>
      </div>
    </section>
  );
};

export default Hero;
