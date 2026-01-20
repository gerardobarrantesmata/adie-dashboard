/*
  Warnings:

  - The values [ORTHODONTONTICS] on the enum `SpecialtyType` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `invitedByUserId` on the `ClinicMember` table. All the data in the column will be lost.
  - You are about to drop the column `address1` on the `Location` table. All the data in the column will be lost.
  - You are about to drop the column `address2` on the `Location` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId,locationId]` on the table `LocationMember` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "SpecialtyType_new" AS ENUM ('GENERAL', 'ENDODONTICS', 'PERIODONTICS', 'PROSTHODONTICS', 'ORTHODONTICS', 'IMPLANTS', 'ORAL_SURGERY', 'PEDIATRIC', 'RADIOLOGY');
ALTER TABLE "public"."NetworkConsult" ALTER COLUMN "specialty" DROP DEFAULT;
ALTER TABLE "ProviderProfile" ALTER COLUMN "primarySpecialty" TYPE "SpecialtyType_new" USING ("primarySpecialty"::text::"SpecialtyType_new");
ALTER TABLE "ProviderSpecialty" ALTER COLUMN "specialty" TYPE "SpecialtyType_new" USING ("specialty"::text::"SpecialtyType_new");
ALTER TABLE "SpecialtyNote" ALTER COLUMN "specialty" TYPE "SpecialtyType_new" USING ("specialty"::text::"SpecialtyType_new");
ALTER TABLE "NetworkConsult" ALTER COLUMN "specialty" TYPE "SpecialtyType_new" USING ("specialty"::text::"SpecialtyType_new");
ALTER TYPE "SpecialtyType" RENAME TO "SpecialtyType_old";
ALTER TYPE "SpecialtyType_new" RENAME TO "SpecialtyType";
DROP TYPE "public"."SpecialtyType_old";
ALTER TABLE "NetworkConsult" ALTER COLUMN "specialty" SET DEFAULT 'GENERAL';
COMMIT;

-- DropForeignKey
ALTER TABLE "ClinicMember" DROP CONSTRAINT "ClinicMember_invitedByUserId_fkey";

-- DropIndex
DROP INDEX "ClinicMember_userId_createdAt_idx";

-- DropIndex
DROP INDEX "Encounter_clinicId_locationId_idx";

-- DropIndex
DROP INDEX "Location_clinicId_name_key";

-- DropIndex
DROP INDEX "LocationMember_clinicId_locationId_idx";

-- DropIndex
DROP INDEX "LocationMember_clinicId_userId_idx";

-- DropIndex
DROP INDEX "LocationMember_locationId_userId_key";

-- DropIndex
DROP INDEX "Patient_clinicId_locationId_idx";

-- DropIndex
DROP INDEX "User_createdAt_idx";

-- AlterTable
ALTER TABLE "ClinicMember" DROP COLUMN "invitedByUserId";

-- AlterTable
ALTER TABLE "Location" DROP COLUMN "address1",
DROP COLUMN "address2";

-- CreateIndex
CREATE INDEX "ClinicMember_userId_idx" ON "ClinicMember"("userId");

-- CreateIndex
CREATE INDEX "Encounter_locationId_idx" ON "Encounter"("locationId");

-- CreateIndex
CREATE INDEX "Encounter_providerUserId_idx" ON "Encounter"("providerUserId");

-- CreateIndex
CREATE INDEX "LocationMember_clinicId_idx" ON "LocationMember"("clinicId");

-- CreateIndex
CREATE INDEX "LocationMember_locationId_idx" ON "LocationMember"("locationId");

-- CreateIndex
CREATE INDEX "LocationMember_userId_idx" ON "LocationMember"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "LocationMember_userId_locationId_key" ON "LocationMember"("userId", "locationId");

-- CreateIndex
CREATE INDEX "Patient_locationId_idx" ON "Patient"("locationId");

-- AddForeignKey
ALTER TABLE "Encounter" ADD CONSTRAINT "Encounter_providerUserId_fkey" FOREIGN KEY ("providerUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
