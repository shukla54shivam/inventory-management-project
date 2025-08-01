from django.db import models

# Create your models here.

class Product(models.Model):
    name = models.CharField(max_length=100)
    type = models.CharField(max_length=100)
    sku = models.CharField(max_length=100, unique=True)
    image_url = models.URLField(blank=True)
    description = models.TextField(blank=True)
    quantity = models.IntegerField()
    price = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return self.name
