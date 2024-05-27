/*
  Warnings:

  - You are about to drop the `_ReservationToService` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_ReservationToService" DROP CONSTRAINT "_ReservationToService_A_fkey";

-- DropForeignKey
ALTER TABLE "_ReservationToService" DROP CONSTRAINT "_ReservationToService_B_fkey";

-- DropTable
DROP TABLE "_ReservationToService";

-- AddForeignKey
ALTER TABLE "Reservation" ADD CONSTRAINT "Reservation_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reservation" ADD CONSTRAINT "Reservation_shopId_fkey" FOREIGN KEY ("shopId") REFERENCES "Shop"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
