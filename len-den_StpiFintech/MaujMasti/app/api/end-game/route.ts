// pages/api/end-game.ts
import { useAuth } from '@/hooks/useAuth';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { gameType, results, cash, bettingAmount } = req.body;
    const {user} = useAuth()
    let returnResult = ""
    if(results){
        const newCash = user?.cash + cash
        try {
            const response = await prisma?.user.update({data: {cash: newCash}, where: {email: user?.email}})
            returnResult = response!.toString()
        } catch (error) {
            const response = error
            returnResult = response!.toString()
        }
    }
    else{
        const newCash = user?.cash! - bettingAmount
        try {
            const response = await prisma?.user.update({data: {cash: newCash}, where: {email: user?.email}})
            returnResult = response!.toString()
        } catch (error) {
            const response = error
            returnResult = response!.toString()
        }
    }
    
    const updatedCash = { returnResult };

    return res.status(200).json(updatedCash);
  }

  return res.status(405).json({ message: 'Method not allowed' });
}
