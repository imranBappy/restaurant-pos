# Generated by Django 5.1.3 on 2025-07-18 18:15

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('kitchen', '0003_remove_printer_kitchen_kitchen_printer_and_more'),
        ('product', '0003_orderproduct_kitchenorder'),
    ]

    operations = [
        migrations.AlterField(
            model_name='orderproduct',
            name='kitchenOrder',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='orders', to='kitchen.kitchenorder'),
        ),
        migrations.AlterField(
            model_name='orderproduct',
            name='product',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='orders', to='product.product'),
        ),
    ]
