from fastapi import FastAPI
from product_api import router as product_router
from order_api import router as order_router
from agent_api import router as agent_router

app = FastAPI()

app.include_router(product_router)
app.include_router(order_router)
app.include_router(agent_router)


@app.get("/")
def home():
    return {
        "message": "FastAPI connected to MySQL successfully"
    }