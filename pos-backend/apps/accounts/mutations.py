from shlex import join
import graphene
from django.contrib.auth.models import Group
from django.db import transaction
from apps.accounts.models import User as CustomUser, UserOTP, UserRole, Address,Building
from apps.accounts.objectType import UserType, AddressType
from graphql import GraphQLError
from apps.outlet.models import Outlet
from backend.authentication import TokenManager, isAuthenticated
from apps.accounts.forms import ClientForm, StaffForm, UserForm, AddressForm, BuildingForm
from django.conf import settings
from graphene_django.forms.mutation import DjangoFormMutation
from apps.base.utils import  create_graphql_error, generate_otp, get_object_or_none
from django_tenants.utils import schema_context
from decouple import config
from apps.clients.models import  Client, Domain

base_url = settings.WEBSITE_URL

class RegisterUser(graphene.Mutation):
    """
        This mutation will be for end customer
    """
    class Arguments:
        name = graphene.String(required=True)
        email = graphene.String(required=True)
        password = graphene.String(required=True)
        phone = graphene.String(required=False)

    success = graphene.Boolean()
    message = graphene.String()
    id = graphene.ID()

    @transaction.atomic
    def mutate(self, info, name, email,password, phone=None):
        email = email.lower()
        find_user = get_object_or_none(CustomUser, email=email)
        if find_user is not None:
            raise GraphQLError(message="Email is already registered.")
        
        if phone:
            find_by_phone_user = get_object_or_none(CustomUser, phone=phone)
            if find_by_phone_user is not None:
                raise GraphQLError(message="Phone is already registered.")
        
        user = CustomUser.objects.create_user(
            name=name, email=email, password=password, phone=phone
        )
        role = Group.objects.get(name="CUSTOMER")
        user.is_verified = False  
        user.role  = role
        user.save()
        # gen_otp = generate_otp()
        # user.send_email_verification(
        #     gen_otp, base_url
        # )
        # new_otp=UserOTP(user=user, otp=gen_otp)
        # new_otp.save()
        return RegisterUser(success=True, message="Registration successful!", id=user.id)


class RegisterStaff(graphene.Mutation):
    """
        This mutation will be for end customer
    """
    class Arguments:
        name = graphene.String(required=True)
        email = graphene.String(required=True)
        password = graphene.String(required=True)
        role = graphene.ID(required=True)
        phone = graphene.String(required=False)
        gender = graphene.String(required=False)

    success = graphene.Boolean()
    message = graphene.String()
    id = graphene.ID()

    @isAuthenticated([UserRole.ADMIN, UserRole.MANAGER])
    @transaction.atomic
    def mutate(self, info, name, email,password,  role, phone=None, gender=None):
        email = email.lower()
        find_user = get_object_or_none(CustomUser, email=email)
        if find_user is not None:
            raise GraphQLError(message="Email is already registered.")
        
        if phone:
            find_by_phone_user = get_object_or_none(CustomUser, phone=phone)
            if find_by_phone_user is not None:
                raise GraphQLError(message="Phone is already registered.")
        
        role = Group.objects.get(id=role) 
        user = CustomUser.objects.create_user(
            name=name, 
            email=email, 
            password=password, 
            role=role,
            is_staff=True,
            is_verified = False, 
            phone=phone,
            gender=gender
        )
        user.save()
        gen_otp = generate_otp()
        user.send_email_verification(
            gen_otp, base_url
        )
        new_otp=UserOTP(user=user, otp=gen_otp)
        new_otp.save()
        return RegisterUser(success=True, message="Registration successful!", id=user.id)

class RegisterStaffV2(DjangoFormMutation):
    """
        This mutation will be for end staff
    """
    class Meta:
        form_class = StaffForm

    success = graphene.Boolean()
    message = graphene.String()

    @isAuthenticated([UserRole.ADMIN, UserRole.MANAGER])
    @transaction.atomic
    def mutate_and_get_payload(self, info, **input):
        email = input.get('email').lower()
        phone = input.get('phone')
        if not input.get('id'):
            find_user = get_object_or_none(CustomUser, email=email)
            if find_user is not None:
                raise GraphQLError(message="Email is already registered.")
            
            if phone:
                find_by_phone_user = get_object_or_none(CustomUser, phone=phone)
                if find_by_phone_user is not None:
                    raise GraphQLError(message="Phone is already registered.")
            

        instance = get_object_or_none(CustomUser, id=input.get('id'))
        input['is_staff'] = True
        input['is_active'] = True
        # input['password'] = input.get('password') 

        form = StaffForm(input, instance=instance)
        if not form.is_valid():
            raise GraphQLError(create_graphql_error(form))
        
        try:
            staff = form.save(commit=False)
            password = input.get('password')
            if password:
                staff.set_password(password)  # Hashes the password
                # staff.save(update_fields=['password'])  # Ensure only password is updated

            staff.save()
            return RegisterStaffV2(message="Staff is created!", success=True)
        except Exception as e:
            print(e)
            raise GraphQLError(e)

