"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";


export async function SetupUser() {
      const { userId } = auth();
      if (!userId) {
        throw new Error("unauthenticated");
      }

      const balance = await prisma.userBalance.findUnique({ where: { userId }});

      if(!balance) {
        // Free 500 credits
        await prisma.userBalance.create({
            data: {
                userId,
                credits: 500
            }
        });
      }

      redirect("/");
}