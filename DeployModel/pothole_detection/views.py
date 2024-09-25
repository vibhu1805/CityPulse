# views.py

from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
import torch
from django.conf import settings
import os
from .serializers import ImageUploadSerializer

# Load the YOLO model
model_path = os.path.join(settings.BASE_DIR, 'models', 'yolov5s.pt')
model = torch.hub.load('ultralytics/yolov5', 'custom', path=model_path)

def home(request):
    return render(request, "home.html")

@api_view(['POST'])
def detect_potholes(request):
    serializer = ImageUploadSerializer(data=request.data)
    if serializer.is_valid():
        uploaded_file = serializer.validated_data['file']
        image_path = os.path.join(settings.MEDIA_ROOT, uploaded_file.name)

        # Save the uploaded file
        try:
            with open(image_path, 'wb+') as destination:
                for chunk in uploaded_file.chunks():
                    destination.write(chunk)

            # Run detection model
            results = model(image_path)

            # Process the results
            detection_results = results.pandas().xyxy[0]  # Get the results in a DataFrame

            # Extract detected image and prepare response
            detected_image_path = results.save()  # Save results to media directory
            detected_image_path = detected_image_path[0] if detected_image_path else None  # Get the path of the first saved result

            # Return detection results in the response
            response_data = {
                'detected_image': detected_image_path,
                'detections': detection_results.to_dict(orient="records"),  # Convert DataFrame to dict
            }

            return Response(response_data, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
