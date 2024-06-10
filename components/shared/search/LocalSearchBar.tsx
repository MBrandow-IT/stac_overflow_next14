import React from "react";
import Image from "next/image";
import { Input } from "@/components/ui/input";

interface LocalSearchBarProps {
  route: string;
  imgSrc: string;
  iconPosition: string;
  placeholder: string;
  otherClasses?: string;
}

const LocalSearchBar = ({
  route,
  imgSrc,
  iconPosition,
  placeholder,
  otherClasses,
}: LocalSearchBarProps) => {
  return (
    <div
      className={`flex-1 background-light800_darkgradient relative flex min-h-[56px] grow items-center gap-4 rounded-xl px-4 w-full ${otherClasses}`}
    >
      {iconPosition === "left" && (
        <Image
          src={imgSrc}
          alt="Search icon"
          width={24}
          height={24}
          className="cursor-pointer"
        />
      )}
      <Input
        type="text"
        placeholder={placeholder}
        // value=""
        className="paragraph-regular no-focus placeholder:text-slate-500 background-light800_darkgradient border-none shadow-none outline-none"
      />
      {iconPosition === "right" && (
        <Image
          src={imgSrc}
          alt="Search icon"
          width={24}
          height={24}
          className="cursor-pointer"
        />
      )}
    </div>
  );
};

export default LocalSearchBar;
