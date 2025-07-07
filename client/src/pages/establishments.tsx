import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";
import EstablishmentCard from "@/components/establishments/establishment-card";
import EstablishmentForm from "@/components/establishments/establishment-form";
import { type Establishment } from "@shared/schema";

export default function Establishments() {
  const [showForm, setShowForm] = useState(false);
  
  const { data: establishments, isLoading } = useQuery<Establishment[]>({
    queryKey: ["/api/establishments"],
  });

  if (isLoading) {
    return (
      <main className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-64 mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-48 bg-gray-200 rounded-lg"></div>
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
            <CardTitle>Estabelecimentos</CardTitle>
            <Button onClick={() => setShowForm(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Novo Estabelecimento
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {establishments?.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">Nenhum estabelecimento cadastrado</p>
              <Button onClick={() => setShowForm(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Adicionar Primeiro Estabelecimento
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {establishments?.map((establishment) => (
                <EstablishmentCard 
                  key={establishment.id} 
                  establishment={establishment} 
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
      
      <EstablishmentForm 
        open={showForm} 
        onOpenChange={setShowForm} 
      />
    </main>
  );
}
