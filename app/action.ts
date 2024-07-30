"use server";
import { prisma } from "@/utils/dbclient";
import { emailTransporter } from "@/utils/etransporter";
import {
  formatDateToCustomString,
  GenerateNumericOTP,
} from "@/utils/generateotp";
import { hashPassword } from "@/utils/hash";
import { capitalizeFirstLetter, utapi } from "@/utils/util";
import { compare } from "bcrypt";
import { JWTPayload, jwtVerify, SignJWT } from "jose";
import { cookies } from "next/headers";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import fs from "fs";
import path from "path";
import { StudentSignUpInput } from "@/types";
import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";

export async function signInAction(
  email: string,
  password: string,
  role: string
) {
  try {
    if (role === "student") {
      const user = await prisma.student.findUnique({ where: { email } });
      if (!user) return { message: "invalid" };

      if (!user.isActive) {
        return { message: "inactive" };
      }

      const match = await compare(password, user.password);

      if (!match) return { message: "invalid" };

      const secretKey = new TextEncoder().encode(process.env.JWT_SECRET);
      const token = await new SignJWT({ ...user, role:role })
        .setProtectedHeader({ alg: "HS256" })
        .sign(secretKey);

      cookies().set({
        name: "token",
        value: token,
        secure: true,
        httpOnly: true,
      });

      return { message: "valid" };
    } else if (role === "recruit") {
      const user = await prisma.companyRepresentative.findUnique({
        where: { email },
        include: { company: true },
      });
      if (!user) return { message: "invalid" };

      if (!user.isActive) {
        return { message: "inactive" };
      }

      const match = await compare(password, user.password);

      if (!match) return { message: "invalid" };

      const secretKey = new TextEncoder().encode(process.env.JWT_SECRET);
      const token = await new SignJWT({ ...user, role })
        .setProtectedHeader({ alg: "HS256" })
        .sign(secretKey);

      cookies().set({
        name: "token",
        value: token,
        secure: true,
        httpOnly: true,
      });

      return { message: "valid" };
    }
  } catch (error) {
    console.log(error);
  }
}

export async function StudentsignUpAction(data: StudentSignUpInput) {
  const {
    name,
    email,
    phone,
    password,
    referenceNumber,
    department,
    programme,
  } = data;

  try {
    const exits = await prisma.student.findUnique({ where: { email } });

    if (exits) return { message: "valid" };

    const hash = await hashPassword(password);
    const otp = GenerateNumericOTP();
    const user = await prisma.student.create({
      data: {
        name,
        email,
        password: hash,
        contact_number: phone,
        department,
        programme,
        reference_number: referenceNumber,
        otp,
        isActive: false,
      },
    });

    if (!user) return;

    //   const transport = await emailTransporter.sendMail({
    //     from: '"InternHub" <blinder1500j@gmail.com>',
    //     to: email,
    //     subject: "InterHub verificaion code",
    //     html: `
    //   <!DOCTYPE html>
    //   <html lang="en">
    //   <head>
    //       <meta charset="UTF-8">
    //       <meta name="viewport" content="width=device-width, initial-scale=1.0">
    //       <title>OTP Verification</title>
    //       <style>
    //           body {
    //               font-family: Arial, sans-serif;
    //               background-color: #f4f4f4;
    //               margin: 0;
    //               padding: 0;
    //               text-align: center;
    //           }
    //           .container {
    //               width: 100%;
    //               padding: 20px;
    //           }
    //           .content {
    //               background-color: #ffffff;
    //               border-radius: 10px;
    //               padding: 20px;
    //               margin: 0 auto;
    //               max-width: 500px;
    //               box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    //           }
    //           h1 {
    //               color: #333333;
    //           }
    //           p {
    //               color: #666666;
    //               line-height: 1.5;
    //           }
    //           .otp {
    //               font-size: 24px;
    //               font-weight: bold;
    //               color: #333333;
    //           }
    //           .footer {
    //               margin-top: 20px;
    //               font-size: 12px;
    //               color: #999999;
    //           }
    //       </style>
    //   </head>
    //   <body>
    //       <div class="container">
    //           <div class="content">
    //               <h1>OTP Verification</h1>
    //               <p>Hello,</p>
    //               <p>Your One-Time Password (OTP) for verification is:</p>
    //               <p class="otp">${otp}</p>
    //               <p>Please use this OTP to complete your verification. This verificaion code should not be shared with anyone.</p>
    //               <p>Thank you,</p>
    //               <p>The InternHub Team</p>
    //           </div>
    //           <div class="footer">
    //               <p>If you did not request this OTP, please ignore this email or contact support.</p>
    //           </div>
    //       </div>
    //   </body>
    //   </html>
    // `,
    //   })

    return { message: "valid" };
  } catch (error) {
    console.log("error", error);
    return { message: "invalid" };
  }
}

