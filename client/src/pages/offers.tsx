import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";
import OfferCard from "@/components/offers/offer-card";
import OfferForm from "@/components/offers/offer-form";
import { type Offer } from "@shared/schema";

export default function Offers() {
  const [showForm, setShowForm] = useState(false);
  
  const { data: offers, isLoading } = useQuery<Offer[]>({
    queryKey: ["/api/offers"],
  });

  if (isLoading) {
    return (
      <main className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-64 mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="p-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Ofertas</CardTitle>
            <Button onClick={() => setShowForm(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Nova Oferta
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {offers?.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">Nenhuma oferta cadastrada</p>
              <Button onClick={() => setShowForm(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Adicionar Primeira Oferta
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {offers?.map((offer) => (
                <OfferCard key={offer.id} offer={offer} />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
      
      <OfferForm 
        open={showForm} 
        onOpenChange={setShowForm} 
      />
    </main>
  );
}
