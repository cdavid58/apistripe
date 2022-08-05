from django.shortcuts import render
from .models import MetaDatos

def Index(request):
	m = MetaDatos.objects.get(pk = 2)
	print(m.public_key)
	return render(request,'index.html',{'m':m})
