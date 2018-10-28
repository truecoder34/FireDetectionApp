# imports
import pandas as pd
import numpy as np
from math import radians, cos, sin, asin, sqrt
import json

dist=10
url = 'MODIS_C6_Global_24h.csv'

#func to find distance 
def findDistanceBetweenTwoPoints(pt1_lon, pt1_lat, pt2_lon, pt2_lat):
  # Find closest points on 20 killoms 
  # We have pt1_lon pt1_lat and pt1_lon pt1_lat
  # Convert points to radians
  pt1_lon, pt1_lat, pt2_lon, pt2_lat = map(radians, [pt1_lon, pt1_lat, pt2_lon, pt2_lat])
  
  # haversine formula 
  d_lon = pt2_lon - pt1_lon
  d_lat = pt2_lat - pt1_lat
  a = sin(d_lat/2)**2 + cos(pt1_lat) * cos(pt2_lat) * sin(d_lon/2)**2
  c = 2 * asin(sqrt(a)) 
  r = 6371 # Radius of earth in miles. Use 6371 for kilometers
  return c * r


def main(coordinates):
    #read Initial frame
  initialDataFrame = pd.read_csv(url)
  initialDataFrame.head()

  LatLonFrame = pd.DataFrame(initialDataFrame[['latitude','longitude']])
  #print(LatLonFrame)

  recievedLat, recievedLon = coordinates[0], coordinates[1]

  BufferDataFrame = pd.DataFrame({
      'latitude':[coordinates[0]],
      'longitude': [coordinates[1]]
      })


  LatLonFrame=pd.concat([BufferDataFrame,LatLonFrame])
  #print(LatLonFrame)

  #Write to csv 
  LatLonFrame.to_csv('PointsList.csv')
  LatLonFrame=pd.read_csv('PointsList.csv').drop('Unnamed: 0', axis=1)

  # # VAZNO - here is result
  coordDict = dict()
  
  for i in range(len(LatLonFrame)):
    x1 = LatLonFrame.iloc[i,0]
    y1 = LatLonFrame.iloc[i,1]
    print(x1, y1)
    x2 = recievedLat
    y2 = recievedLon

    if(findDistanceBetweenTwoPoints(x1, y1, x2, y2) <= dist):
      coordDict[i] = [x1, y1]

  
  if(len(coordDict) > 0):
    return json.dumps(coordDict, ensure_ascii=False)
  else:
    return json.dumps({len():coordinates})