import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertEstablishmentSchema, 
  insertProductSchema, 
  insertOfferSchema, 
  insertCartSchema, 
  insertOrderSchema 
} from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Establishments routes
  app.get("/api/establishments", async (req, res) => {
    try {
      const establishments = await storage.getEstablishments();
      res.json(establishments);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch establishments" });
    }
  });

  app.get("/api/establishments/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const establishment = await storage.getEstablishment(id);
      if (!establishment) {
        return res.status(404).json({ message: "Establishment not found" });
      }
      res.json(establishment);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch establishment" });
    }
  });

  app.post("/api/establishments", async (req, res) => {
    try {
      const validatedData = insertEstablishmentSchema.parse(req.body);
      const establishment = await storage.createEstablishment(validatedData);
      res.status(201).json(establishment);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create establishment" });
    }
  });

  app.put("/api/establishments/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertEstablishmentSchema.partial().parse(req.body);
      const establishment = await storage.updateEstablishment(id, validatedData);
      res.json(establishment);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update establishment" });
    }
  });

  app.delete("/api/establishments/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteEstablishment(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete establishment" });
    }
  });

  // Categories routes
  app.get("/api/categories", async (req, res) => {
    try {
      const categories = await storage.getCategories();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch categories" });
    }
  });

  // Products routes
  app.get("/api/products", async (req, res) => {
    try {
      const establishmentId = req.query.establishmentId ? parseInt(req.query.establishmentId as string) : undefined;
      const products = await storage.getProducts(establishmentId);
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch products" });
    }
  });

  app.get("/api/products/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const product = await storage.getProduct(id);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch product" });
    }
  });

  app.post("/api/products", async (req, res) => {
    try {
      const validatedData = insertProductSchema.parse(req.body);
      const product = await storage.createProduct(validatedData);
      res.status(201).json(product);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create product" });
    }
  });

  app.put("/api/products/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertProductSchema.partial().parse(req.body);
      const product = await storage.updateProduct(id, validatedData);
      res.json(product);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update product" });
    }
  });

  app.delete("/api/products/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteProduct(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete product" });
    }
  });

  // Offers routes
  app.get("/api/offers", async (req, res) => {
    try {
      const establishmentId = req.query.establishmentId ? parseInt(req.query.establishmentId as string) : undefined;
      const offers = await storage.getOffers(establishmentId);
      res.json(offers);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch offers" });
    }
  });

  app.post("/api/offers", async (req, res) => {
    try {
      const validatedData = insertOfferSchema.parse(req.body);
      const offer = await storage.createOffer(validatedData);
      res.status(201).json(offer);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create offer" });
    }
  });

  app.put("/api/offers/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertOfferSchema.partial().parse(req.body);
      const offer = await storage.updateOffer(id, validatedData);
      res.json(offer);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update offer" });
    }
  });

  app.delete("/api/offers/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteOffer(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete offer" });
    }
  });

  // Cart routes
  app.get("/api/cart", async (req, res) => {
    try {
      const sessionId = req.headers['x-session-id'] as string || 'anonymous';
      const cart = await storage.getCart(sessionId);
      res.json(cart);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch cart" });
    }
  });

  app.post("/api/cart", async (req, res) => {
    try {
      const sessionId = req.headers['x-session-id'] as string || 'anonymous';
      const validatedData = insertCartSchema.parse({ ...req.body, sessionId });
      const cartItem = await storage.addToCart(validatedData);
      res.status(201).json(cartItem);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to add to cart" });
    }
  });

  app.put("/api/cart/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { quantity } = req.body;
      const cartItem = await storage.updateCartItem(id, quantity);
      res.json(cartItem);
    } catch (error) {
      res.status(500).json({ message: "Failed to update cart item" });
    }
  });

  app.delete("/api/cart/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.removeFromCart(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to remove from cart" });
    }
  });

  // Orders routes
  app.get("/api/orders", async (req, res) => {
    try {
      const orders = await storage.getOrders();
      res.json(orders);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch orders" });
    }
  });

  app.post("/api/orders", async (req, res) => {
    try {
      const sessionId = req.headers['x-session-id'] as string || 'anonymous';
      const validatedData = insertOrderSchema.parse({ ...req.body, sessionId });
      const order = await storage.createOrder(validatedData);
      
      // Clear cart after order
      await storage.clearCart(sessionId);
      
      res.status(201).json(order);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create order" });
    }
  });

  // Mock payment endpoint
  app.post("/api/payment/process", async (req, res) => {
    try {
      const { method, amount, orderId } = req.body;
      
      // Mock payment processing
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update order status
      await storage.updateOrder(orderId, { status: "paid" });
      
      res.json({ 
        success: true, 
        transactionId: `txn_${Date.now()}`,
        method,
        amount 
      });
    } catch (error) {
      res.status(500).json({ message: "Payment processing failed" });
    }
  });

  // Stats endpoint
  app.get("/api/stats", async (req, res) => {
    try {
      const stats = await storage.getStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch stats" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
