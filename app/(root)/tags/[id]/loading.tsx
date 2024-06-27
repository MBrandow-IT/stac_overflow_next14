import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

const Loading = () => {
  return (
    <section>
      <div className="flex w-full flex-col-reverse justify-between gap-4 sm:flex-row sm:items-center">
        <h1 className="h1-bold text-dark100_light900">Tag Questions</h1>
      </div>

      <div className="mt-11 flex justify-between gap-5 max-sm:flex-col mb-12">
        <Skeleton className="sm:flex-1 h-14" />
        <Skeleton className="min-h-[56px] sm:min-w-[170px]" />
      </div>

      <div className="flex flex-col gap-6">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((item) => (
          <Skeleton key={item} className="h-48 w-full rounded-xl" />
        ))}
      </div>
    </section>
  );
};

export default Loading;
