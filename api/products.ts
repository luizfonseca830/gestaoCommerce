import type { Express, Request, Response } from "express";
import { storage } from "../server/storage";
import { insertProductSchema } from "../shared/schema";
import { z } from "zod";

export default async function products(app: Express) {
    app.get("/api/products", async (req: Request, res: Response) => {
        try {
            const id = req.query.id ? parseInt(req.query.id as string) : null;
            if (id) {
                const product = await storage.getProduct(id);
                if (!product) {
                    return res.status(404).json({ message: "Product not found" });
                }
                return res.status(200).json(product);
            } else {
                const establishmentId = req.query.establishmentId ? parseInt(req.query.establishmentId as string) : undefined;
                const products = await storage.getProducts(establishmentId);
                return res.status(200).json(products);
            }
        } catch (error) {
            return res.status(500).json({ message: "Internal Server Error" });
        }
    });

    app.post("/api/products", async (req: Request, res: Response) => {
        try {
            const validatedData = insertProductSchema.parse(req.body);
            const product = await storage.createProduct(validatedData);
            return res.status(201).json(product);
        } catch (error) {
            if (error instanceof z.ZodError) {
                return res.status(400).json({ message: "Invalid data", errors: error.errors });
            }
            return res.status(500).json({ message: "Internal Server Error" });
        }
    });

    app.put("/api/products", async (req: Request, res: Response) => {
        try {
            const id = parseInt((req.query.id as string) || "0");
            const validatedData = insertProductSchema.partial().parse(req.body);
            const product = await storage.updateProduct(id, validatedData);
            return res.status(200).json(product);
        } catch (error) {
            return res.status(500).json({ message: "Internal Server Error" });
        }
    });

    app.delete("/api/products", async (req: Request, res: Response) => {
        try {
            const id = parseInt((req.query.id as string) || "0");
            await storage.deleteProduct(id);
            return res.status(204).end();
        } catch (error) {
            return res.status(500).json({ message: "Internal Server Error" });
        }
    });
}