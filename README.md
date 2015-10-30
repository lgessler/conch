**NOTE (2015-10-27): this app is under heavy development and the readme will probably be out of date.**

**corpex (corpus explorer)** is for searching through large
(billions of tokens) [linguistic corpora](https://en.wikipedia.org/wiki/Corpus_linguistics).
It is intended to be useful for both language instructors and researchers by
providing them an easy interface for linguistic corpora which otherwise
might have remained out of technical reach.

corpex was developed for the 
[HindMonoCorp](https://lindat.mff.cuni.cz/repository/xmlui/handle/11858/00-097C-0000-0023-6260-A)
corpus, but it can be adapted for other corpora as well.

#### Demo

Go to [corpex.lgessler.com](http://corpex.lgessler.com). 

Right now corpex works by matching regular expressions against raw text. So to find all the instances of चाहता at the end of a sentence, we'd enter चाहता[\s+]?[.!?।] into the search bar and [let it rip!](http://corpex.lgessler.com/results/%E0%A4%9A%E0%A4%BE%E0%A4%B9%E0%A4%A4%E0%A4%BE%5B%5Cs%2B%5D%3F%5B.!%3F%E0%A5%A4%5D)

(Note: the inverted index has not been implemented yet (2015-10-30), so searches *will* be *absurdly* slow.)

#### Components used 

corpex uses Meteor.js with Bootstrap 3 and some supporting Python scripts. It
was built on top of [Differential's Meteor Boilerplate
Lite](https://github.com/Differential/meteor-boilerplate-lite).

------------------------
### Installation with HindMonoCorp 

#### Linux/OSX

First, install Meteor:

    curl https://install.meteor.com/ | sh

Clone repo:

    git clone https://github.com/lgessler/corpex.git
    cd corpex

Launch Meteor:

    cd app
    meteor

In a new terminal, download HindMonoCorp. As of 2015-10-29, only small amounts
of data are supported, so pull out a sample.
    
    cd data
    wget https://lindat.mff.cuni.cz/repository/xmlui/bitstream/handle/11858/00-097C-0000-0023-6260-A/hindmonocorp05.plaintext.gz?sequence=2&isAllowed=y
    gunzip hindmonocorp05.plaintext.gz
    head -n 10000 hindmonocorp05.plaintext > hmcsample.txt

Find your Meteor port (default should be 3001):

    cd ../app
    meteor mongo -U
    (result: mongodb://127.0.0.1:3001/meteor)

Install dependencies and run python script to populate MongoDB:

    pip3 install pymongo tqdm
    python3 populate_db.py data/hmcsample.txt 3001

You should now be able to navigate to `localhost:3000` and begin querying.

#### Windows

Contact me if you need help and we can figure it out together to fill this
section out :^)

------------------------

### Licensing

MIT 
