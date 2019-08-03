import flask
from flask import request, jsonify
import requests
import os
import re
import io
os.environ["GOOGLE_APPLICATION_CREDENTIALS"]="My First Project-22bf52cf81d0.json"

from google.cloud import vision
from google.cloud.vision import types


client = vision.ImageAnnotatorClient()
app = flask.Flask(__name__)
app.config["DEBUG"] = True
UPLOAD_FOLDER = './images'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

def getType(s):
  response = requests.get(
    'https://maps.googleapis.com/maps/api/place/findplacefromtext/json?',
     params={'input': s, 'key':'AIzaSyAgignnY-gj4j_S7IFlIp8bx1Lfm14E2lM', 'inputtype': 'textquery'}
  )
  a=response.json()
  placeid= a['candidates'][0]['place_id']
  response1 = requests.get(
    'https://maps.googleapis.com/maps/api/place/details/json?',
     params={'placeid': placeid, 'key':'AIzaSyAgignnY-gj4j_S7IFlIp8bx1Lfm14E2lM', 'inputtype': 'textquery', 'fields': 'type'}   
  )
  x= response1.json()
  return x['result']['types']

def detect_text(path):
    """Detects text in the file."""
    from google.cloud import vision
    client = vision.ImageAnnotatorClient()
    with io.open(path, 'rb') as image_file:
        content = image_file.read()
    image = vision.types.Image(content=content)
    response = client.text_detection(image=image)
    texts = response.text_annotations
    for text in texts:
        a = '\n{}'.format(text.description)
        break
        vertices = (['({},{})'.format(vertex.x, vertex.y)
                    for vertex in text.bounding_poly.vertices])
    return a

def check1(st):
    return re.match('^[0-9\.\ ]*$',st)

def getData(imgPath):
    file_name = os.path.join(
    os.path.dirname('__file__'),
    imgPath)
    b= detect_text(file_name)

    import re
    c=b.splitlines()

    phone_templates=['\d{10}','\(?\d{3}\)?[-\s]\d{8}']
    phnu=[]
    ind1=0
    ind2=0
    ind3=0

    gst=re.findall('\d{11}',b)

    for i in range(len(phone_templates)):
      phnum=re.findall(phone_templates[i],b)
      if phnum:
        phnu.append(phnum)
        if i==0:
          ind1=1
        else:
          ind2=1
            
    if ind2==1 and ind1==1:
      ind3=1
      
    phone_number=phnu[ind3][0]
    gst_number=int(gst[0])
    store_name=c[1]

    cross=1

    for st in c:
      if 'QTY' in st.upper():
        cross=1
        continue
      if cross==1:
        cross=1
    start_words=['QTY','ITEM','PRICE','AMOUNT','AMT','AMNT','ITEM NAME','TOTAL','OTY']
    end_words=['GRAND TOTAL','SUBTOTAL']

    flag1=0
    flag2=0
    flag3=0

    item_names=[]

    for i in c:
      if flag1==0:
        if i.upper() in start_words:
          flag1=1
      elif i not in start_words and flag1==1 and flag3==0:
        if flag2==0:
    #       item_names.append(i)
          pass
        elif flag2==1 and check1(i):
          break
        item_names.append(i)
        flag2=1
    indstart=c.index(item_names[-1])
    indend = c.index('Grand Total')

    item_prices=[]
    for i in c[indstart:indstart+len(item_names)+1]:
      if(check1(i)):
        item_prices.append(i.split()[0])

    a={}
    item_name_prices = {}
    for i in range(0,len(item_names)):
      item_name_prices[item_names[i]] = item_prices[i]
    a['store_name'] = store_name
    a['phone_number'] = phone_number
    a['gst_number'] = gst_number
    a['items'] = item_name_prices
    a['categories'] = getType(a['store_name'])
    return a
@app.route('/', methods=['GET'])
def home():
    return '''<h1>API</h1>
<p>Get the image API</p>'''

@app.route('/type', methods=['POST'])
def api_id():
    file=request.files['file']
    filename = file.filename
    file_directory = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    file.save(file_directory)
    results = getData(file_directory)
    return jsonify(results)
@app.route('/type1', methods=['GET'])
def api_id1():
	results=[]
	directory = os.fsencode('all_images')
	for file1 in os.listdir(directory):
		filename = os.fsdecode(file1)
		print(filename)
		file_directory = os.path.join(os.fsdecode(directory), filename)
		results.append(getData(file_directory))
	return jsonify(results)
app.run()