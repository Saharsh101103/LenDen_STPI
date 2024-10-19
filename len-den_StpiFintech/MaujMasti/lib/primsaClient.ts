// lib/prisma.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Prevent multiple instances in development
if (process.env.NODE_ENV === 'development') {
  global.prisma = global.prisma || prisma;
}

export default prisma;
