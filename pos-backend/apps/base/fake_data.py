from apps.kitchen.models import Kitchen, Printer
from apps.outlet.models import Outlet
from apps.inventory.models import Unit, ItemCategory, Item
from apps.product.models import Category as ProductCategory, Product, Order, OrderProduct
from django.db import transaction
from random import randint, choice
from apps.product.models import PaymentMethod

def generate_order_channel(numberOfChannel=4):
    """
    Generate a list of order channels for testing/demo purposes.

    Args:
        numberOfChannel (int): Number of order channels to generate.

    Returns:
        list: List of order channel dictionaries.
    """
    base_channels = [
        {"name": "Dine In", "type": "DINE_IN", "commission_rate": 0},
        {"name": "Take Away", "type": "TAKE_AWAY", "commission_rate": 0},
        {"name": "Delivery", "type": "DELIVERY", "commission_rate": 5},
        {"name": "Online", "type": "ONLINE", "commission_rate": 10},
    ]
    order_channels = []
    for i in base_channels:
        base = base_channels[i % len(base_channels)]
        # Optionally, make names unique if more than base types
        channel = base.copy()
        if numberOfChannel > len(base_channels):
            channel["name"] += f" {i+1}"
        order_channels.append(channel)
    return order_channels

def generate_payment_methods(numberOfMethods=4):
    """
    Generate a list of payment methods for testing/demo purposes.

    Args:
        numberOfMethods (int): Number of payment methods to generate.

    Returns:
        list: List of payment method dictionaries.
    """
    base_methods = [
        {"name": "Cash", "type": "CASH", "service_charge_rate": 0.00},
        {"name": "Credit Card", "type": "CARD", "service_charge_rate": 2.00},
        {"name": "Mobile Payment", "type": "MOBILE", "service_charge_rate": 1.00},
        {"name": "Online Banking", "type": "ONLINE", "service_charge_rate": 1.50},
    ]
    payment_methods = []
    for i in range(numberOfMethods):
        base = base_methods[i % len(base_methods)]
        method = base.copy()
        if numberOfMethods > len(base_methods):
            method["name"] += f" {i+1}"
        method["is_active"] = True
        payment_methods.append(method)
    return payment_methods

def generate_products_and_categories(main_kitchen, bar_kitchen, pizza_oven):
    """
    Generate 20 product categories and 100 products, assigning products to these categories and kitchens.
    Idempotent: will not create duplicates if run multiple times.
    """
    # 20 realistic product category names
    category_names = [
        "Pizza", "Burger", "Pasta", "Salad", "Drinks", "Desserts", "Sandwiches", "Appetizers", "Soups", "Grill",
        "Seafood", "Breakfast", "Vegan", "Wraps", "Rice Dishes", "Noodles", "Curry", "Bakery", "Coffee", "Specials"
    ]
    categories = []
    for cname in category_names:
        cat, _ = ProductCategory.objects.get_or_create(name=cname, defaults={"description": f"All {cname.lower()} items"})
        categories.append(cat)

    # 100 product names (reuse previous list, pad if needed)
    product_names = [
        "Margherita Pizza", "Pepperoni Pizza", "Veggie Pizza", "BBQ Chicken Pizza", "Hawaiian Pizza",
        "Cheese Burger", "Chicken Burger", "Veggie Burger", "Fish Burger", "Double Patty Burger",
        "Spaghetti Bolognese", "Penne Alfredo", "Lasagna", "Mac and Cheese", "Ravioli",
        "Caesar Salad", "Greek Salad", "Garden Salad", "Chicken Salad", "Tuna Salad",
        "Coca-Cola", "Pepsi", "Sprite", "Fanta", "Mountain Dew",
        "Orange Juice", "Apple Juice", "Mango Juice", "Pineapple Juice", "Lemonade",
        "Espresso", "Cappuccino", "Latte", "Mocha", "Americano",
        "French Fries", "Potato Wedges", "Onion Rings", "Garlic Bread", "Cheese Sticks",
        "Grilled Chicken", "Fried Chicken", "Chicken Wings", "Chicken Nuggets", "Chicken Tenders",
        "Chocolate Cake", "Cheesecake", "Brownie", "Apple Pie", "Ice Cream",
        "Tiramisu", "Panna Cotta", "Baklava", "Donut", "Muffin",
        "Club Sandwich", "BLT Sandwich", "Egg Sandwich", "Chicken Sandwich", "Veggie Sandwich",
        "Hot Dog", "Corn Dog", "Sausage Roll", "Meat Pie", "Quiche",
        "Sushi Roll", "Nigiri", "Sashimi", "Tempura", "Miso Soup",
        "Pad Thai", "Green Curry", "Red Curry", "Tom Yum Soup", "Spring Roll",
        "Taco", "Burrito", "Quesadilla", "Nachos", "Churros",
        "Falafel", "Shawarma", "Hummus", "Tabbouleh", "Baba Ganoush",
        "Butter Chicken", "Chicken Tikka", "Paneer Masala", "Dal Makhani", "Naan",
        "Pho", "Banh Mi", "Rice Paper Roll", "Lemongrass Chicken", "Vietnamese Coffee",
        "Kimchi", "Bibimbap", "Bulgogi", "Japchae", "Tteokbokki"
    ]
    while len(product_names) < 100:
        product_names.append(f"Demo Product {len(product_names)+1}")

    all_kitchens = [main_kitchen, bar_kitchen, pizza_oven]
    used_names = set(Product.objects.values_list('name', flat=True))
    for i in range(100):
        name = product_names[i]
        if name in used_names:
            continue
        price = randint(2, 30)
        category = choice(categories)
        kitchen = choice(all_kitchens)
        sku = f"SKU{1000+i}"
        Product.objects.create(
            name=name,
            price=price,
            category=category,
            kitchen=kitchen,
            sku=sku,
            is_active=True
        )


