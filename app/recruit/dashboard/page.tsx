"use client";
/* eslint-disable @next/next/no-img-element */
import { formatDistanceToNow } from "date-fns";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsUpDown,
  Circle,
  Ellipsis,
  MenuIcon,
  Plus,
  User,
} from "lucide-react";
import React, { useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import useSWR from "swr";

const image =
  "data:image/jpeg;base64,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";
const data = [
  {
    id: "id",
    name: "emmanuel asidigbe",
    email: "arkwashington52@gmail.com",
    status: "hired",
    phone: "0209242589",
    programme: "computer engineering",
  },
  {
    id: "id",
    name: "abena asidigbe",
    email: "arkwashington52@gmail.com",
    status: "hired",
    phone: "0209242589",
    programme: "computer engineering",
  },
  {
    id: "id",
    name: "alex asidigbe",
    email: "arkwashington52@gmail.com",
    status: "hired",
    phone: "0209242589",
    programme: "computer engineering",
  },
  {
    id: "id",
    name: "nancy asidigbe",
    email: "arkwashington52@gmail.com",
    status: "hired",
    phone: "0209242589",
    programme: "computer engineering",
  },
  {
    id: "id",
    name: "mimi asidigbe",
    email: "arkwashington52@gmail.com",
    status: "hired",
    phone: "0209242589",
    programme: "computer engineering",
  },
  {
    id: "id",
    name: "killer asidigbe",
    email: "arkwashington52@gmail.com",
    status: "hired",
    phone: "0209242589",
    programme: "computer engineering",
  },
  {
    id: "id",
    name: "rowell asidigbe",
    email: "arkwashington52@gmail.com",
    status: "hired",
    phone: "0209242589",
    programme: "computer engineering",
  },
  {
    id: "id",
    name: "aid asidigbe",
    email: "arkwashington52@gmail.com",
    status: "hired",
    phone: "0209242589",
    programme: "computer engineering",
  },
  {
    id: "id",
    name: "selma asidigbe",
    email: "arkwashington52@gmail.com",
    status: "hired",
    phone: "0209242589",
    programme: "computer engineering",
  },
  {
    id: "id",
    name: "tibila asidigbe",
    email: "arkwashington52@gmail.com",
    status: "hired",
    phone: "0209242589",
    programme: "computer engineering",
  },
  {
    id: "id",
    name: "tibila asidigbe",
    email: "arkwashington52@gmail.com",
    status: "hired",
    phone: "0209242589",
    programme: "computer engineering",
  },
  {
    id: "id",
    name: "tibila asidigbe",
    email: "arkwashington52@gmail.com",
    status: "hired",
    phone: "0209242589",
    programme: "computer engineering",
  },
  {
    id: "id",
    name: "tibila asidigbe",
    email: "arkwashington52@gmail.com",
    status: "hired",
    phone: "0209242589",
    programme: "computer engineering",
  },
];
type User = {
  id: string;
  name: string;
  email: string;
  status: string;
  programme: string;
  phone: string;
};
const columnHelper = createColumnHelper<User>();
const columns = [
  columnHelper.accessor("name", {
    header: () => "Name",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("email", {
    header: () => "Email",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("phone", {
    header: () => "Phone",
    cell: (info) => <span className="text-indigo-300">{info.getValue()}</span>,
  }),
  columnHelper.accessor("programme", {
    header: () => "Programme",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("status", {
    header: () => "Status",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("id", {
    header: () => "",
    cell: (info) => (
      <span className="cursor-pointer flex justify-center">
        <DropdownMenu>
          <DropdownMenuTrigger className="outline-none hover:bg-indigo-100 hover:rounded-full duration-500">
            <Ellipsis size={20} />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View details</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </span>
    ),
  }),
];

export default function Page() {
  const [search, setSearch] = useState("");
  const [id,setId]= useState("")
  const router = useRouter();
  const table = useReactTable({
    data,
    columns,
    debugTable: true,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      globalFilter: search,
    },
    onGlobalFilterChange: setSearch,
    getPaginationRowModel: getPaginationRowModel(),
  });
  const posts = useSWR("/api/posts", async (url: string | URL | Request) => {
    const response = await fetch(url);
    return response.json();
  });
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
                    className="w-7 h-7 rounded-full"
                    src="https://images.unsplash.com/photo-1521587765099-8835e7201186?ixlib=rb-1.2.1&q=80&fm=jpg&crop=faces&fit=crop&h=200&w=200&ixid=eyJhcHBfaWQiOjE3Nzg0fQ"
                    alt="profile"
                  />
                  <span className="absolute right-0 -mb-0.5 bottom-0 w-2 h-2 rounded-full bg-green-500 border border-white "></span>
                </span>
                <span className="ml-2">
                  <DropdownMenuDemo />
                </span>
              </div>
            </div>
          </span>
        </div>
        {/* main */}
        <div className="h-full w-full flex">
          {/* main 1 */}
          <div className="w-96 flex flex-col h-full py-4 pl-2 border-r border-r-neutral-300">
            <div className="text-xs text-gray-400 tracking-wider">POSTS</div>
            <div className="relative mt-2 pr-3">
              <input
                type="text"
                className="pl-8 h-9 bg-transparent border border-gray-300 w-full rounded-md text-sm outline-none"
                placeholder="Search"
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
                {posts.data &&
                  posts.data.map((value: Internship) => {
                    return (
                      <div
                        key={value.id}
                        className={cn(
                          "flex flex-col items-start gap-2 rounded-lg cursor-pointer border p-2 mt-3  text-left text-sm transition-all hover:border-neutral-400",
                          "hover:bg-neutral-50 hover:bg-opacity-70  duration-700"
                        )}
                        onClick={()=>{ 
                          console.log(value.id)
                          setId(value.id)}}
                      >
                        <div className="font-semibold">{value.title}</div>
                        <div className="text-sm flex items-start ">
                          <span className="mt-[6px] mr-1">
                            <Circle size={7} />
                          </span>
                          <div
                            className="rendered-content"
                            dangerouslySetInnerHTML={{
                              __html: `${value.description.substring(0, 210)}...`,
                            }}
                          />
                        </div>
                        <div className="">
                          <span className="text-purple-500">
                            posted {" "}
                            {formatDistanceToNow(new Date(value.createdAt), {
                              addSuffix: true,
                            })}
                          </span>
                        </div>
                      </div>
                    );
                  })}
              </div>
              <div className="h-24"></div>
            </ScrollArea>
          </div>
          <ScrollArea className="w-full">
            {/* main 2 */}
            <div className="w-full h-full">
              <div className="sm:px-7 sm:pt-7 px-4 pt-4 flex flex-col w-full border-b border-gray-200 bg-white sticky top-0">
                <div className="flex w-full items-center">
                  <div className="flex items-center text-3xl text-gray-900 ">
                    <img
                      src={image}
                      className="w-12 mr-4 rounded-full"
                      alt="profile"
                    />
                    Google
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
                <div className="flex items-center justify-between w-full space-x-3 sm:mt-7 mt-4">
                  {/* <a
                    href="#"
                    className="px-3 border-b-2 border-blue-500 text-blue-500 pb-1.5"
                  >
                    Activities
                  </a> */}
                  <div className="relative mt-2 pr-3 w-80 mb-1">
                    <input
                      type="text"
                      className="pl-8 h-9 bg-transparent border border-gray-300 w-full rounded-md text-sm outline-none"
                      placeholder="Search"
                      value={search}
                      onChange={(e) => {
                        setSearch(e.target.value);
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
                  <div className="">
                     <button className=" p-1 rounded-md bg-purple-100 hover:bg-purple-300 duration-500" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}><ChevronLeft/> </button>
                     <button className=" p-1 rounded-md bg-purple-100 hover:bg-purple-300 duration-500 ml-1" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}><ChevronRight/></button>
                  </div>
                  
                  {/* <a
                    href="#"
                    className="px-3 border-b-2 border-transparent text-gray-600  pb-1.5"
                  >
                    Transfer
                  </a>
                  <a
                    href="#"
                    className="px-3 border-b-2 border-transparent text-gray-600  pb-1.5"
                  >
                    Notifications
                  </a> */}
                </div>
              </div>
              {/* main 2 sub */}
              <table className="w-full px-4 mt-4 text-xs">
                <thead className="pt-10 text-start">
                  {table.getHeaderGroups().map((headerGroup) => {
                    return (
                      <tr key={headerGroup.id} className="text-gray-400 ">
                        {headerGroup.headers.map((header) => {
                          return (
                            <th
                              key={header.id}
                              className="font-normal px-3 pt-0 pb-3 border-b border-gray-200"
                            >
                              {flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                            </th>
                          );
                        })}
                      </tr>
                    );
                  })}
                  {/* <tr className="text-gray-400 border-t border-gray-200 border-b pt-6">
                    <th className="font-normal px-3 pb-3 pt-3  ">
                      Type
                    </th>
                    <th className="font-normal px-3 pt-3 pb-3  ">
                      Where
                    </th>
                    <th className="font-normal px-3 pt-3 pb-3 border-b border-gray-200  hidden md:table-cell">
                      Description
                    </th>
                    <th className="font-normal px-3 pt-3 pb-3  ">
                      Amount
                    </th>
                    <th className="font-normal px-3 pt-3 pb-3  sm:text-gray-400 text-white">
                      Date
                    </th>
                  </tr> */}
                </thead>
                <tbody className="text-gray-600 text-center">
                  {table.getRowModel().rows.map((row) => {
                    return (
                      <tr
                        key={row.id}
                        className="w-full border-b border-gray-200 hover:bg-neutral-100 duration-700"
                      >
                        {row.getVisibleCells().map((cell) => {
                          return (
                            <td
                              key={cell.id}
                              className="sm:p-3 py-2 px-1 border-b border-gray-200 "
                            >
                              {flexRender(
                                cell.column.columnDef.cell,
                                cell.getContext()
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              <div className="pagination"></div>
            </div>

            <div className="h-24"></div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}
{
  Array.from({ length: 1 }).map(() => {
    return (
      <tr key={1} className="w-full border-b border-gray-200 ">
        <td className="sm:p-3 py-2 px-1 border-b border-gray-200 ">
          <div className="flex items-center">
            <svg
              viewBox="0 0 24 24"
              className="w-4 mr-5 text-yellow-500"
              stroke="currentColor"
              stroke-width="3"
              fill="none"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            Emmanuel Asidigbe
          </div>
        </td>
        <td className="sm:p-3 py-2 px-1 border-b border-gray-200 ">
          <div className="flex items-center">arkwashington52@gmail.com</div>
        </td>
        <td className="sm:p-3 py-2 px-1 border-b border-gray-200  md:table-cell hidden">
          +233 0209242589
        </td>
        <td className="sm:p-3 py-2 px-1 border-b border-gray-200  text-indigo-400">
          Computer Engineering
        </td>
        <td className="px-6 py-2 whitespace-no-wrap border-b text-blue-900  text-sm leading-5">
          <span className="relative inline-block px-3 py-1 font-semibold text-green-900 leading-tight">
            <span
              aria-hidden
              className="absolute inset-0 bg-green-200 opacity-50 rounded-full"
            ></span>
            <span className="relative text-xs">hired</span>
          </span>
        </td>
        <td className="sm:p-3 py-2 px-1 border-b border-gray-200  text-indigo-400">
          09:45 AM
        </td>
      </tr>
    );
  });
}

import { Button } from "@/components/ui/button";
import {
  DropdownMenuGroup,
  DropdownMenuPortal,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "@/components/ui/dropdown-menu";
import { Internship } from "@prisma/client";

export function DropdownMenuDemo() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        asChild
        className="outline-none active:outline-none focus:outline-none"
      >
        <div className="flex items-center">
          <Button variant="ghost" className="h-full text-xs text-neutral-400">
            James Smith <ChevronsUpDown size={15} />
          </Button>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            Profile
            <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            Billing
            <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            Settings
            <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            Keyboard shortcuts
            <DropdownMenuShortcut>⌘K</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>Team</DropdownMenuItem>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>Invite users</DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                <DropdownMenuItem>Email</DropdownMenuItem>
                <DropdownMenuItem>Message</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>More...</DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
          <DropdownMenuItem>
            New Team
            <DropdownMenuShortcut>⌘+T</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem>GitHub</DropdownMenuItem>
        <DropdownMenuItem>Support</DropdownMenuItem>
        <DropdownMenuItem disabled>API</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          Log out
          <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
