import { NextResponse } from 'next/server';
import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const data = await request.json();

    // Validate data
    if (!data.email || !data.firstName || !data.username || !data.password) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const newUser = await prisma.user.create({
      data: {
        email: data.email,
        Name: data.firstName,
        username: data.username,
        password: data.password,
        cash: data.cash || 0,
        account_num: data.account_num || "",
        ifsc: data.ifsc || "",
      },
    });

    return NextResponse.json(newUser);
  } catch (error) {
    console.error('Error adding user:', error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        return NextResponse.json({ error: `A user with this ${error.meta} already exists` }, { status: 409 });
      }
    }
    return NextResponse.json({ error: 'Error adding user' }, { status: 500 });
  }
}
