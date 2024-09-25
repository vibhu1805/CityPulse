from django.urls import path
from .views import detect_potholes

urlpatterns = [
    path('detect/', detect_potholes, name='detect_potholes'),
]
