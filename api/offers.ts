import { VercelRequest, VercelResponse } from '@vercel/node';
import { storage } from '../server/storage';
import { insertOfferSchema } from '../shared/schema';
import { z } from 'zod';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    try {
        if (req.method === 'GET') {
            const establishmentId = req.query.establishmentId
                ? parseInt(req.query.establishmentId as string)
                : undefined;
            const offers = await storage.getOffers(establishmentId);
            return res.status(200).json(offers);
        }

        if (req.method === 'POST') {
            const validatedData = insertOfferSchema.parse(req.body);
            const offer = await storage.createOffer(validatedData);
            return res.status(201).json(offer);
        }

        if (req.method === 'PUT') {
            const id = parseInt((req.query.id as string) || '0');
            const validatedData = insertOfferSchema.partial().parse(req.body);
            const offer = await storage.updateOffer(id, validatedData);
            return res.status(200).json(offer);
        }

        if (req.method === 'DELETE') {
            const id = parseInt((req.query.id as string) || '0');
            await storage.deleteOffer(id);
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
