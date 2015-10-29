# corpex 

## NOTE (2015-10-27): this app is under heavily development and the readme will probably be out of date.

**corpex (corpus explorer)** is a Meteor app for searching through large
(billions of tokens) [linguistic corpora](https://en.wikipedia.org/wiki/Corpus_linguistics).
It is intended to be useful for both language instructors and researchers.

corpex was developed for the 
[HindMonoCorp](https://lindat.mff.cuni.cz/repository/xmlui/handle/11858/00-097C-0000-0023-6260-A)
corpus, but it can be adapted for other corpora as well.

------------------------
### Installation with HindMonoCorp 

First, install Meteor:

    $ curl https://install.meteor.com/ | sh

Clone repo:

    $ git clone https://github.com/lgessler/corpex.git
    $ cd corpex

Launch Meteor:

    $ cd app
    $ meteor

In a new terminal, download HindMonoCorp. As of 2015-10-29, only small amounts
of data are supported, so pull out a sample.
    
    $ cd data
    $ wget https://lindat.mff.cuni.cz/repository/xmlui/bitstream/handle/11858/00-097C-0000-0023-6260-A/hindmonocorp05.plaintext.gz?sequence=2&isAllowed=y
    $ gunzip hindmonocorp05.plaintext.gz
    $ head -n 10000 hindmonocorp05.plaintext > hmcsample.txt

Find your Meteor port (default should be 3001):

    $ cd ../app
    $ meteor mongo -U
    mongodb://127.0.0.1:3001/meteor

Install dependencies and run:

    $ pip3 install pymongo tqdm
    $ python3 populate_db.py data/hmcsample.txt 3001

You should now be able to navigate to `localhost:3000` and begin querying.

------------------------

### Licensing

MIT 
