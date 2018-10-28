import keras
import sys
from keras.layers import Dense
from keras.models import model_from_json
from sklearn.externals import joblib
from PIL import Image
import numpy as np
from keras import models, layers, optimizers
from keras.applications import MobileNet
from keras.models import Sequential
from keras.layers import Dense, Dropout, Flatten
from keras.layers import Conv2D, MaxPooling2D

# from keras.models import Sequential
#from keras.layers import Dense, Dropout, Activation


def crop_resize(img_path, img_size_square):
    
    # Get dimensions      
    mysize = img_size_square
    image = Image.open(img_path) 
    width, height = image.size
    
    # resize
    
    if (width and height) >= img_size_square:
        
        if width > height:
            
            wpercent = (mysize/float(image.size[1]))
            vsize = int((float(image.size[0])*float(wpercent)))
            image = image.resize((vsize, mysize), Image.ANTIALIAS)
        else:
            wpercent = (mysize/float(image.size[0]))
            hsize = int((float(image.size[1])*float(wpercent)))
            image = image.resize((mysize, hsize), Image.ANTIALIAS)
        
        # crop
        width, height = image.size
        left = (width - mysize)/2
        top = (height - mysize)/2
        right = (width + mysize)/2
        bottom = (height + mysize)/2
        image=image.crop((left, top, right, bottom))
       

        return image


conv_base = MobileNet(weights='imagenet', include_top=False, input_shape=(224, 224, 3))

def build_model():

    model = models.Sequential()
    model.add(conv_base)
    model.add(layers.Flatten())
    model.add(layers.Dense(256, activation='relu'))
    model.add(layers.Dense(64, activation='relu'))
    model.add(layers.Dense(1, activation='sigmoid'))
    model.compile(loss='binary_crossentropy',
    optimizer=optimizers.RMSprop(lr=2e-5),
    metrics=['acc'])
    return model


image=crop_resize(sys.argv[1],224)
image = np.reshape(image,[1,224,224,3])



#Loading models and text processing
# model=load_model_and_weights('firepredict')

model = build_model()
print('building a model')

model.load_weights('./models/mobile_weights.h5')

print('model loaded')

pred_cat=model.predict(image)

if pred_cat > 0.5:
  print('fire {}'.format(pred_cat))
else: print('no fire {}'.format(pred_cat))
   