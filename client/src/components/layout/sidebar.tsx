import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { 
  Store, 
  BarChart3, 
  Building, 
  Package, 
  Tags, 
  ShoppingCart, 
  CreditCard, 
  Users, 
  Settings 
} from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/", icon: BarChart3 },
  { name: "Estabelecimentos", href: "/establishments", icon: Building },
  { name: "Produtos", href: "/products", icon: Package },
  { name: "Ofertas", href: "/offers", icon: Tags },
  { name: "Vendas", href: "/sales", icon: ShoppingCart },
  { name: "Pagamentos", href: "/payments", icon: CreditCard },
  { name: "Clientes", href: "/customers", icon: Users },
  { name: "Configurações", href: "/settings", icon: Settings },
];

const customerNavigation = [
  { name: "Visualizar Loja", href: "/loja", icon: Store },
];

export default function Sidebar() {
  const [location] = useLocation();

  return (
    <div className="w-64 bg-white shadow-lg border-r border-gray-200 fixed h-full z-10">
      <div className="p-6 border-b border-gray-200">
        <Link href="/" className="flex items-center">
          <Store className="w-8 h-8 text-primary mr-3" />
          <h1 className="text-2xl font-bold text-primary">GestãoRede</h1>
        </Link>
      </div>
      
      <nav className="mt-6">
        {navigation.map((item) => {
          const Icon = item.icon;
          const isActive = location === item.href;
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center px-6 py-3 text-gray-600 hover:bg-gray-50 transition-colors duration-200",
                isActive && "bg-primary-light border-r-4 border-primary text-primary"
              )}
            >
              <Icon className="w-5 h-5 mr-3" />
              {item.name}
            </Link>
          );
        })}

        {/* Separator */}
        <div className="border-t border-gray-200 mt-6 pt-6">
          <div className="px-6 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
            Loja Virtual
          </div>
          {customerNavigation.map((item) => {
            const Icon = item.icon;
            
            return (
              <a
                key={item.name}
                href={item.href}
                className="flex items-center px-6 py-3 text-gray-600 hover:bg-gray-50 transition-colors duration-200"
              >
                <Icon className="w-5 h-5 mr-3" />
                {item.name}
              </a>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
