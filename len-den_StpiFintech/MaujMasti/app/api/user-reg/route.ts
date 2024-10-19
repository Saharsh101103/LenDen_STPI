import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/primsaClient';
import { PrismaClientValidationError } from '@prisma/client/runtime/library';



export async function GET(req: Request) {
  try {
    const url = new URL(req.url);  // Parse the request URL
    const email = url.searchParams.get('email');  // Get the 'email' query parameter

    if (!email) {
      return NextResponse.json({ message: 'Email is required' }, { status: 400 });
    }

    // Query the user from the database
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (user) {
      return NextResponse.json({ message: 'User found', user }, { status: 200 });
    } else {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

  } catch (error) {
    // Type narrowing for the unknown 'error' type
    if (error instanceof Error) {
      console.error("Error querying user:", error.message);
      return NextResponse.json({ message: 'Internal Server Error', error: error.message }, { status: 500 });
    } else {
      console.error("Unknown error occurred:", error);
      return NextResponse.json({ message: 'Internal Server Error', error: 'Unknown error' }, { status: 500 });
    }
  }
}


// Define POST request handler
export async function POST(req: NextRequest) {
  const body = await req.json(); // Read the JSON body
  const { email, name, username } = body;
  console.log("USER BODY:", email, name, username);

  try {
    // Validate required fields
    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    if (!username) {
      return NextResponse.json({ error: "Username is required" }, { status: 400 });
    }

    // Additional validation checks
    if (typeof email !== 'string' || !validateEmail(email)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 });
    }

    if (typeof username !== 'string' || username.length < 3) {
      return NextResponse.json({ error: "Username must be at least 3 characters long" }, { status: 400 });
    }

    // Check for existing user with the same email or username
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email },
          { username }
        ]
      }
    });

    if (existingUser) {
      return NextResponse.json({ error: "Email or username already exists" }, { status: 400 });
    }

    // Create the user
    const newUser = await prisma.user.create({
      data: {
        email,
        name: name || null, // Optional
        cash: 0,
        username, // Ensure it's a valid string
      },
    });

    return NextResponse.json(newUser, { status: 200 });

  } catch (error) {
    console.error('Error creating user:', error);

    // Check if it's a Prisma validation error
    if (error instanceof PrismaClientValidationError) {
      return NextResponse.json(
        { error: 'Prisma validation error', details: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Error creating user', details: error },
      { status: 500 }
    );
  }
}

// Utility function to validate email format
function validateEmail(email: string) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}
