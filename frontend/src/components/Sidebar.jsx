import React from "react";
import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Package, ShoppingCart } from "lucide-react";

export default function Sidebar() {
  const location = useLocation();

  const navItems = [
    {
      name: "Dashboard",
      path: "/admin",
      exact: true,
      icon: LayoutDashboard,
    },
    {
      name: "Products",
      path: "/admin/products",
      exact: false,
      icon: Package,
    },
    {
      name: "Orders",
      path: "/admin/orders",
      exact: false,
      icon: ShoppingCart,
    },
  ];

  return (
    <aside className="w-full md:w-64 bg-white border-b md:border-b-0 md:border-r border-gray-200 p-4 md:min-h-[calc(100vh-4rem)] flex-shrink-0">
      <div className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3 px-3 hidden md:block">
        Admin Navigation
      </div>
      <nav className="flex md:flex-col space-x-2 md:space-x-0 md:space-y-1 overflow-x-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.exact
            ? location.pathname === item.path
            : location.pathname.startsWith(item.path);

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                isActive
                  ? "bg-indigo-50 text-indigo-700 font-semibold"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              }`}
            >
              <Icon
                className={`w-5 h-5 ${
                  isActive ? "text-indigo-600" : "text-gray-400"
                }`}
              />
              <span className="whitespace-nowrap">{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
