// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import config from '@/constant/res.json'

export type rowItem = {
  title: string
  cover: string
  href: string
  tag: string
  alt: string
}
export type Data = {
  msg: string
  code: number
  data: {
    count: number
    current: number
    pageSize: number
    rows: rowItem[]
  }
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  res.status(200).json(config.banner)
}
