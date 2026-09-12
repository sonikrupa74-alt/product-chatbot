# 🛒 E-commerce Product & Order Chatbot

An AI-powered e-commerce application built with **React, FastAPI, LangChain, LangGraph, Groq, and MySQL**.

The application provides an **AI customer chatbot** for product and order assistance and an **admin panel** for managing products and orders.

The AI agent retrieves product and order information through **REST APIs**, while the backend APIs communicate with a cloud-hosted **MySQL database**.

---

## 🚀 Live Application

| Application | Link |
|---|---|
| 🤖 Customer Chat | [Open Customer Chat](https://product-chatbot-frontend.onrender.com/customer/chat) |
| 🛠️ Admin Panel | [Open Admin Panel](https://product-chatbot-frontend.onrender.com/admin) |
| 📚 API Documentation | [FastAPI Swagger Docs](https://product-chatbot-mji0.onrender.com/docs) |
| 💻 Source Code | [GitHub Repository](https://github.com/sonikrupa74-alt/product-chatbot) |

---

## ✨ Features

### 🤖 AI Customer Chatbot

Customers can interact with an AI assistant to get information about products and orders.

### 🛍️ Product Queries

The chatbot can answer product-related questions such as:

- Tell me about ipad
- What is the price of iPhone 17?
- Tell me about MacBook Air M4
- Show me all products

The chatbot can search for products by name without requiring the user to select a product first.

### 🎯 Selected Product Context

Users can select a product from the product dropdown and ask follow-up questions such as:

- Tell me about this product
- What is its price?
- How much is this?
- Tell me about it

The selected product information is passed to the AI agent as context.

### 📦 Order Queries

The chatbot can answer order-related questions such as:

- Show me order 1
- Where is my order?
- Tell me about order 5
- Show order details

### 💬 Casual Conversation

The chatbot also handles simple conversational messages such as:

- Hi
- Hello
- Okay
- Thanks
- Bye

The chatbot is primarily designed to help with **product and order information**.

---

## 🛍️ Product Management

The Admin Panel provides CRUD operations for products.

- ➕ Add products
- 📋 View products
- ✏️ Update products
- 🗑️ Delete products

Products added through the Admin Panel are sent to the FastAPI backend and stored in the MySQL database.

---

## 📦 Order Management

The Admin Panel provides order management functionality.

- ➕ Add orders
- 📋 View orders
- ✏️ Update orders
- 🗑️ Delete orders
- 🔎 View order details
- 📦 View associated product information

---

## 🧠 Agentic AI

The chatbot uses **LangChain and LangGraph** to create a tool-based AI agent powered by **Groq**.

The AI agent does not directly access the database.

Instead, the agent uses backend REST APIs through dedicated tools.

### Agent Tools

- `get_products`
- `get_product`
- `get_product_by_name`
- `get_orders`
- `get_order`

The agent determines which tool is required based on the user's question, retrieves the required information through the API, and generates the final response.

---

## 🏗️ System Architecture

```text
                         USER
                           │
                           ▼
                ┌─────────────────────┐
                │   React Frontend    │
                │                     │
                │  Customer Chat      │
                │  Admin Panel        │
                └──────────┬──────────┘
                           │
                           │ HTTP / REST
                           ▼
                ┌─────────────────────┐
                │   FastAPI Backend   │
                │                     │
                │  Product APIs       │
                │  Order APIs         │
                │  Chat API           │
                └──────────┬──────────┘
                           │
              ┌────────────┴────────────┐
              │                         │
              ▼                         ▼
     ┌─────────────────┐       ┌──────────────────┐
     │    AI Agent     │       │    Aiven MySQL   │
     │                 │       │                  │
     │   LangChain     │       │    Products      │
     │   LangGraph     │       │    Orders        │
     │   Groq          │       │                  │
     └────────┬────────┘       └──────────────────┘
              │
              │ Agent Tools
              ▼
     ┌─────────────────────┐
     │ Product / Order APIs │
     └─────────────────────┘
```

---

## 🔄 How It Works

```text
User asks a question
        │
        ▼
React Customer Chat
        │
        ▼
FastAPI /chat endpoint
        │
        ▼
LangGraph AI Agent
        │
        ▼
Groq LLM
        │
        ▼
Select required tool
        │
        ├── Product Tool
        │
        └── Order Tool
                │
                ▼
          FastAPI REST API
                │
                ▼
           Aiven MySQL
                │
                ▼
        Product / Order Data
                │
                ▼
            AI Agent
                │
                ▼
         Response to User
```

---

## 🔌 REST API

### Product Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/products` | Get all products |
| GET | `/products/{id}` | Get product by ID |
| POST | `/products` | Create a product |
| PUT | `/products/{id}` | Update a product |
| DELETE | `/products/{id}` | Delete a product |

### Order Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/orders` | Get all orders |
| GET | `/orders/{id}` | Get order by ID |
| POST | `/orders` | Create an order |
| PUT | `/orders/{id}` | Update an order |
| DELETE | `/orders/{id}` | Delete an order |

### Chat Endpoint

| Method | Endpoint | Description |
|---|---|---|
| POST | `/chat` | Send a message to the AI agent |

### Example Chat Request

```json
{
  "message": "Tell me about ipad"
}
```

---

## 🛠️ Tech Stack

### Frontend

- React
- JavaScript
- Vite
- Tailwind CSS
- HTML
- CSS

### Backend

- Python
- FastAPI
- REST APIs
- PyMySQL

### Agentic AI

- LangChain
- LangGraph
- Groq
- LLM-based Agent

### Database

- MySQL
- Aiven MySQL

### Deployment

- Render
- GitHub

### Development Tools

- Git
- GitHub
- VS Code
- Jupyter Notebook

---

## 📁 Project Structure

```text
product-chatbot/
│
├── backend/
│   ├── main.py
│   ├── database.py
│   ├── product_api.py
│   ├── order_api.py
│   ├── agent_api.py
│   ├── agent.ipynb
│   ├── test_db.py
│   ├── requirements.txt
│   ├── ca.pem
│   └── .env
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   │   └── CustomerChat.jsx
│   │   ├── api.js
│   │   ├── App.jsx
│   │   └── ...
│   │
│   ├── package.json
│   ├── package-lock.json
│   ├── vite.config.js
│   └── ...
│
├── .gitignore
└── README.md
```

> `.env` is used for local configuration and is excluded from GitHub.

---

## 💻 Run Locally

### 1. Clone the Repository

```bash
git clone https://github.com/sonikrupa74-alt/product-chatbot.git
cd product-chatbot
```

### 2. Backend Setup

```bash
cd backend
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Create a `.env` file:

```env
GROQ_API_KEY=your_groq_api_key

DB_HOST=your_database_host
DB_PORT=your_database_port
DB_USER=your_database_user
DB_PASSWORD=your_database_password
DB_NAME=your_database_name
DB_SSL_CA=./ca.pem

BACKEND_URL=http://127.0.0.1:8000
```

Start the backend:

```bash
uvicorn main:app --reload
```

Backend:

`http://127.0.0.1:8000`

Swagger documentation:

`http://127.0.0.1:8000/docs`

### 3. Frontend Setup

Open another terminal:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the frontend:

```bash
npm run dev
```

---

## ☁️ Deployment

The application is deployed using **Render**.

### Frontend

```text
Platform: Render Static Site
Root Directory: frontend
Build Command: npm install && npm run build
Publish Directory: dist
```

### Backend

```text
Platform: Render Web Service
Root Directory: backend
Build Command: pip install -r requirements.txt
Start Command: uvicorn main:app --host 0.0.0.0 --port $PORT
```

### Database

```text
Provider: Aiven
Database: MySQL
```

The production backend connects to the Aiven MySQL database using SSL.

---

## 🔐 Environment Variables

The application uses environment variables for sensitive configuration.

```env
GROQ_API_KEY=your_groq_api_key

DB_HOST=your_database_host
DB_PORT=your_database_port
DB_USER=your_database_user
DB_PASSWORD=your_database_password
DB_NAME=your_database_name
DB_SSL_CA=./ca.pem

BACKEND_URL=your_backend_url
```

> ⚠️ Never commit `.env` files, API keys, database passwords, or other secrets to GitHub.

---

## 🎯 Key Highlights

This project demonstrates practical implementation of:

- 🤖 Agentic AI
- 🧠 LLM-powered applications
- 🔗 LangChain
- 🕸️ LangGraph
- ⚡ Groq
- 🛠️ Tool-based AI agents
- 🚀 FastAPI REST APIs
- ⚛️ React
- 🗄️ MySQL
- ☁️ Aiven Cloud Database
- 🔄 CRUD Operations
- 🛠️ Admin Dashboard
- 🔌 API Integration
- 🐙 Git & GitHub
- 🌐 Cloud Deployment with Render

---

### - Krupa Soni

**AI/ML • Agentic AI • Python • FastAPI • Automation**

GitHub: https://github.com/sonikrupa74-alt

---
