/* eslint-disable @next/next/no-img-element */
"use client";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useFormStatus } from "react-dom";
import { useForm,SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { resendOtpAction, signInAction } from "../action";
import toast, { Toaster } from "react-hot-toast";
import { useState } from "react";
import { RecruitSignInModal } from "@/components/modals/recruitmodals";

function Submit() {
  const status = useFormStatus();
  return (
    <button
      type="submit"
      className="w-full inline-block pt-4 pr-5 pb-4 pl-5 text-xl font-medium text-center text-white bg-indigo-500 rounded-lg transition duration-200 hover:bg-indigo-600 ease"
      disabled={status.pending}
    >
      {status.pending ? (
        <div className="flex items-center justify-center w-full">
          <div className="loader"></div>
        </div>
      ) : (
        "Sign Up"
      )}
    </button>
  );
}
export default function Page() {
  const [email,setEmail]= useState("")
  const [modal,setModal]= useState(false)
  const schema = z.object({
    email: z.string().email(),
    password: z.string().min(6,"password must contain at least 6 character(s)"),
  });
  type Inputs = z.infer<typeof schema>;
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors,isSubmitting },
  } = useForm<Inputs>({ resolver: zodResolver(schema) });
  const router=useRouter();

  const processForm: SubmitHandler<Inputs> = async(data) => {
    const {email, password}= data
    const res= await signInAction(email,password,"recruit")
     if(res?.message==="valid"){

       router.push("/recruit/dashboard")

     }else if(res?.message==="invalid"){
      toast.error("invalid crendentials")
      reset()
     }else if(res?.message==="inactive"){ 
      const res= await resendOtpAction(email,"recruit")
      setEmail(email)
       setModal(true)
     }
    console.log(data)
  }
  return (
    <div className="w-full lg:grid lg:grid-cols-2 h-full">
      <div className="flex items-center justify-center sm:py-12 py-16">
        <div className="mx-auto grid w-[350px] gap-6">
          <div className="grid gap-2 text-center">
            <h1 className="text-3xl font-bold">Login</h1>
            <p className="text-balance text-muted-foreground">
              Enter your email below to login to your account
            </p>
          </div>
          <form className="grid gap-4" onSubmit={handleSubmit(processForm)}>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                placeholder="m@example.com"
               {...register("email")}
              />
              {errors.email && (<p className="text-red-600 text-xs"> {errors.email?.message}</p>)}
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
              <Input type="password" {...register("password")}/>
              {errors.password && (<p className="text-red-600 text-xs"> {errors.password?.message}</p>)}
            </div>
            <Button disabled={isSubmitting} type="submit" className="w-full">
              {isSubmitting ?(        <div className="flex items-center justify-center w-full">
          <div className="loader"></div>
        </div>):"Login"}
            </Button>
          </form>
          <div className="mt-4 text-center text-sm">
            Don&apos;t have an account?{" "}
            <Link href="/recruit/signup" className="underline">
              Sign up
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
        
        <RecruitSignInModal
         isModalOpen={modal}
         handleCloseModal={()=>{
          setModal(false)
         }}
         email={email}
        />
        <Toaster/>
    </div>
  );
}