export async function RecruitSignUpAction(formData: FormData) {
  try {
    // Extract other form data
    const name = formData.get("fullName") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const contactNumber = formData.get("phone") as string;
    const companyName = formData.get("companyName") as string;
    const companyLocation = formData.get("location") as string;
    const ishiringmanager = formData.get("isHiringManager") as string;
    const headcount = formData.get("companyEmployees") as string;

    const exits = await prisma.companyRepresentative.findUnique({
      where: { email },
    });
    if (exits) {
      return { success: true };
    }
    const files = [];

    // Upload company profile if present
    let companyProfileUrl = null;
    let companyProfileKey = null;
    if (formData.has("companyProfile")) {
      const companyProfile = formData.get("companyProfile") as File;
      const uploadCompanyProfile = await utapi.uploadFiles(companyProfile);
      files.push(uploadCompanyProfile);
      companyProfileUrl = uploadCompanyProfile.data?.url;
      companyProfileKey = uploadCompanyProfile.data?.key;
    }

    // Upload user profile if present
    let userProfileUrl = null;
    let userProfileKey = null;
    if (formData.has("userProfile")) {
      const userProfile = formData.get("userProfile") as File;
      const uploadUserProfile = await utapi.uploadFiles(userProfile);
      files.push(uploadUserProfile);
      userProfileUrl = uploadUserProfile.data?.url;
      userProfileKey = uploadUserProfile.data?.key;
    }

    // Create company record
    const company = await prisma.company.create({
      data: {
        name: companyName,
        location: companyLocation,
        headcount,
        profile_url: companyProfileUrl,
        profile_key: companyProfileKey,
      },
    });
    const hash = await hashPassword(password);
    // Create company representative record
    const otp = GenerateNumericOTP();
    const user = await prisma.companyRepresentative.create({
      data: {
        name: name,
        email: email,
        password: hash,
        contact_number: contactNumber,
        company_id: company.id,
        isActive: false,
        otp,
        ishiringmanager,
        profile_url: userProfileUrl,
        profile_key: userProfileKey,
      },
    });
    //   const transport = await emailTransporter.sendMail({
    //     from: '"InternHub" <blinder1500j@gmail.com>',
    //     to: email,
    //     subject: "InterHub verificaion code",
    //     html: `
    //   <!DOCTYPE html>
    //   <html lang="en">
    //   <head>
    //       <meta charset="UTF-8">
    //       <meta name="viewport" content="width=device-width, initial-scale=1.0">
    //       <title>OTP Verification</title>
    //       <style>
    //           body {
    //               font-family: Arial, sans-serif;
    //               background-color: #f4f4f4;
    //               margin: 0;
    //               padding: 0;
    //               text-align: center;
    //           }
    //           .container {
    //               width: 100%;
    //               padding: 20px;
    //           }
    //           .content {
    //               background-color: #ffffff;
    //               border-radius: 10px;
    //               padding: 20px;
    //               margin: 0 auto;
    //               max-width: 500px;
    //               box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    //           }
    //           h1 {
    //               color: #333333;
    //           }
    //           p {
    //               color: #666666;
    //               line-height: 1.5;
    //           }
    //           .otp {
    //               font-size: 24px;
    //               font-weight: bold;
    //               color: #333333;
    //           }
    //           .footer {
    //               margin-top: 20px;
    //               font-size: 12px;
    //               color: #999999;
    //           }
    //       </style>
    //   </head>
    //   <body>
    //       <div class="container">
    //           <div class="content">
    //               <h1>OTP Verification</h1>
    //               <p>Hello,</p>
    //               <p>Your One-Time Password (OTP) for verification is:</p>
    //               <p class="otp">${otp}</p>
    //               <p>Please use this OTP to complete your verification. This verificaion code should not be shared with anyone.</p>
    //               <p>Thank you,</p>
    //               <p>The InternHub Team</p>
    //           </div>
    //           <div class="footer">
    //               <p>If you did not request this OTP, please ignore this email or contact support.</p>
    //           </div>
    //       </div>
    //   </body>
    //   </html>
    // `,
    //   })

    return { success: true, user, company };
  } catch (error) {
    console.error("Error in RecruitSignUpAction:", error);
    return { success: false, error };
  }
}

