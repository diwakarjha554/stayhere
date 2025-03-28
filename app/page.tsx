import Hero from "@/components/home/hero";
import SearchComponent from "@/components/home/search";
import Header from "@/components/shared/Header/header";
import React from "react";

const page: React.FC = () => {
  return (
    <main className="min-h-screen w-full">
      <Header />
      <Hero />
      <SearchComponent />
    </main>
  );
};

export default page;
