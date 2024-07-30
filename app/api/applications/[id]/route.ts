import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/utils/dbclient";

type Props = {
  params: {
    id: string;
  };
};

export async function DELETE(request: NextRequest, { params }: Props) {
  const { id } = params;
  console.log("Checking for application with ID:", id); // Log the ID for debugging

  try {
    // Check if the application exists
    const application = await prisma.application.findUnique({
      where: { id },
    });

    if (!application) {
      return NextResponse.json(
        { error: "Application not found" },
        { status: 404 }
      );
    }

    // If exists, delete the application
    const deletedApplication = await prisma.application.delete({
      where: { id },
    });

    return NextResponse.json(deletedApplication);
  } catch (error) {
    console.error("Error deleting application:", error);
    return NextResponse.json(
      { error: "Failed to delete application" },
      { status: 500 }
    );
  }
}
