import React from "react";

import Profile from "@/components/forms/Profile";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getUserByClerkId } from "@/lib/actions/user.action";

const EditProfile = async () => {
  const { userId } = auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const user = await getUserByClerkId(userId);

  if (!user) {
    redirect("/community");
  }

  console.log(user);

  return (
    <div>
      <h1 className="h1-bold text-dark100_light900 mb-8">Edit Profile</h1>
      <Profile
        username={user?.user.username}
        clerkId={userId}
        name={user.user.name}
        location={user.user.location}
        bio={user.user.bio}
        portfolio={user.user.portfolioWebsite}
      />
    </div>
  );
};

export default EditProfile;
