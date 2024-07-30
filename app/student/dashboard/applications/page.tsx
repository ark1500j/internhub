"use client";
import React, { useState } from "react";
import useSWR, { mutate } from "swr";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Application } from "@/types";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EllipsisIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { generateAcceptPdfAction } from "@/app/action";

export default function Page() {
  const { data, isLoading, error } = useSWR<Application[]>(
    "/api/applications",
    async (url: string) => {
      const response = await fetch(url);
      return response.json();
    }
  );

  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    console.log(id);
    try {
      await fetch(`/api/applications/${id}`, {
        method: "DELETE",
      });
      await mutate("/api/applications");
      setIsAlertOpen(false);
    } catch (error) {
      console.error("Failed to delete application", error);
    }
  };

  const handleAccept = async (id: string) => {
    try {
      const res= await generateAcceptPdfAction(id)
          if (res?.sucess) {
            // Convert buffer to ArrayBuffer
            const arrayBuffer = new Uint8Array(res?.pdf).buffer;

            // Create a blob from the ArrayBuffer
            const blob = new Blob([arrayBuffer], { type: "application/pdf" });

            // Create a link element, use it to trigger the download, and remove it
            const link = document.createElement("a");
            link.href = URL.createObjectURL(blob);
            link.download = "Acceptance Letter.pdf";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          } else {
            console.error("Failed to generate PDF");
          }
      mutate("/api/applications");
    } catch (error) {
      console.error("Failed to accept application", error);
    }
  };
  console.log(data)
  const getStatusClass = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-purple-300 px-2";
      case "hired":
        return "bg-green-300 px-4";
      case "rejected":
        return "bg-red-400";
      default:
        return "";
    }
  };

  return (
    <div>
      <div className="h-14 bg-purple-500 w-full text-white flex items-center px-12 fixed top-0 left-0">
        <a href={"/student/dashboard"} className="flex items-center gap-1">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.svg" alt="logo" />
          <span>Internhub</span>
        </a>
      </div>
      <div className="sm:px-24 mt-16 flex flex-col py-5">
        <Table>
          <TableCaption>A list of your applications.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Internship Title</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Applied At</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Start Date</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && (
              <TableRow>
                <TableCell>
                  <Skeleton className="h-12 mt-2 w-full rounded-xl" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-12 mt-2 w-full rounded-xl" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-12 mt-2 w-ull  rounded-xl" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-12 mt-2 w-full rounded-xl" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-12 mt-2 w-full rounded-xl" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-12 mt-2 w-full rounded-xl" />
                </TableCell>
              </TableRow>
            )}
            {Array.isArray(data) &&
              data.map((application) => (
                <TableRow key={application.id}>
                  <TableCell className="font-medium">
                    {application.internship.title}
                  </TableCell>
                  <TableCell>
                    <span
                      className={`p-2 px-2 rounded-full ${getStatusClass(
                        application.applicationStatus as string
                      )}`}
                    >
                      {application.applicationStatus}
                    </span>
                  </TableCell>
                  <TableCell>
                    {new Date(application.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{application.internship.duration}</TableCell>
                  <TableCell>
                    {application.internship.start_date
                      ? new Date(
                          application.internship.start_date
                        ).toLocaleDateString()
                      : "N/A"}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <div className="w-full text-center cursor-pointer">
                          <EllipsisIcon />
                        </div>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-56">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuGroup>
                          {application.applicationStatus === "hired" && (
                            <DropdownMenuItem>
                              <div
                                className="cursor-pointer"
                                onClick={() => handleAccept(application.id)}
                              >
                                Accept
                              </div>
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem>
                            <div
                              className="cursor-pointer"
                              onClick={() => {
                                setIsAlertOpen(true);
                                setDeleteId(application.id);
                              }}
                            >
                              Delete
                            </div>
                          </DropdownMenuItem>
                        </DropdownMenuGroup>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={5}>Total Applications</TableCell>
              <TableCell className="text-right text-yellow-400">
                {data && data.length}
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </div>
      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsAlertOpen(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (deleteId) {
                  handleDelete(deleteId);
                }
              }}
              className="bg-red-600 hover:bg-red-600"
            >
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
