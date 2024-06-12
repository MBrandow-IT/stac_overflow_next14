import ParseHTML from "@/components/ParseHTML";
import Answer from "@/components/forms/Answer";
import AllAnswers from "@/components/shared/AllAnswers";
import Metric from "@/components/shared/Metric";
import RenderTag from "@/components/shared/RenderTag";
import Voting from "@/components/shared/Voting";
import { viewQuestion } from "@/lib/actions/interaction.action";
import { getQuestionById } from "@/lib/actions/question.action";
import { getUserIdWithClerkId } from "@/lib/actions/user.action";
import { formatLargeNumber, getTimestamp } from "@/lib/utils";
import { auth } from "@clerk/nextjs/server";
import Image from "next/image";
import Link from "next/link";
import React from "react";

interface QuestionDetailsProps {
  params: {
    id: string;
  };
}

const QuestionDetails = async ({ params }: QuestionDetailsProps) => {
  const { userId } = auth();

  const question = await getQuestionById({ questionId: params.id });
  const author = question.author;

  let mongoUserId;
  if (userId) {
    mongoUserId = await getUserIdWithClerkId(userId);
  }

  const questionId = params.id;

  console.log(question._id);
  const liked =
    mongoUserId !== undefined
      ? question.upvotes.includes(mongoUserId._id)
      : false;
  const saved =
    mongoUserId !== undefined
      ? mongoUserId.saved.some(
          (savedQuestion: { equals: (arg0: any) => any }) =>
            savedQuestion.equals(question._id)
        )
      : false;
  const disliked =
    mongoUserId !== undefined
      ? question.downvotes.includes(mongoUserId._id)
      : false;
  const upvotes = question.upvotes.length;
  const downvotes = question.downvotes.length;

  viewQuestion({
    questionId,
    userId: mongoUserId !== undefined ? mongoUserId._id : null,
  });

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
          <div className="flex justify-end">
            <Voting
              questionId={JSON.stringify(questionId)}
              userId={
                mongoUserId !== undefined
                  ? JSON.stringify(mongoUserId._id)
                  : undefined
              }
              upvotes={upvotes}
              downvotes={downvotes}
              liked={liked}
              saved={saved}
              disliked={disliked}
            />
          </div>
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
          value={formatLargeNumber(question.answers.length)}
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

      <div className="mt-8 flex flex-wrap gap-2">
        {question.tags.map((tag: any) => (
          <RenderTag
            _id={tag._id}
            key={tag._id}
            name={tag.name}
            showCount={false}
          />
        ))}
      </div>

      <AllAnswers
        questionId={JSON.stringify(questionId)}
        userId={
          mongoUserId !== undefined
            ? JSON.stringify(mongoUserId._id)
            : undefined
        }
      />

      <Answer
        questionId={JSON.stringify(questionId)}
        userId={
          mongoUserId !== undefined
            ? JSON.stringify(mongoUserId._id)
            : undefined
        }
      />
    </>
  );
};

export default QuestionDetails;
