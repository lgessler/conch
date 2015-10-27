from pymongo import MongoClient
from tqdm import *
from time import sleep
import re

# To find this, run meteor and then type `meteor mongo -U`. 
# But it's usually meteor's port +1, so try that first.
port = 5051

client = MongoClient('localhost', port)
dic = client.meteor.Dictionary

def connection_test():
    d1 = { "Word"       : "DOG"
         , "Definition" : "Canis Familiaris" 
         }

    d2 = { "Word"       : "FOG"
         , "Definition" : "Coastal condensation" 
         }

    dic.insert(d1)
    dic.insert(d2)
    sleep(3)
    dic.remove({"Word":"FOG"})
    dic.remove({"Word":"DOG"})

def inject_hindmonocorp_file(filepath='data/hmc/hindmonocorp05.plaintext'):
    with open(filepath, 'r') as f:
        for line in tqdm(f):
            try:
                #keys = ["corpus", "type", "txt",]
                keys = ["Word", "type", "Definition",]
                vals = line.split('\t') 

                # remove newline character
                vals[2] = vals[2][:-1]

                obj = dict(zip(keys, vals))
                dic.insert(obj)
            except:
                print("\nERROR: Something's not right with this string.")
                print("Trying to solve the case where there's a missing second tab...", end="")
                pat = re.compile(r"\<.\>\n")
                if pat.match(vals[1]):
                    vals = vals[0] + vals[1][:3] + vals[1][3:]
                    obj = dict(zip(keys, vals))
                    dic.insert(obj)
                    print("There was a missing second tab. Line recovered successfully.")
                else:
                    print("String still looks bad after attempt to fix it. Giving up and moving on.")
                    print("Vals:\t{}".format(vals))
                    print("Raw line:\t{}".format(line))

                    
connection_test() 
#inject_hindmonocorp_file()

