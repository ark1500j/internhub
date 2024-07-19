-- CreateTable
CREATE TABLE "Student" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "contact_number" TEXT NOT NULL,
    "reference_number" TEXT NOT NULL,
    "programme" TEXT NOT NULL,
    "department" TEXT NOT NULL,
    "profile_url" TEXT,
    "profile_key" TEXT,
    "otp" TEXT,
    "isActive" BOOLEAN NOT NULL
);

-- CreateTable
CREATE TABLE "Application" (
    "id" TEXT NOT NULL,
    "message" TEXT,
    "applicantId" TEXT NOT NULL,
    "internshipId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "applicationStatus" TEXT NOT NULL,
    CONSTRAINT "Application_applicantId_fkey" FOREIGN KEY ("applicantId") REFERENCES "Student" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Application_internshipId_fkey" FOREIGN KEY ("internshipId") REFERENCES "Internship" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Internship" (
    "id" TEXT NOT NULL,
    "posted_by" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "title" TEXT NOT NULL,
    "requirements" TEXT,
    "description" TEXT NOT NULL,
    "location" TEXT,
    "start_date" DATETIME,
    "end_date" DATETIME,
    CONSTRAINT "Internship_posted_by_fkey" FOREIGN KEY ("posted_by") REFERENCES "CompanyRepresentative" ("representative_id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "CompanyRepresentative" (
    "representative_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "contact_number" TEXT NOT NULL,
    "company_id" INTEGER NOT NULL,
    "profile_url" TEXT,
    "profile_key" TEXT,
    "isActive" BOOLEAN,
    "otp" TEXT,
    CONSTRAINT "CompanyRepresentative_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "Company" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Company" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "profile_url" TEXT,
    "profile_key" TEXT
);

-- CreateIndex
CREATE UNIQUE INDEX "Student_id_key" ON "Student"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Student_email_key" ON "Student"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Application_id_key" ON "Application"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Internship_id_key" ON "Internship"("id");

-- CreateIndex
CREATE UNIQUE INDEX "CompanyRepresentative_email_key" ON "CompanyRepresentative"("email");

-- CreateIndex
CREATE UNIQUE INDEX "CompanyRepresentative_company_id_key" ON "CompanyRepresentative"("company_id");

-- CreateIndex
CREATE INDEX "representative_company_idx" ON "CompanyRepresentative"("company_id");
