// pages/api/end-game.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest, res: NextResponse) {
  if (req.method === 'POST') {
    const body = await req.json();
    const { results, user } = body;
    let returnResult = ""

        const newCash = user?.cash + results
        try {
            const response = await prisma?.user.update({data: {cash: newCash}, where: {email: user?.email}})
            returnResult = response!.cash.toString()
        } catch (error) {
            const response = error
            returnResult = response!.toString()
        }

    
    const updatedCash = { returnResult };

    return NextResponse.json(updatedCash, {status: 200})
  }

  return  NextResponse.json({message: 'Method not allowed'}, {status: 405})
}