def generate_fake_data(outlet, admin_user):
    """
    Generate realistic demo data for a new tenant. Idempotent: will not create duplicates if run multiple times.
    """
    with transaction.atomic():
        # Units
        unit_kg, _ = Unit.objects.get_or_create(name="Kilogram", defaults={"description": "kg"})
        unit_piece, _ = Unit.objects.get_or_create(name="Piece", defaults={"description": "piece"})
        unit_liter, _ = Unit.objects.get_or_create(name="Liter", defaults={"description": "liter"})

        # Item Categories
        veg_cat, _ = ItemCategory.objects.get_or_create(name="Vegetables", defaults={"description": "Fresh vegetables"})
        bev_cat, _ = ItemCategory.objects.get_or_create(name="Beverages", defaults={"description": "Soft drinks and juices"})
        dairy_cat, _ = ItemCategory.objects.get_or_create(name="Dairy", defaults={"description": "Milk, cheese, etc."})

        # Items
        tomato, _ = Item.objects.get_or_create(name="Tomato", defaults={
            "category": veg_cat, "unit": unit_kg, "safety_stock": 10, "sku": "TOM001", "stock": 100, "current_stock": 100
        })
        coke, _ = Item.objects.get_or_create(name="Coca-Cola", defaults={
            "category": bev_cat, "unit": unit_piece, "safety_stock": 20, "sku": "COK001", "stock": 50, "current_stock": 50
        })
        cheese, _ = Item.objects.get_or_create(name="Cheese", defaults={
            "category": dairy_cat, "unit": unit_kg, "safety_stock": 5, "sku": "CHE001", "stock": 30, "current_stock": 30
        })

        # Printers
        kot_printer, _ = Printer.objects.get_or_create(name="KOT Printer", defaults={"printer_type": "KOT"})
        bill_printer, _ = Printer.objects.get_or_create(name="Bill Printer", defaults={"printer_type": "BILL"})

        # Kitchens
        main_kitchen, _ = Kitchen.objects.get_or_create(
            name="Main Kitchen",
            defaults={
                "photo": "/POS/assets/no-image.jpg",
                "description": "Main kitchen for hot food",
                "outlet": outlet,
                "printer": kot_printer,
            },
        )
        bar_kitchen, _ = Kitchen.objects.get_or_create(
            name="Bar",
            defaults={
                "photo": "/POS/assets/no-image.jpg",
                "description": "Bar for drinks and cocktails",
                "outlet": outlet,
                "printer": bill_printer,
            },
        )
        pizza_oven, _ = Kitchen.objects.get_or_create(
            name="Pizza Oven",
            defaults={
                "photo": "/POS/assets/no-image.jpg",
                "description": "Dedicated pizza oven kitchen",
                "outlet": outlet,
                "printer": kot_printer,
            },
        )

        # Generate 20 categories and 100 products
        generate_products_and_categories(main_kitchen, bar_kitchen, pizza_oven)
        generate_order_channel()
        
        # Orders (create only if none exist for this outlet)
        # if not Order.objects.filter(outlet=outlet).exists():
        #     # Use the first two products for the order if available
        #     products = list(Product.objects.all()[:2])
        #     order = Order.objects.create(user=admin_user, amount=12, final_amount=12, status="PENDING", outlet=outlet)
        #     for idx, product in enumerate(products):
        #         OrderProduct.objects.create(order=order, product=product, quantity=1, price=product.price)
    
