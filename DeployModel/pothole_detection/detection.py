class Detections:
    def __init__(self, imgs=None):
        self.imgs = imgs or []  # Initialize with an empty list if no images are provided

    def add_image(self, image):
        self.imgs.append(image)  # Method to add detected images

    def clear_images(self):
        self.imgs.clear()  # Clear the list of images
