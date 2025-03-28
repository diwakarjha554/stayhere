import React from "react";
import Link from "next/link";
import Image from "next/image";

const Hero: React.FC = () => {
  return (
    <div className="relative h-[600px] w-full">
      <Image
        src="/hero.jpg"
        alt="Beautiful vacation destination"
        fill
        className="object-cover"
        priority
      />
      <div className="absolute inset-0 bg-black/70" />
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
          Find Your Perfect Getaway
        </h1>
        <p className="text-xl text-white mb-8 max-w-2xl">
          Discover unique vacation rentals for any style, budget, or adventure
        </p>
        <Link href="/signup">
          <div className="rounded bg-blue-900 cursor-pointer text-white px-4 py-2 hover:bg-blue-800 transition shadow-white/10 shadow">
            Start Exploring
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Hero;
