import ParseHTML from "@/components/ParseHTML";
import Metric from "@/components/shared/Metric";
import { getQuestionById } from "@/lib/actions/question.action";
import { formatLargeNumber, getTimestamp } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import React from "react";

interface QuestionDetailsProps {
  params: {
    id: string;
  };
}

const QuestionDetails = async ({ params }: QuestionDetailsProps) => {
  const question = await getQuestionById({ questionId: params.id });
  const author = question.author;

  return (
    <>
      <div className="flex-start w-full flex-col">
        <div className="flex w-full flex-col-reverse justify-between  gap-5 sm:flex-row sm:items-center sm:gap-2">
          <Link
            href={`/profile/${author.clerkId}`}
            className="flex items-center justify-start gap-1"
          >
            <Image
              alt="User Image"
              src={author.picture}
              className="rounded-full"
              width={22}
              height={22}
            />
            <p className="paragraph-semibold text-dark300_light700">
              {author.username}
            </p>
          </Link>
          <div className="flex justify-end">VOTING</div>
        </div>
        <h2 className="h2-semibold text-dark200_light900 mt-3.5 w-full text-left">
          {question.title}
        </h2>
      </div>

      <div className="mb-8 mt-5 flex flex-wrap gap-4">
        <Metric
          imgUrl="/assets/icons/clock.svg"
          alt="clock icon"
          value={`Asked ${getTimestamp(question.createdAt)}`}
          title=""
          textStyles="small-medium text-dark400_light800"
        />
        <Metric
          imgUrl="/assets/icons/message.svg"
          alt="Answers"
          value={formatLargeNumber(Number(question.answers))}
          title=" Answers"
          textStyles="small-medium text-dark400_light800"
        />
        <Metric
          imgUrl="/assets/icons/eye.svg"
          alt="eye"
          value={formatLargeNumber(Number(question.views))}
          title=" Views"
          textStyles="small-medium text-dark400_light800"
        />
      </div>

      <ParseHTML data={question.content} />
    </>
  );
};

export default QuestionDetails;
