import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MoreVertical, ShoppingCart } from "lucide-react";
import { type Product } from "@shared/schema";

interface ProductCardProps {
  product: Product;
  onEdit?: (product: Product) => void;
  onDelete?: (id: number) => void;
  onAddToCart?: (product: Product) => void;
  isCustomerView?: boolean;
}

export default function ProductCard({ 
  product, 
  onEdit, 
  onDelete, 
  onAddToCart,
  isCustomerView = false 
}: ProductCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-200 active:scale-95">
      {product.imageUrl && (
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-32 sm:h-48 object-cover"
        />
      )}
      <CardContent className="p-3 sm:p-4">
        <h3 className="font-semibold text-sm sm:text-base text-gray-800 mb-1 sm:mb-2 line-clamp-2">{product.name}</h3>
        {product.description && (
          <p className="text-xs sm:text-sm text-gray-600 mb-2 line-clamp-2 hidden sm:block">{product.description}</p>
        )}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div className="mb-2 sm:mb-0">
            <span className="text-base sm:text-lg font-bold text-primary">
              R$ {parseFloat(product.price).toFixed(2)}
            </span>
            <span className="text-xs sm:text-sm text-gray-500">/{product.unit}</span>
          </div>
          {isCustomerView ? (
            <Button 
              size="sm" 
              onClick={() => onAddToCart?.(product)}
              className="bg-primary hover:bg-primary-dark w-full sm:w-auto text-xs sm:text-sm py-2"
            >
              <ShoppingCart className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
              Adicionar
            </Button>
          ) : (
            <Button variant="ghost" size="icon">
              <MoreVertical className="w-4 h-4" />
            </Button>
          )}
        </div>
        {!product.inStock && (
          <Badge variant="destructive" className="mt-2">
            Fora de estoque
          </Badge>
        )}
      </CardContent>
    </Card>
  );
}
