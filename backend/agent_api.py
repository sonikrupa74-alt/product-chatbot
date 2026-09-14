import os
import requests

from fastapi import APIRouter
from pydantic import BaseModel
from dotenv import load_dotenv

from langchain_groq import ChatGroq
from langchain_core.tools import tool
from langgraph.prebuilt import create_react_agent

load_dotenv()

router = APIRouter()

# BACKEND API URL
BACKEND_URL = os.getenv(
    "BACKEND_URL",
    "http://127.0.0.1:8000"
)

PRODUCT_API = f"{BACKEND_URL}/products"
ORDER_API = f"{BACKEND_URL}/orders"


# PRODUCT API TOOLS
@tool
def get_products():
    """Get all available products and their prices."""
    response = requests.get(PRODUCT_API, timeout=5)
    return response.json()


@tool
def get_product(product_id: int):
    """Get details of one product by ID."""
    response = requests.get(
        f"{PRODUCT_API}/{product_id}",
        timeout=5
    )
    return response.json()


@tool
def get_product_by_name(name: str):
    """Get product details by searching for a product name. Search is case-insensitive."""

    try:
        response = requests.get(
            PRODUCT_API,
            timeout=5
        )

        products = response.json()

    except Exception as e:
        return {
            "error": f"Failed to fetch products: {e}"
        }

    search_term = name.strip().lower()

    # Exact match
    for product in products:

        product_name = product.get(
            "name",
            ""
        ).strip().lower()

        if product_name == search_term:
            return product

    # Partial match
    matches = []

    for product in products:

        product_name = product.get(
            "name",
            ""
        ).strip().lower()

        if (
            search_term in product_name
            or product_name in search_term
        ):
            matches.append(product)

    if matches:

        matches.sort(
            key=lambda product:
            abs(
                len(
                    product.get(
                        "name",
                        ""
                    )
                ) - len(search_term)
            )
        )

        return matches[0]

    return {
        "message": f"Product '{name}' not found"
    }


# ORDER API TOOLS
@tool
def get_orders():
    """Get all orders."""
    response = requests.get(
        ORDER_API,
        timeout=5
    )

    return response.json()


@tool
def get_order(order_id: int):
    """Get details of one order by ID."""
    response = requests.get(
        f"{ORDER_API}/{order_id}",
        timeout=5
    )

    return response.json()


# GROQ LLM
llm = ChatGroq(
    model="openai/gpt-oss-20b",
    temperature=0
)

# TOOLS
tools = [
    get_products,
    get_product,
    get_product_by_name,
    get_orders,
    get_order
]


# AGENT
agent = create_react_agent(
    model=llm,
    tools=tools
)

CASUAL_RESPONSES = {

    "hi":
        "Hello! How can I help you with products or orders?",

    "hello":
        "Hello! How can I help you with products or orders?",

    "hey":
        "Hello! How can I help you with products or orders?",

    "hi there":
        "Hello! How can I help you with products or orders?",

    "hello there":
        "Hello! How can I help you with products or orders?",

    "okay":
        "Okay! 👍",

    "ok":
        "Okay! 👍",

    "alright":
        "Okay! 👍",

    "cool":
        "Glad I could help!",

    "good":
        "Great!",

    "great":
        "Great!",

    "nice":
        "Great!",

    "bad":
        "I'm sorry to hear that. How can I help you with products or orders?",

    "not good":
        "I'm sorry to hear that. How can I help you with products or orders?",

    "yes":
        "Sure!",

    "yeah":
        "Sure!",

    "yup":
        "Sure!",

    "no":
        "No problem!",

    "nope":
        "No problem!",

    "please":
        "How can I assist you with products or orders?",

    "thanks":
        "You're welcome!",

    "thank you":
        "You're welcome!",

    "thank you so much":
        "You're welcome!",

    "sorry":
        "No problem!",

    "sure":
        "Sure!",

    "bye":
        "Goodbye! Have a great day!",

    "goodbye":
        "Goodbye! Have a great day!"
}


def get_casual_response(text: str):

    if not text:
        return None

    cleaned = (
        text
        .strip()
        .lower()
        .strip("!.,?:;")
    )

    return CASUAL_RESPONSES.get(cleaned)


system_message = """
You are a helpful Product and Order Chatbot.

Your job is to help customers ONLY with:

1. Products
2. Orders


PRODUCT RULES:

- Always get product information from the Product API.
- If the user asks about a product using its name, use get_product_by_name.
- Product names are case-insensitive.
- Never ask for a product ID when the user has provided a recognizable product name.
- For a specific product by ID, use get_product.
- For a list of products, use get_products.
- If a product is not found, clearly say that the product was not found.
- Never invent product information.


PRODUCT EXAMPLES:

User: "tell me about ipad"
→ Use get_product_by_name.

User: "what is the price of macbook air m4?"
→ Use get_product_by_name.

User: "tell me about samsung galaxy s26"
→ Use get_product_by_name.


SELECTED PRODUCT:

The frontend may provide selected product information.

When the user refers to:

- "this product"
- "this item"
- "this phone"
- "this laptop"
- "tell me about it"
- "what is its price?"
- "how much is this?"

Use the selected product information provided in the user's message.

Do not ask for the product ID if the selected product information is already provided.


ORDER RULES:

- Always get order information from the Order API.
- For a specific order, use get_order.
- For a list of orders, use get_orders.
- Never invent order information.


NORMAL CONVERSATION:

Understand common conversational words and phrases.

Examples:

"Hi"
→ "Hello! How can I help you with products or orders?"

"Okay"
→ "Okay! 👍"

"Cool"
→ "Glad I could help!"

"Good"
→ "Great!"

"Yes"
→ "Sure!"

"No"
→ "No problem!"

"Thank you"
→ "You're welcome!"

"Sorry"
→ "No problem!"

Casual messages should NOT trigger Product or Order API calls.

Keep casual responses short and friendly.


RESTRICTION:

The chatbot must ONLY provide information about:

1. Products
2. Orders

For unrelated questions such as:

- weather
- coding
- jokes
- news
- general knowledge
- programming
- mathematics
- other unrelated topics

respond:

"I can only help with product and order information."

Never make up information.

Keep responses short, simple, and friendly.
"""

# CHAT REQUEST
class ChatRequest(BaseModel):
    message: str


# CHAT API
@router.post("/chat")
def chat(request: ChatRequest):

    print("1. Chat request received")

    user_msg = request.message

    print("2. User message:", user_msg)

    # Remove selected product information
    if ". Selected product:" in user_msg:
        base_msg = user_msg.split(". Selected product:")[0]

    elif " (Selected product:" in user_msg:
        base_msg = user_msg.split(" (Selected product:")[0]

    else:
        base_msg = user_msg

    print("3. Checking casual response")

    casual = get_casual_response(base_msg)

    if casual:
        print("4. Casual response")

        return {
            "response": casual
        }

    print("5. Calling LangGraph/Groq agent")

    result = agent.invoke({
        "messages": [
            ("system", system_message),
            ("user", request.message)
        ]
    })

    print("6. Agent finished")

    return {
        "response": result["messages"][-1].content
    }