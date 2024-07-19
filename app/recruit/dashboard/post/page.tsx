/* eslint-disable @next/next/no-img-element */
"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import {  default as MultiSelect } from "react-select";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { postschema } from "@/utils/schema";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CalendarIcon } from "@radix-ui/react-icons";
import { addDays, format } from "date-fns";
import { DateRange } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { PostIntershipAction } from "@/app/action";
import { useRouter } from "next/navigation";

// Dynamically import ReactQuill to avoid SSR issues
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

const steps = [
  {
    id: "Step 1",
    name: "Personal Information",
    fields: ["jobTitle", "location", "jobLocation", "duration","expectedapplicant"]
  },
  {
    id: "Step 2",
    name: "Address",
    fields: ["dateRange","programme", "requirements"] 
  },
  { id: "Step 3", name: "Complete" ,fields: ["description"]  },
];

const options = [
  { value: "computer engineering", label: "computer" },
  { value: "electrical engineering", label: "electrical" },
  { value: "biomedical engineering", label: "biomedical" },
  { value: "telecom engineering", label: "telecom" },
  { value: "mechanical engineering", label: "mechanical" },
];

type Inputs = z.infer<typeof postschema>;
export default function Page() {
  const [state, setState] = useState(0);
  const [value, setValue] = useState("");
  const [delta, setDelta] = useState(0);
  const [isFirstRender, setIsFirstRender] = useState(true);
  const router= useRouter();
  const {
    register,
    control,
    reset,
    trigger,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Inputs>({ resolver: zodResolver(postschema) });

  const processForm: SubmitHandler<Inputs> = async (data) => {
    const formData = new FormData();
    (Object.keys(data) as (keyof Inputs)[]).forEach(key => {
      // Handle special cases for nested or complex objects
      if (key === 'programme') {
        // Assuming programme is an array of objects with value and label
        formData.append(key, JSON.stringify(data[key]));
      } else if (key === 'dateRange') {
        formData.append('start_date', data.dateRange.from.toISOString());
        formData.append('end_date', data.dateRange.to.toISOString());
      } else {
        formData.append(key, data[key] as any);
      }
    });
   const res= await PostIntershipAction(formData);
    if(res?.sucess){
      router.push("/recuit/dashboard")
    }
    // const programmeArray = res?.programme ? JSON.parse(res.programme) : [];
  };

  type FieldName = keyof Inputs;
  async function next() {
    const fields = steps[state].fields;
    const output = await trigger(fields as FieldName[], {
      shouldFocus: true,
    });
    console.log(output)
    if (!output) return;
    setState(state + 1);
    setDelta(state);
  }

  function prev() {
    setDelta(-1);
    setState(state - 1);
  }

  useEffect(() => {
    setIsFirstRender(false);
  }, []);

  return (
    <>
      <div>
        <Link
          href={"/recruit/dashboard"}
          className="h-12 w-full fixed bg-white  flex gap-1 top-0 items-center px-6"
        >
          <img src="/logo.svg" alt="" />
          <span className="text-purple-500">InternHub</span>
        </Link>
        <div className="sm:w-screen grid content-center mt-16">
          <h1 className=" w-full text-center text-3xl font-semibold sm:hidden mb-4">
            Post Internsip
          </h1>
          <div className="flex items-start w-full md:items-center md:flex-col xl:px-96 px-12 md:px-36">
            <nav aria-label="Progress" className="md:w-full hidden sm:block">
              <ol
                role="list"
                className="space-y-4 md:flex md:space-x-8 md:space-y-0"
              >
                {steps.map((step, index) => (
                  <li key={step.name} className="md:flex-1">
                    {state > index ? (
                      <div className="group flex w-full flex-col border-l-4 border-purple-600  py-2 pl-4 transition-colors md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4">
                        <span className="text-sm font-medium text-purple-600 transition-colors ">
                          {step.id}
                        </span>
                        <span className="text-sm font-medium">{step.name}</span>
                      </div>
                    ) : state === index ? (
                      <div
                        className="flex w-full flex-col border-l-4 border-purple-600 py-2 pl-4 md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4"
                        aria-current="step"
                      >
                        <span className="text-sm font-medium text-purple-600">
                          {step.id}
                        </span>
                        <span className="text-sm font-medium">{step.name}</span>
                      </div>
                    ) : (
                      <div className="group flex w-full flex-col border-l-4 border-gray-200 py-2 pl-4 transition-colors md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4">
                        <span className="text-sm font-medium text-gray-500 transition-colors">
                          {step.id}
                        </span>
                        <span className="text-sm font-medium">{step.name}</span>
                      </div>
                    )}
                  </li>
                ))}
              </ol>
            </nav>
            <div className="w-full md:pt-6">
              {state === 0 && (
                <motion.div
                  initial={
                    isFirstRender
                      ? {}
                      : { x: delta >= 0 ? "0" : "-50%", opacity: 0 }
                  }
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className=" md:mt-6 lg:mt-0 leading-normal"
                >
                  <div className="mb-3">
                    <label htmlFor="" className="mb-4">
                      <div className="mb-2">
                        job title <span className="text-red-600">*</span>
                      </div>
                      <input
                        className="w-full p-2 border rounded-sm border-neutral-300 focus:outline focus:outline-purple-500  focus:border-purple-500"
                        {...register("jobTitle")}
                      />
                      {errors.jobTitle && (
                        <p className="text-xs text-red-600">
                          {errors.jobTitle.message}
                        </p>
                      )}
                    </label>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="" className="mb-4">
                      <div className="mb-2">
                        location <span className="text-red-600">*</span>
                      </div>
                      <input
                        {...register("location")}
                        className="w-full p-2 border rounded-sm border-neutral-300 focus:outline focus:outline-purple-500  focus:border-purple-500"
                      />
                      {errors.location && (
                        <p className="text-xs text-red-600">
                          {errors.location.message}
                        </p>
                      )}
                    </label>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="" className="mb-4">
                      <div className="mb-2">
                        which option best describes the job{"'"}s location{" "}
                        <span className="text-red-600">*</span>
                      </div>
                      <Controller
                        control={control}
                        render={({ field: { onChange, value } }) => (
                          <Select value={value} onValueChange={onChange}>
                            <SelectTrigger className="w-full">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectGroup>
                                <SelectItem value="In person - precise location">
                                  In person - precise location
                                </SelectItem>
                                <SelectItem value="In person - general location">
                                  In person - general location
                                </SelectItem>
                                <SelectItem value="Remote">Remote</SelectItem>
                                <SelectItem value="Hybrid Remote">
                                  Hybrid Remote
                                </SelectItem>
                                <SelectItem value="On the road">
                                  On the road
                                </SelectItem>
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                        )}
                        name="jobLocation"
                      />
                      {errors.jobLocation && (
                        <p className="text-xs text-red-600">
                          {errors.jobLocation.message}
                        </p>
                      )}
                    </label>
                  </div>
                  <div className="mb-3 flex w-full gap-10 justify-between">
                    <label htmlFor="" className="mb-4 w-full">
                      <div className="mb-2">
                        duration
                        <span className="text-red-600">*</span>
                      </div>
                      <Controller
                        control={control}
                        render={({ field: { onChange, value } }) => (
                          <Select value={value} onValueChange={onChange}>
                            <SelectTrigger className="w-full">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectGroup>
                                <SelectItem value="2 months">
                                  2 months
                                </SelectItem>
                                <SelectItem value="3 months">
                                  3 months
                                </SelectItem>
                                <SelectItem value="3+ months">
                                  3 months+
                                </SelectItem>
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                        )}
                        name="duration"
                      />
                      {errors.duration && (
                        <p className="text-xs text-red-600">
                          {errors.duration.message}
                        </p>
                      )}
                    </label>
                    <label htmlFor="" className="mb-4 w-full">
                      <div className="mb-2">
                        expected applicants
                        <span className="text-red-600">*</span>
                      </div>
                      <input {...register("expectedapplicant")} className="w-full p-[6px] border rounded-sm border-neutral-300 focus:outline focus:outline-purple-500  focus:border-purple-500"/>
                      {errors.expectedapplicant && (
                        <p className="text-xs text-red-600">
                          {errors.expectedapplicant.message}
                        </p>
                      )}
                    </label>
                  </div>
                  <div className="mt-3 pt-5">
                    <div className="flex justify-between items-center">
                      <button
                        type="button"
                        onClick={prev}
                        disabled={true}
                        className="rounded bg-white px-2 py-1 text-sm font-semibold text-sky-900 shadow-sm ring-1 ring-inset ring-purple-300 hover:bg-purple-50 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="1.5"
                          stroke="currentColor"
                          className="h-6 w-6"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M15.75 19.5L8.25 12l7.5-7.5"
                          />
                        </svg>
                      </button>
                      <button
                        type="button"
                        onClick={next}
                        className="rounded bg-white px-2 py-1 text-sm font-semibold text-sky-900 shadow-sm ring-1 ring-inset ring-purple-300 hover:bg-sky-50 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="1.5"
                          stroke="currentColor"
                          className="h-6 w-6"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M8.25 4.5l7.5 7.5-7.5 7.5"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
              {state === 1 && (
                <motion.div
                  initial={{ x: delta >= 0 ? "50%" : "-50%", opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className=" md:mt-6 lg:mt-0 leading-normal"
                >
                  <div className="mb-6">
                    <label htmlFor="">
                      {" "}
                      <h2 className="mb-2 flex justify-between items-center">
                        <div className="">
                          date for duration
                          <span className="text-red-600">*</span>
                        </div>
                        {errors.dateRange && (
                          <p className="text-xs text-red-600">
                            {errors.dateRange.message}
                          </p>
                        )}
                      </h2>
                      <div className="w-full">
                      <Controller
                        name="dateRange"
                        control={control}
                        render={({ field: { onChange, value } }) => (
                          <div className={"grid gap-2"}>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                id="date"
                                variant={"outline"}
                                className={cn(
                                  "w-full justify-start text-left font-normal",
                                  !value && "text-muted-foreground"
                                )}
                              >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {value?.from ? (
                                  value.to ? (
                                    <>
                                      {format(value.from, "LLL dd, y")} -{" "}
                                      {format(value.to, "LLL dd, y")}
                                    </>
                                  ) : (
                                    format(value.from, "LLL dd, y")
                                  )
                                ) : (
                                  <span>Pick a value</span>
                                )}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                initialFocus
                                mode="range"
                                defaultMonth={value?.from}
                                selected={value}
                                onSelect={onChange}
                                numberOfMonths={2}
                              />
                            </PopoverContent>
                          </Popover>
                        </div>
                        )}
                      />
                      </div>
                    </label>
                  </div>
                  <div className="mb-6">
                    <label htmlFor="">
                      {" "}
                      <h2 className="mb-2 flex justify-between items-center">
                        <div className="">
                          date for duration
                          <span className="text-red-600">*</span>
                        </div>
                        {errors.programme && (
                          <p className="text-xs text-red-600">
                            {errors.programme.message}
                          </p>
                        )}
                      </h2>
                      <Controller
                        control={control}
                        name="programme"
                        render={({ field: { onChange, value } }) => (
                          <MultiSelect
                            className="hover:border-none"
                            styles={{
                              control: (provided, state) => ({
                                ...provided,
                                borderColor: state.isFocused
                                  ? "#a855f7"
                                  : "#e5e7eb",
                                boxShadow: state.isFocused
                                  ? "0 0 0 1px purple"
                                  : "none",
                                "&:hover": {
                                  borderColor: state.isFocused
                                    ? "#a855f7t"
                                    : "#e5e7eb",
                                },
                              }),
                            }}
                            value={value}
                            options={options}
                            onChange={onChange}
                            isMulti
                          />
                        )}
                      />
                    </label>
                  </div>
                  <div className="mb-6">
                    <label htmlFor="">
                      {" "}
                      <h2 className="mb-2 flex justify-between items-center">
                        <div className="">
                          requirements <span className="text-red-600">*</span>
                        </div>
                        <span>
                          {" "}
                          {errors.requirements && (
                            <p className="text-xs text-red-600">
                              {errors.requirements.message}
                            </p>
                          )}
                        </span>
                      </h2>
                      <Controller
                        control={control}
                        render={({ field: { onChange, value } }) => (
                          <ReactQuill
                            className="lg:h-36 sm:h-12 h-36 rounded-sm"
                            theme="snow"
                            value={value}
                            onChange={onChange}
                          />
                        )}
                        name="requirements"
                      />
                    </label>
                    <div className="mt-8 pt-5">
                      <div className="flex justify-between items-center">
                        <button
                          type="button"
                          onClick={prev}
                          className="rounded bg-white px-2 py-1 text-sm font-semibold text-sky-900 shadow-sm ring-1 ring-inset ring-purple-300 hover:bg-purple-50 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                            className="h-6 w-6"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M15.75 19.5L8.25 12l7.5-7.5"
                            />
                          </svg>
                        </button>
                        <button
                          type="button"
                          onClick={next}
                          className="rounded bg-white px-2 py-1 text-sm font-semibold text-sky-900 shadow-sm ring-1 ring-inset ring-purple-300 hover:bg-sky-50 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                            className="h-6 w-6"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M8.25 4.5l7.5 7.5-7.5 7.5"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
              {state === 2 && (
                <motion.div
                  initial={{ x: delta >= 0 ? "50%" : "-50%", opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className=" md:mt-6 lg:mt-0 leading-normal"
                >
                  <form className="mb-6" onSubmit={handleSubmit(processForm)}>
                    <label htmlFor="">
                      {" "}
                      <h2 className="mb-2 flex justify-between">
                        <div className="">
                          Description <span className="text-red-600">*</span>
                        </div>
                        <span>
                          {errors.description && (
                            <p className="text-xs text-red-600">
                              {errors.description.message}
                            </p>
                          )}
                        </span>
                      </h2>
                      <Controller
                        control={control}
                        render={({ field: { onChange, value } }) => (
                          <ReactQuill
                            className="h-80 w-full rounded-sm"
                            theme="snow"
                            value={value}
                            onChange={onChange}
                          />
                        )}
                        name="description"
                      />
                    </label>
                    <div className="mt-8 pt-5">
                    <div className="flex justify-between items-center">
                      <button
                        type="button"
                        onClick={prev}
                        className="rounded bg-white px-2 py-1 text-sm font-semibold text-sky-900 shadow-sm ring-1 ring-inset ring-purple-300 hover:bg-purple-50 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="1.5"
                          stroke="currentColor"
                          className="h-6 w-6"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M15.75 19.5L8.25 12l7.5-7.5"
                          />
                        </svg>
                      </button>
                      <button
                        type="submit"
                        className="rounded bg-white px-2 py-1 text-sm font-semibold text-sky-900 shadow-sm ring-1 ring-inset ring-purple-300 hover:bg-sky-50 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        Post
                      </button>
                    </div>
                  </div>
                  </form>
                  
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
