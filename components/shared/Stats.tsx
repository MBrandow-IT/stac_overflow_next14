import React from "react";
import Image from "next/image";

interface StatsProps {
  questions: number;
  answers: number;
}

const Stats = ({ questions, answers }: StatsProps) => {
  return (
    <div className="mt-10">
      <h4 className="h3-semibold text-dark200_light900">Stats</h4>
      <div className="mt-5 grid grid-cols-1 gap-5 xs:grid-cols-2 md:grid-cols-4">
        <div className="light-border background-light900_dark300 flex flex-wrap items-center justify-start gap-4 rounded-md border p-6 shadow-light-300 dark:shadow-dark-200">
          <div className="flex flex-col gap-1">
            <p className="paragraph-semibold text-dark200_light900">
              {questions}
            </p>
            <p className="body-medium text-dark400_light700">Questions</p>
          </div>
          <div className="flex flex-col gap-1">
            <p className="paragraph-semibold text-dark200_light900">
              {answers}
            </p>
            <p className="body-medium text-dark400_light700">Answers</p>
          </div>
        </div>
        <div className="light-border background-light900_dark300 flex flex-wrap items-center justify-start gap-4 rounded-md border p-6 shadow-light-300 dark:shadow-dark-200">
          <Image
            src="/assets/icons/gold-medal.svg"
            alt="medal icon"
            width={40}
            height={50}
          />
          <div className="flex flex-col gap-1">
            <p className="paragraph-semibold text-dark200_light900">1</p>
            <p className="body-medium text-dark400_light700">Gold Badges</p>
          </div>
        </div>
        <div className="light-border background-light900_dark300 flex flex-wrap items-center justify-start gap-4 rounded-md border p-6 shadow-light-300 dark:shadow-dark-200">
          <Image
            src="/assets/icons/silver-medal.svg"
            alt="medal icon"
            width={40}
            height={50}
          />
          <div className="flex flex-col gap-1">
            <p className="paragraph-semibold text-dark200_light900">1</p>
            <p className="body-medium text-dark400_light700">Silver Badges</p>
          </div>
        </div>
        <div className="light-border background-light900_dark300 flex flex-wrap items-center justify-start gap-4 rounded-md border p-6 shadow-light-300 dark:shadow-dark-200">
          <Image
            src="/assets/icons/bronze-medal.svg"
            alt="medal icon"
            width={40}
            height={50}
          />
          <div className="flex flex-col gap-1">
            <p className="paragraph-semibold text-dark200_light900">0</p>
            <p className="body-medium text-dark400_light700">Bronze Badges</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Stats;
