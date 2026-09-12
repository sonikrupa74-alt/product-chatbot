# 🛒 E-commerce Product & Order Chatbot

An AI-powered e-commerce chatbot that helps users get product and order information using an Agentic AI workflow.

The application includes a customer chatbot, product selection, product/order management, REST APIs, and a cloud-hosted MySQL database.

---

## 🚀 Live Demo

**Customer Chat:**  
[Open Customer Chat](YOUR_FRONTEND_URL)

**Admin Panel:**  
[Open Admin Panel](YOUR_FRONTEND_URL/admin)

**API Documentation:**  
[FastAPI Swagger Docs](YOUR_BACKEND_URL/docs)

---

## ✨ Features

### 🤖 AI Customer Chatbot

- Ask questions about products and orders.
- Search for products by name without selecting them.
- Ask for product prices and details.
- Ask about order information.
- Supports selected-product context.
- Understands follow-up questions such as:
  - "Tell me about this product"
  - "What is its price?"
- Handles simple casual conversations.
- Restricts responses to product and order related information.

### 🛍️ Product Management

Admin can:

- View all products
- Add new products
- Update products
- Delete products
- Manage products through the frontend admin panel

### 📦 Order Management

Admin can:

- View orders
- Add orders
- Update order status/details
- Delete orders
- View product information associated with orders

### ☁️ Cloud Deployment

The application is deployed using:

- Frontend → Render Static Site
- Backend → Render Web Service
- Database → Aiven MySQL

---

## 🏗️ Architecture

```text
                    ┌──────────────────────┐
                    │      Customer        │
                    │    React Frontend    │
                    │       Render        │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │    FastAPI Backend   │
                    │        Render        │
                    └──────────┬───────────┘
                               │
                  ┌────────────┴────────────┐
                  │                         │
                  ▼                         ▼
        ┌──────────────────┐      ┌──────────────────┐
        │   AI Agent       │      │ Product / Order  │
        │ LangGraph +      │      │ REST APIs        │
        │ LangChain + Groq │      └────────┬─────────┘
        └──────────────────┘               │
                                           ▼
                                  ┌──────────────────┐
                                  │    Aiven MySQL   │
                                  │   Cloud Database  │
                                  └──────────────────┘
