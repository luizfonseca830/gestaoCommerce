import type { Express, Request, Response } from 'express';
import { storage } from '../server/storage';
import { insertEstablishmentSchema } from '../shared/schema';
import { z } from 'zod';

export default function establishmentsRoutes(app: Express) {
    app.get('/api/establishments', async (req: Request, res: Response) => {
        try {
            const id = req.query.id ? parseInt(req.query.id as string) : null;
            if (id) {
                const establishment = await storage.getEstablishment(id);
                if (!establishment) {
                    return res.status(404).json({ message: "Establishment not found" });
                }
                return res.status(200).json(establishment);
            } else {
                const establishments = await storage.getEstablishments();
                return res.status(200).json(establishments);
            }
        } catch (error) {
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    });

    app.post('/api/establishments', async (req: Request, res: Response) => {
        try {
            const validatedData = insertEstablishmentSchema.parse(req.body);
            const establishment = await storage.createEstablishment(validatedData);
            return res.status(201).json(establishment);
        } catch (error) {
            if (error instanceof z.ZodError) {
                return res.status(400).json({ message: 'Invalid data', errors: error.errors });
            }
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    });

    app.put('/api/establishments', async (req: Request, res: Response) => {
        try {
            const id = parseInt((req.query.id as string) || '0');
            const validatedData = insertEstablishmentSchema.partial().parse(req.body);
            const establishment = await storage.updateEstablishment(id, validatedData);
            return res.status(200).json(establishment);
        } catch (error) {
            if (error instanceof z.ZodError) {
                return res.status(400).json({ message: 'Invalid data', errors: error.errors });
            }
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    });

    app.delete('/api/establishments', async (req: Request, res: Response) => {
        try {
            const id = parseInt((req.query.id as string) || '0');
            await storage.deleteEstablishment(id);
            return res.status(204).end();
        } catch (error) {
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    });
}
