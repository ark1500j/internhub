import { atom, useAtom } from "jotai";

import { eachMonthOfInterval } from "date-fns";

const configAtom = atom({selected:''});
const command = atom(false)

const otpEmail = atom({ email:'', otp: '' });

const resetPasswordKey= atom<boolean>(false)

export function usePost() {
  return useAtom(configAtom);
}

export function useCommand(){
  return useAtom(command)
}