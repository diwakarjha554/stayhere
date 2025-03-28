"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import Data from "@/lib/data"; // Adjust the import path as needed

const Action: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  return (
    <div className="flex flex-row-reverse items-center gap-3">
      <div className="md:hidden transition" onClick={toggleMenu}>
        {isMenuOpen ? <X size={36} /> : <Menu size={32} />}
      </div>
      {isMenuOpen && (
        <div className="fixed inset-y-0 right-0 bg-white z-50 w-3/4 max-w-sm flex flex-col p-6 gap-4 shadow-lg">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">Menu</h2>
            <button onClick={toggleMenu}>
              <X size={24} />
            </button>
          </div>
          <div className="flex flex-col gap-3">
            {Data.navlinks.map((link, index) => (
              <Link
                key={index}
                href={link.href}
                className="p-2 rounded hover:bg-gray-100"
              >
                {link.title}
              </Link>
            ))}
          </div>
          <div className="mt-auto">
            <Link
              href="/login"
              className="block bg-blue-900 hover:bg-blue-800 rounded text-white text-center px-4 py-2 transition"
            >
              Login
            </Link>
          </div>
        </div>
      )}
      <Link
        href="/login"
        className="hidden md:block bg-blue-900 hover:bg-blue-800 rounded text-white px-2.5 py-1 sm:px-3 sm:py-1.5 md:px-4 md:py-2 transition"
      >
        Login
      </Link>
    </div>
  );
};

export default Action;
