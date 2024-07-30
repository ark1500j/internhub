"use client";
import React, { useState } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import { Separator } from "../ui/separator";
import { format } from "date-fns";
import { Company, Internship } from "@prisma/client";
import { ScrollArea } from "../ui/scroll-area";
import { Button } from "../ui/button";
import { ApplicationModal } from "../modals/applicationmodal";
import useSWR from "swr";
import { Skeleton } from "../ui/skeleton";

interface PostDisplayProps {
  post: Internship | null;
}

export default function PostDetail({ post }: PostDisplayProps) {
  const { data, isLoading, error } = useSWR(
    `/api/internships/${post?.posted_by}`,
    async (url) => {
      const response = await fetch(url);
      return response.json();
    }
  );
  const [modal, setModal] = useState(false);
  function capitalizeFirstLetter(string: string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
  const parsedProgramme = post?.programme ? JSON.parse(post.programme) : [];
  if (!post)
    return (
      <div className="border-neutral-300 w-[50vw] rounded-sm h-[85vh] hidden border md:flex flex-col sticky top-0">
        <div className=" p-3 w-full bg-white sticky">
          <div className="h-36">
            <Skeleton className="h-[80%] w-full rounded-xl" />
            <Skeleton className="h-[10%] mt-2 w-full rounded-xl" />
            <Skeleton className="h-[10%] mt-2 w-[80%] rounded-xl" />
          </div>
        </div>
        <div className="h-96 p-3">
          <Skeleton className="h-full w-full rounded-xl" />
        </div>
      </div>
    );

  return (
    <div className="border-neutral-300 w-[50vw] rounded-sm h-[85vh] border hidden md:flex flex-col sticky top-0">
      <div className=" p-4 border-b border-neutral-300 shadow-sm  w-full bg-white sticky">
        <div className="flex items-baseline">
          <div className="text-gray-600 text-2xl font-semibold mr-auto ">
            {post?.title && capitalizeFirstLetter(post?.title)}
          </div>
          <div className="text-gray-500 text-xs font-medium tracking-wide">
            {data && data.name}
          </div>
          <div className="ml-2 text-yellow-400 text-xs font-semibold gap-2">
            4.2 ★
          </div>
        </div>
        <div className="">
          Expected applicants,{" "}
          <span className="text-yellow-400 ">{post?.expected_applicants}</span>{" "}
        </div>
        <div className="flex items-baseline gap-3">
          <div className="uppercase text-gray-600 text-sm font-semibold ">
            {post?.location},
          </div>
          <div className="text-gray-600 text-sm font-semibold ">
            {post?.type}
          </div>
        </div>
        <Button onClick={() => setModal(true)} className="bg-purple-600 m-1">
          Apply now
        </Button>
      </div>
      <ScrollArea className="px-6">
        <div className="">
          <h3 className="py-2 text-neutral-500 font-semibold  text-xl">
            Duration
          </h3>{" "}
          <span>{post.duration}</span>
        </div>

        <h3 className="py-2 text-neutral-500 font-semibold  text-xl">
          Prefered programmes
        </h3>
        <div className="text-sm text-gray-700 flex gap-3">
          {parsedProgramme &&
            parsedProgramme.map(
              (programme: { label: string; value: string }, index: number) => (
                <div
                  key={index}
                  className="border rounded-full px-2 bg-purple-200 py-1 text-xs"
                >
                  {programme.value}
                </div>
              )
            )}
        </div>
        <h3 className="py-2 text-neutral-500 text-xl font-semibold ">
          Requirements
        </h3>
        <div
          className="rendered-content text-neutral-500"
          dangerouslySetInnerHTML={{
            __html: `${post?.requirements}`,
          }}
        />
        <h3 className="py-2 text-neutral-500 text-xl font-semibold">
          Full Description
        </h3>
        <div
          className="rendered-content text-sm text-neutral-500"
          dangerouslySetInnerHTML={{
            __html: `${post?.description}`,
          }}
        />
      </ScrollArea>
      <ApplicationModal
        isModalOpen={modal}
        handleCloseModal={() => {
          setModal(false);
        }}
        postid={post && post?.id}
      />
    </div>
  );
}
