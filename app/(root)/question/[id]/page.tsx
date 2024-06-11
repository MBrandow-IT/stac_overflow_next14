import Metric from "@/components/shared/Metric";
import { getQuestionById } from "@/lib/actions/question.action";
import { getUserById } from "@/lib/actions/user.action";
import { getTimestamp } from "@/lib/utils";
import React from "react";

interface QuestionDetailsProps {
  params: {
    id: string;
  };
}

const QuestionDetails = async ({ params }: QuestionDetailsProps) => {
  const question = await getQuestionById({ questionId: params.id });
  const user = await getUserById({ userId: question.author });

  console.log(user);

  return (
    <div>
      <Metric
        imgUrl={user.picture}
        alt="User"
        value={user.username}
        title={` - asked ${getTimestamp(user.createdAt)}`}
        href={`/profile/${user._id}`}
        isAuthor
        textStyles="body-medium text-dark400_light700"
      />
      <h1 className="h1-bold">{question.title}</h1>
    </div>
  );
};

export default QuestionDetails;
