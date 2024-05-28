/*
  Warnings:

  - You are about to drop the column `reservationId` on the `Service` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Service" DROP CONSTRAINT "Service_reservationId_fkey";

-- AlterTable
ALTER TABLE "Service" DROP COLUMN "reservationId";

-- CreateTable
CREATE TABLE "_ReservationToService" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_ReservationToService_AB_unique" ON "_ReservationToService"("A", "B");

-- CreateIndex
CREATE INDEX "_ReservationToService_B_index" ON "_ReservationToService"("B");

-- AddForeignKey
ALTER TABLE "_ReservationToService" ADD CONSTRAINT "_ReservationToService_A_fkey" FOREIGN KEY ("A") REFERENCES "Reservation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ReservationToService" ADD CONSTRAINT "_ReservationToService_B_fkey" FOREIGN KEY ("B") REFERENCES "Service"("id") ON DELETE CASCADE ON UPDATE CASCADE;
