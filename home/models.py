from django.db import models

from phonenumber_field.modelfields import PhoneNumberField



class Customer(models.Model):

    name = models.CharField(max_length=100)

    address=models.CharField(max_length=200)

    email = models.EmailField(unique=True)

    phone_number = PhoneNumberField(null=False, blank=False, unique=True)

    password = models.CharField(max_length=100)

    

    def __str__(self):

        return self.name

    

class Borewell(models.Model):

    customer=models.ForeignKey(Customer,on_delete=models.SET_NULL,null=True)

    latitude=models.CharField(max_length=100)

    longitude=models.CharField(max_length=100)

    well_type=models.CharField(max_length=100 )

    depth_type=models.CharField(max_length=100 )

    wall_type=models.CharField(max_length=100)

    supply_system=models.CharField(max_length=100)

    exact_depth=models.IntegerField(default=0)

    motor_operated=models.BooleanField(default=False)

    authorities_aware=models.BooleanField(default=False)

    description=models.CharField(max_length=500)



    def __str__(self):

        return self.customer.name + "'s borewell"
