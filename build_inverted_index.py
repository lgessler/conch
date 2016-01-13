from pymongo import MongoClient
import leveldb

import json
import sys

import os
import atexit
import uuid

# To find this, run meteor and then type `meteor mongo -U`. 
# But it's usually meteor's port +1, so try that first.
port = 3001

# Write files into tmp folder
basename = os.path.join('/tmp/', uuid.uuid4().hex)

def write_to_leveldb():
    mongo = MongoClient('localhost', port)
    coll = mongo.meteor.texts
    level = leveldb.LevelDB('./leveldb')

    buffer = {}
    docnum = 0
    
    for doc in coll.find():
        docid = doc['_custom_id']
        text = doc['text']
        doclen = len(text)
        already_seen_this_doc = []
        
        for i in range(0, doclen-2): 
            trigram = text[i:i+3]
            if trigram not in already_seen_this_doc:
                if trigram in buffer:
                    buffer[trigram].append(docid)
                else:
                    buffer[trigram] = [docid]
                already_seen_this_doc.append(trigram)
        
        docnum += 1

        #if sys.getsizeof(buffer) >= 512000000:
        if sys.getsizeof(buffer) >= 1400000:
            for k,v in buffer.items():
                encoded_key = k.encode('utf-8')
                new_bytes = (','.join(map(str,v))).encode('utf-8')
                try:
                    old_bytes = level.Get(k.encode('utf-8'))
                    old_and_new_bytes = old_bytes + ','.encode('utf-8') + new_bytes
                    level.Put( encoded_key, old_and_new_bytes )
                except KeyError:
                    level.Put( encoded_key, new_bytes )

            buffer = {}


if __name__ == '__main__':
    if len(sys.argv) not in [1,2]:
        print("Usage: `python3 populate_db.py [<port>]`")
        sys.exit(1)

    if len(sys.argv) == 2:
        try:
            port = int(sys.argv[1])
        except:
            print("port doesn't seem to be an int")
            sys.exit(1)

    write_to_leveldb()
                    