export async function otpVerifyAction(
  email: string,
  otp: string,
  role: string
) {
  try {
    if (role === "student") {
      const user = await prisma.student.findUnique({ where: { email, otp } });

      if (!user) return { message: "invalid" };

      await prisma.student.update({
        data: { isActive: true },
        where: { email },
      });
      return { message: "valid" };
    } else if (role === "recruit") {
      const user = await prisma.companyRepresentative.findUnique({
        where: { email, otp },
      });
      if (!user) return { message: "invalid" };
      await prisma.companyRepresentative.update({
        data: { isActive: true },
        where: { email },
      });
      return { message: "valid" };
    }
  } catch (error) {
    console.log("error:", error);
    return { message: "invalid" };
  }
}
export async function resendOtpAction(email: string, role: string) {
  const otp = GenerateNumericOTP();
  try {
    if (role === "student") {
      const user = await prisma.student.findUnique({ where: { email } });
      if (!user) return;
      await prisma.student.update({
        where: { email },
        data: { otp },
      });
      //   const transport = await emailTransporter.sendMail({
      //     from: '"InternHub" <blinder1500j@gmail.com>',
      //     to: email,
      //     subject: "InterHub verificaion code",
      //     html: `
      //   <!DOCTYPE html>
      //   <html lang="en">
      //   <head>
      //       <meta charset="UTF-8">
      //       <meta name="viewport" content="width=device-width, initial-scale=1.0">
      //       <title>OTP Verification</title>
      //       <style>
      //           body {
      //               font-family: Arial, sans-serif;
      //               background-color: #f4f4f4;
      //               margin: 0;
      //               padding: 0;
      //               text-align: center;
      //           }
      //           .container {
      //               width: 100%;
      //               padding: 20px;
      //           }
      //           .content {
      //               background-color: #ffffff;
      //               border-radius: 10px;
      //               padding: 20px;
      //               margin: 0 auto;
      //               max-width: 500px;
      //               box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
      //           }
      //           h1 {
      //               color: #333333;
      //           }
      //           p {
      //               color: #666666;
      //               line-height: 1.5;
      //           }
      //           .otp {
      //               font-size: 24px;
      //               font-weight: bold;
      //               color: #333333;
      //           }
      //           .footer {
      //               margin-top: 20px;
      //               font-size: 12px;
      //               color: #999999;
      //           }
      //       </style>
      //   </head>
      //   <body>
      //       <div class="container">
      //           <div class="content">
      //               <h1>OTP Verification</h1>
      //               <p>Hello,</p>
      //               <p>Your One-Time Password (OTP) for verification is:</p>
      //               <p class="otp">${otp}</p>
      //               <p>Please use this OTP to complete your verification. This verificaion code should not be shared with anyone.</p>
      //               <p>Thank you,</p>
      //               <p>The InternHub Team</p>
      //           </div>
      //           <div class="footer">
      //               <p>If you did not request this OTP, please ignore this email or contact support.</p>
      //           </div>
      //       </div>
      //   </body>
      //   </html>
      // `,
      //   })
      return { message: "valid" };
    } else if (role === "recruit") {
      const user = await prisma.companyRepresentative.findUnique({
        where: { email },
      });
      if (!user) return;
      await prisma.companyRepresentative.update({
        where: { email },
        data: { otp },
      });
      // const transport = await emailTransporter.sendMail({
      //     from: '"InternHub" <blinder1500j@gmail.com>',
      //     to: email,
      //     subject: "InterHub verificaion code",
      //     html: `
      //   <!DOCTYPE html>
      //   <html lang="en">
      //   <head>
      //       <meta charset="UTF-8">
      //       <meta name="viewport" content="width=device-width, initial-scale=1.0">
      //       <title>OTP Verification</title>
      //       <style>
      //           body {
      //               font-family: Arial, sans-serif;
      //               background-color: #f4f4f4;
      //               margin: 0;
      //               padding: 0;
      //               text-align: center;
      //           }
      //           .container {
      //               width: 100%;
      //               padding: 20px;
      //           }
      //           .content {
      //               background-color: #ffffff;
      //               border-radius: 10px;
      //               padding: 20px;
      //               margin: 0 auto;
      //               max-width: 500px;
      //               box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
      //           }
      //           h1 {
      //               color: #333333;
      //           }
      //           p {
      //               color: #666666;
      //               line-height: 1.5;
      //           }
      //           .otp {
      //               font-size: 24px;
      //               font-weight: bold;
      //               color: #333333;
      //           }
      //           .footer {
      //               margin-top: 20px;
      //               font-size: 12px;
      //               color: #999999;
      //           }
      //       </style>
      //   </head>
      //   <body>
      //       <div class="container">
      //           <div class="content">
      //               <h1>OTP Verification</h1>
      //               <p>Hello,</p>
      //               <p>Your One-Time Password (OTP) for verification is:</p>
      //               <p class="otp">${otp}</p>
      //               <p>Please use this OTP to complete your verification. This verificaion code should not be shared with anyone.</p>
      //               <p>Thank you,</p>
      //               <p>The InternHub Team</p>
      //           </div>
      //           <div class="footer">
      //               <p>If you did not request this OTP, please ignore this email or contact support.</p>
      //           </div>
      //       </div>
      //   </body>
      //   </html>
      // `,
      //   })
      return { message: "valid" };
    }
  } catch (error) {
    console.log(error);
  }
}

