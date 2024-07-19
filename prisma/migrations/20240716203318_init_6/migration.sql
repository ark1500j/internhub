/*
  Warnings:

  - The primary key for the `CompanyRepresentative` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Added the required column `duration` to the `Internship` table without a default value. This is not possible if the table is not empty.
  - Added the required column `programme` to the `Internship` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `Internship` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_CompanyRepresentative" (
    "representative_id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "contact_number" TEXT NOT NULL,
    "company_id" INTEGER NOT NULL,
    "profile_url" TEXT,
    "profile_key" TEXT,
    "ishiringmanager" TEXT,
    "isActive" BOOLEAN,
    "otp" TEXT,
    CONSTRAINT "CompanyRepresentative_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "Company" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_CompanyRepresentative" ("company_id", "contact_number", "email", "isActive", "ishiringmanager", "name", "otp", "password", "profile_key", "profile_url", "representative_id") SELECT "company_id", "contact_number", "email", "isActive", "ishiringmanager", "name", "otp", "password", "profile_key", "profile_url", "representative_id" FROM "CompanyRepresentative";
DROP TABLE "CompanyRepresentative";
ALTER TABLE "new_CompanyRepresentative" RENAME TO "CompanyRepresentative";
CREATE UNIQUE INDEX "CompanyRepresentative_email_key" ON "CompanyRepresentative"("email");
CREATE UNIQUE INDEX "CompanyRepresentative_company_id_key" ON "CompanyRepresentative"("company_id");
CREATE INDEX "representative_company_idx" ON "CompanyRepresentative"("company_id");
CREATE TABLE "new_Application" (
    "id" TEXT NOT NULL,
    "message" TEXT,
    "applicantId" TEXT NOT NULL,
    "internshipId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "applicationStatus" TEXT,
    CONSTRAINT "Application_applicantId_fkey" FOREIGN KEY ("applicantId") REFERENCES "Student" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Application_internshipId_fkey" FOREIGN KEY ("internshipId") REFERENCES "Internship" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Application" ("applicantId", "applicationStatus", "createdAt", "id", "internshipId", "message") SELECT "applicantId", "applicationStatus", "createdAt", "id", "internshipId", "message" FROM "Application";
DROP TABLE "Application";
ALTER TABLE "new_Application" RENAME TO "Application";
CREATE UNIQUE INDEX "Application_id_key" ON "Application"("id");
CREATE TABLE "new_Internship" (
    "id" TEXT NOT NULL,
    "posted_by" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "title" TEXT NOT NULL,
    "requirements" TEXT,
    "description" TEXT NOT NULL,
    "duration" TEXT NOT NULL,
    "expected_applicants" TEXT,
    "programme" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "location" TEXT,
    "start_date" DATETIME,
    "end_date" DATETIME,
    CONSTRAINT "Internship_posted_by_fkey" FOREIGN KEY ("posted_by") REFERENCES "CompanyRepresentative" ("representative_id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Internship" ("createdAt", "description", "end_date", "id", "location", "posted_by", "requirements", "start_date", "title") SELECT "createdAt", "description", "end_date", "id", "location", "posted_by", "requirements", "start_date", "title" FROM "Internship";
DROP TABLE "Internship";
ALTER TABLE "new_Internship" RENAME TO "Internship";
CREATE UNIQUE INDEX "Internship_id_key" ON "Internship"("id");
PRAGMA foreign_key_check("CompanyRepresentative");
PRAGMA foreign_key_check("Application");
PRAGMA foreign_key_check("Internship");
PRAGMA foreign_keys=ON;
