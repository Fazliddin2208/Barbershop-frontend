"use client"

import Link from "next/link";
import React, { useEffect, useState } from "react";
import Logo from "@/public/assets/images/logo.png";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function MenuComponent() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className={cn("flex items-center justify-between fixed top-0 w-full px-20 z-10 pb-6 pt-4",
      isScrolled ? "border-b border-border" : ""
    )}>
      <Link href={'/'}><Image src={Logo} alt="logo" width={100} height={100} className="w-16 h-16" /></Link>
      <ul className="flex items-center gap-5 text-white">
        <li className="group">
          <Link href="/">Home</Link>
        </li>
        <li className="group">
          <Link href="/">About</Link>
        </li>
        <li className="group">
          <Link href="/">Services</Link>
        </li>
        <li className="group">
          <Link href="/">Prices</Link>
        </li>
        <li className="group">
          <Link href="/">Contact</Link>
        </li>
        <li className="group">
          <Link href="/">Pages</Link>
        </li>
      </ul>
      <div className="flex items-center gap-5">
        <Button>Band qilish</Button>
      </div>
    </div>
  );
}
