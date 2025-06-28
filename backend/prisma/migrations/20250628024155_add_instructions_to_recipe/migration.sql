-- AlterEnum
ALTER TYPE "Category" ADD VALUE 'LANCHE';

-- AlterTable
ALTER TABLE "Recipe" ADD COLUMN     "instructions" TEXT,
ALTER COLUMN "description" DROP NOT NULL;
