import graphene
from apps.product.models import Ingredient, Category, Product, Order, OrderProduct, Floor, FloorTable, Payment, TableBooking
from apps.base.utils import get_object_by_kwargs
from apps.product.objectType import IngredientType, CategoryType, TableBookingType, ProductType, SubCategoryType, PaymentType, OrderType, OrderProductType, FloorType, FloorTableType
from graphene_django.filter import DjangoFilterConnectionField
from apps.product.tasks import booking_expired


class Query(graphene.ObjectType):
    ingredient = graphene.Field(IngredientType, id=graphene.ID(required=True))
    ingredients = DjangoFilterConnectionField(IngredientType)

    category = graphene.Field(CategoryType, id=graphene.ID(required=True))
    categories = DjangoFilterConnectionField(CategoryType)
    
    subcategory = graphene.Field(CategoryType, id=graphene.ID(required=True))
    subcategories = DjangoFilterConnectionField(SubCategoryType, parent_id=graphene.ID(required=True))
    
    product = graphene.Field(ProductType, id=graphene.ID(required=True))
    products = DjangoFilterConnectionField(ProductType)
    
    order = graphene.Field(OrderType, id=graphene.ID(required=True))
    orders = DjangoFilterConnectionField(OrderType)
    
    order_product = graphene.Field(OrderProductType, id=graphene.ID(required=True))
    order_products = DjangoFilterConnectionField(OrderProductType)
    
   
    floor = graphene.Field(FloorType, id=graphene.ID(required=True))
    floors = DjangoFilterConnectionField(FloorType)

    floor_table = graphene.Field(FloorTableType, id=graphene.ID(required=True))
    floor_tables = DjangoFilterConnectionField(FloorTableType)
    

    payment = graphene.Field(PaymentType, id=graphene.ID(required=False), order=graphene.ID(required=False))
    payments = DjangoFilterConnectionField(PaymentType)
    
    table_booking = graphene.List(TableBookingType)

    def resolve_order_tables(self, info):
        return TableBooking.objects.all()

    def resolve_ingredient(self, info, id):
        return get_object_by_kwargs(Ingredient, {"id": id})
    
    def resolve_ingredients(self, info ,**kwargs):
        return Ingredient.objects.all()

    def resolve_category(self, info, id):
        return get_object_by_kwargs(Category, {"id": id})
    def resolve_categories(self, info ,**kwargs):
        return Category.objects.order_by("-created_at")

    def resolve_subcategory(self, info, id):
        return get_object_by_kwargs(Category, {"id": id})
    def resolve_subcategories(self, info, **kwargs):
        return Category.objects.filter(parent=kwargs.get("parent_id"))
        

    def resolve_product(self, info, id):
        return get_object_by_kwargs(Product, {"id": id})
     
    def resolve_products(self, info, **kwargs):
        return Product.objects.all()
    
    def resolve_order(self, info, id):
        return get_object_by_kwargs(Order, {"id": id})
     
    def resolve_orders(self, info, **kwargs):
        return Order.objects.all()  
    
    def resolve_order_product(self, info, id):
        return get_object_by_kwargs(OrderProduct, {"id": id})
     
    def resolve_order_products(self, info, **kwargs):
        return OrderProduct.objects.all()
    
    def resolve_floor(self, info, id):
        return get_object_by_kwargs(Floor, {"id": id})
     
    def resolve_floors(self, info, **kwargs):
        return Floor.objects.all()
    
    def resolve_floor_table(self, info, id):
        return get_object_by_kwargs(FloorTable, {"id": id})
     
    def resolve_floor_tables(self, info, **kwargs):
        booking_expired()
        return FloorTable.objects.all()
 
        
    def resolve_payment(self, info, id, order=None):
        if order:
            result =  get_object_by_kwargs(Payment, { 'order': order})
            return result
        return get_object_by_kwargs(Payment, {'id': id})
     
    def resolve_payments(self, info, **kwargs):
        return Payment.objects.all()
    
    
    def elastic_search(self, info, **kwargs):
        pass
    
