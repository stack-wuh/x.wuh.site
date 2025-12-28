// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import config from '@/constant/res.json'

export type TRowItem = {
  url: string
  id: number
  name: string
  by: string
}

export type TResData = {
  msg: string
  code: number
  data: {
    count: number
    current: number
    pageSize: number
    rows: TRowItem[]
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<TResData>
) {
  res.status(200).json(config.playlist)
}
