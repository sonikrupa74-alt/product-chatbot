import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getProducts, getOrders, API_URL } from "../api";
import {
  Package,
  ShoppingCart,
  Server,
  ArrowRight,
  PlusCircle,
  MessageSquare,
  TrendingUp,
} from "lucide-react";
import AlertMessage from "../components/AlertMessage";

export default function AdminDashboard() {
  const [productCount, setProductCount] = useState(0);
  const [orderCount, setOrderCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadStats() {
      setLoading(true);
      setError(null);
      try {
        const [products, orders] = await Promise.all([
          getProducts(),
          getOrders(),
        ]);
        setProductCount(products.length);
        setOrderCount(orders.length);
      } catch (err) {
        setError("Unable to connect to the server.");
      } finally {
        setLoading(false);
      }
    }

    loadStats();
  }, []);

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">
          Welcome to your store management center
        </p>
      </div>

      {error && <AlertMessage type="error" message={error} />}

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {/* Products Card */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Total Products
            </p>
            <h3 className="text-3xl font-extrabold text-gray-900 mt-2">
              {loading ? "..." : productCount}
            </h3>
            <Link
              to="/admin/products"
              className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-800 mt-3"
            >
              <span>Manage products</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Package className="w-6 h-6" />
          </div>
        </div>

        {/* Orders Card */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Total Orders
            </p>
            <h3 className="text-3xl font-extrabold text-gray-900 mt-2">
              {loading ? "..." : orderCount}
            </h3>
            <Link
              to="/admin/orders"
              className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-800 mt-3"
            >
              <span>View all orders</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <ShoppingCart className="w-6 h-6" />
          </div>
        </div>

        {/* Backend Status Card */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between sm:col-span-2 lg:col-span-1">
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              FastAPI Server
            </p>
            <div className="flex items-center gap-2 mt-2">
              <span
                className={`w-2.5 h-2.5 rounded-full ${
                  error ? "bg-red-500" : "bg-emerald-500 animate-pulse"
                }`}
              ></span>
              <span className="text-sm font-semibold text-gray-800">
                {error ? "Offline" : "Connected"}
              </span>
            </div>
            <p className="text-xs font-mono text-gray-400 mt-3 truncate max-w-[200px]">
              {API_URL}
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Server className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Quick Action Cards */}
      <div className="bg-gradient-to-r from-indigo-500 to-indigo-700 rounded-2xl p-6 text-white shadow-md">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold">Quick Actions</h2>
            <p className="text-indigo-100 text-sm mt-1">
              Quickly test adding a product or interact with the customer chatbot
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              to="/admin/products"
              className="inline-flex items-center gap-2 px-4 py-2 bg-white text-indigo-700 font-semibold rounded-lg shadow hover:bg-indigo-50 transition text-sm"
            >
              <PlusCircle className="w-4 h-4" />
              Add Product
            </Link>
            <Link
              to="/customer/chat"
              className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-800 text-white font-semibold rounded-lg hover:bg-indigo-900 border border-indigo-400 transition text-sm"
            >
              <MessageSquare className="w-4 h-4" />
              Open Customer Chat
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
