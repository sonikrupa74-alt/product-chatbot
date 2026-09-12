import React, { useState, useEffect, useRef } from "react";
import { getProducts, sendChatMessage } from "../api";
import AlertMessage from "../components/AlertMessage";
import {
  Send,
  Bot,
  User,
  Package,
  RotateCcw,
  Sparkles,
  HelpCircle,
} from "lucide-react";

export default function CustomerChat() {
  const [products, setProducts] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState("");
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [productError, setProductError] = useState(null);

  // Chat conversation state
  const [messages, setMessages] = useState([
    {
      id: "init",
      sender: "bot",
      text: "Hello! I am your E-commerce Assistant. Please select a product above or ask me any question regarding our products and orders.",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  // Auto-scroll ref
  const messagesEndRef = useRef(null);

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  function scrollToBottom() {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  async function loadProducts() {
    setLoadingProducts(true);
    setProductError(null);
    try {
      const data = await getProducts();
      setProducts(data);
    } catch (err) {
      setProductError(err.message || "Unable to connect to the server.");
    } finally {
      setLoadingProducts(false);
    }
  }

  // Get currently selected product object
  const selectedProduct = products.find(
    (p) => p.id.toString() === selectedProductId
  );

  async function handleSendMessage(e) {
    if (e) e.preventDefault();

    const trimmedInput = inputValue.trim();
    if (!trimmedInput || isTyping) return;

    const userMsg = {
      id: Date.now().toString(),
      sender: "user",
      text: trimmedInput,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue("");
    setIsTyping(true);

    try {
      // Call the API connector for the chatbot with automatic proxy fallback
      const res = await sendChatMessage(trimmedInput, selectedProduct);

      const botMsg = {
        id: (Date.now() + 1).toString(),
        sender: "bot",
        text: res.response || "No response received.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      const errorMsg = {
        id: (Date.now() + 1).toString(),
        sender: "bot",
        text: "Sorry, I am having trouble connecting to the AI agent right now.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  }

  function handlePromptSuggestion(promptText) {
    setInputValue(promptText);
  }

  function handleResetChat() {
    setMessages([
      {
        id: Date.now().toString(),
        sender: "bot",
        text: "Chat cleared! How can I assist you today with our products or your orders?",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    ]);
  }

  return (
    <div className="max-w-3xl mx-auto py-4 sm:py-6 px-4">
      {/* Product Loading Error Alert */}
      {productError && (
        <AlertMessage
          type="error"
          message={productError}
          onRetry={loadProducts}
        />
      )}

      {/* Main Chat Container */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm flex flex-col h-[78vh] min-h-[520px] overflow-hidden">
        
        {/* Chat Header */}
        <div className="bg-white border-b border-gray-100 p-4 sm:px-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-500 text-white flex items-center justify-center shadow-sm">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-gray-900 text-base sm:text-lg">
                E-commerce Assistant
              </h2>
              <div className="flex items-center space-x-1.5 text-xs text-gray-500">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span>Ready to assist</span>
              </div>
            </div>
          </div>

          <button
            onClick={handleResetChat}
            className="self-end sm:self-auto text-xs text-gray-500 hover:text-gray-800 flex items-center gap-1 px-2.5 py-1.5 rounded-lg hover:bg-gray-100 transition"
            title="Reset conversation"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Clear Chat</span>
          </button>
        </div>

        {/* Product Dropdown Selector */}
        <div className="bg-indigo-50/70 border-b border-indigo-100/80 px-4 sm:px-6 py-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <label
              htmlFor="product-select"
              className="text-xs font-bold text-indigo-900 flex items-center gap-1.5 uppercase tracking-wide"
            >
              <Package className="w-4 h-4 text-indigo-600" />
              Select Product:
            </label>

            <div className="flex-1 sm:max-w-xs">
              {loadingProducts ? (
                <div className="text-xs text-indigo-600 animate-pulse flex items-center gap-1.5 py-1">
                  <span>Loading products from API...</span>
                </div>
              ) : (
                <select
                  id="product-select"
                  value={selectedProductId}
                  onChange={(e) => setSelectedProductId(e.target.value)}
                  className="w-full bg-white text-gray-800 text-sm font-medium border border-indigo-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">No item selected</option>
                  {products.map((prod) => (
                    <option key={prod.id} value={prod.id}>
                      {prod.name} (₹{Number(prod.price).toLocaleString()})
                    </option>
                  ))}
                </select>
              )}
            </div>
          </div>

          {/* Quick Context Pill */}
          {selectedProduct && (
            <div className="mt-2 text-xs text-indigo-700 flex items-center justify-between">
              <span>
                Active item: <strong className="font-semibold">{selectedProduct.name}</strong>
              </span>
              <span className="font-semibold">
                ₹{Number(selectedProduct.price).toLocaleString()}
              </span>
            </div>
          )}
        </div>

        {/* Message Stream */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-slate-50/50">
          {messages.map((msg) => {
            const isUser = msg.sender === "user";
            return (
              <div
                key={msg.id}
                className={`flex items-end gap-2.5 ${
                  isUser ? "justify-end" : "justify-start"
                }`}
              >
                {!isUser && (
                  <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center flex-shrink-0 mb-0.5">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-[80%] sm:max-w-[70%] rounded-2xl px-4 py-3 text-sm shadow-sm ${
                    isUser
                      ? "bg-indigo-600 text-white rounded-br-none"
                      : "bg-white text-gray-800 border border-gray-200/80 rounded-bl-none"
                  }`}
                >
                  <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                  <div
                    className={`text-[10px] mt-1.5 text-right ${
                      isUser ? "text-indigo-200" : "text-gray-400"
                    }`}
                  >
                    {msg.timestamp}
                  </div>
                </div>

                {isUser && (
                  <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-700 flex items-center justify-center flex-shrink-0 mb-0.5">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            );
          })}

          {/* Typing indicator */}
          {isTyping && (
            <div className="flex items-end gap-2.5 justify-start">
              <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center flex-shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-white border border-gray-200/80 rounded-2xl rounded-bl-none px-4 py-3 shadow-sm">
                <div className="flex space-x-1.5 items-center h-4">
                  <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                  <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                  <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce"></div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggestion Chips */}
        <div className="px-4 py-2 bg-white border-t border-gray-100 flex items-center gap-2 overflow-x-auto text-xs">
          <span className="text-gray-400 flex items-center gap-1 whitespace-nowrap">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            Try asking:
          </span>
          <button
            type="button"
            onClick={() => handlePromptSuggestion("What is the price?")}
            className="px-2.5 py-1 rounded-full bg-gray-100 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition whitespace-nowrap"
          >
            "What is the price?"
          </button>
          <button
            type="button"
            onClick={() => handlePromptSuggestion("Where is my order?")}
            className="px-2.5 py-1 rounded-full bg-gray-100 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition whitespace-nowrap"
          >
            "Where is my order?"
          </button>
          <button
            type="button"
            onClick={() => handlePromptSuggestion("Tell me about this product.")}
            className="px-2.5 py-1 rounded-full bg-gray-100 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition whitespace-nowrap"
          >
            "Tell me about this product."
          </button>
        </div>

        {/* Input Bar */}
        <form
          onSubmit={handleSendMessage}
          className="p-3 sm:p-4 bg-white border-t border-gray-200 flex items-center gap-2"
        >
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Type your question..."
            disabled={isTyping}
            className="flex-1 px-4 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
          />
          <button
            type="submit"
            disabled={!inputValue.trim() || isTyping}
            className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 font-medium text-sm transition shadow-sm disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5"
          >
            <span>Send</span>
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
