from .models import Kitchen, KitchenOrder, Printer
import django_filters as filters
from apps.base.filters import BaseFilterOrderBy
from django.db.models import Q


class KitchenFilter(BaseFilterOrderBy):
    name = filters.CharFilter(lookup_expr="icontains", field_name="name")
    class Meta:
        model = Kitchen
        fields = '__all__'

class KitchenOrderFilter(BaseFilterOrderBy):
    name = filters.CharFilter(lookup_expr="icontains", field_name="name")
    order = filters.CharFilter(method="order_filter")
    
    class Meta:
        model = KitchenOrder
        fields = '__all__'

    def order_filter(self, queryset, name, value):
        return queryset.filter(Q(order__order_id__icontains=value))

class PrinterFilter(BaseFilterOrderBy):
    name = filters.CharFilter(lookup_expr="icontains", field_name="name")
    class Meta:
        model = Printer
        fields = '__all__'