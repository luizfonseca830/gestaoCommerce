import { VercelRequest, VercelResponse } from '@vercel/node';
import { storage } from '../server/storage';
import { insertOrderSchema } from '../shared/schema';
import { z } from 'zod';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    try {
        const sessionId = (req.headers['x-session-id'] as string) || 'anonymous';

        if (req.method === 'GET') {
            const orders = await storage.getOrders();
            return res.status(200).json(orders);
        }

        if (req.method === 'POST') {
            const validatedData = insertOrderSchema.parse({ ...req.body, sessionId });
            const order = await storage.createOrder(validatedData);
            await storage.clearCart(sessionId);
            return res.status(201).json(order);
        }

        return res.status(405).json({ message: 'Method Not Allowed' });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ message: 'Invalid data', errors: error.errors });
        }
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}
