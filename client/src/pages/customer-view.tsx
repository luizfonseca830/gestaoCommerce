import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, ShoppingCart, X, CreditCard, Smartphone, Banknote } from "lucide-react";
import { useState } from "react";
import ProductCard from "@/components/products/product-card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { type Product, type Category, type Cart } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function CustomerView() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [showCart, setShowCart] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [sessionId] = useState(() => `session_${Date.now()}`);
  
  const { data: products, isLoading: loadingProducts } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const { data: categories } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  const { data: cart } = useQuery<Cart[]>({
    queryKey: ["/api/cart"],
    queryFn: async () => {
      const response = await fetch("/api/cart", {
        headers: { "x-session-id": sessionId },
      });
      return response.json();
    },
  });

  const addToCartMutation = useMutation({
    mutationFn: async (productId: number) => {
      const response = await apiRequest("POST", "/api/cart", {
        productId,
        quantity: "1",
      }, {
        headers: { "x-session-id": sessionId },
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
      toast({
        title: "Produto adicionado!",
        description: "Item adicionado ao carrinho com sucesso.",
      });
    },
  });

  const processPaymentMutation = useMutation({
    mutationFn: async ({ method, total }: { method: string; total: number }) => {
      // First create the order
      const orderResponse = await apiRequest("POST", "/api/orders", {
        establishmentId: 1,
        totalAmount: total.toString(),
        paymentMethod: method,
      }, {
        headers: { "x-session-id": sessionId },
      });
      
      const order = await orderResponse.json();
      
      // Then process payment
      const paymentResponse = await apiRequest("POST", "/api/payment/process", {
        method,
        amount: total,
        orderId: order.id,
      });
      
      return paymentResponse.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
      setShowPayment(false);
      setShowCart(false);
      toast({
        title: "Pagamento processado!",
        description: "Seu pedido foi confirmado com sucesso.",
      });
    },
  });

  const filteredProducts = products?.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const cartTotal = cart?.reduce((total, item) => {
    const product = products?.find(p => p.id === item.productId);
    return total + (product ? parseFloat(product.price) * parseFloat(item.quantity) : 0);
  }, 0) || 0;

  const handleAddToCart = (product: Product) => {
    addToCartMutation.mutate(product.id);
  };

  const handlePayment = (method: string) => {
    processPaymentMutation.mutate({ method, total: cartTotal });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-2xl font-bold text-primary">MercadoLocal</h1>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Buscar produtos..."
                  className="w-64 pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button 
                variant="outline" 
                size="icon" 
                className="relative"
                onClick={() => setShowCart(true)}
              >
                <ShoppingCart className="w-5 h-5" />
                {cart && cart.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-danger text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {cart.length}
                  </span>
                )}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Featured Offers Banner */}
      <div className="bg-gradient-to-r from-primary to-primary-dark text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h2 className="text-3xl font-bold mb-4">Ofertas Especiais</h2>
          <p className="text-lg mb-4">Aproveite as melhores promoções dos estabelecimentos locais</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white bg-opacity-20 rounded-lg p-4">
              <h3 className="font-semibold">Supermercado Central</h3>
              <p className="text-sm">30% OFF em frutas e verduras</p>
            </div>
            <div className="bg-white bg-opacity-20 rounded-lg p-4">
              <h3 className="font-semibold">Açougue do Bairro</h3>
              <p className="text-sm">Picanha R$ 45,99/kg</p>
            </div>
            <div className="bg-white bg-opacity-20 rounded-lg p-4">
              <h3 className="font-semibold">Padaria Nova</h3>
              <p className="text-sm">Pão francês R$ 12,90/kg</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Categories */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Categorias</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {categories?.map((category) => (
              <Card key={category.id} className="hover:shadow-lg transition-shadow duration-200 cursor-pointer">
                <CardContent className="p-4 text-center">
                  <div className={`text-3xl mb-2 ${category.color}`}>
                    <i className={category.icon}></i>
                  </div>
                  <p className="text-sm font-medium">{category.name}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Products */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Produtos</h2>
          {loadingProducts ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="h-64 bg-gray-200 rounded-lg animate-pulse"></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredProducts?.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={handleAddToCart}
                  isCustomerView={true}
                />
              ))}
            </div>
          )}
        </div>

        {/* Payment Methods */}
        <Card>
          <CardHeader>
            <CardTitle>Formas de Pagamento</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex items-center justify-center p-4 border border-gray-200 rounded-lg">
                <CreditCard className="w-6 h-6 text-primary mr-3" />
                <span className="text-sm font-medium">Cartão de Crédito</span>
              </div>
              <div className="flex items-center justify-center p-4 border border-gray-200 rounded-lg">
                <CreditCard className="w-6 h-6 text-primary mr-3" />
                <span className="text-sm font-medium">Cartão de Débito</span>
              </div>
              <div className="flex items-center justify-center p-4 border border-gray-200 rounded-lg">
                <Smartphone className="w-6 h-6 text-primary mr-3" />
                <span className="text-sm font-medium">PIX</span>
              </div>
              <div className="flex items-center justify-center p-4 border border-gray-200 rounded-lg">
                <Banknote className="w-6 h-6 text-primary mr-3" />
                <span className="text-sm font-medium">Dinheiro</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Cart Modal */}
      <Dialog open={showCart} onOpenChange={setShowCart}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Carrinho de Compras</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {cart?.length === 0 ? (
              <p className="text-center text-gray-500 py-8">Seu carrinho está vazio</p>
            ) : (
              cart?.map((item) => {
                const product = products?.find(p => p.id === item.productId);
                return product ? (
                  <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">{product.name}</h4>
                      <p className="text-sm text-gray-600">
                        Quantidade: {item.quantity} {product.unit}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">
                        R$ {(parseFloat(product.price) * parseFloat(item.quantity)).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ) : null;
              })
            )}
            {cart && cart.length > 0 && (
              <div className="border-t pt-4">
                <div className="flex justify-between items-center mb-4">
                  <span className="font-bold text-lg">Total:</span>
                  <span className="font-bold text-lg text-primary">
                    R$ {cartTotal.toFixed(2)}
                  </span>
                </div>
                <Button 
                  className="w-full" 
                  onClick={() => setShowPayment(true)}
                  disabled={processPaymentMutation.isPending}
                >
                  Finalizar Compra
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Payment Modal */}
      <Dialog open={showPayment} onOpenChange={setShowPayment}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Escolha a forma de pagamento</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="text-center mb-4">
              <span className="text-lg font-bold">
                Total: R$ {cartTotal.toFixed(2)}
              </span>
            </div>
            <div className="grid grid-cols-1 gap-4">
              <Button
                onClick={() => handlePayment("card")}
                disabled={processPaymentMutation.isPending}
                className="flex items-center justify-center p-6"
              >
                <CreditCard className="w-6 h-6 mr-3" />
                Cartão de Crédito/Débito
              </Button>
              <Button
                onClick={() => handlePayment("pix")}
                disabled={processPaymentMutation.isPending}
                className="flex items-center justify-center p-6"
              >
                <Smartphone className="w-6 h-6 mr-3" />
                PIX
              </Button>
              <Button
                onClick={() => handlePayment("cash")}
                disabled={processPaymentMutation.isPending}
                className="flex items-center justify-center p-6"
              >
                <Banknote className="w-6 h-6 mr-3" />
                Dinheiro
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
