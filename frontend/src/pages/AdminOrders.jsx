import React, { useState, useEffect } from "react";
import { getOrders, updateOrder, deleteOrder, getProducts } from "../api";
import StatusBadge from "../components/StatusBadge";
import AlertMessage from "../components/AlertMessage";
import { ShoppingCart, RefreshCw, User, Package, X, AlertTriangle } from "lucide-react";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  // Edit Order State
  const [editingOrder, setEditingOrder] = useState(null);
  const [editCustomerName, setEditCustomerName] = useState("");
  const [editProductId, setEditProductId] = useState("");
  const [editQuantity, setEditQuantity] = useState("");
  const [editStatus, setEditStatus] = useState("Processing");
  const [editSubmitting, setEditSubmitting] = useState(false);
  const [editError, setEditError] = useState(null);

  useEffect(() => {
    loadOrders();
    loadProducts();
  }, []);

  async function loadProducts() {
    try {
      const data = await getProducts();
      setProducts(data);
    } catch (err) {
      console.error("Failed to load products for order editing:", err);
    }
  }

  async function loadOrders() {
    setLoading(true);
    setError(null);
    try {
      const data = await getOrders();
      setOrders(data);
    } catch (err) {
      setError(err.message || "Failed to load orders.");
    } finally {
      setLoading(false);
    }
  }

  function handleOpenEditModal(order) {
    setEditingOrder(order);
    setEditCustomerName(order.customer_name || "");

    // Match product_id from order or look up in loaded products by name
    let matchedId = order.product_id;
    if (!matchedId && products.length > 0) {
      const match = products.find((p) => p.name === order.product_name);
      if (match) {
        matchedId = match.id;
      } else {
        matchedId = products[0].id;
      }
    }
    setEditProductId(matchedId ? matchedId.toString() : "");
    setEditQuantity(order.quantity ? order.quantity.toString() : "1");
    setEditStatus(order.status || "Processing");
    setEditError(null);
  }

  function handleCloseEditModal() {
    setEditingOrder(null);
    setEditCustomerName("");
    setEditProductId("");
    setEditQuantity("");
    setEditStatus("Processing");
    setEditError(null);
  }

  async function handleUpdateOrder(e) {
    e.preventDefault();
    setEditError(null);

    const trimmedName = editCustomerName.trim();
    const numProductId = parseInt(editProductId, 10);
    const numQuantity = parseInt(editQuantity, 10);

    if (!trimmedName) {
      setEditError("Customer name cannot be empty.");
      return;
    }

    if (!numProductId || isNaN(numProductId)) {
      setEditError("Please select a valid product.");
      return;
    }

    if (!numQuantity || isNaN(numQuantity) || numQuantity <= 0) {
      setEditError("Quantity must be a positive integer.");
      return;
    }

    setEditSubmitting(true);
    try {
      await updateOrder(editingOrder.id, {
        customer_name: trimmedName,
        product_id: numProductId,
        quantity: numQuantity,
        status: editStatus,
      });
      setSuccessMsg(`Order #${editingOrder.id} updated successfully!`);
      handleCloseEditModal();
      await loadOrders();
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err) {
      setEditError(err.message || "Failed to update order.");
    } finally {
      setEditSubmitting(false);
    }
  }

  async function handleDeleteOrder(order) {
    const confirmed = window.confirm("Are you sure you want to delete this order?");
    if (!confirmed) return;

    try {
      await deleteOrder(order.id);
      setSuccessMsg(`Order #${order.id} deleted successfully!`);
      await loadOrders();
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err) {
      setError(err.message || "Failed to delete order.");
    }
  }

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <ShoppingCart className="w-7 h-7 text-indigo-600" />
            Orders
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Track customer orders and fulfillment status
          </p>
        </div>

        <div>
          <button
            onClick={loadOrders}
            disabled={loading}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition"
            title="Refresh orders"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Global Alerts */}
      {successMsg && (
        <AlertMessage type="success" message={successMsg} />
      )}
      {error && (
        <AlertMessage
          type="error"
          message={error}
          onRetry={loadOrders}
        />
      )}

      {/* Orders Table Card */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gray-500">
            <div className="inline-block animate-spin w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full mb-3"></div>
            <p className="text-sm font-medium">Loading orders from server...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            <ShoppingCart className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-base font-semibold text-gray-800">No orders found</h3>
            <p className="text-sm text-gray-500 mt-1">
              Customer orders will show up here once placed.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-left text-sm">
              <thead className="bg-gray-50 text-gray-600 uppercase text-xs tracking-wider">
                <tr>
                  <th scope="col" className="px-6 py-3 font-semibold">
                    Order ID
                  </th>
                  <th scope="col" className="px-6 py-3 font-semibold">
                    Customer Name
                  </th>
                  <th scope="col" className="px-6 py-3 font-semibold">
                    Product Name
                  </th>
                  <th scope="col" className="px-6 py-3 font-semibold">
                    Price
                  </th>
                  <th scope="col" className="px-6 py-3 font-semibold">
                    Quantity
                  </th>
                  <th scope="col" className="px-6 py-3 font-semibold">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 font-semibold text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50/80 transition">
                    <td className="px-6 py-4 font-mono font-medium text-xs text-indigo-600">
                      #{order.id}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 text-xs font-semibold">
                          {order.customer_name ? order.customer_name[0].toUpperCase() : "U"}
                        </div>
                        <span className="font-medium text-gray-900">
                          {order.customer_name}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-800 font-medium">
                      {order.product_name}
                    </td>
                    <td className="px-6 py-4 font-semibold text-gray-700">
                      {order.price !== undefined && order.price !== null
                        ? `₹${Number(order.price).toLocaleString("en-IN")}`
                        : "-"}
                    </td>
                    <td className="px-6 py-4 text-gray-600 font-medium">
                      {order.quantity}
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={order.status} />
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="inline-flex items-center space-x-2">
                        <button
                          onClick={() => handleOpenEditModal(order)}
                          className="px-2.5 py-1 text-xs font-medium text-indigo-600 hover:text-indigo-900 bg-indigo-50 hover:bg-indigo-100 rounded border border-indigo-200 transition"
                          title="Edit order"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() => handleDeleteOrder(order)}
                          className="px-2.5 py-1 text-xs font-medium text-red-600 hover:text-red-900 bg-red-50 hover:bg-red-100 rounded border border-red-200 transition"
                          title="Delete order"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Edit Order Modal */}
      {editingOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md border border-gray-100 overflow-hidden animate-in fade-in zoom-in duration-150">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900">Edit Order #{editingOrder.id}</h2>
              <button
                onClick={handleCloseEditModal}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleUpdateOrder} className="p-6 space-y-4">
              {editError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>{editError}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                  Customer Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rahul Sharma"
                  value={editCustomerName}
                  onChange={(e) => setEditCustomerName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                  Product <span className="text-red-500">*</span>
                </label>
                <select
                  required
                  value={editProductId}
                  onChange={(e) => setEditProductId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm bg-white"
                >
                  <option value="">Select a product</option>
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} (₹{Number(p.price).toLocaleString()})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                  Quantity <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  step="1"
                  placeholder="e.g. 1"
                  value={editQuantity}
                  onChange={(e) => setEditQuantity(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                  Status <span className="text-red-500">*</span>
                </label>
                <select
                  required
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm bg-white"
                >
                  <option value="Processing">Processing</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

              <div className="pt-3 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={handleCloseEditModal}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={editSubmitting}
                  className="px-5 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition disabled:opacity-50 flex items-center gap-2"
                >
                  {editSubmitting && (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  )}
                  <span>{editSubmitting ? "Saving..." : "Save Changes"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
