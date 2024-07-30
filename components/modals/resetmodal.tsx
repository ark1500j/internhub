"use client";
import { CircleX } from "lucide-react";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import toast from "react-hot-toast";
import { useEffect } from "react";
import { otpVerifyAction, resendOtpAction } from "@/app/action";

interface Props {
  isModalOpen?: boolean;
  role: string;
  email: string;
  otp: string;
  setOtp: (otp: string) => void;
  setState: (state: boolean) => void;
  handleCloseModal: () => void;
  // handleReset?: () => void;
}
const ResetModal = ({
  isModalOpen,
  handleCloseModal,
  setState,
  role,
  otp,
  email,
  setOtp,
}: Props) => {
  async function handleSubmit() {
    const res = await otpVerifyAction(email, otp, role);
    if (res?.message === "valid") {
      setTimeout(() => {
        setState(true);
        handleCloseModal();
      }, 2000);
    } else if (res?.message === "invalid") {
      toast.error("the otp entered is invalid");
      setTimeout(() => {
        setOtp("");
      }, 2000);
    }
  }
  async function handleResend() {
    const res = await resendOtpAction(email, role);
    if (res?.message === "valid")
      toast.success("new code has been sent to your  email");
  }

  useEffect(() => {
    if (otp.length === 6) {
      handleSubmit();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [otp]);

  return (
    <div className="flex items-center justify-center">
      <div
        className={`fixed top-0 left-0 w-screen h-screen flex items-center justify-center bg-black bg-opacity-35 transform ${
          isModalOpen ? "scale-100" : "scale-0"
        } transition-transform duration-300`}
      >
        {/* Modal content */}
        <div className="bg-white text-center rounded-sm w-[90%] sm:w-1/2 h-64 sm:h-96 relative">
          <div
            onClick={handleCloseModal}
            className="cursor-pointer absolute top-3 left-6"
          >
            <CircleX />
          </div>
          <div className="flex items-center justify-center h-full flex-col">
            <InputOTP
              maxLength={6}
              value={otp}
              name="otp"
              onChange={(value) => setOtp(value)}
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
            <div className="text-center text-sm mt-4">
              {otp === "" ? (
                <>Enter your one-time password.</>
              ) : (
                <>You entered: {otp}</>
              )}
            </div>
            <div className="pt-6 text-sm text-neutral-400">
              A verification code has been sent to the email
            </div>
            <div className="text-neutral-400 mt-2">
              Did not recieve verication code{" "}
              <span onClick={handleResend} className="cursor-pointer underline">
                resend
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetModal;
