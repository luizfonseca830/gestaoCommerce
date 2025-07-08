import type { Express } from "express";

import products from "../api/products.ts";
import establishments from "../api/establishments.ts";
import categories from "../api/categories.ts";
import offers from "../api/offers.ts";
import cart from "../api/cart.ts";
import orders from "../api/orders.ts";
import payment from "../api/payment.ts";
import stats from "../api/stats.ts";

export async function registerRoutes(app: Express) {
    await products(app);
    await establishments(app);
    await categories(app);
    await offers(app);
    await cart(app);
    await orders(app);
    await payment(app);
    await stats(app);
}
