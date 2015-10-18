from pymongo import MongoClient

client = MongoClient('localhost',3001)

dic = client.meteor.Dictionary
d1 = { "Word"       : "DOG"
     , "Definition" : "Canis Familiaris" 
     }

d2 = { "Word"       : "FOG"
     , "Definition" : "Coastal condensation" 
     }

dic.insert(d1)
dic.insert(d2)

