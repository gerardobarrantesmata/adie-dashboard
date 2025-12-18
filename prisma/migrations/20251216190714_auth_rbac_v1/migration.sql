/*
  Warnings:

  - You are about to drop the column `specialty` on the `ProviderProfile` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[code]` on the table `Clinic` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `code` to the `Clinic` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Clinic" ADD COLUMN     "code" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "ProviderProfile" DROP COLUMN "specialty",
ADD COLUMN     "primarySpecialty" "SpecialtyType";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "failedLoginCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "lastLoginAt" TIMESTAMP(3),
ADD COLUMN     "lockedUntil" TIMESTAMP(3),
ADD COLUMN     "passwordHash" TEXT;

-- CreateTable
CREATE TABLE "ProviderSpecialty" (
    "id" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "specialty" "SpecialtyType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProviderSpecialty_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ProviderSpecialty_specialty_idx" ON "ProviderSpecialty"("specialty");

-- CreateIndex
CREATE UNIQUE INDEX "ProviderSpecialty_providerId_specialty_key" ON "ProviderSpecialty"("providerId", "specialty");

-- CreateIndex
CREATE UNIQUE INDEX "Clinic_code_key" ON "Clinic"("code");

-- CreateIndex
CREATE INDEX "ProviderProfile_primarySpecialty_idx" ON "ProviderProfile"("primarySpecialty");

-- CreateIndex
CREATE INDEX "User_clinicId_isActive_idx" ON "User"("clinicId", "isActive");

-- AddForeignKey
ALTER TABLE "ProviderSpecialty" ADD CONSTRAINT "ProviderSpecialty_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "ProviderProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
