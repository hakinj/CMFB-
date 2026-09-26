ALTER TABLE "profiles" ALTER COLUMN "status" SET DATA TYPE text;--> statement-breakpoint
DROP TYPE "public"."user_status";--> statement-breakpoint
CREATE TYPE "public"."user_status" AS ENUM('active', 'restricted', 'pending');--> statement-breakpoint
ALTER TABLE "profiles" ALTER COLUMN "status" SET DATA TYPE "public"."user_status" USING "status"::"public"."user_status";