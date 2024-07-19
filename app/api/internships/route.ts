
import { prisma } from "@/utils/dbclient"; 



export async function GET(request:Request){
   try{
    const data= await prisma.internship.findMany()
    return new Response(JSON.stringify(data), { status: 200 });
   }catch(error){
       console.log(error)
       return new Response("Internal Server Error", { status: 500 });
   }
    
}
