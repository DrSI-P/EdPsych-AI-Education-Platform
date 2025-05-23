import { NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "../db";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  // Add your auth providers and other configuration here
  session: {
    strategy: "jwt",
  },
  // Add more configuration as needed
};
