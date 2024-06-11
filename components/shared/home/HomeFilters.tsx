"use client";

import { Button } from "@/components/ui/button";
import React from "react";

import { HomePageFilters } from "@/constants";
import { usePathname } from "next/navigation";

const HomeFilters = () => {
  const [activeFilter, setActiveFilter] = React.useState("");
  const pathname = usePathname();

  return (
    <div
      className={`flex-wrap flex-row gap-3 md:flex hidden mt-3 ${
        pathname !== "/" && "md:hidden"
      }`}
    >
      {HomePageFilters.map((filter, index) => (
        <Button
          key={index}
          className={`body-medium text-light400_light500 shadow-none rounded-lg border-none px-4 py-2 sm:min-w-[170px] ${
            activeFilter === filter.name
              ? "text-primary-500 bg-primary-100"
              : "bg-light-800 text-light-500 hover:bg-light-800 dark:bg-dark-300 dark:hover:bg-dark-300"
          }`}
          onClick={() => {
            activeFilter === filter.name
              ? setActiveFilter("")
              : setActiveFilter(filter.name);
          }}
        >
          {filter.name}
        </Button>
      ))}
    </div>
  );
};

export default HomeFilters;
