"use client"

import * as React from "react"

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import { useState,useEffect } from "react"
import { resetOtpAction } from "@/app/action"
import { useResetInfo, useRestPassword } from "@/utils/state"
import toast, { Toaster } from "react-hot-toast"

export function InputOTPControlled() {
  const [resetInfo, setResetInfo]= useResetInfo()
  const[resetKey,setResetkey]=useRestPassword()

  async function handleSubmit(){
  const response = await resetOtpAction(resetInfo)
  
   if(response?.message) {
    setResetkey(response.message)
   }else{
    toast.error('OTP invalid, Please try again')
   setTimeout(()=>{
    setResetInfo((prev)=>{
      return {...prev, otp:''}
    })
   },1000)
   }
}


 useEffect(()=>{
  if(resetInfo.otp.length === 6){
    handleSubmit()
}
 // eslint-disable-next-line react-hooks/exhaustive-deps
 },[resetInfo.otp.length])

  return (
    <div className={`space-y-2 flex items-center justify-center flex-col ${resetKey?'hidden -translate-y-36 duration-2000':''}`}>
 <InputOTP
        maxLength={6}
        value={resetInfo.otp}
        name="otp"
        onChange={(value) =>setResetInfo((prev)=>{
          return {...prev, otp:value}
        }) }

      >
        <InputOTPGroup>
          <InputOTPSlot index={0} />
          <InputOTPSlot index={1} />
          <InputOTPSlot index={2} />
          <InputOTPSlot index={3} />
          <InputOTPSlot index={4} />
          <InputOTPSlot index={5} />
        </InputOTPGroup>
      </InputOTP>
      <div className="text-center text-sm">
        {resetInfo.otp === "" ? (
          <>Enter your one-time password.</>
        ) : (
          <>You entered: {resetInfo.otp}</>
        )}
      </div>
      
    </div>
  )
}
