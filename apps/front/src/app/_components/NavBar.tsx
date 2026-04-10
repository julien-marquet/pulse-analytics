"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { ReactNode } from "react";

// type NavBarProps = {}

export default function NavBar() {
  const pathName = usePathname();
  console.log(pathName);
  return (
    <nav>
      <NavBarItem pathName="/overview" activePathName={pathName}>
        Overview
      </NavBarItem>
      <NavBarItem pathName="/events" activePathName={pathName}>
        Events
      </NavBarItem>
      <NavBarItem pathName="/stats" activePathName={pathName}>
        Stats
      </NavBarItem>
    </nav>
  );
}

type NavBarItemProps = {
  activePathName: string;
  pathName: string;
  children: ReactNode;
};
function NavBarItem({ children, activePathName, pathName }: NavBarItemProps) {
  const isActive = activePathName == pathName;

  return (
    <li>
      <Link className={isActive ? "bg-black" : "bg-white"} href={pathName}>
        {children}
      </Link>
    </li>
  );
}
