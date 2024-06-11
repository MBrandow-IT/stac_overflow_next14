import React from "react";

interface TagProps {
  name: string; // The name of the tag
  description: string; // The description of the tag
  count: number; // The number of questions associated with the tag
}

const UserCard = ({ name, description, count }: TagProps) => {
  return (
    <div className="card-wrapper p-9 sm:px-8 rounded-[14px] flex flex-col shadow-light100_darknone w-[260px]">
      <div className="background-light800_dark400 w-fit rounded-sm px-5 py-1.5">
        <p className="paragraph-semibold text-dark300_light900">{name}</p>
      </div>
      <p className="body-regular text-dark500_light700 mt-2">{description}</p>
      <div className="mt-2">
        <span className="primary-text-gradient">{count}+ </span>
        <span className="text-dark400_light500">Questions</span>
      </div>
    </div>
  );
};

export default UserCard;
