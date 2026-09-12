import React, { useState, useEffect } from "react";
import { getProducts, addProduct, updateProduct, deleteProduct } from "../api";
import AlertMessage from "../components/AlertMessage";
import { Plus, Package, RefreshCw, X, AlertTriangle } from "lucide-react";

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  // Form State - Add Product
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formError, setFormError] = useState(null);

  // Form State - Edit Product
  const [editingProduct, setEditingProduct] = useState(null);
  const [editName, setEditName] = useState("");
  const [editPrice, setEditPrice] = useState("");
  const [editSubmitting, setEditSubmitting] = useState(false);
  const [editError, setEditError] = useState(null);

  // Load products on mount
  useEffect(() => {
    loadProducts();
  }, []);

  async function loadProducts() {
    setLoading(true);
    setError(null);
    try {
      const data = await getProducts();
      setProducts(data);
    } catch (err) {
      setError(err.message || "Failed to load products.");
    } finally {
      setLoading(false);
    }
  }

  async function handleAddProduct(e) {
    e.preventDefault();
    setFormError(null);

    // Validate inputs
    const trimmedName = name.trim();
    const numPrice = Number(price);

    if (!trimmedName) {
      setFormError("Product name cannot be empty.");
      return;
    }

    if (!price || isNaN(numPrice) || numPrice <= 0) {
      setFormError("Please enter a valid positive price.");
      return;
    }

    setFormSubmitting(true);
    try {
      await addProduct({ name: trimmedName, price: numPrice });
      setSuccessMsg(`Product "${trimmedName}" created successfully!`);
      // Clear form
      setName("");
      setPrice("");
      setIsModalOpen(false);
      // Refresh list
      await loadProducts();
      // Auto-hide success message after 4s
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err) {
      setFormError(err.message || "Failed to add product.");
    } finally {
      setFormSubmitting(false);
    }
  }

  function handleOpenEditModal(product) {
    setEditingProduct(product);
    setEditName(product.name);
    setEditPrice(product.price.toString());
    setEditError(null);
  }

  function handleCloseEditModal() {
    setEditingProduct(null);
    setEditName("");
    setEditPrice("");
    setEditError(null);
  }

  async function handleUpdateProduct(e) {
    e.preventDefault();
    setEditError(null);

    const trimmedName = editName.trim();
    const numPrice = Number(editPrice);

    if (!trimmedName) {
      setEditError("Product name cannot be empty.");
      return;
    }

    if (!editPrice || isNaN(numPrice) || numPrice <= 0) {
      setEditError("Please enter a valid positive price.");
      return;
    }

    setEditSubmitting(true);
    try {
      await updateProduct(editingProduct.id, { name: trimmedName, price: numPrice });
      setSuccessMsg(`Product "${trimmedName}" updated successfully!`);
      handleCloseEditModal();
      await loadProducts();
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err) {
      setEditError(err.message || "Failed to update product.");
    } finally {
      setEditSubmitting(false);
    }
  }

  async function handleDeleteProduct(product) {
    const confirmed = window.confirm("Are you sure you want to delete this product?");
    if (!confirmed) return;

    try {
      await deleteProduct(product.id);
      setSuccessMsg(`Product "${product.name}" deleted successfully!`);
      await loadProducts();
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err) {
      setError(err.message || "Failed to delete product.");
    }
  }

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Package className="w-7 h-7 text-indigo-600" />
            Products
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage your store catalog and view pricing
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadProducts}
            disabled={loading}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition"
            title="Refresh product list"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>

          <button
            onClick={() => {
              setFormError(null);
              setIsModalOpen(true);
            }}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 shadow-sm transition"
          >
            <Plus className="w-4 h-4" />
            Add Product
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
          onRetry={loadProducts}
        />
      )}

      {/* Product Table Card */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gray-500">
            <div className="inline-block animate-spin w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full mb-3"></div>
            <p className="text-sm font-medium">Loading products from server...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-base font-semibold text-gray-800">No products found</h3>
            <p className="text-sm text-gray-500 mt-1 mb-4">
              Get started by adding your first product to the catalog.
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700"
            >
              <Plus className="w-4 h-4" />
              Add Product
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-left text-sm">
              <thead className="bg-gray-50 text-gray-600 uppercase text-xs tracking-wider">
                <tr>
                  <th scope="col" className="px-6 py-3 font-semibold">
                    ID
                  </th>
                  <th scope="col" className="px-6 py-3 font-semibold">
                    Product Name
                  </th>
                  <th scope="col" className="px-6 py-3 font-semibold">
                    Price
                  </th>
                  <th scope="col" className="px-6 py-3 font-semibold text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {products.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50/80 transition">
                    <td className="px-6 py-4 font-mono text-xs text-gray-500">
                      #{p.id}
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {p.name}
                    </td>
                    <td className="px-6 py-4 font-semibold text-gray-800">
                      ₹{Number(p.price).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="inline-flex items-center space-x-2">
                        {/* Edit Button */}
                        <button
                          onClick={() => handleOpenEditModal(p)}
                          className="px-2.5 py-1 text-xs font-medium text-indigo-600 hover:text-indigo-900 bg-indigo-50 hover:bg-indigo-100 rounded border border-indigo-200 transition"
                          title="Edit product"
                        >
                          Edit
                        </button>

                        {/* Delete Button */}
                        <button
                          onClick={() => handleDeleteProduct(p)}
                          className="px-2.5 py-1 text-xs font-medium text-red-600 hover:text-red-900 bg-red-50 hover:bg-red-100 rounded border border-red-200 transition"
                          title="Delete product"
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

      {/* Add Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md border border-gray-100 overflow-hidden animate-in fade-in zoom-in duration-150">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900">Add New Product</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleAddProduct} className="p-6 space-y-4">
              {formError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                  Product Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Samsung Galaxy S26"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                  Price (₹) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  step="1"
                  placeholder="e.g. 74999"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                />
              </div>

              <div className="pt-3 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formSubmitting}
                  className="px-5 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition disabled:opacity-50 flex items-center gap-2"
                >
                  {formSubmitting && (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  )}
                  <span>{formSubmitting ? "Adding..." : "Add Product"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Product Modal */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md border border-gray-100 overflow-hidden animate-in fade-in zoom-in duration-150">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900">Edit Product</h2>
              <button
                onClick={handleCloseEditModal}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleUpdateProduct} className="p-6 space-y-4">
              {editError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>{editError}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                  Product Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Samsung Galaxy S26"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                  Price (₹) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  step="1"
                  placeholder="e.g. 74999"
                  value={editPrice}
                  onChange={(e) => setEditPrice(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                />
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
