import type { Express, Request, Response } from "express";
import { storage } from "../server/storage";
import { insertOfferSchema } from "../shared/schema";
import { z } from "zod";

export default async function offers(app: Express) {
    app.get("/api/offers", async (req: Request, res: Response) => {
        try {
            const establishmentId = req.query.establishmentId ? parseInt(req.query.establishmentId as string) : undefined;
            const offers = await storage.getOffers(establishmentId);
            return res.status(200).json(offers);
        } catch (error) {
            return res.status(500).json({ message: "Internal Server Error" });
        }
    });

    app.post("/api/offers", async (req: Request, res: Response) => {
        try {
            const validatedData = insertOfferSchema.parse(req.body);
            const offer = await storage.createOffer(validatedData);
            return res.status(201).json(offer);
        } catch (error) {
            if (error instanceof z.ZodError) {
                return res.status(400).json({ message: "Invalid data", errors: error.errors });
            }
            return res.status(500).json({ message: "Internal Server Error" });
        }
    });

    app.put("/api/offers", async (req: Request, res: Response) => {
        try {
            const id = parseInt((req.query.id as string) || "0");
            const validatedData = insertOfferSchema.partial().parse(req.body);
            const offer = await storage.updateOffer(id, validatedData);
            return res.status(200).json(offer);
        } catch (error) {
            return res.status(500).json({ message: "Internal Server Error" });
        }
    });

    app.delete("/api/offers", async (req: Request, res: Response) => {
        try {
            const id = parseInt((req.query.id as string) || "0");
            await storage.deleteOffer(id);
            return res.status(204).end();
        } catch (error) {
            return res.status(500).json({ message: "Internal Server Error" });
        }
    });
}