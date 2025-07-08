import { VercelRequest, VercelResponse } from '@vercel/node';
import { storage } from '../server/storage';
import { insertProductSchema } from '../shared/schema';
import { z } from 'zod';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    try {
        if (req.method === 'GET') {
            const id = req.query.id ? parseInt(req.query.id as string) : null;
            if (id) {
                const product = await storage.getProduct(id);
                if (!product) {
                    return res.status(404).json({ message: 'Product not found' });
                }
                return res.status(200).json(product);
            } else {
                const establishmentId = req.query.establishmentId ? parseInt(req.query.establishmentId as string) : undefined;
                const products = await storage.getProducts(establishmentId);
                return res.status(200).json(products);
            }
        }

        if (req.method === 'POST') {
            const validatedData = insertProductSchema.parse(req.body);
            const product = await storage.createProduct(validatedData);
            return res.status(201).json(product);
        }

        if (req.method === 'PUT') {
            const id = parseInt((req.query.id as string) || '0');
            const validatedData = insertProductSchema.partial().parse(req.body);
            const product = await storage.updateProduct(id, validatedData);
            return res.status(200).json(product);
        }

        if (req.method === 'DELETE') {
            const id = parseInt((req.query.id as string) || '0');
            await storage.deleteProduct(id);
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