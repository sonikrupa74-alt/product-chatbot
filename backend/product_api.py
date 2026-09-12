from fastapi import APIRouter
from pydantic import BaseModel
from database import get_db_connection

router = APIRouter()


class Product(BaseModel):
    name: str
    price: int


# GET all products
@router.get("/products")
def get_products():

    db = get_db_connection()
    cursor = db.cursor()

    cursor.execute("SELECT id, name, price FROM products")

    rows = cursor.fetchall()

    products = []

    for row in rows:
        products.append({
            "id": row[0],
            "name": row[1],
            "price": row[2]
        })

    cursor.close()
    db.close()

    return products


# GET one product
@router.get("/products/{product_id}")
def get_product(product_id: int):

    db = get_db_connection()
    cursor = db.cursor()

    cursor.execute(
        "SELECT id, name, price FROM products WHERE id = %s",
        (product_id,)
    )

    row = cursor.fetchone()

    cursor.close()
    db.close()

    if row is None:
        return {
            "message": "Product not found"
        }

    return {
        "id": row[0],
        "name": row[1],
        "price": row[2]
    }


# ADD product
@router.post("/products")
def add_product(product: Product):

    db = get_db_connection()
    cursor = db.cursor()

    cursor.execute(
        "INSERT INTO products (name, price) VALUES (%s, %s)",
        (product.name, product.price)
    )

    db.commit()

    product_id = cursor.lastrowid

    cursor.close()
    db.close()

    return {
        "message": "Product added successfully",
        "product_id": product_id
    }

@router.put("/products/{product_id}")
def update_product(product_id: int, product: Product):

    db = get_db_connection()
    cursor = db.cursor()

    cursor.execute(
        """
        UPDATE products
        SET name = %s, price = %s
        WHERE id = %s
        """,
        (product.name, product.price, product_id)
    )

    db.commit()

    cursor.close()
    db.close()

    return {
        "message": "Product updated successfully"
    }


@router.delete("/products/{product_id}")
def delete_product(product_id: int):

    db = get_db_connection()
    cursor = db.cursor()

    cursor.execute(
        "DELETE FROM products WHERE id = %s",
        (product_id,)
    )

    db.commit()

    cursor.close()
    db.close()

    return {
        "message": "Product deleted successfully"
    }

