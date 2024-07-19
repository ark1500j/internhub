import { NextRequest } from "next/server";




export async function POST(request:NextRequest){
   const data=  await request.formData()
    return new Response('hello world')
}