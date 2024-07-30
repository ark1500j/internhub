import { z } from "zod";

const imageSchema = z.custom<File>((file) => {
    const validTypes = ['image/jpeg', 'image/png'];
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (!validTypes.includes(file.type) || file.size > maxSize) {
      return false;
    }
    return true;
  }, {
    message: 'Invalid file type or size. Only JPEG/PNG files less than 5MB are allowed.'
  });

  
  export const recruitFromSchema = z.object({
    fullName: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    companyName: z.string().min(1, "Name is required"),
    location: z.string().min(1, "required"),
    companyEmployees: z.enum(["30", "30+"]),
    isHiringManager: z.enum(["Yes", "No"], { message: "Required" }),
    phone: z.string().min(10, "phone is required"),
    companyProfile: z.any().refine((file) => {
      if (!file) return true; // Allow empty file input
      const validTypes = ["image/jpeg", "image/png"];
      const maxSize = 5 * 1024 * 1024; // 5MB
      return validTypes.includes(file.type) && file.size <= maxSize;
    }, "Invalid file type or size"),
    userProfile: z.any().refine((file) => {
      if (!file) return true; // Allow empty file input
      const validTypes = ["image/jpeg", "image/png"];
      const maxSize = 5 * 1024 * 1024; // 5MB
      return validTypes.includes(file.type) && file.size <= maxSize;
    }, "Invalid file type or size"),
  });

  export const postschema = z.object({
    jobTitle: z.string().min(1,"Job title is required"),
    location: z.string().min(1,"location is required" ),
    jobLocation: z.string().min(1,"required" ),
    duration: z.string().min(1,"required"),
    expectedapplicant: z.string().min(1,"required").refine((value) => {
      const parsedValue = parseInt(value, 10);
      return !isNaN(parsedValue) && parsedValue > 0;
    }, { message: "must be a positive non-zero number" }),
    dateRange: z.object({
      from: z.date(),
      to: z.date(),
    }).refine((value) => value.from < value.to, {
      message: 'To date must be after from date',
    }),
    programme:  z.array(
      z.object({
        label: z.string(),
        value: z.string(),
      })
    ).min(1, "At least one programme is required"),
    requirements: z.string().min(20,"text not enough"),
    description: z.string().min(1,"not enough text"),
  });