import Image from "next/image";
import React from "react";
import { Badge } from "../ui/badge";

interface UserProps {
  name: string;
  username: string;
  picture: string;
  tags: { _id: string; name: string; count: number }[];
}

const UserCard = ({ username, name, picture, tags }: UserProps) => {
  const sortedTags = tags.sort((a, b) => b.count - a.count);
  const topThreeTags = sortedTags.slice(0, 3);

  return (
    <div className="card-wrapper p-9 sm:px-4 rounded-[14px] flex flex-col items-center shadow-light100_darknone w-[260px]">
      <Image
        alt="User Image"
        className="rounded-full"
        src={picture}
        width={100}
        height={100}
      />
      <h3 className="h3-bold text-dark200_light900 line-clamp-1 mt-4">
        {name === undefined || name === "null" ? username : name}
      </h3>
      <p className="body-regular text-dark500_light500 mt-2">@{username}</p>
      <div className="mt-2">
        {topThreeTags.map((tag, index) => (
          <Badge
            key={index}
            className="subtle-medium background-light800_dark300 text-light400_light500 rounded-md border-none px-4 py-2 uppercase mx-1 inline-flex"
          >
            {tag.name === undefined
              ? "No Tags Yet"
              : tag.name.length > 6
              ? `${tag.name.slice(0, 4)}..`
              : tag.name}
          </Badge>
        ))}
      </div>
    </div>
  );
};

export default UserCard;
