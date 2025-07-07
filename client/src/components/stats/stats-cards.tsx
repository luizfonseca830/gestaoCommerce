import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Building, Package, Tags, TrendingUp } from "lucide-react";

export default function StatsCards() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["/api/stats"],
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-16 bg-gray-200 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const statCards = [
    {
      title: "Total Estabelecimentos",
      value: stats?.totalEstablishments || 0,
      icon: Building,
      bgColor: "bg-primary-light",
      iconColor: "text-primary",
    },
    {
      title: "Produtos Cadastrados",
      value: stats?.totalProducts || 0,
      icon: Package,
      bgColor: "bg-green-100",
      iconColor: "text-success",
    },
    {
      title: "Ofertas Ativas",
      value: stats?.activeOffers || 0,
      icon: Tags,
      bgColor: "bg-yellow-100",
      iconColor: "text-warning",
    },
    {
      title: "Receita Mensal",
      value: stats?.monthlyRevenue ? `R$ ${stats.monthlyRevenue.toLocaleString()}` : "R$ 0",
      icon: TrendingUp,
      bgColor: "bg-green-100",
      iconColor: "text-success",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statCards.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                </div>
                <div className={`${stat.bgColor} p-3 rounded-full`}>
                  <Icon className={`${stat.iconColor} w-6 h-6`} />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
