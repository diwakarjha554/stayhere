import React from "react";
import Action from "./action";
import Navlinks from "./navlinks";
import Logo from "@/components/shared/logo";

const Header: React.FC = () => {
  return (
    <header
      className="shadow-b mx-auto px-4 py-4 flex items-center justify-between w-full"
      id="header"
    >
      <Logo />
      <Navlinks />
      <Action />
    </header>
  );
};

export default Header;
