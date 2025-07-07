import { 
  establishments, 
  categories, 
  products, 
  offers, 
  carts, 
  orders,
  type Establishment, 
  type InsertEstablishment,
  type Category,
  type InsertCategory,
  type Product,
  type InsertProduct,
  type Offer,
  type InsertOffer,
  type Cart,
  type InsertCart,
  type Order,
  type InsertOrder
} from "@shared/schema";

export interface IStorage {
  // Establishments
  getEstablishments(): Promise<Establishment[]>;
  getEstablishment(id: number): Promise<Establishment | undefined>;
  createEstablishment(establishment: InsertEstablishment): Promise<Establishment>;
  updateEstablishment(id: number, establishment: Partial<InsertEstablishment>): Promise<Establishment>;
  deleteEstablishment(id: number): Promise<void>;

  // Categories
  getCategories(): Promise<Category[]>;
  getCategory(id: number): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;

  // Products
  getProducts(establishmentId?: number): Promise<Product[]>;
  getProduct(id: number): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: number, product: Partial<InsertProduct>): Promise<Product>;
  deleteProduct(id: number): Promise<void>;

  // Offers
  getOffers(establishmentId?: number): Promise<Offer[]>;
  getOffer(id: number): Promise<Offer | undefined>;
  createOffer(offer: InsertOffer): Promise<Offer>;
  updateOffer(id: number, offer: Partial<InsertOffer>): Promise<Offer>;
  deleteOffer(id: number): Promise<void>;

  // Cart
  getCart(sessionId: string): Promise<Cart[]>;
  addToCart(cart: InsertCart): Promise<Cart>;
  updateCartItem(id: number, quantity: number): Promise<Cart>;
  removeFromCart(id: number): Promise<void>;
  clearCart(sessionId: string): Promise<void>;

  // Orders
  getOrders(): Promise<Order[]>;
  getOrder(id: number): Promise<Order | undefined>;
  createOrder(order: InsertOrder): Promise<Order>;
  updateOrder(id: number, order: Partial<InsertOrder>): Promise<Order>;

  // Stats
  getStats(): Promise<{
    totalEstablishments: number;
    totalProducts: number;
    activeOffers: number;
    monthlyRevenue: number;
  }>;
}

export class MemStorage implements IStorage {
  private establishments: Map<number, Establishment> = new Map();
  private categories: Map<number, Category> = new Map();
  private products: Map<number, Product> = new Map();
  private offers: Map<number, Offer> = new Map();
  private carts: Map<number, Cart> = new Map();
  private orders: Map<number, Order> = new Map();
  private currentId: number = 1;

  constructor() {
    this.seedData();
  }

  private seedData() {
    // Seed categories
    const defaultCategories: InsertCategory[] = [
      { name: "Frutas", icon: "fas fa-apple-alt", color: "text-success" },
      { name: "Verduras", icon: "fas fa-carrot", color: "text-warning" },
      { name: "Carnes", icon: "fas fa-drumstick-bite", color: "text-danger" },
      { name: "Padaria", icon: "fas fa-bread-slice", color: "text-yellow-600" },
      { name: "Laticínios", icon: "fas fa-cheese", color: "text-yellow-500" },
      { name: "Bebidas", icon: "fas fa-bottle-water", color: "text-blue-500" },
    ];

    defaultCategories.forEach(category => {
      this.categories.set(this.currentId, { ...category, id: this.currentId });
      this.currentId++;
    });

    // Seed establishments
    const defaultEstablishments: InsertEstablishment[] = [
      {
        name: "Supermercado Central",
        type: "supermarket",
        address: "Rua das Flores, 123 - Centro",
        phone: "(11) 3456-7890",
        email: "contato@supermercadocentral.com",
        imageUrl: "https://images.unsplash.com/photo-1542838132-92c53300491e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=80&h=80",
        status: "active",
      },
      {
        name: "Açougue do Bairro",
        type: "butcher",
        address: "Av. Principal, 456 - Jardim",
        phone: "(11) 9876-5432",
        email: "contato@acouguebairro.com",
        imageUrl: "https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=80&h=80",
        status: "active",
      },
      {
        name: "Mercearia Express",
        type: "grocery",
        address: "Rua Nova, 789 - Vila",
        phone: "(11) 1234-5678",
        email: "contato@mercariaexpress.com",
        imageUrl: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=80&h=80",
        status: "pending",
      },
    ];

    defaultEstablishments.forEach(establishment => {
      this.establishments.set(this.currentId, { 
        ...establishment, 
        id: this.currentId,
        createdAt: new Date()
      });
      this.currentId++;
    });
  }

  // Establishments
  async getEstablishments(): Promise<Establishment[]> {
    return Array.from(this.establishments.values());
  }

  async getEstablishment(id: number): Promise<Establishment | undefined> {
    return this.establishments.get(id);
  }

  async createEstablishment(establishment: InsertEstablishment): Promise<Establishment> {
    const id = this.currentId++;
    const newEstablishment: Establishment = {
      ...establishment,
      id,
      createdAt: new Date(),
    };
    this.establishments.set(id, newEstablishment);
    return newEstablishment;
  }

