from apps.product.models import Order
from apps.kitchen.models import KitchenOrder
from apps.kitchen.models import Printer
from datetime import datetime, timedelta

# write function to generate KOT (Kitchen Order Ticket)
def upsert_kitchen_order(order_id):
    try:
        order = Order.objects.get(id=order_id)
    except Order.DoesNotExist:
        print(f"Order with ID {order_id} not found.")
        return None # Or raise an exception, depending on desired behavior

    # Unpack the tuple returned by get_or_create to get the object and a boolean flag
    kot, created = KitchenOrder.objects.get_or_create(order=order)

    cooking_time = 0
    # Assuming order.items is a ManyRelatedManager for related OrderProduct objects
    # and OrderProduct has a 'product' ForeignKey and 'kitchenOrder' ForeignKey
    for item in order.items.all():
        # Ensure 'product' and 'kitchen' attributes exist on the item
        # 'item.product' refers to the Product model associated with the OrderProduct item
        # 'item.product.kitchen' implies Product has a 'kitchen' attribute/field
        if hasattr(item, 'product') and hasattr(item.product, 'kitchen') and item.product.kitchen:
            print(f"Product: {item.product.name}, Cooking Time: {item.product.cooking_time}")
            # Ensure 'cooking_time' attribute exists and is not None/zero
            item.kitchenOrder = kot
            item.save()
            if hasattr(item.product, 'cooking_time') and item.product.cooking_time is not None:
                cooking_time += int(item.product.cooking_time)
                # Assign the KitchenOrder to the OrderProduct item
                
                if(item.product.kitchen):
                    kot.kitchen = item.product.kitchen
            else:
                print(f"Warning: Product '{item.product.name}' has no cooking_time or it's None.")
        else:
            print(f"Info: Item '{item.product.name if hasattr(item, 'product') else 'Unknown Product'}' does not have an associated kitchen or 'kitchen' attribute.")


    # Update the KitchenOrder instance's fields
    kot.cooking_time = int(cooking_time)
    kot.status = "PENDING" # Setting status to PENDING on upsert
    kot.completion_time = datetime.now() + timedelta(minutes=cooking_time)

    # Save the updated KitchenOrder instance
    kot.save()

    return kot
