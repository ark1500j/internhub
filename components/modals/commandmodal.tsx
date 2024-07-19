"use client";

import { useEffect, useState } from "react";
import { CircleX, SearchIcon } from "lucide-react";
import { ScrollArea } from "../ui/scroll-area";
import Link from "next/link";
import { Internship } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useCommand } from "@/utils/state";

interface Props {
  data: Internship[];
}

const CommandModal = ({ data }: Props) => {
  const [command, setCommand] = useCommand();
  const [search, setSearch] = useState("");
  const [filteredData, setFilteredData] = useState<Internship[]>(data);
  const router = useRouter();

  const handleClose = () => {
    setCommand(false);
  };

  const handleClickOutside = (event: MouseEvent) => {
    const modalContent = document.getElementById("modal-content");
    if (modalContent && !modalContent.contains(event.target as Node)) {
      handleClose();
    }
  };

  useEffect(() => {
    if (command) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [command]);

  useEffect(() => {
    setFilteredData(
      data && data.filter(
        (item) =>
          item.title.toLowerCase().includes(search.toLowerCase()) ||
          (item.location && item.location.toLowerCase().includes(search.toLowerCase()))
      )
    );
  }, [search, data]);
  
  return (
    <div className="flex items-center justify-center relative z-50">
      <div
        className={`fixed top-0 left-0 w-screen h-screen flex items-center justify-center bg-black bg-opacity-40 transform ${
          command ? "scale-100" : "scale-0"
        } transition-transform duration-300`}
      >
        {/* Modal content */}
        <div
          id="modal-content"
          className="bg-white rounded-lg w-1/2 h-80 relative"
        >
          <label htmlFor="" className="flex rounded-lg items-center px-4 gap-2">
            <SearchIcon className="w-4 h-4 text-neutral-200" />
            <input
              value={search}
              type="text"
              onChange={(e) => {
                setSearch(e.target.value);
              }}
              placeholder="quick search"
              className="w-full focus:outline-none py-2 rounded-lg text-neutral-400"
            />
            <CircleX
              onClick={() => setCommand(false)}
              className="text-neutral-200 h-4 w-4 cursor-pointer"
            />
          </label>
          <hr />
          <ScrollArea className="h-full w-full text-neutral-400">
            <Link
              href="/student/dashboard/search"
              className="w-full flex gap-3 py-1 px-3 hover:bg-neutral-100 items-center duration-300"
            >
              <SearchIcon className="w-4 h-4 text-neutral-200" />
              <span>search</span>
            </Link>

            {filteredData &&  filteredData.length === 0 ? (
              <div className="px-3 py-1 text-neutral-500">No results found</div>
            ) : (
              filteredData && filteredData.map((item) => (
                <div
                  key={item.id}
                  className="px-3 hover:bg-neutral-100 duration-300 py-1 cursor-pointer"
                  onClick={() => router.push("/student/dashboard/" + item.id)}
                >
                  <div>{item.title}</div>
                  {/* {item.location && (
                    <div className="text-sm text-neutral-500">{item.location}</div>
                  )} */}
                </div>
              ))
            )}
          </ScrollArea>
        </div>
      </div>
    </div>
  );
};

export { CommandModal };
