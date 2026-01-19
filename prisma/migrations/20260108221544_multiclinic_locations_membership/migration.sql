/*
  Warnings:

  - You are about to drop the column `clinicId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `role` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[email]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "MembershipStatus" AS ENUM ('INVITED', 'ACTIVE', 'SUSPENDED');

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_clinicId_fkey";

-- DropIndex
DROP INDEX "User_clinicId_email_key";

-- DropIndex
DROP INDEX "User_clinicId_isActive_idx";

-- DropIndex
DROP INDEX "User_clinicId_role_idx";

-- AlterTable
ALTER TABLE "Encounter" ADD COLUMN     "locationId" TEXT;

-- AlterTable
ALTER TABLE "Patient" ADD COLUMN     "locationId" TEXT;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "clinicId",
DROP COLUMN "role";

-- CreateTable
CREATE TABLE "Location" (
    "id" TEXT NOT NULL,
    "clinicId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "country" TEXT,
    "city" TEXT,
    "address1" TEXT,
    "address2" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Location_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClinicMember" (
    "id" TEXT NOT NULL,
    "clinicId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'STAFF',
    "status" "MembershipStatus" NOT NULL DEFAULT 'ACTIVE',
    "invitedByUserId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ClinicMember_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LocationMember" (
    "id" TEXT NOT NULL,
    "clinicId" TEXT NOT NULL,
    "locationId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LocationMember_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Location_clinicId_isActive_idx" ON "Location"("clinicId", "isActive");

-- CreateIndex
CREATE INDEX "Location_clinicId_createdAt_idx" ON "Location"("clinicId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "Location_clinicId_name_key" ON "Location"("clinicId", "name");

-- CreateIndex
CREATE INDEX "ClinicMember_clinicId_role_idx" ON "ClinicMember"("clinicId", "role");

-- CreateIndex
CREATE INDEX "ClinicMember_clinicId_status_idx" ON "ClinicMember"("clinicId", "status");

-- CreateIndex
CREATE INDEX "ClinicMember_userId_createdAt_idx" ON "ClinicMember"("userId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "ClinicMember_clinicId_userId_key" ON "ClinicMember"("clinicId", "userId");

-- CreateIndex
CREATE INDEX "LocationMember_clinicId_userId_idx" ON "LocationMember"("clinicId", "userId");

-- CreateIndex
CREATE INDEX "LocationMember_clinicId_locationId_idx" ON "LocationMember"("clinicId", "locationId");

-- CreateIndex
CREATE UNIQUE INDEX "LocationMember_locationId_userId_key" ON "LocationMember"("locationId", "userId");

-- CreateIndex
CREATE INDEX "Encounter_clinicId_locationId_idx" ON "Encounter"("clinicId", "locationId");

-- CreateIndex
CREATE INDEX "Patient_clinicId_locationId_idx" ON "Patient"("clinicId", "locationId");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_isActive_idx" ON "User"("isActive");

-- CreateIndex
CREATE INDEX "User_createdAt_idx" ON "User"("createdAt");

-- AddForeignKey
ALTER TABLE "Location" ADD CONSTRAINT "Location_clinicId_fkey" FOREIGN KEY ("clinicId") REFERENCES "Clinic"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClinicMember" ADD CONSTRAINT "ClinicMember_clinicId_fkey" FOREIGN KEY ("clinicId") REFERENCES "Clinic"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClinicMember" ADD CONSTRAINT "ClinicMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClinicMember" ADD CONSTRAINT "ClinicMember_invitedByUserId_fkey" FOREIGN KEY ("invitedByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LocationMember" ADD CONSTRAINT "LocationMember_clinicId_fkey" FOREIGN KEY ("clinicId") REFERENCES "Clinic"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LocationMember" ADD CONSTRAINT "LocationMember_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LocationMember" ADD CONSTRAINT "LocationMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Patient" ADD CONSTRAINT "Patient_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Encounter" ADD CONSTRAINT "Encounter_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location"("id") ON DELETE SET NULL ON UPDATE CASCADE;
