# Generated by Django 5.1.3 on 2025-07-18 05:56

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('kitchen', '0002_kitchenorder_order'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='printer',
            name='kitchen',
        ),
        migrations.AddField(
            model_name='kitchen',
            name='printer',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='kitchens', to='kitchen.printer'),
        ),
        migrations.AddField(
            model_name='kitchenorder',
            name='cooking_time',
            field=models.IntegerField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='printer',
            name='printer_type',
            field=models.CharField(choices=[('POS', 'POS'), ('KOT', 'KOT'), ('BILL', 'BILL'), ('OTHER', 'OTHER')], default='POS', max_length=10),
        ),
    ]
