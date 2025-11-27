from django.urls import path
from . import views

urlpatterns = [
    path('registro/', views.UserRegistrationView.as_view(), name='registro'),
    path('login/', views.login_view, name='login'),
    path('logout/', views.logout_view, name='logout'),
    path('perfil/', views.UserProfileView.as_view(), name='perfil'),
]
