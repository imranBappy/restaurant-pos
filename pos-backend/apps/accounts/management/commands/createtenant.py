import os
from django.core.management.base import BaseCommand
from django_tenants.utils import schema_context
from django.contrib.auth import get_user_model
from apps.clients.models import Client, Domain
from django.contrib.auth.models import Group
from apps.accounts.models import UserRole
from apps.outlet.models import Outlet
from django.conf import settings
from apps.kitchen.models import Kitchen
from apps.base.fake_data import generate_fake_data



class Command(BaseCommand):
    help = 'Create a superuser for a specific tenant'

    def add_arguments(self, parser):
        parser.add_argument('--name', type=str, help='The schema name of the tenant', required=True)
        parser.add_argument('--email', type=str, help='The email of the superuser', required=True)
        parser.add_argument('--password', type=str, help='The password of the superuser', required=True)

    def handle(self, *args, **kwargs):
        name = kwargs['name']
        schema_name = "".join(name.lower().split(" "))
        email = kwargs['email']
        password = kwargs['password']


        try:
            tenant = Client.objects.get(schema_name=schema_name)
            self.stdout.write(self.style.ERROR(f'Tenant with schema name {schema_name} does exist'))
            return
        except Client.DoesNotExist:
            tenant = Client.objects.create(name=name, schema_name=schema_name)
            HOST_NAME = os.getenv("HOST_NAME")
            HOST_NAME = settings.HOST_NAME
            domain_name=f"{schema_name}.{HOST_NAME}"
            Domain.objects.create(domain=domain_name, tenant=tenant, is_primary=True)
            self.stdout.write(self.style.SUCCESS('Successfully created tenent and domain!'))
         
        with schema_context(schema_name):
            User = get_user_model()
            if User.objects.filter(email=email).exists():
                self.stdout.write(self.style.ERROR(f'User with email {email} already exists'))
            else:
                # create all roles as groups
                user_roles_list = [role[0] for role in UserRole.choices]
                for role in user_roles_list:
                    Group.objects.get_or_create(name=role)
                
                     # create outlet
                outlet = Outlet.objects.create(name=tenant.name, phone='123456789', email=email, address='Admin Address')
                    
                admin_user = User.objects.create_superuser(email=email, password=password, outlet=outlet)
                admin_user.role = Group.objects.get(name=UserRole.ADMIN)
                admin_user.save()
                
                generate_fake_data(outlet, admin_user)
               
                self.stdout.write(self.style.SUCCESS(f'Superuser {email} created successfully for tenant {schema_name}'))
                
                self.stdout.write(self.style.HTTP_INFO(f'Email: {email}'))
                self.stdout.write(self.style.HTTP_INFO(f'Password: {password}'))
                self.stdout.write(self.style.HTTP_INFO(f'Login URL: http://{schema_name}.localhost:8000/admin/'))
            
