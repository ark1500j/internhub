"use client";
import { MapPin, Search } from "lucide-react";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
function SelectDemo() {
  return (
    <Select>
      <SelectTrigger className="w-full text-neutral-400 bg-neutral-50 border-none  outline-none focus:outline-none focus:border-none mr-3">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectItem value="apple">In person - precise location</SelectItem>
          <SelectItem value="banana">In person - general location</SelectItem>
          <SelectItem value="blueberry">Remote</SelectItem>
          <SelectItem value="grapes">Hybrid Remote</SelectItem>
          <SelectItem value="pineapple">On the road</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}

export default function Page() {
  const [state, setState] = useState(0);
  const [isFirstRender, setIsFirstRender] = useState(true);
  const [delta, setDelta] = useState(0);

  useEffect(() => {
    setIsFirstRender(false);
  }, []);
  return (
    <div className="mx-20 mt-6">
      <form className="bg-neutral-50 border gap-2 items-center border-neutral-300 shadow-lg rounded-xl flex flex-col sm:flex-row px-6 py-2">
        <div className="flex items-center w-full gap-2">
          <Search className="text-neutral-400" size={20} />
          <input
            type="text-lg"
            placeholder="job title"
            className="bg-transparent focus:outline-none py-3"
          />
        </div>
        <div className="text-2xl text-neutral-200 hidden sm:block">|</div>
        <div className="flex items-center w-full gap-2">
          <MapPin className="text-neutral-400" size={30} />
          <SelectDemo />
        </div>
        <button className="rounded-lg bg-purple-600 px-4 py-2 text-white hover:bg-purple-500 duration-400 ">
          {" "}
          search
        </button>
      </form>
      <div className="flex gap-6 mt-12">
        <div
          onClick={() => {
            setDelta(-1);
            setState(0);
          }}
          className={`cursor-pointer ${
            state === 0
              ? "border-b-purple-600 border-b-4"
              : "hover:border-b-4 hover:border-b-purple-600 "
          }`}
        >
          Details
        </div>
        <div
          onClick={() => {
            setDelta(0)
            setState(1);
          }}
          className={`cursor-pointer ${
            state === 1
              ? "border-b-purple-600 border-b-4"
              : "hover:border-b-4 hover:border-b-purple-600 "
          }`}
        >
          Search results
        </div>
      </div>
      {state === 0 && (
        <motion.div
          initial={
            isFirstRender ? {} : { x: delta >= 0 ? "0" : "-50%", opacity: 0 }
          }
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="md:w-1/2"
        >
          <div className="bg-white rounded-lg  pt-10">
            <div className="flex items-baseline">
              <div className="text-gray-600 text-sm font-semibold mr-auto">
                Remote
              </div>
              <div className="text-gray-500 text-xs font-medium tracking-wide">
                Part of Recruit Holdings, Co., Ltd.
              </div>
              <div className="ml-2 text-yellow-400 text-xs font-semibold">
                4.2 ★
              </div>
            </div>

            <h3 className="mt-2 text-xl leading-tight font-bold text-black">
              Principal AI/ML Software Engineer
            </h3>

            <p className="mt-3 text-gray-700">$243,000 a year - Full-time</p>

            <div className="mt-4">
              <span>Indeed people are saying about working here:</span>

              <button
                type="button"
                className="text-blue-600 hover:text-blue-800 focus:outline-none focus:underline transition ease-in-out duration-150"
              >
                Helpful
              </button>
            </div>

            <h4 className="mt-6 uppercase tracking-wide text-gray-700 font-bold">
              Job
            </h4>

            <h5 className="mt-6 uppercase tracking-wide text-gray-700 font-bold">
              Skills
            </h5>
            <p>Do you have experience in TensorFlow?</p>
            <button
              type="button"
              className="text-blue-600 hover:text-blue-800 focus:outline-none focus:underline transition ease-in-out duration-150"
            >
              Yes
            </button>
            <button
              type="button"
              className="ml-2 text-blue-600 hover:text-blue-800 focus:outline-none focus:underline transition ease-in-out duration-150"
            >
              No
            </button>
          </div>
          <div className="bg-white  p-6">
            <h3 className="text-xl leading-tight font-bold text-black">
              Job details
            </h3>
            <p className="mt-2 text-gray-700">
              Here{"'"}s how the job details align with your profile:
            </p>

            <div className="mt-4">
              <h4 className="uppercase tracking-wide text-gray-700 font-bold">
                Pay
              </h4>
              <p className="text-gray-700">$423,000 a year</p>
            </div>

            <div className="mt-4">
              <h4 className="uppercase tracking-wide text-gray-700 font-bold">
                Job type
              </h4>
              <p className="text-gray-700">Full-time</p>
            </div>

            <div className="mt-4">
              <h4 className="uppercase tracking-wide text-gray-700 font-bold">
                Location
              </h4>
              <p className="text-gray-700">Remote</p>
            </div>

            <div className="mt-4">
              <h4 className="uppercase tracking-wide text-gray-700 font-bold">
                Benefits
              </h4>
              <ul className="list-disc list-inside text-gray-700">
                <li>401(k)</li>
                <li>Dental insurance</li>
                <li>Disability insurance</li>
                <li>Health insurance</li>
                <li>Life insurance</li>
                <li>Paid parental leave</li>
                <li>Paid time off</li>
              </ul>
            </div>
          </div>
          <div className="">
            <div className="">Job Description</div>
            <div className="">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Ducimus
              eveniet deleniti necessitatibus eum, numquam quam. Tenetur eum
              dolor nostrum iste qui repellendus sapiente. Culpa sequi, quos
              cumque iure incidunt asperiores. Lorem, ipsum dolor sit amet
              consectetur adipisicing elit. Iste maiores labore quidem delectus
              vel numquam officia tempora sequi, alias, ipsam voluptate adipisci
              nobis corrupti rem saepe quae, sit veniam culpa.
            </div>
          </div>
        </motion.div>
      )}
      {state === 1 && (
        <motion.div
          initial={{ x: delta >= 0 ? "50%" : "-50%", opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          no results
        </motion.div>
      )}
    </div>
  );
}
