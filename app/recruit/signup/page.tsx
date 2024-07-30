/* eslint-disable @next/next/no-img-element */
"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import { RecruitSignUpModal } from "@/components/modals/recruitmodals";
import { Toaster } from "react-hot-toast";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { recruitFromSchema } from "@/utils/schema";
import { z } from "zod";
import { RecruitSignUpAction } from "@/app/action";

type Inputs = z.infer<typeof recruitFromSchema>;

const steps = [
  {
    id: "Step 1",
    name: "Company Information",
    fields: ["companyName", "companyEmployees", "isHiringManager","location"],
  },
  {
    id: "Step 2",
    name: "Comany Information",
    fields: ["companyProfile"],
  },
  {
    id: "Step 3",
    name: "Personal Information",
    fields: ["fullName", "phone", "userProfile"],
  },
  {
    id: "Step 3",
    name: "Personal Information",
    fields: ["email", "password"],
  },
];

export default function Page() {
  const [state, setState] = useState(0);
  const [modal, setModal] = useState(false);
  const [delta, setDelta] = useState(0);
  const [file, setFile] = useState<File | null>(null);
  const [file2, setFile2] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewUrl2, setPreviewUrl2] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const fileInputRef2 = useRef<HTMLInputElement | null>(null);
  const [isFirstRender, setIsFirstRender] = useState(true);
  const [email,setEmail]= useState("");
  const {
    register,
    trigger,
    setValue,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<Inputs>({
    resolver: zodResolver(recruitFromSchema),
  });
  const processForm: SubmitHandler<Inputs> = async (data) => {

    const formData = new FormData();

    formData.append("companyName", data.companyName);
    formData.append("companyEmployees", data.companyEmployees);
    formData.append("isHiringManager", data.isHiringManager);
    formData.append("fullName", data.fullName);
    formData.append("phone", data.phone);
    formData.append("email", data.email);
    formData.append("password", data.password);
    formData.append("location", data.location)

    if (file) {
      formData.append("companyProfile", file);
    }

    if (file2) {
      formData.append("userProfile", file2);
    }

    const res = await RecruitSignUpAction(formData)
    if(res.success){
      setEmail(data.email)
      setModal(true);
    }
    
    console.log(data);
  };

  type FieldName = keyof Inputs;

  const next = async function () {
    const fields = steps[state].fields;
    const output = await trigger(fields as FieldName[], { shouldFocus: true });

    if (!output) return;

    setState(state + 1);
    setDelta(state);
  };

  const previous = async () => {
    setDelta(-1);
    setState(state - 1);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    
    const file = e.target.files?.[0] ?? null;
    setFile(file);
    setValue("companyProfile", file as unknown as string)
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    } else {
      setPreviewUrl(null);
    }
  };

  const handleFileChange2 = (e: React.ChangeEvent<HTMLInputElement>) => {
    
    const file2 = e.target.files?.[0] ?? null;
    setFile2(file2);
    setValue("userProfile", file2 as unknown as string)
    if (previewUrl2) {
      URL.revokeObjectURL(previewUrl2);
    }
    if (file2) {
      const url = URL.createObjectURL(file2);
      setPreviewUrl2(url);
    } else {
      setPreviewUrl2(null);
    }
  };

  useEffect(() => {
    setIsFirstRender(false);
  }, []);
  return (
    <>
      <div className="w-full lg:grid lg:grid-cols-2 h-full">
        <div className="flex items-center justify-center sm:pt-12 pt-24">
          <div className="mx-auto grid w-[350px] gap-6">
            <div className="grid gap-2 text-center">
              <h1 className="text-2xl font-bold">
                Create an employer{"'"}s accout
              </h1>
              <p className="text-balance text-sm text-muted-foreground">
                Enter your email below to login to your account
              </p>
            </div>
            {state === 0 && (
              <motion.div
                initial={
                  isFirstRender
                    ? {}
                    : { x: delta >= 0 ? "0" : "-50%", opacity: 0 }
                }
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="grid gap-1"
              >
                <div className="grid gap-1 mb-2">
                  <Label htmlFor="refNum" className="mb-1">
                    Company Name
                  </Label>
                  <Input id="refNum" type="text" {...register("companyName")} />
                  {errors.companyName && (
                    <div className="text-xs text-red-600">
                      {errors.companyName.message}
                    </div>
                  )}
                </div>

                <div className="grid gap-1 mb-2">
                  <Label className="mb-1">Location</Label>
                  <Input {...register("location")} />
                  {errors.location && (
                    <div className="text-xs text-red-600">
                      {errors.location.message}
                    </div>
                  )}
                </div>
                <div className="grid gap-1 mt-2 mb-2">
                  <Label htmlFor="" className="mb-1">
                    Your company{"'"}s Number of employees
                  </Label>
                  <Controller
                    control={control}
                    render={({ field: { onChange, value } }) => (
                      <Select value={value} onValueChange={onChange}>
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectItem value="30">30</SelectItem>
                            <SelectItem value="30+">
                             30+
                            </SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    )}
                    name="companyEmployees"
                  />
                  {errors.companyEmployees && (
                    <p className="text-xs text-red-600">
                      {errors.companyEmployees.message}
                    </p>
                  )}
                </div>
                <div className="grid gap-2 mt-2 mb-2 ">
                  <Label htmlFor="" className="">
                    Are You a hiring manager?
                  </Label>
                  <Controller
                    control={control}
                    name="isHiringManager"
                    render={({ field: { onChange, value } }) => (
                      <Select value={value} onValueChange={onChange}>
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectItem value="Yes">Yes</SelectItem>
                            <SelectItem value="No">No</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.isHiringManager && (
                    <p className="text-xs text-red-600">
                      {errors.isHiringManager.message}
                    </p>
                  )}
                </div>
                <Button className="w-full mt-2" onClick={next}>
                  Continue
                </Button>
              </motion.div>
            )}
            {state === 1 && (
              <motion.div
                initial={{ x: delta >= 0 ? "50%" : "-50%", opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="grid gap-4"
              >
                <div className="grid gap-2">
                  <Label htmlFor="password" className="mb-3">
                    Company Profile
                  </Label>
                  <Label className="flex flex-col ">
                    <div className="flex">
                      <svg
                        className="w-5 h-5 hover:cursor-pointer transform-gpu active:scale-75 transition-all text-neutral-400"
                        aria-label="Attach media"
                        role="img"
                        viewBox="0 0 20 20"
                      >
                        <path
                          d="M13.9455 9.0196L8.49626 14.4688C7.16326 15.8091 5.38347 15.692 4.23357 14.5347C3.07634 13.3922 2.9738 11.6197 4.30681 10.2794L11.7995 2.78669C12.5392 2.04694 13.6745 1.85651 14.4289 2.60358C15.1833 3.3653 14.9855 4.4859 14.2458 5.22565L6.83367 12.6524C6.57732 12.9088 6.28435 12.8355 6.10124 12.6671C5.94011 12.4986 5.87419 12.1983 6.12322 11.942L11.2868 6.78571C11.6091 6.45612 11.6164 5.97272 11.3088 5.65778C10.9938 5.35749 10.5031 5.35749 10.1808 5.67975L4.99529 10.8653C4.13835 11.7296 4.1823 13.0626 4.95134 13.8316C5.77898 14.6592 7.03874 14.6446 7.903 13.7803L15.3664 6.32428C16.8678 4.81549 16.8312 2.83063 15.4909 1.4903C14.1799 0.179264 12.1584 0.106021 10.6496 1.60749L3.10564 9.16608C1.16472 11.1143 1.27458 13.9268 3.06169 15.7139C4.8488 17.4937 7.6613 17.6109 9.60955 15.6773L15.1027 10.1841C15.4103 9.87653 15.4103 9.30524 15.0881 9.00495C14.7878 8.68268 14.2677 8.70465 13.9455 9.0196Z"
                          className="fill-current"
                        ></path>
                      </svg>
                      <div className="text-sm text-neutral-400 mb-2 px-2">
                        Attach Image
                      </div>
                    </div>
                    <div className="grid gap-2">
                      {previewUrl && file ? (
                        <div className="mt-4">
                          {file.type.startsWith("image/") && (
                            <img
                              className="rounded-md"
                              src={previewUrl}
                              alt="Selected file"
                            />
                          )}
                        </div>
                      ) : (
                        <>
                          <div
                            className="bg-gray-100 p-8 text-center rounded-lg border-dashed border-2 border-gray-300 hover:border-purple-500 transition duration-300 ease-in-out transform hover:scale-105 hover:shadow-md"
                            id="dropzone"
                          >
                            <label
                              htmlFor="fileInput"
                              className="cursor-pointer flex flex-col items-center space-y-2"
                            >
                              <svg
                                className="w-16 h-16 text-gray-400"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                  stroke-width="2"
                                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                                ></path>
                              </svg>
                              <span className="text-gray-600">No Image</span>
                              <span className="text-gray-500 text-sm"></span>
                            </label>
                          </div>
                        </>
                      )}
                    </div>
                    <Input
                      className="bg-transparent flex-1 border-none outline-none hidden"
                      type="file"
                      {...register("companyProfile")}
                      ref={fileInputRef}
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                    {errors.companyProfile && (
                      <p className="text-xs text-red-600">
                        {`${errors.companyProfile.message}`}
                      </p>
                    )}
                  </Label>
                </div>
                <div className="flex justify-between">
                  <Button onClick={previous}>Prev</Button>
                  <Button onClick={next}>Next</Button>
                </div>
              </motion.div>
            )}
            {state === 2 && (
              <motion.div
                initial={{ x: delta >= 0 ? "50%" : "-50%", opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="grid gap-4"
              >
                <div className="grid gap-2">
                  <Label htmlFor="email">Your Full Name</Label>
                  <Input
                    id="name"
                    type="name"
                    placeholder="netizen ark1500j"
                    {...register("fullName")}
                  />
                </div>
                {errors.fullName && (
                  <p className="text-xs text-red-600">
                    {errors.fullName.message}
                  </p>
                )}
                <div className="grid gap-2">
                  <div className="flex items-center">
                    <Label htmlFor="password">Phone</Label>
                  </div>
                  <Input
                    id="Phone"
                    type="text"
                    placeholder="+233 209242589"
                    {...register("phone")}
                  />
                  {errors.phone && (
                    <p className="text-xs text-red-600">
                      {errors.phone.message}
                    </p>
                  )}
                </div>
                <div className="grid gap-2">
                  <div className="flex items-center">
                    <Label htmlFor="">Your profile</Label>
                  </div>
                  <div className="grid gap-2">
                    <Label className="flex flex-col">
                      <div className="flex">
                        <svg
                          className="w-5 h-5 hover:cursor-pointer transform-gpu active:scale-75 transition-all text-neutral-400"
                          aria-label="Attach media"
                          role="img"
                          viewBox="0 0 20 20"
                        >
                          <path
                            d="M13.9455 9.0196L8.49626 14.4688C7.16326 15.8091 5.38347 15.692 4.23357 14.5347C3.07634 13.3922 2.9738 11.6197 4.30681 10.2794L11.7995 2.78669C12.5392 2.04694 13.6745 1.85651 14.4289 2.60358C15.1833 3.3653 14.9855 4.4859 14.2458 5.22565L6.83367 12.6524C6.57732 12.9088 6.28435 12.8355 6.10124 12.6671C5.94011 12.4986 5.87419 12.1983 6.12322 11.942L11.2868 6.78571C11.6091 6.45612 11.6164 5.97272 11.3088 5.65778C10.9938 5.35749 10.5031 5.35749 10.1808 5.67975L4.99529 10.8653C4.13835 11.7296 4.1823 13.0626 4.95134 13.8316C5.77898 14.6592 7.03874 14.6446 7.903 13.7803L15.3664 6.32428C16.8678 4.81549 16.8312 2.83063 15.4909 1.4903C14.1799 0.179264 12.1584 0.106021 10.6496 1.60749L3.10564 9.16608C1.16472 11.1143 1.27458 13.9268 3.06169 15.7139C4.8488 17.4937 7.6613 17.6109 9.60955 15.6773L15.1027 10.1841C15.4103 9.87653 15.4103 9.30524 15.0881 9.00495C14.7878 8.68268 14.2677 8.70465 13.9455 9.0196Z"
                            className="fill-current"
                          ></path>
                        </svg>
                        <div className="text-sm text-neutral-400 mb-2 px-2">
                          Attach Image
                        </div>
                      </div>
                      <div className="grid gap-2">
                        {previewUrl2 && file2 ? (
                          <div className="mt-4">
                            {file2.type.startsWith("image/") && (
                              <img
                                className="rounded-full h-12 w-12"
                                src={previewUrl2}
                                alt="Selected file"
                              />
                            )}
                          </div>
                        ) : (
                          <>
                            <div
                              className="bg-gray-100 pt-3 w-12  h-12 text-center rounded-full border-dashed border-2 border-gray-300 hover:border-purple-500 transition duration-300 ease-in-out transform hover:scale-105 hover:shadow-md"
                              id="dropzone"
                            >
                              <label
                                htmlFor="fileInput"
                                className="cursor-pointer flex flex-col items-center"
                              >
                                <svg
                                  className="w-6 h-6 text-gray-400"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                                  ></path>
                                </svg>
                                <span className="text-gray-500 text-sm"></span>
                              </label>
                            </div>
                          </>
                        )}
                      </div>
                      <Input
                        className="bg-transparent flex-1 border-none outline-none hidden"
                        type="file"
                        accept="image/*"
                        {...register("userProfile")}
                        onChange={handleFileChange2}
                        ref={fileInputRef2}
                      />
                    </Label>
                  </div>
                </div>
                <div className="flex justify-between">
                  <Button onClick={previous}>Prev</Button>
                  <Button onClick={next}>Next</Button>
                </div>
              </motion.div>
            )}
            {state === 3 && (
              <motion.div
                initial={{ x: delta >= 0 ? "50%" : "-50%", opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                <form
                  className="grid gap-4"
                  onSubmit={handleSubmit(processForm)}
                >
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input placeholder="m@example.com" {...register("email")} />
                    {errors.email && (
                      <p className="text-xs text-red-600">
                        {errors.email?.message}
                      </p>
                    )}
                  </div>
                  <div className="grid gap-2">
                    <div className="flex items-center">
                      <Label htmlFor="password">Password</Label>
                      <Link
                        href="/forgot-password"
                        className="ml-auto inline-block text-sm underline"
                      >
                        Forgot your password?
                      </Link>
                    </div>
                    <Input type="password" {...register("password")} />
                    {errors.password && (
                      <p className="text-xs text-red-600">
                        {errors.password.message}
                      </p>
                    )}
                  </div>
                  <div className="flex justify-between items-center">
                    <Button onClick={previous}>Prev</Button>
                    <Button type="submit">
                      {isSubmitting ? (
                        <div className="flex items-center justify-center w-full">
                          <div className="loader"></div>
                        </div>
                      ) : (
                        "Create"
                      )}
                    </Button>
                  </div>
                </form>
              </motion.div>
            )}
            <div className="mt-4 text-center text-sm">
              Don&apos;t have an account?{" "}
              <Link href="/student/" className="underline">
                Login
              </Link>
            </div>
          </div>
        </div>
        <div className="hidden bg-muted lg:block h-screen">
          <img
            src="/side.jpg"
            alt="Image"
            className="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
          />
        </div>
        <div className="absolute flex items-center gap-1 top-4 left-6 font-bold text-3xl text-purple-600">
          {/* eslint-disable-next-line jsx-a11y/alt-text */}
          <img src="/logo.svg" />{" "}
          <span className="text-lg mt-2">InternHub</span>
        </div>
      </div>
      <RecruitSignUpModal
        isModalOpen={modal}
        handleCloseModal={() => {
          setModal(false);
        }}
        email={email}
      />
      <Toaster />
    </>
  );
}
