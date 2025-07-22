from apps.product.models import Order
from apps.kitchen.models import KitchenOrder
from apps.kitchen.models import Printer
from datetime import datetime, timedelta

# write function to generate KOT (Kitchen Order Ticket)
def upsert_kitchen_order(order_id):
    order = Order.objects.get(id=order_id)
    kot = KitchenOrder.objects.get_or_create(order=order)
 
    cooking_time = 0
    for product in order.order_products.all():
        cooking_time += product.product.cooking_time
    kot.cooking_time = cooking_time
    kot.status = "PENDING"
    kot.completion_time = datetime.now() + timedelta(minutes=cooking_time)
    if kot:
        kot.save()
    else:
        kot = KitchenOrder.objects.create(order=order)
    return kot


