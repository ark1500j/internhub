import { prisma } from "@/utils/dbclient";
type Props = {
  params: {
    id: string;
  };
};

export async function POST(request: Request, { params }: Props) {
  const { id } = params;
  console.log(id)
  try {
    const applications = await prisma.application.findMany({
      where: { internshipId: id },
      include: { applicant: true },
    });
    console.log(applications);

    return new Response(JSON.stringify(applications), {
      status: 200,
      statusText: "successfull",
    });
  } catch (error) {
    console.log(error);
  }
}