export async function PostIntershipAction(formData: FormData) {
  try {
    const token = cookies().get("token");
    if (!token) return;
    const secretKey = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token.value, secretKey);
    const { representative_id } = payload;

    const internshipData = {
      title: formData.get("jobTitle") as string,
      requirements: formData.get("requirements") as string,
      description: formData.get("description") as string,
      duration: formData.get("duration") as string,
      expected_applicants: formData.get("expectedapplicant") as string,
      programme: formData.get("programme") as string,
      type: formData.get("jobLocation") as string,
      location: formData.get("location") as string,
      start_date: new Date(formData.get("start_date") as string),
      end_date: new Date(formData.get("end_date") as string),
    };

    const post = await prisma.internship.create({
      data: {
        ...internshipData,
        representative: {
          connect: { representative_id: representative_id as string },
        },
      },
    });

    return { sucess: true, post };
  } catch (error) {
    console.log(error);
  }
}

export async function ApplyInternshipAction(postid: string, message: string) {
  try {
    const token = cookies().get("token");
    if (!token) return;

    const secretKey = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token.value, secretKey);

    console.log(postid, message);

    const application = await prisma.application.create({
      data: {
        message: message,
        internshipId: postid,
        applicantId: payload.id as string,
        applicationStatus: "pending",
      },
    });
    if (!application)
      return { sucess: false, message: "application unsucessesfull" };

    return { sucess: true, message: "application sucessesfull" };
  } catch (error) {
    console.log(error);
  }
}

// pages/api/generate-pdf.js

