import React from "react";
import Link from "next/link";
import Image from "next/image";

const Logo: React.FC = () => {
  return (
    <Link href="/">
      <Image
        src="/logofull.svg"
        alt="Logo"
        width={1000000}
        height={1000000}
        className="w-36 h-10 select-none"
      />
    </Link>
  );
};

export default Logo;
