-- CreateEnum
CREATE TYPE "NetworkUrgency" AS ENUM ('ROUTINE', 'URGENT');

-- CreateEnum
CREATE TYPE "NetworkConsultStatus" AS ENUM ('OPEN', 'RESOLVED');

-- CreateEnum
CREATE TYPE "NetworkAttachmentKind" AS ENUM ('IMAGE', 'PDF', 'FILE');

-- AlterEnum
ALTER TYPE "SpecialtyType" ADD VALUE 'ORTHODONTONTICS';

-- CreateTable
CREATE TABLE "NetworkConsult" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "clinicId" TEXT NOT NULL,
    "patientId" TEXT,
    "title" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "specialty" "SpecialtyType" NOT NULL DEFAULT 'GENERAL',
    "urgency" "NetworkUrgency" NOT NULL DEFAULT 'ROUTINE',
    "status" "NetworkConsultStatus" NOT NULL DEFAULT 'OPEN',
    "authorNameSnapshot" TEXT NOT NULL,
    "authorUserId" TEXT,

    CONSTRAINT "NetworkConsult_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NetworkMessage" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "consultId" TEXT NOT NULL,
    "authorNameSnapshot" TEXT NOT NULL,
    "authorUserId" TEXT,
    "body" TEXT NOT NULL,

    CONSTRAINT "NetworkMessage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NetworkAttachment" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "consultId" TEXT NOT NULL,
    "uploadedByNameSnapshot" TEXT,
    "uploadedByUserId" TEXT,
    "kind" "NetworkAttachmentKind" NOT NULL DEFAULT 'IMAGE',
    "url" TEXT NOT NULL,
    "mime" TEXT,

    CONSTRAINT "NetworkAttachment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "NetworkConsult_clinicId_createdAt_idx" ON "NetworkConsult"("clinicId", "createdAt");

-- CreateIndex
CREATE INDEX "NetworkConsult_clinicId_specialty_idx" ON "NetworkConsult"("clinicId", "specialty");

-- CreateIndex
CREATE INDEX "NetworkConsult_clinicId_urgency_idx" ON "NetworkConsult"("clinicId", "urgency");

-- CreateIndex
CREATE INDEX "NetworkConsult_clinicId_status_idx" ON "NetworkConsult"("clinicId", "status");

-- CreateIndex
CREATE INDEX "NetworkConsult_patientId_idx" ON "NetworkConsult"("patientId");

-- CreateIndex
CREATE INDEX "NetworkMessage_consultId_createdAt_idx" ON "NetworkMessage"("consultId", "createdAt");

-- CreateIndex
CREATE INDEX "NetworkAttachment_consultId_idx" ON "NetworkAttachment"("consultId");

-- CreateIndex
CREATE INDEX "NetworkAttachment_createdAt_idx" ON "NetworkAttachment"("createdAt");

-- AddForeignKey
ALTER TABLE "NetworkConsult" ADD CONSTRAINT "NetworkConsult_clinicId_fkey" FOREIGN KEY ("clinicId") REFERENCES "Clinic"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NetworkConsult" ADD CONSTRAINT "NetworkConsult_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NetworkConsult" ADD CONSTRAINT "NetworkConsult_authorUserId_fkey" FOREIGN KEY ("authorUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NetworkMessage" ADD CONSTRAINT "NetworkMessage_consultId_fkey" FOREIGN KEY ("consultId") REFERENCES "NetworkConsult"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NetworkMessage" ADD CONSTRAINT "NetworkMessage_authorUserId_fkey" FOREIGN KEY ("authorUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NetworkAttachment" ADD CONSTRAINT "NetworkAttachment_consultId_fkey" FOREIGN KEY ("consultId") REFERENCES "NetworkConsult"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NetworkAttachment" ADD CONSTRAINT "NetworkAttachment_uploadedByUserId_fkey" FOREIGN KEY ("uploadedByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