export async function generatePdfAction() {
  try {
    const token = cookies().get("token");
    if (!token) return;

    const secretKey = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token.value, secretKey);
    if (!payload) return;
    // Load the existing PDF template
    const filePath = path.resolve(".", "public/letter.pdf");
    const existingPdfBytes = fs.readFileSync(filePath);

    // Load the PDF with pdf-lib
    const pdfDoc = await PDFDocument.load(existingPdfBytes);

    const timesFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);
    // Get the first page of the PDF
    const pages = pdfDoc.getPages();
    const firstPage = pages[0];

    // Insert the values at the specified locations on the page
    firstPage.drawText(payload.name as string, {
      x: 137,
      y: 470,
      size: 12,
      font: timesFont,
      color: rgb(0, 0, 0),
    });

    const date = new Date();
    firstPage.drawText(formatDateToCustomString(date.toISOString()), {
      x: 412,
      y: 568,
      size: 12,
      font: timesFont,
      color: rgb(0, 0, 0),
    });

    firstPage.drawText(
      "Bsc " + capitalizeFirstLetter(payload.programme as string),
      {
        x: 145,
        y: 450,
        size: 12,
        font: timesFont,
        color: rgb(0, 0, 0),
      }
    );

    firstPage.drawText(payload.contact_number as string, {
      x: 149,
      y: 432,
      size: 12,
      font: timesFont,
      color: rgb(0, 0, 0),
    });

    // Serialize the PDFDocument to bytes (a Uint8Array)
    const pdfBytes = await pdfDoc.save();

    // Convert the PDF to a base64 string

    // Return the base64 string
    return { sucess: true, pdf: pdfBytes };
  } catch (error) {
    console.log("error:", error);
    return { error: "Failed to generate PDF" };
  }
}

export async function generateAcceptPdfAction(id: string) {
  try {
    const application = await prisma.application.findUnique({
      where: { id },
      include: {
        applicant: { select: { name: true } },
        internship: {
          include: { representative: { include: { company: {select:{name:true}} } } },
        },
      },
    });

    if(!application) return {success:false, message:'application does not exits'};
    // Load the existing PDF template
    const filePath = path.resolve(".", "public/accept.pdf");
    const existingPdfBytes = fs.readFileSync(filePath);

    // Load the PDF with pdf-lib
    const pdfDoc = await PDFDocument.load(existingPdfBytes);

    const timesFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);
    // Get the first page of the PDF
    const pages = pdfDoc.getPages();
    const firstPage = pages[0];

    // Insert the values at the specified locations on the page
    firstPage.drawText(
      formatDateToCustomString(application.internship?.start_date?.toISOString() || ''),
      {
        x: 218,
        y: 527,
        size: 11,
        font: timesFont,
        color: rgb(0, 0, 0),
      }
    );

    firstPage.drawText(
      formatDateToCustomString(
        application.internship?.end_date?.toISOString() || ""
      ),
      {
        x: 384,
        y: 527,
        size: 11,
        font: timesFont,
        color: rgb(0, 0, 0),
      }
    );

    const date = new Date();
    firstPage.drawText(formatDateToCustomString(date.toISOString()), {
      x: 475,
      y: 687,
      size: 11,
      font: timesFont,
      color: rgb(0, 0, 0),
    });

    firstPage.drawText(
      application.internship.title + ".",
      {
        x: 169,
        y: 549,
        size: 11,
        font: timesFont,
        color: rgb(0, 0, 0),
      }
    );

    firstPage.drawText(application.internship.representative.company.name, {
      x: 450,
      y: 578, 
      size: 11,
      font: timesFont,
      color: rgb(0, 0, 0),
    });

    firstPage.drawText(application.applicant.name + ",", {
      x: 388,
      y: 438,
      size: 12,
      font: timesFont,
      color: rgb(0, 0, 0),
    });
    // Serialize the PDFDocument to bytes (a Uint8Array)
    const pdfBytes = await pdfDoc.save();

    // Convert the PDF to a base64 string

    // Return the base64 string
    return { sucess: true, pdf: pdfBytes };
  } catch (error) {
    console.log("error:", error);
    return { error: "Failed to generate PDF" };
  }
}

