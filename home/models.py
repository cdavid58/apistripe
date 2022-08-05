from django.db import models

class MetaDatos(models.Model):
	public_key = models.TextField()
	secret_key = models.TextField()