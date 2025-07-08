import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/dashboard";
import Establishments from "@/pages/establishments";
import Products from "@/pages/products";
import Offers from "@/pages/offers";
import CustomerView from "@/pages/customer-view";
import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";

function Router() {
    return (
        <Switch>
            <Route path="/" component={Dashboard} />
            <Route path="/establishments" component={Establishments} />
            <Route path="/products" component={Products} />
            <Route path="/offers" component={Offers} />
            <Route path="/customer-view" component={CustomerView} />
            <Route path="/loja" component={CustomerView} />
            <Route component={NotFound} />
        </Switch>
    );
}

function App() {
    const [location] = useLocation();
    const isCustomerView = location === "/customer-view" || location === "/loja";

    return (
        <QueryClientProvider client={queryClient}>
            <TooltipProvider>
                <Toaster />
                {isCustomerView ? (
                    // Layout for customer view (no sidebar/header)
                    <div className="min-h-screen bg-gray-50">
                        <Router />
                    </div>
                ) : (
                    // Layout for admin pages (with sidebar/header)
                    <div className="min-h-screen flex bg-gray-50">
                        <Sidebar />
                        <div className="flex-1 ml-64">
                            <Header />
                            <Router />
                        </div>
                    </div>
                )}
            </TooltipProvider>
        </QueryClientProvider>
    );
}

export default App;
