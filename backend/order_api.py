from fastapi import APIRouter
from pydantic import BaseModel
from database import get_db_connection

router = APIRouter()


# =========================
# Order Model
# =========================

class Order(BaseModel):
    customer_name: str
    product_id: int
    quantity: int
    status: str = "Processing"


# =========================
# GET ALL ORDERS
# =========================

@router.get("/orders")
def get_orders():

    db = get_db_connection()
    cursor = db.cursor()

    cursor.execute("""
        SELECT
            orders.id,
            orders.customer_name,
            products.name AS product_name,
            orders.quantity,
            orders.status
        FROM orders
        JOIN products
        ON orders.product_id = products.id
    """)

    rows = cursor.fetchall()

    orders = []

    for row in rows:
        orders.append({
            "id": row[0],
            "customer_name": row[1],
            "product_name": row[2],
            "quantity": row[3],
            "status": row[4]
        })

    cursor.close()
    db.close()

    return orders


# =========================
# ADD ORDER
# =========================

@router.post("/orders")
def add_order(order: Order):

    db = get_db_connection()
    cursor = db.cursor()

    cursor.execute(
        """
        INSERT INTO orders
        (customer_name, product_id, quantity, status)
        VALUES (%s, %s, %s, %s)
        """,
        (
            order.customer_name,
            order.product_id,
            order.quantity,
            order.status
        )
    )

    db.commit()

    order_id = cursor.lastrowid

    cursor.close()
    db.close()

    return {
        "message": "Order added successfully",
        "order_id": order_id
    }

@router.get("/orders/{order_id}")
def get_order(order_id: int):

    db = get_db_connection()
    cursor = db.cursor()

    cursor.execute("""
        SELECT
            orders.id,
            orders.customer_name,
            products.name AS product_name,
            products.price,
            orders.quantity,
            orders.status
        FROM orders
        JOIN products
        ON orders.product_id = products.id
        WHERE orders.id = %s
    """, (order_id,))

    row = cursor.fetchone()

    cursor.close()
    db.close()

    if row is None:
        return {
            "message": "Order not found"
        }

    return {
        "id": row[0],
        "customer_name": row[1],
        "product_name": row[2],
        "price": row[3],
        "quantity": row[4],
        "status": row[5]
    }

@router.put("/orders/{order_id}")
def update_order(order_id: int, order: Order):

    db = get_db_connection()
    cursor = db.cursor()

    cursor.execute(
        """
        UPDATE orders
        SET customer_name = %s,
            product_id = %s,
            quantity = %s,
            status = %s
        WHERE id = %s
        """,
        (
            order.customer_name,
            order.product_id,
            order.quantity,
            order.status,
            order_id
        )
    )

    db.commit()

    cursor.close()
    db.close()

    return {
        "message": "Order updated successfully"
    }


@router.delete("/orders/{order_id}")
def delete_order(order_id: int):

    db = get_db_connection()
    cursor = db.cursor()

    cursor.execute(
        "DELETE FROM orders WHERE id = %s",
        (order_id,)
    )

    db.commit()

    cursor.close()
    db.close()

    return {
        "message": "Order deleted successfully"
    }