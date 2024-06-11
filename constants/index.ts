import { SidebarLink } from "@/types";
export const themes = [
  { value: "light", label: "Light", icon: "/assets/icons/sun.svg" },
  { value: "dark", label: "Dark", icon: "/assets/icons/moon.svg" },
  { value: "system", label: "System", icon: "/assets/icons/computer.svg" },
];

export const sidebarLinks: SidebarLink[] = [
  {
    imgURL: "/assets/icons/home.svg",
    route: "/",
    label: "Home",
  },
  {
    imgURL: "/assets/icons/users.svg",
    route: "/community",
    label: "Community",
  },
  {
    imgURL: "/assets/icons/star.svg",
    route: "/collection",
    label: "Collections",
  },
  {
    imgURL: "/assets/icons/suitcase.svg",
    route: "/jobs",
    label: "Find Jobs",
  },
  {
    imgURL: "/assets/icons/tag.svg",
    route: "/tags",
    label: "Tags",
  },
  {
    imgURL: "/assets/icons/user.svg",
    route: "/profile",
    label: "Profile",
  },
  {
    imgURL: "/assets/icons/question.svg",
    route: "/ask-question",
    label: "Ask a question",
  },
];

export const BADGE_CRITERIA = {
  QUESTION_COUNT: {
    BRONZE: 10,
    SILVER: 50,
    GOLD: 100,
  },
  ANSWER_COUNT: {
    BRONZE: 10,
    SILVER: 50,
    GOLD: 100,
  },
  QUESTION_UPVOTES: {
    BRONZE: 10,
    SILVER: 50,
    GOLD: 100,
  },
  ANSWER_UPVOTES: {
    BRONZE: 10,
    SILVER: 50,
    GOLD: 100,
  },
  TOTAL_VIEWS: {
    BRONZE: 1000,
    SILVER: 10000,
    GOLD: 100000,
  },
};

export const AnswerFilters = [
  { name: "Highest Upvotes", value: "highestUpvotes" },
  { name: "Lowest Upvotes", value: "lowestUpvotes" },
  { name: "Most Recent", value: "recent" },
  { name: "Oldest", value: "old" },
];

export const CommunityFilters = [
  { name: "New Users", value: "new_users" },
  { name: "Old Users", value: "old_users" },
  { name: "Top Contributors", value: "top_contributors" },
];

export const UserFilters = [
  { name: "New Users", value: "new_users" },
  { name: "Old Users", value: "old_users" },
  { name: "Top Contributors", value: "top_contributors" },
];

export const QuestionFilters = [
  { name: "Most Recent", value: "most_recent" },
  { name: "Oldest", value: "oldest" },
  { name: "Most Voted", value: "most_voted" },
  { name: "Most Viewed", value: "most_viewed" },
  { name: "Most Answered", value: "most_answered" },
];

export const TagFilters = [
  { name: "Popular", value: "popular" },
  { name: "Recent", value: "recent" },
  { name: "Name", value: "name" },
  { name: "Old", value: "old" },
];

export const HomePageFilters = [
  { name: "Newest", value: "newest" },
  { name: "Recommended", value: "recommended" },
  { name: "Frequent", value: "frequent" },
  { name: "Unanswered", value: "unanswered" },
];

export const GlobalSearchFilters = [
  { name: "Question", value: "question" },
  { name: "Answer", value: "answer" },
  { name: "User", value: "user" },
  { name: "Tag", value: "tag" },
];

// top questions

export const topQuestions = [
  {
    id: 1,
    title: "How to use React Query?",
    tags: ["react", "react-query"],
    views: 1000,
    answers: 10,
    upvotes: 20,
    url: "/questions/1",
  },
  {
    id: 2,
    title: "What are the best practices for writing clean code in TypeScript?",
    tags: ["typescript", "clean-code"],
    views: 500,
    answers: 5,
    upvotes: 10,
    url: "/questions/2",
  },
  {
    id: 3,
    title: "How to implement authentication in a Next.js app?",
    tags: ["next.js", "authentication"],
    views: 800,
    answers: 8,
    upvotes: 15,
    url: "/questions/3",
  },
  {
    id: 4,
    title: "What are the advantages of using Redux in a React application?",
    tags: ["react", "redux"],
    views: 1200,
    answers: 12,
    upvotes: 25,
    url: "/questions/4",
  },
  {
    id: 5,
    title: "How to optimize performance in a React Native app?",
    tags: ["react-native", "performance"],
    views: 700,
    answers: 7,
    upvotes: 13,
    url: "/questions/5",
  },
  {
    id: 6,
    title: "What are the best practices for handling errors in Node.js?",
    tags: ["node.js", "error-handling"],
    views: 900,
    answers: 9,
    upvotes: 18,
    url: "/questions/6",
  },
  {
    id: 7,
    title: "How to deploy a Next.js app to a production server?",
    tags: ["next.js", "deployment"],
    views: 600,
    answers: 6,
    upvotes: 11,
    url: "/questions/7",
  },
  {
    id: 8,
    title: "What are the differences between REST and GraphQL?",
    tags: ["rest", "graphql"],
    views: 1000,
    answers: 10,
    upvotes: 20,
    url: "/questions/8",
  },
  {
    id: 9,
    title: "How to handle form validation in React?",
    tags: ["react", "form-validation"],
    views: 400,
    answers: 4,
    upvotes: 8,
    url: "/questions/9",
  },
  {
    id: 10,
    title: "What are the best practices for testing React components?",
    tags: ["react", "testing"],
    views: 1100,
    answers: 11,
    upvotes: 22,
    url: "/questions/10",
  },
];

export const tags = [
  {
    _id: "1",
    name: "react",
    totalQuestions: 100,
  },
  {
    _id: "2",
    name: "typescript",
    totalQuestions: 80,
  },
  {
    _id: "3",
    name: "next.js",
    totalQuestions: 70,
  },
  {
    _id: "4",
    name: "redux",
    totalQuestions: 60,
  },
  {
    _id: "5",
    name: "react-native",
    totalQuestions: 50,
  },
  {
    _id: "6",
    name: "node.js",
    totalQuestions: 40,
  },
  {
    _id: "7",
    name: "rest",
    totalQuestions: 30,
  },
  {
    _id: "8",
    name: "graphql",
    totalQuestions: 20,
  },
  {
    _id: "9",
    name: "form-validation",
    totalQuestions: 10,
  },
  {
    _id: "10",
    name: "testing",
    totalQuestions: 5,
  },
];
