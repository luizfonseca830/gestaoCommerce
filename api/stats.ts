import type { Express, Request, Response } from "express";
import { storage } from "../server/storage";

export default async function stats(app: Express) {
    app.get("/api/stats", async (_req: Request, res: Response) => {
        try {
            const stats = await storage.getStats();
            return res.status(200).json(stats);
        } catch (error) {
            return res.status(500).json({ message: "Failed to fetch stats" });
        }
    });
}