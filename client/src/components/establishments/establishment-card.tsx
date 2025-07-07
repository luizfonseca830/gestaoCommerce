import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MoreVertical, Package, Tags } from "lucide-react";
import { type Establishment } from "@shared/schema";

interface EstablishmentCardProps {
  establishment: Establishment;
  onEdit?: (establishment: Establishment) => void;
  onDelete?: (id: number) => void;
}

export default function EstablishmentCard({ 
  establishment, 
  onEdit, 
  onDelete 
}: EstablishmentCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-success text-white";
      case "pending":
        return "bg-warning text-white";
      case "inactive":
        return "bg-gray-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "active":
        return "Ativo";
      case "pending":
        return "Pendente";
      case "inactive":
        return "Inativo";
      default:
        return "Desconhecido";
    }
  };

  return (
    <Card className="border border-gray-200 hover:shadow-lg transition-shadow duration-200">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {establishment.imageUrl && (
              <img
                src={establishment.imageUrl}
                alt={establishment.name}
                className="w-16 h-16 rounded-lg object-cover"
              />
            )}
            <div>
              <h4 className="font-semibold text-gray-800">{establishment.name}</h4>
              <p className="text-sm text-gray-500">{establishment.address}</p>
              <div className="flex items-center space-x-4 mt-2">
                <span className="text-sm text-gray-600 flex items-center">
                  <Package className="w-4 h-4 mr-1" />
                  245 produtos
                </span>
                <span className="text-sm text-gray-600 flex items-center">
                  <Tags className="w-4 h-4 mr-1" />
                  8 ofertas
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge className={getStatusColor(establishment.status)}>
              {getStatusLabel(establishment.status)}
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
