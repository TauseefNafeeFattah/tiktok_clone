// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { client } from '../../utils/client';
import { uuid } from 'uuidv4';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'PUT'){

    const { postId, caption, topic} = req.body;

    const data = await client.patch(postId)
    .set({
        caption:caption,
        topic:topic,
      }).commit();
    res.status(200).json(data);
  }
}
