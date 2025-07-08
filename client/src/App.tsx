import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
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

// Usa base correta de acordo com o build
const basename = import.meta.env.BASE_URL;

function AppLayout() {
    const location = useLocation();
    const path = location.pathname;

    const isCustomerView = path === "/customer-view" || path === "/loja";

    return (
        <QueryClientProvider client={queryClient}>
            <TooltipProvider>
                <Toaster />
                {isCustomerView ? (
                    <div className="min-h-screen bg-gray-50">
                        <Routes>
                            <Route path="/" element={<Dashboard />} />
                            <Route path="/customer-view" element={<CustomerView />} />
                            <Route path="/loja" element={<CustomerView />} />
                            <Route path="*" element={<NotFound />} />
                        </Routes>
                    </div>
                ) : (
                    <div className="min-h-screen flex bg-gray-50">
                        <Sidebar />
                        <div className="flex-1 ml-64">
                            <Header />
                            <Routes>
                                <Route path="/" element={<Dashboard />} />
                                <Route path="/establishments" element={<Establishments />} />
                                <Route path="/products" element={<Products />} />
                                <Route path="/offers" element={<Offers />} />
                                <Route path="/customer-view" element={<CustomerView />} />
                                <Route path="/loja" element={<CustomerView />} />
                                <Route path="*" element={<NotFound />} />
                            </Routes>
                        </div>
                    </div>
                )}
            </TooltipProvider>
        </QueryClientProvider>
    );
}

export default function App() {
    return (
        <Router basename={basename}>
            <AppLayout />
        </Router>
    );
}
