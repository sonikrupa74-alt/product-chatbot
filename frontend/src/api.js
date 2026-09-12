// =======================================================
// API CONFIGURATION
// Base URL for the FastAPI backend.
// Replace with deployed Render URL in production.
// =======================================================
export const API_URL = "http://127.0.0.1:8000";

/**
 * Robust fetch helper that attempts direct connection to API_URL,
 * and seamlessly falls back to the Vite dev proxy if the browser
 * blocks cross-origin requests due to missing CORS headers on the backend.
 */
async function apiFetch(endpoint, options = {}) {
  try {
    const res = await fetch(`${API_URL}${endpoint}`, options);
    return res;
  } catch (err) {
    // If browser blocks direct cross-origin request (CORS issue), retry via Vite proxy
    try {
      const fallbackRes = await fetch(endpoint, options);
      return fallbackRes;
    } catch (fallbackErr) {
      throw err;
    }
  }
}

// =======================================================
// PRODUCT APIs
// =======================================================

// Fetch all products from GET /products
export async function getProducts() {
  try {
    const response = await apiFetch("/products");
    if (!response.ok) {
      throw new Error(`Server returned status ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw new Error("Unable to connect to the server. Please check if backend is running.");
  }
}

// Fetch single product by ID from GET /products/{id}
export async function getProductById(id) {
  try {
    const response = await apiFetch(`/products/${id}`);
    if (!response.ok) {
      throw new Error(`Server returned status ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error fetching product ${id}:`, error);
    throw new Error("Unable to connect to the server.");
  }
}

// Add new product via POST /products
export async function addProduct(product) {
  try {
    const response = await apiFetch("/products", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: product.name,
        price: parseInt(product.price, 10),
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(errText || "Failed to create product");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error creating product:", error);
    throw new Error("Failed to add product. Unable to connect to the server.");
  }
}

// Update existing product via PUT /products/{id}
export async function updateProduct(id, product) {
  try {
    const response = await apiFetch(`/products/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: product.name,
        price: parseInt(product.price, 10),
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(errText || "Failed to update product");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error updating product ${id}:`, error);
    throw new Error("Failed to update product. Unable to connect to the server.");
  }
}

// Delete product via DELETE /products/{id}
export async function deleteProduct(id) {
  try {
    const response = await apiFetch(`/products/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(errText || "Failed to delete product");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error deleting product ${id}:`, error);
    throw new Error("Failed to delete product. Unable to connect to the server.");
  }
}

// =======================================================
// ORDER APIs
// =======================================================

// Fetch all orders from GET /orders
export async function getOrders() {
  try {
    const response = await apiFetch("/orders");
    if (!response.ok) {
      throw new Error(`Server returned status ${response.status}`);
    }
    const orders = await response.json();

    // Ensure price is populated:
    // If /orders returns price directly, use it.
    // If /orders omitted price, fetch the order detail via GET /orders/{id}
    const ordersWithPrice = await Promise.all(
      orders.map(async (order) => {
        if (order.price !== undefined && order.price !== null) {
          return order;
        }
        try {
          const detail = await getOrderById(order.id);
          return {
            ...order,
            price: detail.price ?? order.price,
          };
        } catch {
          return order;
        }
      })
    );

    return ordersWithPrice;
  } catch (error) {
    console.error("Error fetching orders:", error);
    throw new Error("Unable to connect to the server. Please check if backend is running.");
  }
}

// Fetch single order by ID from GET /orders/{id}
export async function getOrderById(id) {
  try {
    const response = await apiFetch(`/orders/${id}`);
    if (!response.ok) {
      throw new Error(`Server returned status ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error fetching order ${id}:`, error);
    throw new Error("Unable to connect to the server.");
  }
}

// Update existing order via PUT /orders/{id}
export async function updateOrder(id, order) {
  try {
    const response = await apiFetch(`/orders/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        customer_name: order.customer_name,
        product_id: parseInt(order.product_id, 10),
        quantity: parseInt(order.quantity, 10),
        status: order.status,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(errText || "Failed to update order");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error updating order ${id}:`, error);
    throw new Error(error.message || "Failed to update order. Unable to connect to the server.");
  }
}

// Delete order via DELETE /orders/{id}
export async function deleteOrder(id) {
  try {
    const response = await apiFetch(`/orders/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(errText || "Failed to delete order");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error deleting order ${id}:`, error);
    throw new Error(error.message || "Failed to delete order. Unable to connect to the server.");
  }
}

// =======================================================
// CHATBOT AGENT CONNECTOR (LANGGRAPH / GROQ BACKEND)
// =======================================================

export const CASUAL_RESPONSES = {
  // Greetings
  "hi": "Hello! How can I help you with products or orders?",
  "hello": "Hello! How can I help you with products or orders?",
  "hey": "Hello! How can I help you with products or orders?",
  "hi there": "Hello! How can I help you with products or orders?",
  "hello there": "Hello! How can I help you with products or orders?",

  // Acknowledgments & Feedback
  "okay": "Okay! 👍",
  "ok": "Okay! 👍",
  "alright": "Okay! 👍",
  "cool": "Glad I could help!",
  "good": "Great!",
  "great": "Great!",
  "nice": "Great!",
  "bad": "I'm sorry to hear that. How can I help you with products or orders?",
  "not good": "I'm sorry to hear that. How can I help you with products or orders?",

  // Affirmations & Negations
  "yes": "Sure!",
  "yeah": "Sure!",
  "yup": "Sure!",
  "no": "No problem!",
  "nope": "No problem!",

  // Politeness
  "please": "How can I assist you with products or orders?",
  "thanks": "You're welcome!",
  "thank you": "You're welcome!",
  "thank you so much": "You're welcome!",
  "sorry": "No problem!",
  "sure": "Sure!",

  // Farewells
  "bye": "Goodbye! Have a great day!",
  "goodbye": "Goodbye! Have a great day!",
};

export function getCasualResponse(userMessage) {
  if (!userMessage) return null;
  const cleaned = userMessage.trim().toLowerCase().replace(/^[^\w\s]+|[^\w\s]+$/g, "").trim();
  return CASUAL_RESPONSES[cleaned] || null;
}

export async function sendChatMessage(userMessage, selectedProduct = null) {
  // Casual messages should NOT trigger Product or Order API calls
  const casualReply = getCasualResponse(userMessage);
  if (casualReply) {
    return { response: casualReply };
  }

  // Include selected product information so queries like "this product", "what is its price?", "how much is this?" resolve immediately
  const message = selectedProduct
    ? `${userMessage}. Selected product: ${selectedProduct.name}, Product ID: ${selectedProduct.id}, Price: ₹${selectedProduct.price}`
    : userMessage;

  const response = await apiFetch("/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      message: message,
    }),
  });

  if (!response.ok) {
    throw new Error(`Chat API returned status ${response.status}`);
  }

  return await response.json();
}