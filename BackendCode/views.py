from django.contrib.auth.models import Group, User
from rest_framework import permissions, viewsets, status, authentication
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.decorators import api_view, permission_classes
from django.contrib.auth.hashers import check_password, make_password
from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from rest_framework.permissions import AllowAny
import json
import random

from .models import Client, Flower, Order
from BackendCode.serializer import GroupSerializer, UserSerializer, ClientSerializer, FlowerSerializer, CategoriesSerializer, OrderSerializer




class UserViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """
    queryset = User.objects.all().order_by('-date_joined')
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]


class GroupViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows groups to be viewed or edited.
    """
    queryset = Group.objects.all().order_by('name')
    serializer_class = GroupSerializer
    permission_classes = [permissions.IsAuthenticated]

class ClientViewSet(viewsets.ModelViewSet):
    queryset = Client.objects.all().order_by('firstName')
    serializer_class = ClientSerializer
    permission_classes = [permissions.IsAuthenticated]

class Flower(viewsets.ModelViewSet):
    queryset = Flower.objects.all().order_by('name')
    serializer_class = FlowerSerializer
    permission_classes = []


from django.contrib.auth.hashers import make_password

class RegisterView(APIView):
    def post(self, request):
        print("Creating new client!")

        # Extract user data from request
        user_data = {
            'email': request.data.get('email'),
            'password': request.data.get('password'),
            'username': f"{request.data.get('firstName')} {request.data.get('lastName')}"  # Combine first and last name for username
        }

        # Create user
        user = User.objects.create_user(**user_data)

        # Prepare client data (pass only the user's ID)
        client_data = {
            'email': request.data.get('email'),
            'firstName': request.data.get('firstName'),
            'lastName': request.data.get('lastName'),
            'phone': request.data.get('phone'),
            'address': request.data.get('address'),
            'password': make_password(request.data.get('password')),
            'user': user.id  # Pass the user ID, not the entire user object
        }

        # Serialize client data
        serializer = ClientSerializer(data=client_data)
        print(request.data)

        if serializer.is_valid():
            serializer.save()  # Save the client along with the created user
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        if not serializer.is_valid():
            print(serializer.errors)  # To check detailed error messages
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



class LoginView(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')

        print(email, password)

        try:
            # Get the client by email
            client = Client.objects.get(email=email)


            # Check if the password is correct using check_password
            if check_password(password, client.password):
                # Create a JWT token for the client
                refresh = RefreshToken.for_user(client)

                return Response({
                    'refresh': str(refresh),  # Refresh token
                    'access': str(refresh.access_token),  # Access token
                    'client': {
                        'email': client.email,
                        'first_name': client.firstName or None,
                        'last_name': client.lastName or None,
                        'phone': client.phone or None,
                        'address': client.address or None,
                        'image': client.image.url if client.image else None  
                    }
                }, status=status.HTTP_200_OK)
            else:
                return Response({'error': 'Invalid Credentials'}, status=status.HTTP_400_BAD_REQUEST)

        except Client.DoesNotExist:
            return Response({'error': 'User DoesNotExist'}, status=status.HTTP_400_BAD_REQUEST)
        

@csrf_exempt
@api_view(['POST'])
@permission_classes([AllowAny])
def reset_password(request):
    try:
        data = json.loads(request.body)
        email = data.get('email')
        
        if not email:
            return JsonResponse({"error": "Email is required"}, status=400)
        
        # Generate a 4-digit code
        code = f"{random.randint(1000, 9999)}"
        print(code)
                
        subject = 'Password Reset Request'
        html_message = render_to_string('password_reset_react.html', {'code': code})
        plain_message = strip_tags(html_message)  # Fallback to plain text email
        send_mail(subject, plain_message, 'benahmedyasmin@gmail.com', [email], html_message=html_message)
                
        request.session['reset_code'] = code
        
        return JsonResponse({"message": "Password reset code sent"}, status=200)
    
    except json.JSONDecodeError:
        return JsonResponse({"error": "Invalid JSON"}, status=400)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)
    

