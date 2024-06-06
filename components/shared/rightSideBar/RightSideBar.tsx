import React from "react";
import { topQuestions, tags } from "@/constants";
import Image from "next/image";
import Link from "next/link";
import RenderTag from "../RenderTag";

const RightSideBar = () => {
  return (
    <section className="custom-scrollbar background-light900_dark200 light-border sticky right-0 top-0 flex h-screen w-fit flex-col overflow-y-auto border-l p-6 pt-36 shadow-light-300 dark:shadow-none max-xl:hidden lg:w-[350px] gap-16">
      <div className="flex flex-col gap-7 text-dark500_light700 body-medium">
        <h3 className="h3-bold text-dark200_light900">Top Questions</h3>
        {topQuestions.slice(0, 5).map((question) => (
          <Link
            href={question.url}
            key={question.id}
            className="flex flex-row justify-between gap-6"
          >
            <p>{question.title}</p>
            <Image
              alt="left arrow"
              src="/assets/icons/chevron-right.svg"
              width={20}
              height={20}
              className="invert-colors"
            />
          </Link>
        ))}
      </div>
      <div className="flex flex-col gap-3">
        <h3 className="h3-bold text-dark200_light900">Popular Tags</h3>
        {tags.slice(0, 5).map((tag) => (
          <RenderTag
            key={tag._id}
            _id={tag._id}
            name={tag.name}
            totalQuestions={tag.totalQuestions}
            showCount
          />
        ))}
      </div>
    </section>
  );
};

export default RightSideBar;
