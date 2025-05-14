import { PrismaClient, Prisma } from "./generated/prisma/index.js";

export const prismaClient = new PrismaClient();
export const prisma = Prisma;
