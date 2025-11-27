from django.db import models

class Categoria(models.Model):
    nombre = models.CharField(max_length=100)
    
    # Esto asegura que el nombre de la categoría se vea bien en el Admin
    def __str__(self):
        return self.nombre

class Producto(models.Model):
    nombre = models.CharField(max_length=200)
    descripcion = models.TextField(blank=True, null=True) 
    precio = models.DecimalField(max_digits=10, decimal_places=2)
    categoria = models.ForeignKey(Categoria, on_delete=models.CASCADE)
    stock = models.IntegerField(default=0)
    
    # upload_to='productos/' crea una subcarpeta dentro de la carpeta 'media'
    # null=True, blank=True permite crear productos sin imagen si es necesario
    imagen = models.ImageField(upload_to='productos/', null=True, blank=True)

    # destacar producto
    destacado = models.BooleanField(default=False, verbose_name="Producto Destacado")
    
    def __str__(self):
        return self.nombre