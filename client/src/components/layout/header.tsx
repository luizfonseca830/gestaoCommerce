import { Bell, User } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

export default function Header() {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-gray-800">Dashboard da Rede</h2>
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="w-5 h-5 text-gray-400" />
            <span className="absolute -top-1 -right-1 bg-danger text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              3
            </span>
          </Button>
          <div className="flex items-center space-x-2">
            <Avatar>
              <AvatarFallback className="bg-primary text-white">
                <User className="w-4 h-4" />
              </AvatarFallback>
            </Avatar>
            <span className="text-sm font-medium text-gray-700">João Silva</span>
          </div>
        </div>
      </div>
    </header>
  );
}
