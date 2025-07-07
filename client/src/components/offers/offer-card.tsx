import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MoreVertical, Calendar, Percent } from "lucide-react";
import { type Offer } from "@shared/schema";

interface OfferCardProps {
  offer: Offer;
  onEdit?: (offer: Offer) => void;
  onDelete?: (id: number) => void;
}

export default function OfferCard({ offer, onEdit, onDelete }: OfferCardProps) {
  const isActive = offer.isActive && new Date(offer.endDate) > new Date();
  const hasExpired = new Date(offer.endDate) < new Date();

  return (
    <Card className="border border-gray-200 hover:shadow-lg transition-shadow duration-200">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h4 className="font-semibold text-gray-800">{offer.title}</h4>
            {offer.description && (
              <p className="text-sm text-gray-600 mt-1">{offer.description}</p>
            )}
            
            <div className="flex items-center space-x-4 mt-3">
              {offer.discountPercentage && (
                <div className="flex items-center text-sm text-gray-600">
                  <Percent className="w-4 h-4 mr-1" />
                  {offer.discountPercentage}% OFF
                </div>
              )}
              
              {offer.discountAmount && (
                <div className="flex items-center text-sm text-gray-600">
                  <span className="font-semibold">R$ {parseFloat(offer.discountAmount).toFixed(2)} OFF</span>
                </div>
              )}
              
              <div className="flex items-center text-sm text-gray-600">
                <Calendar className="w-4 h-4 mr-1" />
                {new Date(offer.startDate).toLocaleDateString()} - {new Date(offer.endDate).toLocaleDateString()}
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Badge 
              className={
                hasExpired 
                  ? "bg-gray-500 text-white" 
                  : isActive 
                    ? "bg-success text-white" 
                    : "bg-warning text-white"
              }
            >
              {hasExpired ? "Expirada" : isActive ? "Ativa" : "Inativa"}
            </Badge>
            <Button variant="ghost" size="icon">
              <MoreVertical className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
