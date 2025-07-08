import type { Express, Request, Response } from "express";
import { z } from "zod";
import { storage } from "../server/storage";
import { insertCartSchema } from "../shared/schema";

export default async function cart(app: Express) {
    app.get("/api/cart", async (req: Request, res: Response) => {
        const sessionId = (req.headers["x-session-id"] as string) || "anonymous";
        const cart = await storage.getCart(sessionId);
        return res.status(200).json(cart);
    });

    app.post("/api/cart", async (req: Request, res: Response) => {
        try {
            const sessionId = (req.headers["x-session-id"] as string) || "anonymous";
            const validatedData = insertCartSchema.parse({ ...req.body, sessionId });
            const cartItem = await storage.addToCart(validatedData);
            return res.status(201).json(cartItem);
        } catch (error) {
            if (error instanceof z.ZodError) {
                return res.status(400).json({ message: "Invalid data", errors: error.errors });
            }
            return res.status(500).json({ message: "Internal Server Error" });
        }
    });

    app.put("/api/cart", async (req: Request, res: Response) => {
        try {
            const id = parseInt((req.query.id as string) || "0");
            const { quantity } = req.body;
            const cartItem = await storage.updateCartItem(id, quantity);
            return res.status(200).json(cartItem);
        } catch (error) {
            return res.status(500).json({ message: "Internal Server Error" });
        }
    });

    app.delete("/api/cart", async (req: Request, res: Response) => {
        try {
            const id = parseInt((req.query.id as string) || "0");
            await storage.removeFromCart(id);
            return res.status(204).end();
        } catch (error) {
            return res.status(500).json({ message: "Internal Server Error" });
        }
    });
}