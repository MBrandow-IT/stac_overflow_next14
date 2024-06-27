"use client";

import React from "react";

import Image from "next/image";
import { deleteQuestion } from "@/lib/actions/question.action";
import { deleteAnswer } from "@/lib/actions/asnwer.action";
import { usePathname, useRouter } from "next/navigation";

interface Props {
  type: "question" | "answer";
  itemId: string;
}

const EditDeleteAction = ({ type, itemId }: Props) => {
  const pathname = usePathname();
  const router = useRouter();

  const handleDelete = async () => {
    if (type === "question") {
      await deleteQuestion({ questionId: JSON.parse(itemId), path: pathname });
    } else {
      await deleteAnswer({ answerId: JSON.parse(itemId), path: pathname });
    }
  };

  const handleEdit = () => {
    router.push(`/question/edit/${JSON.parse(itemId)}`);
  };

  return (
    <div className="flex gap-2">
      {type !== "answer" && (
        <Image
          src="/assets/icons/edit.svg"
          alt="Edit"
          width={16}
          height={16}
          className="cursor-pointer object-contain"
          onClick={handleEdit}
        />
      )}
      <Image
        src="/assets/icons/trash.svg"
        alt="Delete"
        width={16}
        height={16}
        className="cursor-pointer object-contain"
        onClick={handleDelete}
      />
    </div>
  );
};

export default EditDeleteAction;
