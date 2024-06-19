"use client";

import React from "react";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "../ui/form";
import { useForm } from "react-hook-form";
import { AnswerSchema } from "@/lib/validations";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Editor } from "@tinymce/tinymce-react";
import { useTheme } from "@/context/theme";
import { Button } from "../ui/button";
import Image from "next/image";
import { createAnswer } from "@/lib/actions/asnwer.action";

interface Props {
  questionId: string;
  question: string;
  userId?: string;
}

const Answer = ({ questionId, userId, question }: Props) => {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isSubmittingAI, setIsSubmittingAI] = React.useState(false);
  // const [aiAnswer, setAiAnswer] = React.useState("");
  const editorRef = React.useRef(null);
  const { mode } = useTheme() || {};

  const form = useForm<z.infer<typeof AnswerSchema>>({
    resolver: zodResolver(AnswerSchema),
    defaultValues: {
      answer: "",
    },
  });

  async function handleCreateAnswer(values: z.infer<typeof AnswerSchema>) {
    setIsSubmitting(true);

    try {
      if (!userId) {
        return;
      }
      await createAnswer({
        content: values.answer,
        author: JSON.parse(userId),
        question: JSON.parse(questionId),
        path: "/question",
      });

      form.reset();

      if (editorRef.current) {
        const editor = editorRef.current as any;

        editor.setContent("");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsSubmitting(false);
    }
  }

  const generateAIAnswer = async () => {
    if (!userId) return;

    setIsSubmittingAI(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/chatgpt`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ question }),
        }
      );

      const aiAnswer = await response.json();

      const formattedAnswer = aiAnswer.answer.replace(/\n/g, "<br />");

      if (editorRef.current) {
        const editor = editorRef.current as any;

        editor.setContent(formattedAnswer);
      }
    } catch (error) {
      console.log(error);
      throw error;
    } finally {
      setIsSubmittingAI(false);
    }
  };

  return (
    <div>
      {userId ? (
        <>
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center sm:gap-2 mt-4">
            <h4 className="paragraph-semibold text-dark400_light800">
              Write your answer here
            </h4>
            {isSubmittingAI ? (
              <>
                <Button
                  className="btn light-border-2 gap-1.5 rounded-md px-4 py-2.5 text-primary-500 shadow-none dark:text-primary-500"
                  disabled
                >
                  <Image
                    alt="star"
                    src="/assets/icons/stars.svg"
                    width={12}
                    height={12}
                    className="object-contain"
                  />
                  Generating...
                </Button>
              </>
            ) : (
              <>
                <Button
                  className="btn light-border-2 gap-1.5 rounded-md px-4 py-2.5 text-primary-500 shadow-none dark:text-primary-500"
                  onClick={() => generateAIAnswer()}
                >
                  <Image
                    alt="star"
                    src="/assets/icons/stars.svg"
                    width={12}
                    height={12}
                    className="object-contain"
                  />
                  Generate an AI Answer
                </Button>
              </>
            )}
          </div>
          <Form {...form}>
            <form
              className="mt-4 flex w-full flex-col gap-10"
              onSubmit={form.handleSubmit(handleCreateAnswer)}
            >
              <FormField
                control={form.control}
                name="answer"
                render={({ field }) => (
                  <FormItem className="flex w-full flex-col gap-3">
                    <FormControl className="mt-3.5">
                      <Editor
                        apiKey={process.env.NEXT_PUBLIC_TINY_EDITER_API_KEY}
                        onInit={(_evt, editor) => {
                          // @ts-ignore
                          editorRef.current = editor;
                        }}
                        onBlur={field.onBlur}
                        onEditorChange={(content) => field.onChange(content)}
                        init={{
                          height: 350,
                          menubar: false,
                          plugins: [
                            "advlist",
                            "autolink",
                            "lists",
                            "link",
                            "image",
                            "charmap",
                            "preview",
                            "anchor",
                            "searchreplace",
                            "visualblocks",
                            "codesample",
                            "fullscreen",
                            "insertdatetime",
                            "media",
                            "table",
                            "help",
                          ],
                          toolbar:
                            "undo redo | " +
                            "codesample | bold italic forecolor | alignleft aligncenter " +
                            "alignright alignjustify | bullist numlist ",
                          content_style:
                            "body { font-family:Inter; font-size:16px }",
                          skin: mode === "dark" ? "oxide-dark" : "oxide",
                          content_css: mode === "dark" ? "dark" : "light",
                        }}
                      />
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />
              <div className="flex justify-end">
                <Button
                  className="primary-gradient w-fit text-white"
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Submitting..." : "Submit"}
                </Button>
              </div>
            </form>
          </Form>
        </>
      ) : (
        <div>Sign in to answer the question</div>
      )}
    </div>
  );
};

export default Answer;