class RegisterClient(DjangoFormMutation):
    """
        This mutation will be for end staff
    """
    class Meta:
        form_class = ClientForm

    success = graphene.Boolean()
    message = graphene.String()
    url  = graphene.String()

    @transaction.atomic
    def mutate_and_get_payload(self, info, **input):
        email = input.get('email').lower()
        phone = input.get('phone')

        try:
            if not input.get('id'):
                find_user = get_object_or_none(CustomUser, email=email)
            
            if find_user is not None:
                raise GraphQLError(message="Email is already registered.")
            
            if phone:
                find_by_phone_user = get_object_or_none(CustomUser, phone=phone)
                if find_by_phone_user is not None:
                    raise GraphQLError(message="Phone is already registered.")
            
            instance = get_object_or_none(CustomUser, id=input.get('id'))
            
            input['is_staff'] = True
            input['is_superuser'] = True

            input['is_active'] = True
            input['password'] = input.get('password') ## 

            form = StaffForm(input, instance=instance)
            
            if not form.is_valid():
                raise GraphQLError(create_graphql_error(form))
            
            staff = form.save(commit=False)
            password = input.get('password')
            staff.is_superuser=True
            if password:
                staff.set_password(password)  
            staff.save()
            
            
            # create tenant
            schema_name="".join(input.get("restaurant_name").lower().split(" ")) 
            restaurant_name= input.get("restaurant_name")
            HOST_NAME = settings.HOST_NAME
            domain_name=f"{schema_name}.{HOST_NAME}"

            domain = get_object_or_none(Domain , domain=domain_name )
            if domain:
                raise GraphQLError("Domain is already exits.")

            tenant = get_object_or_none(Client , schema_name=schema_name )
            if tenant:
                raise GraphQLError("This is already exits.")
            
            
            tenant = Client.objects.create(schema_name=schema_name,name=restaurant_name)
            domain = Domain()
            domain.domain = domain_name
            domain.tenant = tenant
            domain.is_primary = True
            domain.save()

            with schema_context(schema_name):
                User = CustomUser
                if User.objects.filter(email=email).exists():
                    raise GraphQLError("f'User with email {email} already exists'")
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
                    
                    print((f'Superuser {email} created successfully for tenant {schema_name}'))
                    print((f'Email: {email}'))
                    print((f'Password: {password}'))
                    print((f'Login URL: http://{schema_name}.localhost:8000/admin/'))

            return RegisterClient(message="Client is created!", success=True, url=f"http://{schema_name}.localhost:8000/admin/")
        except Exception as e:
            raise GraphQLError(e)
    



class OTPVerification(graphene.Mutation):

    success = graphene.Boolean()
    message = graphene.String()
    user = graphene.Field(UserType)
    
    class Arguments:
        email = graphene.String()
        otp = graphene.String()
    
    def mutate(self, info, email, otp, **kwargs):
        try:
            user = CustomUser.objects.get(email=email)
        except CustomUser.DoesNotExist:
            raise GraphQLError(
                message="Not Found User",
            )
        
        if user.is_verified:
            raise GraphQLError(message="You are already verified.")
        
        user_otp = UserOTP.objects.check_otp(otp=otp, user=user)
        
        if user_otp and user.is_active:
            user.is_verified = True
            user.save()
        else:
            raise GraphQLError(message="OTP is invalid or expired")
            
        return OTPVerification(
            success=True,
            message='User account is successfully verified',
            user = user
        )
class LoginUser(graphene.Mutation):
    class Arguments:
        email = graphene.String(required=True)
        password = graphene.String(required=True)

    token = graphene.String()
    success = graphene.Boolean()
    message = graphene.String()
    user = graphene.Field(UserType)
    @staticmethod
    def mutate(root, info, email, password):
        try:
            if not email:
                return GraphQLError("Invalid email or password.",)
            user = CustomUser.objects.get(email=email.lower()) 
            if not user.check_password(password):
                return  GraphQLError("Invalid email or password.")
            if not user.is_active:
                return  GraphQLError("Account is inactive.")
            
            payload = {
                'name' : user.name,
                'email': user.email,
                'role': user.role.name if user.role else UserRole.ADMIN if user.is_superuser else UserRole.CUSTOMER,
                'photo': user.photo
            }
            token = TokenManager.get_access(payload)
            return LoginUser(token=token,user=user, success=True, message="Login successful.")
        except CustomUser.DoesNotExist:
            return  GraphQLError("Invalid email or password.",)
       
class PasswordResetMail(graphene.Mutation):
    message = graphene.String()
    success  = graphene.Boolean()
    
    class Arguments:
        email = graphene.String(required=True)
    
    def mutate(self, info, email):
        user = CustomUser.objects.get(email=email)
        otp = UserOTP.objects.get_object_or_none(user = user.id)
        if not otp:
            generated_top = generate_otp()
            otp = UserOTP(user=user, otp=generated_top)
            otp.save()
        
        verification_link = f"{base_url}/reset-password?otp={otp.otp}&email={user.email}"
        user.send_email_verification(otp.otp, verification_link)
        return PasswordResetMail(
            message='Successfully send mail',
            success=True
        )

