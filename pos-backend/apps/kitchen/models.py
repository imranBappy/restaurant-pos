from django.db import models
from django.db.models import SET_NULL

# imported models
from apps.outlet.models import Outlet


class Kitchen(models.Model):
    name = models.CharField(max_length=100, unique=True)
    photo = models.URLField()
    description = models.TextField()
    outlet = models.ForeignKey(
        Outlet,on_delete=SET_NULL, null=True, blank=True, related_name="kitchens"
    )
    # printer for the kot
    printer = models.ForeignKey(
        "kitchen.Printer",
        on_delete=SET_NULL,
        null=True,
        blank=True,
        related_name="kitchens",
    )
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.id} - {self.name}"
    
# Kitchen Order Model for KOT (Kitchen Order Ticket)
class KitchenOrder(models.Model):
    KITCHEN_ORDER_STATUS = [
        ("PENDING", "Pending"),
        ("ACKNOWLEDGED", "Acknowledged"),
        ("IN_PROGRESS", "In Progress"),
        ("ON_HOLD", "On Hold"),
        ("READY", "Ready for Serving"),
        ("SERVED", "Served/Delivered"),
        ("CANCELLED", "Cancelled"),
    ]

    kitchen = models.ForeignKey(
        Kitchen,
        on_delete=SET_NULL,
        null=True,
        blank=True,
        related_name="kitchen_orders",
        default='1'
    )
    # Use string literal for ForeignKey to avoid circular import
    order = models.ForeignKey(
        'product.Order', # Changed from Order to 'product.Order'
        on_delete=models.CASCADE,
        related_name="kitchen_orders",
        null=True, blank=True
    )
    notes = models.TextField(null=True, blank=True)
    completion_time = models.DateTimeField(null=True, blank=True)
    cooking_time = models.IntegerField(null=True, blank=True)
    status = models.CharField(
        max_length=20, choices=KITCHEN_ORDER_STATUS, default="PENDING"
    )
    
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.id} - {self.status}"
    
    
    # OrderProduct will be created
    # KitchenOrder will be create
    # OrderProcut will be update with KitchenOrder ID


class Printer(models.Model):
    name = models.CharField(max_length=100)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    # printer type
    PRINTER_TYPE = [
        ("POS", "POS"),
        ("KOT", "KOT"),
        ("BILL", "BILL"),
        ("OTHER", "OTHER"),
    ]
    printer_type = models.CharField(max_length=10, choices=PRINTER_TYPE, default="POS")

    def __str__(self):
        return f"{self.id} - {self.name}"

