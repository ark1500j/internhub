"use client";
/* eslint-disable @next/next/no-img-element */
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsUpDown,
  Circle,
  EllipsisIcon,
  MenuIcon,
  Plus,
  Search,
  Sliders,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
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
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import useSWR, { mutate } from "swr";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { DropdownMenuGroup } from "@/components/ui/dropdown-menu";
import { Internship, Student } from "@prisma/client";
import { LogoutAction, RecruitAction, SoftDeletAction } from "@/app/action";
import toast, { Toaster } from "react-hot-toast";
import { revalidateTag } from "next/cache";

export default function Page() {
  const [search, setSearch] = useState("");
  const [selectedApplicant, setSelectedApplicant] = useState([]);
  const [selected, setSelected] = useState("");
  const [posts, setPosts] = useState([]);
  const [postsearch, setPostSearch] = useState("");
  const [filter, setFilter] = useState("name");
  const router = useRouter();
  const user = useSWR("/api/user", async (url) => {
    const response = await fetch(url);
    return response.json();
  });

  const { data, isLoading } = useSWR(
    "/api/posts",
    async (url: string | URL | Request) => {
      const response = await fetch(url);
      return response.json();
    }
  );

  async function handleApplicantData(id: string) {
    const response = await fetch(`/api/posts/${id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    console.log(data)
    setSelectedApplicant(data);
  }
  async function handleAction(action: string, id: string) {
    const res = await RecruitAction(action, id);
    if (res?.success) {
      toast.success(res.message);
      if (res?.id) {
        handleApplicantData(res.id)
        mutate("/api/applications")
      }
    }
  }

  function stripHtml(html: string): string {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = html;
    return tempDiv.textContent || tempDiv.innerText || "";
  }

  function truncateString(str: string, num: number): string {
    if (str.length <= num) {
      return str;
    }
    return str.slice(0, num) + "...";
  }

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
  async function hadndleSoftDelete(id: string) {
    const res = await SoftDeletAction(id);
    if (res.success) {
      toast.success(res.message);
      mutate("/api/internships");
    }else{
      toast.error(res.message)
    }
  }
  const filteredApplicants = search
    ? selectedApplicant.filter((application: any) => {
        const searchTerm = search.toLowerCase();
        if (filter === "name") {
          return application.applicant.name.toLowerCase().includes(searchTerm);
        } else if (filter === "programme") {
          return application.applicant.programme
            .toLowerCase()
            .includes(searchTerm);
        } else if (filter === "status") {
          return application.applicationStatus
            .toLowerCase()
            .includes(searchTerm);
        }
      })
    : selectedApplicant;

  const filteredPosts: Internship[] = postsearch
    ? data.filter((post: Internship) => {
        return post.title.toLowerCase().includes(postsearch.toLowerCase());
      })
    : data;

  useEffect(() => {
    if (data) {
      if(data.length > 0){
        handleApplicantData(data[0].id);
      }
    }
  }, [data]);
  return (
    <div className="  text-gray-600 h-screen w-screen flex overflow-hidden text-sm">
      {/* sidebar */}
      <div className="bg-white w-14 flex-shrink-0 border-r border-gray-200 flex-col justify-center hidden md:flex ">
        <div className="h-16 text-blue-500 flex items-center justify-center">
          <img src="/logo.svg" alt="" />
        </div>
        <div className="flex mx-auto flex-grow mt-4 flex-col text-gray-400 space-y-4">
          <div className="h-10 w-10  rounded-md flex items-center justify-center hover:bg-neutral-100 duration-700">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <svg
                    viewBox="0 0 24 24"
                    className="h-5"
                    stroke="currentColor"
                    stroke-width="2"
                    fill="none"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                    <polyline points="9 22 9 12 15 12 15 22"></polyline>
                  </svg>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs text text-neutral-400">
                    Add to library
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          <button className="h-10 w-10  rounded-md flex items-center justify-center hover:bg-neutral-200 duration-700">
            <svg
              viewBox="0 0 24 24"
              className="h-5"
              stroke="currentColor"
              stroke-width="2"
              fill="none"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
              <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
            </svg>
          </button>
          <button className="h-10 w-10  rounded-md flex items-center justify-center hover:bg-neutral-200 duration-700">
            <svg
              viewBox="0 0 24 24"
              className="h-5"
              stroke="currentColor"
              stroke-width="2"
              fill="none"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
              <line x1="12" y1="11" x2="12" y2="17"></line>
              <line x1="9" y1="14" x2="15" y2="14"></line>
            </svg>
          </button>
          <button className="h-10 w-10 rounded-md flex items-center justify-center hover:bg-neutral-200 duration-700">
            <svg
              viewBox="0 0 24 24"
              className="h-5"
              stroke="currentColor"
              stroke-width="2"
              fill="none"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <rect x="3" y="3" width="7" height="7"></rect>
              <rect x="14" y="3" width="7" height="7"></rect>
              <rect x="14" y="14" width="7" height="7"></rect>
              <rect x="3" y="14" width="7" height="7"></rect>
            </svg>
          </button>
        </div>
      </div>
      <div className="flex flex-col w-full ">
        {/* topbar */}
        <div className="flex w-full h-10 border-b border-b-neutral-200 items-center px-4 py-2">
          <div className="md:hidden block">
            <Sheet>
              <SheetTrigger>
                <MenuIcon />
              </SheetTrigger>
              <SheetContent className="w-[250px]" side={"left"}>
                <SheetHeader>
                  <SheetTitle>Are you absolutely sure?</SheetTitle>
                  <SheetDescription>
                    This action cannot be undone. This will permanently delete
                    your account and remove your data from our servers.
                  </SheetDescription>
                </SheetHeader>
              </SheetContent>
            </Sheet>
          </div>
          <span className="ml-auto">
            <div className="h-full ">
              <div className="flex items-center">
                <span className="relative flex-shrink-0">
                  <img
                    className="w-5 h-5 rounded-full"
                    src={user.data && user.data.profile}
                    alt="profile"
                  />
                  <span className="absolute right-0 -mb-0.5 bottom-0 w-2 h-2 rounded-full bg-green-500 border border-white "></span>
                </span>
                <span className="ml-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      asChild
                      className="outline-none active:outline-none focus:outline-none"
                    >
                      <div className="flex items-center">
                        <Button
                          variant="ghost"
                          className="h-full text-xs text-neutral-400"
                        >
                          {user.data ? (
                            user.data.name
                          ) : (
                            <span className="px-4"> </span>
                          )}
                          <ChevronsUpDown size={15} />
                        </Button>
                      </div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56">
                      <DropdownMenuLabel>My Account</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={async () => {
                          await LogoutAction("recruit");
                        }}
                      >
                        Log out
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </span>
              </div>
            </div>
          </span>
        </div>
        {/* main */}
        <div className="h-full w-full flex ">
          {/* main 1 */}
          <div className="w-96 flex flex-col h-full py-4 pl-2 border-r border-r-neutral-300">
            <div className="text-xs text-gray-400 tracking-wider">POSTS</div>
            <div className="relative mt-2 pr-3">
              <input
                type="text"
                className="pl-8 h-9 bg-transparent border border-gray-300 w-full rounded-md text-sm outline-none"
                placeholder="Search"
                onChange={(e) => {
                  setPostSearch(e.target.value);
                }}
              />
              <svg
                viewBox="0 0 24 24"
                className="w-4 absolute text-gray-400 top-1/2 transform translate-x-0.5 -translate-y-1/2 left-2"
                stroke="currentColor"
                stroke-width="2"
                fill="none"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </div>
            <ScrollArea className="h-full pt-2">
              <div className="pr-3">
                {filteredPosts &&
                  filteredPosts.map((value: Internship) => {
                    return (
                      <ContextMenu key={value.id}>
                        <ContextMenuTrigger>
                          <div
                            className={cn(
                              "flex flex-col items-start gap-2 rounded-lg cursor-pointer border p-2 mt-3  text-left text-sm transition-all hover:border-neutral-400",
                              `${
                                selected === value.id && "bg-purple-100"
                              } hover:bg-neutral-50 hover:bg-opacity-70  duration-700 relative`
                            )}
                            onClick={() => {
                              setSelected(value.id);
                              handleApplicantData(value.id);
                            }}
                          >
                            <div className="font-semibold flex items-center justify-between">
                              <span>{value.title}</span>
                              {value.soft_delete && (
                                <span className="bg-red-600 w-1 h-1 rounded-full"></span>
                              )}
                            </div>
                            <div className="text-sm flex items-start ">
                              <span className="mt-[6px] mr-1">
                                <Circle size={7} />
                              </span>
                              <div className="rendered-content">
                                {truncateString(
                                  stripHtml(value.description),
                                  210
                                )}
                              </div>
                            </div>
                            <div className="">
                              <span className="text-purple-500">
                                posted{" "}
                                {formatDistanceToNow(
                                  new Date(value.createdAt),
                                  {
                                    addSuffix: true,
                                  }
                                )}
                              </span>
                            </div>
                          </div>
                        </ContextMenuTrigger>
                        <ContextMenuContent>
                          <ContextMenuItem
                            onClick={() => {
                              router.push(
                                "/recruit/dashboard/details/" + value.id
                              );
                            }}
                          >
                            View Details
                          </ContextMenuItem>
                          <ContextMenuItem
                            onClick={() => {
                              hadndleSoftDelete(value.id);
                            }}
                          >
                            Soft Delete
                          </ContextMenuItem>
                        </ContextMenuContent>
                      </ContextMenu>
                    );
                  })}
                {filteredPosts && filteredPosts.length === 0 && (
                  <div className="w-full text center py-4">no posts</div>
                )}
                {isLoading &&
                  Array.from({ length: 5 }).map(() => {
                    return (
                      <div
                        key={1}
                        className="flex flex-col space-y-3 mb-4 mx-auto"
                      >
                        <Skeleton className="h-[150px] w-full bg-neutral-200 rounded-xl" />
                        <div className="space-y-2">
                          <Skeleton className="h-4 w-full" />
                        </div>
                      </div>
                    );
                  })}
              </div>
              <div className="h-24"></div>
              <ScrollBar />
            </ScrollArea>
          </div>
          <ScrollArea className="w-full">
            {/* main 2 */}
            <div className="w-full h-full">
              <div className="sm:px-7 sm:pt-7 px-4 pt-4 flex flex-col w-full border-b border-gray-200 bg-white sticky top-0">
                <div className="flex w-full items-center">
                  <div className="flex items-center text-3xl text-gray-900 ">
                    <img
                      src={user.data && user.data.company.profile_url}
                      className="w-14 h-14 mr-4 rounded-full"
                      alt=""
                    />
                    {user.data &&
                      user.data.company.name.charAt(0).toUpperCase() +
                        user.data.company.name.slice(1)}
                  </div>
                  <div className="ml-auto text-neutral-400 text-xs">
                    <Button
                      variant={"ghost"}
                      className="p-0 px-4 duration-500 flex items-center rounded-sm"
                      onClick={() => {
                        router.push("/recruit/dashboard/post");
                      }}
                    >
                      {" "}
                      <Plus size={17} />
                      {""}
                      <span className="ml-2 ">post a job</span>
                    </Button>
                  </div>
                </div>
                <div className="flex items-center  w-full  sm:mt-7 mt-4">
                  <label className="relative mt-2 pr-3 w-80 mb-1">
                    <input
                      type="text"
                      className="pl-8 h-9 bg-transparent border border-gray-300 w-full rounded-md text-sm outline-none"
                      placeholder="Search"
                      value={search}
                      onChange={(e) => {
                        setSearch(e.target.value);
                      }}
                    />
                    <Search className="w-4 h-4 absolute text-gray-400 top-1/2 transform translate-x-0.5 -translate-y-1/2 left-2" />
                  </label>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant={"ghost"} className="py-0 px-2">
                        <Sliders className="w-5 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56">
                      <DropdownMenuLabel>Filter</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuRadioGroup
                        value={filter}
                        onValueChange={setFilter}
                      >
                        <DropdownMenuRadioItem value="name">
                          Name
                        </DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="programme">
                          Programme
                        </DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="status">
                          Status
                        </DropdownMenuRadioItem>
                      </DropdownMenuRadioGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <div className="ml-auto">
                    <button className=" p-1 rounded-md bg-purple-100 hover:bg-purple-300 duration-500">
                      <ChevronLeft />{" "}
                    </button>
                    <button className=" p-1 rounded-md bg-purple-100 hover:bg-purple-300 duration-500 ml-1">
                      <ChevronRight />
                    </button>
                  </div>
                </div>
              </div>
              {/* main 2 sub */}
              <Table>
                <TableHeader className="text-xs text-center h-6">
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Programme</TableHead>
                    <TableHead>Start Date</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading && (
                    <TableRow className="h-6">
                      <TableCell>
                        <Skeleton className="h-4 mt-2 w-full rounded-xl" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 mt-2 w-full rounded-xl" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 mt-2 w-ull  rounded-xl" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 mt-2 w-full rounded-xl" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 mt-2 w-full rounded-xl" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 mt-2 w-full rounded-xl" />
                      </TableCell>
                    </TableRow>
                  )}
                  {filteredApplicants &&
                    filteredApplicants.map((application: any) => (
                      <TableRow key={application.id} className="text-xs h-8">
                        <TableCell className="font-medium">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger>
                                {application.applicant.name}
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>{application.message}</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </TableCell>
                        <TableCell>{application.applicant.email}</TableCell>
                        <TableCell className="text-indigo-400 p-2">
                          {application.applicant.contact_number}
                        </TableCell>
                        <TableCell>{application.applicant.programme}</TableCell>
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
                                <DropdownMenuItem className="cursor-pointer">
                                  <Link
                                    className="cursor-pointer"
                                    href={`/recruit/dashboard/${application.id}`}
                                  >
                                    View details
                                  </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => {
                                    handleAction("hire", application.id);
                                  }}
                                  className="cursor-pointer"
                                >
                                  Hire
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => {
                                    handleAction("reject", application.id);
                                  }}
                                  className="cursor-pointer"
                                >
                                  Decline
                                </DropdownMenuItem>
                              </DropdownMenuGroup>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
              {filteredApplicants.length === 0 && (
                <div className="w-full text-center font">no applicants</div>
              )}
              <div className="pagination"></div>
            </div>
            <div className="h-24"></div>
          </ScrollArea>
        </div>
      </div>
      <Toaster />
    </div>
  );
}
