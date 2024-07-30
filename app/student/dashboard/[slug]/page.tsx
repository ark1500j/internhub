"use client";
import Link from "next/link";
import React, { useState } from "react";
import useSWR from "swr";
import { format, parseISO } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ApplicationModal } from "@/components/modals/applicationmodal";
import { Toaster } from "react-hot-toast";

export default function Page({ params }: { params: { slug: string } }) {
  const [modal, setModal] = useState(false);
  const {
    data: internshipData,
    isLoading,
    error,
  } = useSWR(`/api/internships`, async (url) => {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: `${params.slug}` }),
    });
    return response.json();
  });

  // Parse and format the dates
  const formattedStartDate = internshipData?.start_date
    ? format(parseISO(internshipData.start_date), "MMM d, yyyy")
    : "Not specified";
  const formattedEndDate = internshipData?.end_date
    ? format(parseISO(internshipData.end_date), "MMM d, yyyy")
    : "Not specified";

  const parsedProgramme = internshipData?.programme
    ? JSON.parse(internshipData.programme)
    : [];

  return (
    <div className="flex justify-center items-center flex-col">
      <div className="w-full h-14 bg-purple-500 sticky top-0 flex gap-4 items-center text-white px-12 cursor-pointer">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <a
          href={"/student/dashboard"}
          className="flex items-center text-white cursor-pointer"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.svg" alt="logo" /> Internhub
        </a>
        <Link href={"/student/dashboard/applications"} className="text-sm">
          Applications
        </Link>
      </div>
      <div className="md:w-1/2">
        {isLoading && (
          <div className=" w-[50vw] rounded-sm h-full hidden  md:flex flex-col sticky top-0">
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
        )}
        {internshipData && (
          <>
            <div className="bg-white rounded-lg pt-10">
              <div className="flex items-baseline">
                <div className="text-gray-600 text-lg font-semibold mr-auto">
                  {internshipData.title}
                </div>
                <div className="text-gray-500 text-xs font-medium tracking-wide">
                  {internshipData.representative?.company?.name}
                </div>
                <div className="ml-2 text-yellow-400 text-xs font-semibold">
                  ★
                </div>
              </div>
              <div className="text-gray-600 text-lg font-semibold mr-auto">
                Duration: {internshipData.duration}
              </div>
              <Button
                onClick={() => {
                  setModal(true);
                }}
              >
                Apply
              </Button>
              <div className="h-6"></div>
              <h3 className="py-2 text-neutral-500 font-semibold text-xl">
                Preferred programmes
              </h3>
              <div className="text-sm text-gray-700 flex gap-3">
                {parsedProgramme &&
                  parsedProgramme.map(
                    (
                      programme: { label: string; value: string },
                      index: number
                    ) => (
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
                  __html: `${internshipData.requirements}`,
                }}
              />
              <h3 className="py-2 text-neutral-500 text-xl font-semibold">
                Full Description
              </h3>
              <div
                className="rendered-content text-sm text-neutral-500"
                dangerouslySetInnerHTML={{
                  __html: `${internshipData.description}`,
                }}
              />
            </div>
            <ApplicationModal
              isModalOpen={modal}
              handleCloseModal={() => {
                setModal(false);
              }}
              postid={internshipData.id}
            />
            <Toaster />
          </>
        )}
      </div>
    </div>
  );
}
