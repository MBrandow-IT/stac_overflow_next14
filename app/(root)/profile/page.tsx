import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

const ProfilePageRedirect = () => {
  const { userId } = auth();

  if (!userId) {
    redirect("/sign-in");
  }

  redirect(`/profile/${userId}`);
};

export default ProfilePageRedirect;
