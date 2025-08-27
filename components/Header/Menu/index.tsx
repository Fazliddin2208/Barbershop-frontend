import Link from "next/link";
import React from "react";
import Logo from "@/public/assets/images/logo.svg";
import Bar from "@/public/assets/images/bar.svg";
import Image from "next/image";
import {Bars2Icon, MagnifyingGlassIcon, ShoppingBagIcon} from "@heroicons/react/16/solid";

type Props = {};

export default function MenuComponent({}: Props) {
  return (
    <div className="flex items-center justify-between">
      <ul className="flex items-center gap-5">
        <li className="group">
          <Link href="/">Home</Link>
          <div className="w-0 group-hover:w-[85%] duration-75 ease-in relative h-0.5 bg-[#BE8F45] after:content-[''] after:absolute after:w-2 after:h-0.5 after:bg-black after:bottom-0 after:right-1.5 after:transition-all after:duration-300" />
        </li>
        <li className="group">
          <Link href="/">Pages</Link>
          <div className="w-0 group-hover:w-[85%] duration-75 ease-in relative h-0.5 bg-[#BE8F45] after:content-[''] after:absolute after:w-2 after:h-0.5 after:bg-black after:bottom-0 after:right-1.5 after:transition-all after:duration-300" />
        </li>
        <li className="group">
          <Link href="/">Services</Link>
          <div className="w-0 group-hover:w-[85%] duration-75 ease-in relative h-0.5 bg-[#BE8F45] after:content-[''] after:absolute after:w-2 after:h-0.5 after:bg-black after:bottom-0 after:right-1.5 after:transition-all after:duration-300" />
        </li>
        <li className="group">
          <Link href="/">Blog</Link>
          <div className="w-0 group-hover:w-[85%] duration-75 ease-in relative h-0.5 bg-[#BE8F45] after:content-[''] after:absolute after:w-2 after:h-0.5 after:bg-black after:bottom-0 after:right-1.5 after:transition-all after:duration-300" />
        </li>
        <li className="group">
          <Link href="/">Shop</Link>
          <div className="w-0 group-hover:w-[85%] duration-75 ease-in relative h-0.5 bg-[#BE8F45] after:content-[''] after:absolute after:w-2 after:h-0.5 after:bg-black after:bottom-0 after:right-1.5 after:transition-all after:duration-300" />
        </li>
      </ul>

      <Image src={Logo} alt="logo" />

      <div className="flex items-center gap-5">
        <MagnifyingGlassIcon width={22} height={22} className="cursor-pointer" />
        <ShoppingBagIcon width={22} height={22} className="cursor-pointer" />
        <Image src={Bar} alt="hamburger menu" className="cursor-pointer" />
      </div>
    </div>
  );
}
