import Link from "next/link";
import React from "react";
import RenderTag from "../shared/RenderTag";
import Metric from "../shared/Metric";

import { getTimestamp, formatLargeNumber } from "@/lib/utils";
import { auth } from "@clerk/nextjs/server";
import Image from "next/image";

interface QuestionCardProps {
  _id: string;
  title: string;
  tags?: {
    _id: string;
    name: string;
  }[];
  author: {
    _id: string;
    username: string;
    picture: string;
    clerkId: string;
  };
  upVotes: [];
  answers?: [];
  views?: string;
  createdAt: Date;
  answer?: boolean;
}

const QuestionCard = ({
  _id,
  title,
  tags,
  author,
  upVotes,
  answers,
  views,
  createdAt,
  answer,
}: QuestionCardProps) => {
  const { userId } = auth();
  return (
    <div className="card-wrapper p-9 sm:px-11 rounded-[10px]">
      <div className="flex flex-col-reverse items-start justify-between gap-5 sm:flex-row">
        <div className="w-full">
          <span className="subtle-regular text-dark400_light700 line-clamp-1 flex sm:hidden">
            {getTimestamp(createdAt)}
          </span>
          <div className="flex justify-between w-full">
            <Link href={`/question/${_id}`}>
              <h3 className="sm:h3-semibold base-semibold text-dark200_light900 line-clamp-1 flex-1">
                {title}
              </h3>
            </Link>
            {author.clerkId === userId && (
              <div className="flex gap-2">
                {!answer && (
                  <Image
                    src="/assets/icons/edit.svg"
                    alt="Edit"
                    width={16}
                    height={16}
                    className="cursor-pointer"
                  />
                )}
                <Image
                  src="/assets/icons/trash.svg"
                  alt="Delete"
                  width={16}
                  height={16}
                  className="cursor-pointer"
                />
              </div>
            )}
          </div>
        </div>
      </div>
      {tags && (
        <div className="mt-3.5 flex flex-wrap gap-2">
          {tags.map((tag) => (
            <RenderTag key={tag._id} _id={tag._id} name={tag.name} />
          ))}
        </div>
      )}
      <div className="flex-between mt-6 w-full flex-wrap gap-3">
        <Metric
          imgUrl={author.picture}
          alt="User"
          value={author.username}
          title={` - asked ${getTimestamp(createdAt)}`}
          href={`/profile/${author.clerkId}`}
          isAuthor
          textStyles="body-medium text-dark400_light700"
        />
        <Metric
          imgUrl="/assets/icons/like.svg"
          alt="Upvotes"
          value={formatLargeNumber(upVotes.length)}
          title=" Votes"
          textStyles="small-medium text-dark400_light800"
        />

        {answers && (
          <Metric
            imgUrl="/assets/icons/message.svg"
            alt="Answers"
            value={formatLargeNumber(answers.length)}
            title=" Answers"
            textStyles="small-medium text-dark400_light800"
          />
        )}
        {views && (
          <Metric
            imgUrl="/assets/icons/eye.svg"
            alt="eye"
            value={formatLargeNumber(Number(views))}
            title=" Views"
            textStyles="small-medium text-dark400_light800"
          />
        )}
      </div>
    </div>
  );
};

export default QuestionCard;