  async updateEstablishment(id: number, establishment: Partial<InsertEstablishment>): Promise<Establishment> {
    const existing = this.establishments.get(id);
    if (!existing) throw new Error("Establishment not found");
    
    const updated = { ...existing, ...establishment };
    this.establishments.set(id, updated);
    return updated;
  }

  async deleteEstablishment(id: number): Promise<void> {
    this.establishments.delete(id);
  }

  // Categories
  async getCategories(): Promise<Category[]> {
    return Array.from(this.categories.values());
  }

  async getCategory(id: number): Promise<Category | undefined> {
    return this.categories.get(id);
  }

  async createCategory(category: InsertCategory): Promise<Category> {
    const id = this.currentId++;
    const newCategory: Category = { ...category, id };
    this.categories.set(id, newCategory);
    return newCategory;
  }

  // Products
  async getProducts(establishmentId?: number): Promise<Product[]> {
    const allProducts = Array.from(this.products.values());
    if (establishmentId) {
      return allProducts.filter(p => p.establishmentId === establishmentId);
    }
    return allProducts;
  }

  async getProduct(id: number): Promise<Product | undefined> {
    return this.products.get(id);
  }

  async createProduct(product: InsertProduct): Promise<Product> {
    const id = this.currentId++;
    const newProduct: Product = {
      ...product,
      id,
      createdAt: new Date(),
    };
    this.products.set(id, newProduct);
    return newProduct;
  }

  async updateProduct(id: number, product: Partial<InsertProduct>): Promise<Product> {
    const existing = this.products.get(id);
    if (!existing) throw new Error("Product not found");
    
    const updated = { ...existing, ...product };
    this.products.set(id, updated);
    return updated;
  }

  async deleteProduct(id: number): Promise<void> {
    this.products.delete(id);
  }

  // Offers
  async getOffers(establishmentId?: number): Promise<Offer[]> {
    const allOffers = Array.from(this.offers.values());
    if (establishmentId) {
      return allOffers.filter(o => o.establishmentId === establishmentId);
    }
    return allOffers;
  }

  async getOffer(id: number): Promise<Offer | undefined> {
    return this.offers.get(id);
  }

  async createOffer(offer: InsertOffer): Promise<Offer> {
    const id = this.currentId++;
    const newOffer: Offer = {
      ...offer,
      id,
      createdAt: new Date(),
    };
    this.offers.set(id, newOffer);
    return newOffer;
  }

  async updateOffer(id: number, offer: Partial<InsertOffer>): Promise<Offer> {
    const existing = this.offers.get(id);
    if (!existing) throw new Error("Offer not found");
    
    const updated = { ...existing, ...offer };
    this.offers.set(id, updated);
    return updated;
  }

  async deleteOffer(id: number): Promise<void> {
    this.offers.delete(id);
  }

  // Cart
  async getCart(sessionId: string): Promise<Cart[]> {
    return Array.from(this.carts.values()).filter(c => c.sessionId === sessionId);
  }

  async addToCart(cart: InsertCart): Promise<Cart> {
    const id = this.currentId++;
    const newCart: Cart = {
      ...cart,
      id,
      createdAt: new Date(),
    };
    this.carts.set(id, newCart);
    return newCart;
  }

  async updateCartItem(id: number, quantity: number): Promise<Cart> {
    const existing = this.carts.get(id);
    if (!existing) throw new Error("Cart item not found");
    
    const updated = { ...existing, quantity: quantity.toString() };
    this.carts.set(id, updated);
    return updated;
  }

  async removeFromCart(id: number): Promise<void> {
    this.carts.delete(id);
  }

  async clearCart(sessionId: string): Promise<void> {
    for (const [id, cart] of this.carts.entries()) {
      if (cart.sessionId === sessionId) {
        this.carts.delete(id);
      }
    }
  }

  // Orders
  async getOrders(): Promise<Order[]> {
    return Array.from(this.orders.values());
  }

  async getOrder(id: number): Promise<Order | undefined> {
    return this.orders.get(id);
  }

  async createOrder(order: InsertOrder): Promise<Order> {
    const id = this.currentId++;
    const newOrder: Order = {
      ...order,
      id,
      createdAt: new Date(),
    };
    this.orders.set(id, newOrder);
    return newOrder;
  }

  async updateOrder(id: number, order: Partial<InsertOrder>): Promise<Order> {
    const existing = this.orders.get(id);
    if (!existing) throw new Error("Order not found");
    
    const updated = { ...existing, ...order };
    this.orders.set(id, updated);
    return updated;
  }

  // Stats
  async getStats(): Promise<{
    totalEstablishments: number;
    totalProducts: number;
    activeOffers: number;
    monthlyRevenue: number;
  }> {
    const totalEstablishments = this.establishments.size;
    const totalProducts = this.products.size;
    const activeOffers = Array.from(this.offers.values()).filter(o => o.isActive).length;
    const monthlyRevenue = 45230; // Mock value
    
    return {
      totalEstablishments,
      totalProducts,
      activeOffers,
      monthlyRevenue,
    };
  }
}

export const storage = new MemStorage();