export async function RecruitAction(action: string, id: string) {
  try {
    if (action === "hire") {
      const hireaction = await prisma.application.update({
        where: { id },
        data: { applicationStatus: "hired" },
        include: { applicant: true, internship: true },
      });
      const emailText = `
Dear ${hireaction.applicant.name},

We are thrilled to inform you that you have been selected for the ${hireaction.internship.title} internship.
Best regards.

Please log in to the app to formally accept the offer and to find more details about the next steps.
      `;
      const mailOptions = {
        from: '"InternHub" <blinder1500j@gmail.com>',
        to: hireaction.applicant.email,
        subject: "Application Status from Internhub",
        text: emailText,
      };
      const email = await emailTransporter.sendMail(mailOptions);

      return {
        success: true,
        message: "student hired",
        id: hireaction.internshipId,
      };
    } else if (action === "reject") {
      const hireaction = await prisma.application.update({
        where: { id },
        data: { applicationStatus: "rejected" },
        include: { applicant: true, internship: true },
      });
      const emailText = `
Dear ${hireaction.applicant.name},
Thank you for applying for the ${hireaction.internship.title} internship. After careful consideration, we have decided to proceed with other candidates.
We appreciate your interest and effort. Please feel free to apply for future opportunities with us.
Best regards
      `;
      const mailOptions = {
        from: '"InternHub" <blinder1500j@gmail.com>',
        to: hireaction.applicant.email,
        subject: "Application Status from Internhub",
        text: emailText,
      };
      const email = await emailTransporter.sendMail(mailOptions);
      revalidateTag("applications");
      return {
        success: true,
        message: "student rejected",
        id: hireaction.internshipId,
      };
    }
  } catch (error) {
    console.log(error);
    return { success: true, message: "student rejected" };
  }
}
////Reset Password Action for Users
export async function VerifyEmailAction(email: string, role: string) {
  const otp = GenerateNumericOTP();
  try {
    if (role === "student") {
      const user = await prisma.student.findUnique({ where: { email } });
      if (!user) return { success: false, message: "internal server error" };
      const newUser = await prisma.student.update({
        where: { email },
        data: { otp },
      });
      if (!user) return { success: false, message: "internal server error" };
      // const transport = await emailTransporter.sendMail({
      //     from: '"InternHub" <blinder1500j@gmail.com>',
      //     to: email,
      //     subject: "InterHub verificaion code",
      //     html: `
      //   <!DOCTYPE html>
      //   <html lang="en">
      //   <head>
      //       <meta charset="UTF-8">
      //       <meta name="viewport" content="width=device-width, initial-scale=1.0">
      //       <title>OTP Verification</title>
      //       <style>
      //           body {
      //               font-family: Arial, sans-serif;
      //               background-color: #f4f4f4;
      //               margin: 0;
      //               padding: 0;
      //               text-align: center;
      //           }
      //           .container {
      //               width: 100%;
      //               padding: 20px;
      //           }
      //           .content {
      //               background-color: #ffffff;
      //               border-radius: 10px;
      //               padding: 20px;
      //               margin: 0 auto;
      //               max-width: 500px;
      //               box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
      //           }
      //           h1 {
      //               color: #333333;
      //           }
      //           p {
      //               color: #666666;
      //               line-height: 1.5;
      //           }
      //           .otp {
      //               font-size: 24px;
      //               font-weight: bold;
      //               color: #333333;
      //           }
      //           .footer {
      //               margin-top: 20px;
      //               font-size: 12px;
      //               color: #999999;
      //           }
      //       </style>
      //   </head>
      //   <body>
      //       <div class="container">
      //           <div class="content">
      //               <h1>OTP Verification</h1>
      //               <p>Hello,</p>
      //               <p>Your One-Time Password (OTP) for verification is:</p>
      //               <p class="otp">${otp}</p>
      //               <p>Please use this OTP to complete your verification. This verificaion code should not be shared with anyone.</p>
      //               <p>Thank you,</p>
      //               <p>The InternHub Team</p>
      //           </div>
      //           <div class="footer">
      //               <p>If you did not request this OTP, please ignore this email or contact support.</p>
      //           </div>
      //       </div>
      //   </body>
      //   </html>
      // `,
      //   })
      return { success: true, message: "user valid" };
    } else if (role === "recruit") {
      const user = await prisma.companyRepresentative.findUnique({
        where: { email },
      });
      if (!user) return { success: false, message: "internal server error" };

      const newUser = await prisma.companyRepresentative.update({
        where: { email },
        data: { otp },
      });

      // const transport = await emailTransporter.sendMail({
      //     from: '"InternHub" <blinder1500j@gmail.com>',
      //     to: email,
      //     subject: "InterHub verificaion code",
      //     html: `
      //   <!DOCTYPE html>
      //   <html lang="en">
      //   <head>
      //       <meta charset="UTF-8">
      //       <meta name="viewport" content="width=device-width, initial-scale=1.0">
      //       <title>OTP Verification</title>
      //       <style>
      //           body {
      //               font-family: Arial, sans-serif;
      //               background-color: #f4f4f4;
      //               margin: 0;
      //               padding: 0;
      //               text-align: center;
      //           }
      //           .container {
      //               width: 100%;
      //               padding: 20px;
      //           }
      //           .content {
      //               background-color: #ffffff;
      //               border-radius: 10px;
      //               padding: 20px;
      //               margin: 0 auto;
      //               max-width: 500px;
      //               box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
      //           }
      //           h1 {
      //               color: #333333;
      //           }
      //           p {
      //               color: #666666;
      //               line-height: 1.5;
      //           }
      //           .otp {
      //               font-size: 24px;
      //               font-weight: bold;
      //               color: #333333;
      //           }
      //           .footer {
      //               margin-top: 20px;
      //               font-size: 12px;
      //               color: #999999;
      //           }
      //       </style>
      //   </head>
      //   <body>
      //       <div class="container">
      //           <div class="content">
      //               <h1>OTP Verification</h1>
      //               <p>Hello,</p>
      //               <p>Your One-Time Password (OTP) for verification is:</p>
      //               <p class="otp">${otp}</p>
      //               <p>Please use this OTP to complete your verification. This verificaion code should not be shared with anyone.</p>
      //               <p>Thank you,</p>
      //               <p>The InternHub Team</p>
      //           </div>
      //           <div class="footer">
      //               <p>If you did not request this OTP, please ignore this email or contact support.</p>
      //           </div>
      //       </div>
      //   </body>
      //   </html>
      // `,
      //   })
      return { success: true, message: "user valid" };
    }
  } catch (error) {
    console.log(error);
    return { success: false, message: "internal server error" };
  }
}

