import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import qs from "query-string";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getTimestamp = (createdAt: Date): string => {
  const now = new Date();
  const seconds = Math.floor((now.getTime() - createdAt.getTime()) / 1000);

  if (seconds < 60) {
    return `${seconds} seconds ago`;
  }

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) {
    return `${minutes} minutes ago`;
  }

  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return `${hours} hours ago`;
  }

  const days = Math.floor(hours / 24);
  if (days < 7) {
    return `${days} days ago`;
  }

  const weeks = Math.floor(days / 7);
  if (weeks < 4) {
    return `${weeks} weeks ago`;
  }

  const months = Math.floor(days / 30);
  if (months < 12) {
    return `${months} months ago`;
  }

  const years = Math.floor(days / 365);
  return `${years} years ago`;
};

export const formatLargeNumber = (number: number): string => {
  if (number >= 1_000_000) {
    return (number / 1_000_000).toFixed(1) + "m";
  } else if (number >= 1_000) {
    return (number / 1_000).toFixed(1) + "k";
  } else if (number === 0) {
    return "0";
  } else {
    return number.toString();
  }
};

export const getJoinedDateString = (date: Date) => {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const joinYear = date.getFullYear();
  const month = months[date.getMonth()];

  let yearString;

  if (currentYear === joinYear) {
    yearString = "this year";
  } else if (currentYear - joinYear === 1) {
    yearString = "last year";
  } else {
    yearString = `${currentYear - joinYear} years ago`;
  }

  return `Joined ${month} ${yearString}`;
};

interface UrlQueryParams {
  params: string;
  key: string;
  value: string | null;
}

export const formUrlQuery = ({ params, key, value }: UrlQueryParams) => {
  const currentUrl = qs.parse(params);

  currentUrl[key] = value;

  return qs.stringifyUrl(
    {
      url: window.location.pathname,
      query: currentUrl,
    },
    {
      skipNull: true,
    }
  );
};

interface RemoveUrlQueryParams {
  params: string;
  keysToRemove: string[];
}

export const removeKeysFromQuery = ({
  params,
  keysToRemove,
}: RemoveUrlQueryParams) => {
  const currentUrl = qs.parse(params);

  keysToRemove.forEach((key) => {
    delete currentUrl[key];
  });

  return qs.stringifyUrl(
    {
      url: window.location.pathname,
      query: currentUrl,
    },
    {
      skipNull: true,
    }
  );
};

// Example usage:
// const joinDate = new Date("2021-08-15");
// console.log(getJoinedDateString(joinDate)); // Output: "Joined August 3 years ago" (assuming the current year is 2024)
