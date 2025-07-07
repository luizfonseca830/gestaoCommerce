import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, ShoppingCart, X, CreditCard, Smartphone, Banknote, ArrowLeft, Store, MapPin, Phone, Mail } from "lucide-react";
import { useState } from "react";
import ProductCard from "@/components/products/product-card";
import OfferCard from "@/components/offers/offer-card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { type Product, type Category, type Cart, type Establishment, type Offer } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function CustomerView() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [showCart, setShowCart] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [selectedEstablishment, setSelectedEstablishment] = useState<Establishment | null>(null);
  const [sessionId] = useState(() => `session_${Date.now()}`);
  
  const { data: establishments, isLoading: loadingEstablishments } = useQuery<Establishment[]>({
    queryKey: ["/api/establishments"],
  });

  const { data: products, isLoading: loadingProducts } = useQuery<Product[]>({
    queryKey: ["/api/products", selectedEstablishment?.id],
    queryFn: async () => {
      const url = selectedEstablishment 
        ? `/api/products?establishmentId=${selectedEstablishment.id}` 
        : "/api/products";
      const response = await fetch(url);
      return response.json();
    },
    enabled: !!selectedEstablishment,
  });

  const { data: offers, isLoading: loadingOffers } = useQuery<Offer[]>({
    queryKey: ["/api/offers", selectedEstablishment?.id],
    queryFn: async () => {
      const url = selectedEstablishment 
        ? `/api/offers?establishmentId=${selectedEstablishment.id}` 
        : "/api/offers";
      const response = await fetch(url);
      return response.json();
    },
    enabled: !!selectedEstablishment,
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
        establishmentId: selectedEstablishment?.id || 1,
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

  const filteredEstablishments = establishments?.filter(establishment =>
    establishment.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    establishment.status === "active"
  );

  const cartTotal = cart?.reduce((total, item) => {
    const product = products?.find(p => p.id === item.productId);
    return total + (product ? parseFloat(product.price) * parseFloat(item.quantity) : 0);
  }, 0) || 0;

  const handleAddToCart = (product: Product) => {
    addToCartMutation.mutate(product.id);
  };

  const handlePayment = (method: string) => {
    if (!selectedEstablishment) return;
    processPaymentMutation.mutate({ method, total: cartTotal });
  };

  const handleSelectEstablishment = (establishment: Establishment) => {
    setSelectedEstablishment(establishment);
    setSearchTerm("");
  };

  const handleBackToEstablishments = () => {
    setSelectedEstablishment(null);
    setSearchTerm("");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              {selectedEstablishment && (
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={handleBackToEstablishments}
                  className="mr-3"
                >
                  <ArrowLeft className="w-5 h-5" />
                </Button>
              )}
              <h1 className="text-2xl font-bold text-primary">
                {selectedEstablishment ? selectedEstablishment.name : "MercadoLocal"}
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <Input
                  placeholder={selectedEstablishment ? "Buscar produtos..." : "Buscar estabelecimentos..."}
                  className="w-64 pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              {selectedEstablishment && (
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
              )}
            </div>
          </div>
        </div>
      </header>

      {!selectedEstablishment && (
        /* Featured Banner */
        <div className="bg-gradient-to-r from-primary to-primary-dark text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h2 className="text-3xl font-bold mb-4">Bem-vindo ao MercadoLocal</h2>
            <p className="text-lg mb-4">Escolha um estabelecimento para ver produtos e ofertas especiais</p>
          </div>
        </div>
      )}

      {selectedEstablishment && (
        /* Establishment Info Banner */
        <div className="bg-gradient-to-r from-primary to-primary-dark text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center space-x-4">
              {selectedEstablishment.imageUrl && (
                <img
                  src={selectedEstablishment.imageUrl}
                  alt={selectedEstablishment.name}
                  className="w-16 h-16 rounded-lg object-cover"
                />
              )}
              <div>
                <h2 className="text-2xl font-bold">{selectedEstablishment.name}</h2>
                <div className="flex items-center space-x-4 text-sm mt-2">
                  <span className="flex items-center">
                    <MapPin className="w-4 h-4 mr-1" />
                    {selectedEstablishment.address}
                  </span>
                  {selectedEstablishment.phone && (
                    <span className="flex items-center">
                      <Phone className="w-4 h-4 mr-1" />
                      {selectedEstablishment.phone}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!selectedEstablishment ? (
          /* Establishments List */
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Estabelecimentos Disponíveis</h2>
            {loadingEstablishments ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-48 bg-gray-200 rounded-lg animate-pulse"></div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredEstablishments?.map((establishment) => (
                  <Card 
                    key={establishment.id} 
                    className="hover:shadow-lg transition-shadow duration-200 cursor-pointer"
                    onClick={() => handleSelectEstablishment(establishment)}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-4">
                        {establishment.imageUrl && (
                          <img
                            src={establishment.imageUrl}
                            alt={establishment.name}
                            className="w-16 h-16 rounded-lg object-cover"
                          />
                        )}
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-800">{establishment.name}</h3>
                          <p className="text-sm text-gray-600 capitalize">{establishment.type}</p>
                          <div className="flex items-center mt-2 text-sm text-gray-500">
                            <MapPin className="w-4 h-4 mr-1" />
                            {establishment.address}
                          </div>
                          {establishment.phone && (
                            <div className="flex items-center mt-1 text-sm text-gray-500">
                              <Phone className="w-4 h-4 mr-1" />
                              {establishment.phone}
                            </div>
                          )}
                        </div>
                        <Store className="w-8 h-8 text-primary" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        ) : (
          /* Selected Establishment Content */
          <div>
            {/* Offers Section */}
            {offers && offers.length > 0 && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Ofertas Especiais</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  {offers.map((offer) => (
                    <Card key={offer.id} className="border-2 border-warning">
                      <CardContent className="p-4">
                        <h3 className="font-semibold text-lg text-gray-800">{offer.title}</h3>
                        {offer.description && (
                          <p className="text-sm text-gray-600 mt-1">{offer.description}</p>
                        )}
                        <div className="flex items-center justify-between mt-3">
                          <div>
                            {offer.discountPercentage && (
                              <span className="bg-warning text-white px-2 py-1 rounded text-sm font-semibold">
                                {offer.discountPercentage}% OFF
                              </span>
                            )}
                            {offer.discountAmount && (
                              <span className="bg-warning text-white px-2 py-1 rounded text-sm font-semibold">
                                R$ {parseFloat(offer.discountAmount).toFixed(2)} OFF
                              </span>
                            )}
                          </div>
                          <Badge className="bg-success text-white">
                            Ativa
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Products Section */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Produtos</h2>
              {loadingProducts ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[...Array(8)].map((_, i) => (
                    <div key={i} className="h-64 bg-gray-200 rounded-lg animate-pulse"></div>
                  ))}
                </div>
              ) : filteredProducts && filteredProducts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {filteredProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onAddToCart={handleAddToCart}
                      isCustomerView={true}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-500">Este estabelecimento ainda não possui produtos cadastrados.</p>
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
          </div>
        )}
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
