import { NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { db } from "../db";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db.prisma),
  // Add your auth providers and other configuration here
  session: {
    strategy: "jwt",
  },
  // Add more configuration as needed
};