@csrf_exempt
@api_view(['POST'])
@permission_classes([AllowAny])
def verify_code_and_reset_password(request):
    try:
        data = json.loads(request.body)
        email = data.get('email')
        code = data.get('code')
        new_password = data.get('new_password')
        
        # Debugging logs
        print(f"Received email: {email}")
        print(f"Received code: {code}")
        print(f"Received new_password: {new_password}")

        if not email or not code or not new_password:
            print("Missing required fields")
            return JsonResponse({"error": "Email, code, and new password are required"}, status=400)
        
        # Verify the code
        session_code = request.session.get('reset_code')
        print(f"Session code: {session_code}")
        
        if code != session_code:
            print("Invalid code")
            return JsonResponse({"error": "Invalid code"}, status=400)
        
        # Get the user and update the password
        try:
            user = Client.objects.get(email=email)
            user.password = make_password(new_password)   #hashed password secure
            #user.password = new_password
            user.save()
            
            print("Password updated successfully")
            return JsonResponse({"message": "Password updated successfully"}, status=200)
        except User.DoesNotExist:
            print("User not found")
            return JsonResponse({"error": "User not found"}, status=404)
        
    except json.JSONDecodeError:
        print("Invalid JSON received")
        return JsonResponse({"error": "Invalid JSON"}, status=400)
    except Exception as e:
        print(f"Exception occurred: {str(e)}")
        return JsonResponse({"error": str(e)}, status=500)
        
    


@csrf_exempt
@api_view(['POST'])
def update_profile(request, pk):
    try:
        data = json.loads(request.body)
        email = data.get('email')
        first_name = data.get('firstName')
        last_name = data.get('lastName')
        phone = data.get('phone')
        address = data.get('address')

        # Log received data
        print(f"Received data: {data}")

        try:
            user = Client.objects.get(pk=pk)
            user.email = email
            user.first_name = first_name
            user.last_name = last_name
            user.phone = phone
            user.address = address
            user.save()

            print("Profile updated successfully")
            return JsonResponse({"message": "Profile updated successfully"}, status=200)
        except Client.DoesNotExist:
            print("User not found")
            return JsonResponse({"error": "User not found"}, status=404)
    except json.JSONDecodeError:
        print("Invalid JSON received")
        return JsonResponse({"error": "Invalid JSON"}, status=400)
    except Exception as e:
        print(f"Unexpected error: {str(e)}")
        return JsonResponse({"error": "An unexpected error occurred"}, status=500)


@csrf_exempt
@api_view(['POST'])
@permission_classes([AllowAny])
def password_reset_request(request):
    try:
        data = json.loads(request.body)
        email = data.get('email')

        if not email:
            return JsonResponse({"error": "Email is required"}, status=400)

        # Here you can add the logic for handling the password reset request
        # For instance, sending a reset email or code
        return JsonResponse({"message": "Password reset request processed successfully"}, status=200)

    except json.JSONDecodeError:
        return JsonResponse({"error": "Invalid JSON"}, status=400)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)


from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Flower, Category

class FlowerListView(APIView):
    permission_classes = []  # No authentication required

    def get(self, request, *args, **kwargs):
        try:
            # Fetch all flowers and categories from the database
            flowers = Flower.objects.all()
            categories = Category.objects.all()

            # Serialize the flower and category data
            serializer_flower = FlowerSerializer(flowers, many=True)
            serializer_category = CategoriesSerializer(categories, many=True)

            # Combine serialized data into a single response
            data = {
                "flowers": serializer_flower.data,
                "categories": serializer_category.data
            }

            return Response(data, status=status.HTTP_200_OK)
        except Exception as e:
            # Handle unexpected errors and return an error response
            return Response(
                {"error": "An error occurred while fetching the data.", "details": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class OrderCreateView(APIView):
    permission_classes = []  # No authentication required

    def post(self, request, *args, **kwargs):
        try:
            # Deserialize request data
            serializer = OrderSerializer(data=request.data)
            
            if serializer.is_valid():
                order = serializer.save()  # Save the order
                return Response({"message": "Order Created Successfully", "order_id": order.id}, status=status.HTTP_201_CREATED)
            
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            return Response(
                {"error": "An error occurred while creating the order.", "details": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

@api_view(['GET'])
def get_orders(request):
    orders = Order.objects.all().order_by('-created_at')
    serializer = OrderSerializer(orders, many=True)
    return Response(serializer.data)