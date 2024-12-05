# # Contains reusable utility functions
# import cv2

# def validate_image(image):
#     """Check if the upload file is a valid image"""
#     if image is None or image.shape[0] == 0 or image.shape[1] == 0:
#         return False
#     return True


import cv2
import numpy as np

def validate_image(image):
    """
    Validate the input image.
    
    Args:
        image (numpy.ndarray): Input image to validate
    
    Returns:
        bool: True if image is valid, False otherwise
    """
    if image is None:
        return False
    
    # Check if image has valid dimensions
    if len(image.shape) not in [2, 3]:
        return False
    
    # Check image is not empty
    if image.size == 0:
        return False
    
    return True