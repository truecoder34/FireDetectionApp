# a simple script to download flickr images
# insert your api and secret keys
# set image resize size
# run the script

import flickrapi
import urllib.request
from PIL import Image
import pathlib
import os
from tqdm import tqdm


# Flickr api access key
flickr=flickrapi.FlickrAPI('your API key', 'your secret key', cache=True)

def get_links():
    search_term = input("Inupt keywords for images: ")

    keyword = search_term
    max_pics=2000

    photos = flickr.walk(text=keyword,
                         tag_mode='all',
                         tags=keyword,
                         extras='url_c',
                         per_page=500,           # may be you can try different numbers..
                         sort='relevance')


    urls = []
    for i, photo in enumerate(photos):
        #print (i)

        url = photo.get('url_c')
        if url is not None:
            urls.append(url)

        
        if i > max_pics:
            break

    num_of_pics=len(urls)
    print('total urls:',len(urls)) # print number of images available for a keywords
    return urls, keyword, num_of_pics
  
  
#resizing  and cropping output images will be besquare

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

def download_images(urls_,keyword_, num_of_pics_):
    num_of_pics=num_of_pics_
    keyword=keyword_
    urls=urls_
    i=0
    base_path='./flickr_data/' # your base folder to save pics

    for item in tqdm(urls):
        name=''.join([keyword,'_',str(i),'.jpg'])
        i+=1
        keyword_=''.join([keyword,'_',str(num_of_pics)])
        dir_path= os.path.join(base_path,keyword_)
        file_path=os.path.join(dir_path,name)
        pathlib.Path(dir_path).mkdir(parents=True, exist_ok=True)

        urllib.request.urlretrieve(item, file_path)

        resized_img=crop_resize(file_path, 256) #set output image size

        try:
            resized_img.save(file_path)
        except:
            pass


urls, keyword, num_of_pics =get_links()

coninue = input("coninue or try other keywords (y,n): ") #command line interface to get keywords to download

if coninue=='y':
    download_images(urls, keyword, num_of_pics)
elif coninue=='n':
    get_links()
else:
    pass