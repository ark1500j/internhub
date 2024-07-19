"use server";
import { prisma } from "@/utils/dbclient";
import { emailTransporter } from "@/utils/etransporter";
import { GenerateNumericOTP } from "@/utils/generateotp";
import { hashPassword } from "@/utils/hash";
import { utapi } from "@/utils/util";
import { compare } from "bcrypt";
import { jwtVerify, SignJWT } from "jose";
import { cookies } from "next/headers";

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

      if (!match) return;

      const secretKey = new TextEncoder().encode(process.env.JWT_SECRET);
      const token = await new SignJWT({ ...user, role })
        .setProtectedHeader({ alg: "HS256" })
        .setExpirationTime("2 day")
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
        .setExpirationTime("2 day")
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
      programme: JSON.stringify(formData.get("programme")),
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
      },
    });
    if (!application)
      return { sucess: false, message: "application unsucessesfull" };

    return { sucess: true, message: "application sucessesfull" };
  } catch (error) {
    console.log(error);
  }
}
