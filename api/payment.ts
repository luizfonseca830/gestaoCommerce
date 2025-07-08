import { VercelRequest, VercelResponse } from '@vercel/node';
import { storage } from '../server/storage';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    try {
        if (req.method === 'POST') {
            const { method, amount, orderId } = req.body;

            // Mock payment processing delay
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Update order status to paid
            await storage.updateOrder(orderId, { status: "paid" });

            return res.status(200).json({
                success: true,
                transactionId: `txn_${Date.now()}`,
                method,
                amount
            });
        }

        return res.status(405).json({ message: 'Method Not Allowed' });
    } catch (error) {
        return res.status(500).json({ message: 'Payment processing failed' });
    }
}
