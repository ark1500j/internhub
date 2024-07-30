import { Internship } from "@prisma/client";

type StudentSignUpInput = {
  name: string;
  referenceNumber: string;
  email: string;
  password: string;
  programme: string;
  phone: string;
  department: string;
};

type RecruitSignUpInput = {
  fullName: string;
  email: string;
  password: string;
  companyName: string;
  companyEmployees: string;
  isHiringManager: string;
  phone: string;
  companyProfile: any;
  UserProfile: any;
};

interface Application {
  id: string;
  message?: string;
  applicantId: string;
  internshipId: string;
  createdAt: Date;
  applicationStatus?: string;
  internship: Internship;
}

// interface Application {
//   id: string;
//   applicantId: string;
//   internshipId: string;
//   applicationStatus: "pending" | "approved" | "rejected" | "hired";
//   createdAt: string;
//   message: string;
//   applicant: Applicant;
// }
