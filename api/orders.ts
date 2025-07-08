import type { Express, Request, Response } from "express";
import { storage } from "../server/storage";
import { insertOrderSchema } from "../shared/schema";
import { z } from "zod";

export default async function orders(app: Express) {
    app.get("/api/orders", async (_req: Request, res: Response) => {
        try {
            const orders = await storage.getOrders();
            return res.status(200).json(orders);
        } catch (error) {
            return res.status(500).json({ message: "Internal Server Error" });
        }
    });

    app.post("/api/orders", async (req: Request, res: Response) => {
        try {
            const sessionId = (req.headers["x-session-id"] as string) || "anonymous";
            const validatedData = insertOrderSchema.parse({ ...req.body, sessionId });
            const order = await storage.createOrder(validatedData);
            await storage.clearCart(sessionId);
            return res.status(201).json(order);
        } catch (error) {
            if (error instanceof z.ZodError) {
                return res.status(400).json({ message: "Invalid data", errors: error.errors });
            }
            return res.status(500).json({ message: "Internal Server Error" });
        }
    });
}