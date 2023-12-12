/*
  Warnings:

  - Added the required column `instituicaoId` to the `Acordo` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Acordo" DROP CONSTRAINT "Acordo_id_fkey";

-- AlterTable
ALTER TABLE "Acordo" ADD COLUMN     "instituicaoId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Acordo" ADD CONSTRAINT "Acordo_instituicaoId_fkey" FOREIGN KEY ("instituicaoId") REFERENCES "Instituicao"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
