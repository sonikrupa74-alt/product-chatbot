from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from product_api import router as product_router
from order_api import router as order_router
from agent_api import router as agent_router


app = FastAPI()


# CORS CONFIGURATION
# Allows the React frontend to communicate with FastAPI

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "https://product-chatbot-frontend.onrender.com",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# API ROUTES
app.include_router(product_router)
app.include_router(order_router)
app.include_router(agent_router)


# HOME
@app.get("/")
def home():
    return {
        "message": "FastAPI connected to MySQL successfully"
    }