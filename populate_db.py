from pymongo import MongoClient
from tqdm import *
from time import sleep
import sys
import re

# To find this, run meteor and then type `meteor mongo -U`. 
# But it's usually meteor's port +1, so try that first.
port = 3001

def connection_test():
    client = MongoClient('localhost', port)
    dic = client.meteor.texts

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
    print("The connection to mongo on port {} seems to work.".format(port))

def inject_hindmonocorp_file(filepath):
    client = MongoClient('localhost', port)
    dic = client.meteor.texts
    print("Attempting to populate Mongo DB on port {} with lines from {}"
            .format(port, filepath))

    with open(filepath, 'r') as f:
        for line in tqdm(f):
            try:
                keys = ["corpus", "type", "text",]
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

    print("Successfully populated DB.")

if __name__ == '__main__':
    if len(sys.argv) not in [2,3]:
        print("Usage: `python3 populate_db.py <src> [<port>]`")
        sys.exit(1)
    src = sys.argv[1]
    if len(sys.argv) == 3:
        try:
            port = int(sys.argv[2])
        except:
            print("port doesn't seem to be an int")
            sys.exit(1)
    inject_hindmonocorp_file(src)
                    

