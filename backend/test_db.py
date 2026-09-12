print("1. Python started")

from database import get_db_connection

print("2. Trying to connect to MySQL...")

db = get_db_connection()

print("3. MySQL connected successfully!")

db.close()

print("4. Connection closed")