// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { client } from '../../../utils/client';
import { uuid } from 'uuidv4';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {

  if (req.method === 'DELETE'){
    const { id } = req.query;
    const data = await client.delete(id).then((res) =>{
                      res.body;
                    }).then((res) => console.log('Deleted'));
    res.status(200).json(data);
  }

}
