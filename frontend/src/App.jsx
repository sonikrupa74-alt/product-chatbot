import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import AdminDashboard from "./pages/AdminDashboard";
import AdminProducts from "./pages/AdminProducts";
import AdminOrders from "./pages/AdminOrders";
import CustomerChat from "./pages/CustomerChat";

// Admin layout wrapper with responsive sidebar
function AdminLayout({ children }) {
  return (
    <div className="flex flex-col md:flex-row min-h-[calc(100vh-4rem)]">
      <Sidebar />
      <main className="flex-1 p-4 sm:p-6 md:p-8 max-w-6xl">
        {children}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar />

      <div className="flex-1">
        <Routes>
          {/* Customer Routes */}
          <Route path="/customer" element={<Navigate to="/customer/chat" replace />} />
          <Route path="/customer/chat" element={<CustomerChat />} />

          {/* Admin Routes */}
          <Route
            path="/admin"
            element={
              <AdminLayout>
                <AdminDashboard />
              </AdminLayout>
            }
          />
          <Route
            path="/admin/products"
            element={
              <AdminLayout>
                <AdminProducts />
              </AdminLayout>
            }
          />
          <Route
            path="/admin/orders"
            element={
              <AdminLayout>
                <AdminOrders />
              </AdminLayout>
            }
          />

          {/* Default Route */}
          <Route path="/" element={<Navigate to="/customer/chat" replace />} />
          <Route path="*" element={<Navigate to="/customer/chat" replace />} />
        </Routes>
      </div>
    </div>
  );
}
