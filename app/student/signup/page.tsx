/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import { StudentSignupModal } from "@/components/modals/studentmodals";
import { Toaster } from "react-hot-toast";
import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { StudentsignUpAction } from "@/app/action";

export default function Page() {
  const [state, setState] = useState(0);
  const [modal, setModal] = useState(false);
  const [isFirstRender, setIsFirstRender] = useState(true);
  const [delta, setDelta] = useState(0);
  const [email,setEmail] = useState("")
  
  const schema = z.object({
    name: z.string().min(1, "Name is required"),
    referenceNumber: z.string().min(1, "Reference number is required"),
    email: z.string().email("Invalid email address"),
    phone:z.string().min(10,"not up to 10"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    programme: z.string().min(1, "Programme is required"),
    department: z.string().min(1, "Department is required"),
  });

  type Inputs = z.infer<typeof schema>;
  type FieldName = keyof Inputs;
  const steps = [
    {
      id: "Step 1",
      name: "Personal Information",
      fields: ["name", "programme", "department", "referenceNumber"],
    },
    {
      id: "Step 2",
      name: "Credentials",
      fields: ["email","phone", "password"],
    },
  ];
  const {
    register,
    handleSubmit,
    trigger,
    formState: { errors, isSubmitting },
  } = useForm<Inputs>({ resolver: zodResolver(schema) });

  const processForm: SubmitHandler<Inputs> = async (data) => {
      const res= await StudentsignUpAction(data)
      if(res?.message==="valid") {
        setEmail(data.email)
        setModal(true)
      }else if(res?.message==="invalid") {

      }
          
  };
    
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

  useEffect(() => {
    setIsFirstRender(false);
  }, []);
  return (
    <>
      <div className="w-full lg:grid lg:grid-cols-2 h-full">
        <div className="flex items-center justify-center sm:pt-12 pt-24">
          <div className="mx-auto grid w-[350px] gap-6">
            <div className="grid gap-2 text-center">
              <h1 className="text-3xl font-bold">Sign Up</h1>
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
                className="grid gap-3"
              >
                <p className="text-balance text-muted-foreground">
                  Enter your email below to login to your account
                </p>
                <div className="grid gap-1">
                  <Label htmlFor="refNum" className="mb-1">
                    Name
                  </Label>
                  <Input placeholder="full name" {...register("name")} />
                  {errors.name && (
                    <p className="text-red-600 text-xs">
                      {" "}
                      {errors.name?.message}
                    </p>
                  )}
                </div>
                <div className="grid gap-1">
                  <Label htmlFor="refNum" className="mb-1">
                    Reference number
                  </Label>
                  <Input
                    placeholder="20723275"
                    {...register("referenceNumber")}
                  />
                  {errors.referenceNumber && (
                    <p className="text-red-600 text-xs">
                      {" "}
                      {errors.referenceNumber?.message}
                    </p>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="company-name" className="mb-1">
                      Programme
                    </Label>
                    <Input
                      placeholder="Computer Engineering"
                      {...register("programme")}
                    />
                    {errors.programme && (
                      <p className="text-red-600 text-xs">
                        {errors.programme?.message}
                      </p>
                    )}
                  </div>
                  <div className="grid gap-1">
                    <Label htmlFor="department" className="mb-1">
                      Department
                    </Label>
                    <Input
                      placeholder="Comuter Engineering"
                      {...register("department")}
                    />
                    {errors.department && (
                      <p className="text-red-600 text-xs">
                        {" "}
                        {errors.department?.message}
                      </p>
                    )}
                  </div>
                </div>
                <Button className="w-full" onClick={next}>
                  Continue
                </Button>
              </motion.div>
            )}
            {state === 1 && (
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
                    <Label htmlFor="email" className="mb-1">
                      Email
                    </Label>
                    <Input placeholder="m@example.com" {...register("email")} />
                    {errors.email && (
                      <p className="text-red-600 text-xs">
                        {" "}
                        {errors.email?.message}
                      </p>
                    )}
                  </div>
                  <div className="grid gap-2">
                    <div className="flex items-center">
                      <Label htmlFor="password" className="mb-1">
                        Phone
                      </Label>
                    </div>
                    <Input  {...register("phone")} />
                    {errors.phone && (
                      <p className="text-red-600 text-xs">
                        {" "}
                        {errors.phone?.message}
                      </p>
                    )}
                  </div>
                  <div className="grid gap-2">
                    <div className="flex items-center">
                      <Label htmlFor="password" className="mb-1">
                        Password
                      </Label>
                    </div>
                    <Input type="password" {...register("password")} />
                    {errors.password && (
                      <p className="text-red-600 text-xs">
                        {" "}
                        {errors.password?.message}
                      </p>
                    )}
                  </div>
                        
                  <div className="flex justify-between">
                    <Button onClick={previous}>Previous</Button>
                    <Button disabled={isSubmitting} type="submit">
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
        <div className="absolute flex items-center gap-1 top-4 left-6 font-bold  text-purple-600">
          {/* eslint-disable-next-line jsx-a11y/alt-text */}
           <img src="/logo.svg"/>   <span className="text-lg mt-2">InternHub</span>
        </div>
      </div>
      <StudentSignupModal
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
