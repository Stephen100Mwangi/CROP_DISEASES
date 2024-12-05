import os
import cv2
import numpy as np


def load_dataset(dataset_path,img_size=(224,224)):
    images,labels=[],[]
    class_names = os.listdir(dataset_path)
    for idx,class_name in enumerate (class_names):
        class_path = os.path.join(dataset_path,class_name)
        for image_name in os.listdir(class_path):
            img_path = os.path.join(class_path,image_name)
            img = cv2.imread(img_path)
            if img is not None:
                img = cv2.resize(img, img_size)
                images.append(img)
                labels.append(idx)

    images = np.array(images) / 255.0
    labels = np.array(labels)
    return images, labels, class_names            
