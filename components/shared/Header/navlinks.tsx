"use client";

import React from "react";
import Link from "next/link";
import Data from "@/lib/data";
import { usePathname } from "next/navigation";

const Navlinks: React.FC = () => {
  const path = usePathname();
  return (
    <nav className="hidden md:flex items-center gap-6">
      {Data.navlinks.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={`font-semibold capitalize hover:text-blue-800 ${
            path === link.href ? "text-blue-800" : ""
          }`}
        >
          {link.title}
        </Link>
      ))}
    </nav>
  );
};

export default Navlinks;
