import Question from "@/components/forms/Question";
import { getQuestionById } from "@/lib/actions/question.action";
import { auth } from "@clerk/nextjs/server";
import React from "react";

interface EditQuestionProps {
  params: {
    id: string;
  };
}

const EditQuestion = async ({ params }: EditQuestionProps) => {
  const { userId } = auth();

  const { id } = params;

  const question = await getQuestionById({ questionId: id });

  if (question.author.clerkId !== userId) {
    return <div>You are not the uathor of this question</div>;
  }

  // console.log(question);

  return (
    <>
      <h1 className="h1-bold mb-9 text-dark100_light900">Edit Question</h1>
      {userId && (
        <div>
          <Question
            type="edit"
            mongoUserId={userId}
            questionTitle={question.title}
            questionContent={question.content}
            tags={question.tags.map((tag: any) => tag.name)}
            questionId={id}
          />
        </div>
      )}
    </>
  );
};

export default EditQuestion;
