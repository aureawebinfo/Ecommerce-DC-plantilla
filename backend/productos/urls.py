from django.urls import path
from . import views

urlpatterns = [
    path('categorias/', views.CategoriaListView.as_view(), name='categorias'),
    path('', views.ProductoListView.as_view(), name='productos'),
    path('destacados/', views.productos_destacados, name='productos-destacados'),
    path('<int:pk>/', views.ProductoDetailView.as_view(), name='producto-detalle'),
]