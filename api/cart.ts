import { VercelRequest, VercelResponse } from '@vercel/node';
import { storage } from '../server/storage';
import { insertCartSchema } from '../shared/schema';
import { z } from 'zod';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    try {
        const sessionId = (req.headers['x-session-id'] as string) || 'anonymous';

        if (req.method === 'GET') {
            const cart = await storage.getCart(sessionId);
            return res.status(200).json(cart);
        }

        if (req.method === 'POST') {
            const validatedData = insertCartSchema.parse({ ...req.body, sessionId });
            const cartItem = await storage.addToCart(validatedData);
            return res.status(201).json(cartItem);
        }

        if (req.method === 'PUT') {
            const id = parseInt((req.query.id as string) || '0');
            const { quantity } = req.body;
            const cartItem = await storage.updateCartItem(id, quantity);
            return res.status(200).json(cartItem);
        }

        if (req.method === 'DELETE') {
            const id = parseInt((req.query.id as string) || '0');
            await storage.removeFromCart(id);
            return res.status(204).end();
        }

        return res.status(405).json({ message: 'Method Not Allowed' });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ message: 'Invalid data', errors: error.errors });
        }
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}
