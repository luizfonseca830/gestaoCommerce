import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Eye } from "lucide-react";
import { Link } from "wouter";
import { useState } from "react";
import StatsCards from "@/components/stats/stats-cards";
import EstablishmentCard from "@/components/establishments/establishment-card";
import EstablishmentForm from "@/components/establishments/establishment-form";
import { type Establishment } from "@shared/schema";

export default function Dashboard() {
  const [showEstablishmentForm, setShowEstablishmentForm] = useState(false);
  
  const { data: establishments, isLoading } = useQuery<Establishment[]>({
    queryKey: ["/api/establishments"],
  });

  if (isLoading) {
    return (
      <main className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-64 mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="p-6">
      <StatsCards />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Seus Estabelecimentos</CardTitle>
                <Button onClick={() => setShowEstablishmentForm(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {establishments?.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500">Nenhum estabelecimento cadastrado</p>
                    <Button 
                      onClick={() => setShowEstablishmentForm(true)}
                      className="mt-4"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Adicionar Primeiro Estabelecimento
                    </Button>
                  </div>
                ) : (
                  establishments?.map((establishment) => (
                    <EstablishmentCard 
                      key={establishment.id} 
                      establishment={establishment} 
                    />
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Ações Rápidas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button 
                className="w-full" 
                onClick={() => setShowEstablishmentForm(true)}
              >
                <Plus className="w-4 h-4 mr-2" />
                Novo Estabelecimento
              </Button>
              <Link href="/products">
                <Button className="w-full bg-success hover:bg-green-600">
                  <Plus className="w-4 h-4 mr-2" />
                  Cadastrar Produto
                </Button>
              </Link>
              <Link href="/offers">
                <Button className="w-full bg-warning hover:bg-yellow-600">
                  <Plus className="w-4 h-4 mr-2" />
                  Criar Oferta
                </Button>
              </Link>
              <Link href="/customer-view">
                <Button className="w-full bg-gray-600 hover:bg-gray-700">
                  <Eye className="w-4 h-4 mr-2" />
                  Visualizar Loja
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <EstablishmentForm 
        open={showEstablishmentForm} 
        onOpenChange={setShowEstablishmentForm} 
      />
    </main>
  );
}
