"use client";

import { CircleX } from "lucide-react";
import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp"

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import { useEffect, useState } from "react";
import { otpVerifyAction, resendOtpAction } from "@/app/action";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";


interface Props {
  isModalOpen?: boolean,
  email:string,
  handleCloseModal: () => void;
}
const StudentSignupModal = ({ isModalOpen, handleCloseModal,email }: Props) => {
  const [otp,setOtp]= useState("")
  const router= useRouter()
    async function handleVerify() {
      const res = await otpVerifyAction(email,otp,"student")
      if(res?.message==="valid"){
         router.push("/student")
      }else if(res?.message==="invalid"){
        toast.error("Invalid otp please try again")
        setTimeout(() => {
          setOtp("")
        }, 1000);
      }
    }
    async function handleResend() {
      const res= await resendOtpAction(email,"student")
      if(res?.message==="valid") toast.success("new code has been sent to your  email")
    }

  useEffect(() => {
    if (otp.length === 6) {
      handleVerify();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [otp]);
  return (
    <div className="flex items-center justify-center">
      <div
        className={`fixed top-0 left-0 w-screen h-screen flex items-center justify-center bg-black bg-opacity-35 transform ${isModalOpen ? "scale-100" : "scale-0"
          } transition-transform duration-300`}
      >
        {/* Modal content */}

        <div className="bg-white rounded-sm w-1/2 h-96 relative">
          <div
            onClick={handleCloseModal}
            className="cursor-pointer absolute top-3 left-6"
          >
            <CircleX />
          </div>
          <div className="flex items-center flex-col justify-center h-full gap-4">
          <InputOTP maxLength={6} value={otp} onChange={(value)=>setOtp(value)} pattern={REGEXP_ONLY_DIGITS_AND_CHARS}>
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
            <div className="text-center text-sm ">
                {otp === "" ? (
                  <>Enter your one-time password.</>
                ) : (
                  <>You entered: {otp}</>
                )}
                <div className="text-neutral-400">
                  a verification code has been sent to your email
                </div>
                <div className="text-neutral-400 mt-2">
                  Did not recieve verication code <span onClick={handleResend} className="cursor-pointer underline">resend</span>
                </div>
              </div>
          </div>
        </div>
      </div>

    </div>
  );
};

const StudentResetModal = ({ isModalOpen, handleCloseModal }: Props) => {
  return (
    <div className="flex items-center justify-center">
      <div
        className={`fixed top-0 left-0 w-screen h-screen flex items-center justify-center bg-black bg-opacity-35 transform ${isModalOpen ? "scale-100" : "scale-0"
          } transition-transform duration-300`}
      >
        {/* Modal content */}

        <div className="bg-white rounded-sm w-1/2 h-96 relative">
          <div
            onClick={handleCloseModal}
            className="cursor-pointer absolute top-3 left-6"
          >
            <CircleX />
          </div>
          <div className="flex items-center justify-center h-full">
            <InputOTP maxLength={6} pattern={REGEXP_ONLY_DIGITS_AND_CHARS}>
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
          </div>
        </div>
      </div>

    </div>
  );
};

const SignInModal = ({ isModalOpen, handleCloseModal,email }: Props) => {
  const [otp,setOtp]=useState("")
  const router= useRouter()
    async function handleVerify() {
      const res = await otpVerifyAction(email,otp,"student")
      if(res?.message==="valid"){
        toast.success("account activated, login")
         handleCloseModal()
      }else if(res?.message==="invalid"){
        toast.error("Invalid otp please try again")
        setTimeout(() => {
          setOtp("")
        }, 1000);
      }
    }
  async function handleResend() {
    const res= await resendOtpAction(email,"student")
    if(res?.message==="valid") toast.success("new code has been sent to your email")
  }
  useEffect(() => {
    if (otp.length === 6) {
      handleVerify();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [otp]);
  return (
    <div className="flex items-center justify-center">
      <div
        className={`fixed top-0 left-0 w-screen h-screen flex items-center justify-center bg-black bg-opacity-35 transform ${isModalOpen ? "scale-100" : "scale-0"
          } transition-transform duration-300`}
      >
        {/* Modal content */}

        <div className="bg-white rounded-sm w-1/2 h-96 relative">
          <div
            onClick={()=>{
              setOtp("")
              handleCloseModal()
            }}
            className="cursor-pointer absolute top-3 left-6"
          >
            <CircleX />
          </div>
          <div className="flex items-center flex-col justify-center h-full gap-4">
          <InputOTP maxLength={6} value={otp} onChange={(value)=>setOtp(value)} pattern={REGEXP_ONLY_DIGITS_AND_CHARS}>
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
            <div className="text-center text-sm ">
                {otp === "" ? (
                  <>Enter your one-time password to activate your account.</>
                ) : (
                  <>You entered: {otp}</>
                )}
              
                <div className="text-neutral-400">
                  a verification code has been sent to your email
                </div>
                <div className="text-neutral-400 mt-2">
                  Did not recieve verication code <span onClick={handleResend} className="cursor-pointer underline">resend</span>
                </div>
              </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export { StudentSignupModal, StudentResetModal,SignInModal };