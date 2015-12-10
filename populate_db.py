from pymongo import MongoClient
from tqdm import *
from time import sleep
import sys
import re

# To find this, run meteor and then type `meteor mongo -U`. 
# But it's usually meteor's port +1, so try that first.
port = 3001

def inject_hindmonocorp_file(filepath):
    client = MongoClient('localhost', port)
    dic = client.meteor.texts
    print("Attempting to populate Mongo DB on port {} with lines from {}"
            .format(port, filepath))

    keys = ["text", "corpus", "date", "url"]
    with open(filepath, 'r') as f:
        for line in tqdm(f):
            vals = line.split('\t') 

            # This happens when the text is empty in HindMonoCorp05--ignore the line
            if len(vals) == 2:
                continue

            # remove newline character
            vals[2] = vals[2][:-1]

            dic.insert({
                "text": vals[2],
                "corpus": vals[1],
                "date": None,
                "url": None
            })

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
                    

