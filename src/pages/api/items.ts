import type { NextApiRequest, NextApiResponse } from 'next';

interface Item {
  id: number;
  name: string;
}

let items: Item[] = [];

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    return res.status(200).json(items);
  }

  if (req.method === 'POST') {
    const newItem: Item = { id: Date.now(), name: req.body.name };
    items.push(newItem);
    return res.status(201).json(newItem);
  }

  if (req.method === 'PUT') {
    const { id, name } = req.body;
    items = items.map(item => (item.id === id ? { ...item, name } : item));
    return res.status(200).json({ id, name });
  }

  if (req.method === 'DELETE') {
    const { id } = req.query;
    items = items.filter(item => item.id !== Number(id));
    return res.status(204).end();
  }

  res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
  return res.status(405).end(`Method ${req.method} Not Allowed`);
}