export async function ResetPasswordAction(
  email: string,
  otp: string,
  password: string,
  role: string
) {
  try {
    // Verify OTP
    if (role === "student") {
      const otpRecord = await prisma.student.findUnique({
        where: {
          email,
          otp,
        },
      });

      if (!otpRecord) {
        return { success: false, message: "Invalid OTP" };
      }

      // Hash the new password
      const hashedPassword = await hashPassword(password);

      // Update the password in the database
      const user = await prisma.student.update({
        where: { email },
        data: { password: hashedPassword },
      });

      return { success: true, message: "Password updated successfully" };
    } else if (role === "recruit") {
      const otpRecord = await prisma.companyRepresentative.findUnique({
        where: {
          email,
          otp,
        },
      });

      if (!otpRecord) {
        return { success: false, message: "Invalid OTP" };
      }

      // Hash the new password
      const hashedPassword = await hashPassword(password);

      // Update the password in the database
      const user = await prisma.companyRepresentative.update({
        where: { email },
        data: { password: hashedPassword },
      });

      return { success: true, message: "Password updated successfully" };
    }
  } catch (error) {
    console.error("Error resetting password:", error);
    return {
      success: false,
      message: "An error occurred while resetting the password",
    };
  }
}
export async function SoftDeletAction(id: string) {
  try {
    const internship = await prisma.internship.update({
      where: { id },
      data: { soft_delete: true },
    });
    return {
      success: true,
      message: "delete successfull",
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: "An error occurred while resetting the password",
    };
  }
}


export async function LogoutAction(role:string) {
 
    cookies().delete("token");
    if(role==="student"){
      redirect("/student");
    }else if (role==="recruit"){
      redirect("/recruit")
    }
    
}