import type { Express, Request, Response } from "express";
import { storage } from "../server/storage";

export default async function categories(app: Express) {
    app.get("/api/categories", async (_req: Request, res: Response) => {
        try {
            const categories = await storage.getCategories();
            return res.status(200).json(categories);
        } catch (error) {
            return res.status(500).json({ message: "Failed to fetch categories" });
        }
    });
}