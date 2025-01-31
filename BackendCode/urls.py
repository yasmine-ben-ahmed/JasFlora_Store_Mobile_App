from django.urls import path
from .views import RegisterView, LoginView,Flower, reset_password, verify_code_and_reset_password, update_profile, FlowerListView, OrderCreateView
from rest_framework_simplejwt.views import TokenRefreshView
from . import views



urlpatterns = [
    path('register/', RegisterView.as_view(), name='client-register'),
    path('login/', LoginView.as_view(), name='client-login'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('reset_password/', reset_password, name='reset_password'),
    path('verify_code_and_reset_password/', verify_code_and_reset_password, name='verify_code_and_reset_password'),
    path('update_profile/<int:pk>/', update_profile, name='update_profile'),
    path('password_reset_request/', views.password_reset_request, name='password_reset_request'),
    path('flowers/', FlowerListView.as_view(), name='flower-list'),
    path('orders/', OrderCreateView.as_view(), name='OrderCreateView'),
] 