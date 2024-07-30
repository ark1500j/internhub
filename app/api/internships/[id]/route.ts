import {prisma} from "@/utils/dbclient"
type Props ={
    params:{
        id:string
    }
}

export async function GET(request:Request,{params:{id}}:Props) {
     
    // const id= request.url.slice(request.url.lastIndexOf("/")+ 1);
    const user= await prisma.companyRepresentative.findUnique({where:{representative_id:id}})
    const company = await prisma.company.findUnique({where:{id:user?.company_id}})
     
    if(!company) return;
     
    return Response.json(company);
}