class PasswordReset(graphene.Mutation):
    message = graphene.String()
    success = graphene.Boolean()
    
    class Arguments:
        email = graphene.String(required=True)
        otp = graphene.String(required=True)
        password = graphene.String(required=True)
    
    def mutate(self, info, email, otp, password):
        
        user =  CustomUser.objects.get(email=email)
        if UserOTP.objects.check_otp(otp=otp, user=user.id) == False:
            return GraphQLError(message="OTP is invalid!")

        user.set_password(password)
        user.save()
        
        return PasswordReset(message="Password reset success", success=True)
    
class PasswordChange(graphene.Mutation):
    message = graphene.String()
    success = graphene.Boolean()
    
    class Arguments:
        password = graphene.String()
        new_password = graphene.String()
    
    @isAuthenticated()
    def mutate(self, info, password, new_password):
        user = info.context.user
        if not user.check_password(password):
            raise GraphQLError(
                message="Wrong password",
                extensions={
                    "message": "Wrong password",
                    "code": "wrong_password"
                }
            )
        user.set_password(new_password)
        user.save()
        return PasswordChange(
            success=True,
            message="Password change successful"
        )


class ProfileUpdate(DjangoFormMutation):
    message = graphene.String()
    success = graphene.Boolean()
    profile = graphene.Field(UserType)
    
    class Meta:
        form_class = UserForm
    
    @isAuthenticated()
    def mutate_and_get_payload(self, info, **input):
        instance = get_object_or_none(CustomUser, id=input.get('id'))
        if not instance:
            raise GraphQLError("User not found!")
        form = UserForm(input, instance=instance)
        role = input.get("role")
        
        if role and not info.context.User.is_superuser and int(role) != instance.role.id:
            raise GraphQLError("You can't update role.")
        if not form.is_valid():
            print(form.errors)
            create_graphql_error(form)
        
        profile = form.save()
        return ProfileUpdate(message="Update profile!", success=True, profile=profile)
                
class AddressCUD(DjangoFormMutation):
    success = graphene.Boolean()
    address = graphene.Field(AddressType)
    class Meta:
        form_class = AddressForm

    @isAuthenticated()
    def mutate_and_get_payload(self, info, **input):
         
        id=input.get('id')
        user = input.get('user')
        
        address_type = input.get('address_type')
        instance = get_object_or_none(Address, id=id, address_type=address_type)
         
        if not instance:
           instance = get_object_or_none(Address, user=user, address_type=address_type)
        
        # if is it First address then it will be default
        if not id:
            allAddress  = Address.objects.filter(user=user)
            if not  allAddress:
                input['default'] = True
                
        
        form = AddressForm(input, instance=instance)
        if form.is_valid():
            address = form.save()
            return AddressCUD( success=True, address=address)
        
        create_graphql_error(form)


class AddressUpdate(graphene.Mutation):
    success = graphene.Boolean()
    class Arguments:
        user = graphene.ID(required=True)
        address_type = graphene.String()
        
    def mutate(self,info, user, address_type):
        address = Address.objects.get(user=user, address_type=address_type)
        if(address.default):
            return AddressUpdate(success=True)
        
        if address_type=='HOME':
            address = Address.objects.get(user=user, address_type='OFFICE')
            if(address):
                if(address.default):
                    address.default = False
                    address.save()
        
        if address_type=='OFFICE':
            address = Address.objects.get(user=user, address_type='HOME')
            if(address):
                if(address.default):
                    address.default = False
                    address.save()
        
        address = Address.objects.get(user=user, address_type=address_type)
        address.default = True
        address.save()
        return AddressUpdate(success=True)
        
        
        

class BuildingCUD(DjangoFormMutation):
    success = graphene.Boolean()
    id = graphene.ID()
    
    class Meta:
        form_class = BuildingForm
    @isAuthenticated()
    def mutate_and_get_payload(self, info, **input):
        addressId=input.get('address')
        id = input.get('id')
        
        instance = get_object_or_none(Building, id=id)   
        form = BuildingForm(input, instance=instance)
        
        if not form.is_valid():
            create_graphql_error(form)
        
        addressInstance = get_object_or_none(Address, id=addressId)
        if not addressInstance:
           raise GraphQLError("Address not found!")
            
        building = form.save()
        return BuildingCUD( success=True, id=building.id)


class Mutation(graphene.ObjectType):
    
    register_user = RegisterUser.Field()
    register_staff = RegisterStaff.Field()
    register_staff_v2 = RegisterStaffV2.Field()

    login_user = LoginUser.Field()
    otp_verify = OTPVerification.Field()
    password_reset_mail = PasswordResetMail.Field()
    password_reset = PasswordReset.Field()
    password_change = PasswordChange.Field()
    profile_update = ProfileUpdate.Field()
    address_cud = AddressCUD.Field()
    building_cud = BuildingCUD.Field()
    address_update = AddressUpdate.Field() 
    register_client = RegisterClient.Field()
    