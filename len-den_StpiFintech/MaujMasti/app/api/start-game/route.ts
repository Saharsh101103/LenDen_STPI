// pages/api/start-game.ts
import { NextRequest, NextResponse } from 'next/server';


export async function POST(req: NextRequest, res: NextResponse) {
  if (req.method === 'POST') {
    const body = await req.json()
    const { gameType, betAmount, user } = body;
    const cash = user?.cash
    let response = 'Playing'
    let start = false
    if(betAmount < cash! ||  betAmount == cash!){
        start = true
    }
    else{
        response = "Not enough cash, please lower bet amount!"
    }

    
    const gameData = { start, response };

    return NextResponse.json(gameData, {status: 200})
  }

  return  NextResponse.json({message: 'Method not allowed'}, {status: 405})
}
