import type { Express, Request, Response } from "express";
import { storage } from "../server/storage";

export default async function payment(app: Express) {
    app.post("/api/payment", async (req: Request, res: Response) => {
        try {
            const { method, amount, orderId } = req.body;

            await new Promise(resolve => setTimeout(resolve, 1000));
            await storage.updateOrder(orderId, { status: "paid" });

            return res.status(200).json({
                success: true,
                transactionId: `txn_${Date.now()}`,
                method,
                amount
            });
        } catch (error) {
            return res.status(500).json({ message: "Payment processing failed" });
        }
    });
}