<img src="https://cdn.rawgit.com/lgessler/conch/master/app/public/conch.svg" width="250" height="auto" style="float: right;"></img>
**conch**  is for searching through large
(billions of tokens) [linguistic corpora](https://en.wikipedia.org/wiki/Corpus_linguistics).
It is intended to be useful for both language instructors and researchers by
providing them an easy interface for linguistic corpora which otherwise
might have remained out of technical reach.

conch was developed for the 
[HindMonoCorp](https://lindat.mff.cuni.cz/repository/xmlui/handle/11858/00-097C-0000-0023-6260-A)
corpus, but it can be adapted for other corpora as well.

# Demo

Go to [conch.lgessler.com](http://conch.lgessler.com). 

Right now conch works by matching regular expressions against raw text. So to find all the instances of चाहता at the end of a sentence, we'd enter चाहता[\s+]?[.!?।] into the search bar and [let it rip!](http://conch.lgessler.com/results/%E0%A4%9A%E0%A4%BE%E0%A4%B9%E0%A4%A4%E0%A4%BE%5B%5Cs%2B%5D%3F%5B.!%3F%E0%A5%A4%5D)

(Note: the inverted index has not been implemented yet (2015-10-30), so searches *will* be *absurdly* slow.)

# Components used 

* [Meteor.js](https://www.meteor.com)
    * [Differential's Meteor Boilerplate Lite](https://github.com/Differential/meteor-boilerplate-lite)
* [Bootstrap 3](http://getbootstrap.com/)
* [Google Code Search](https://github.com/google/codesearch) 
* [This excellent conch SVG](https://openclipart.org/detail/30709/conch)

------------------------

# Installation with HindMonoCorp 

## Ubuntu/Debian Linux 

First, install Meteor:

    curl https://install.meteor.com/ | sh

Now, install Go and set up your GOPATH:
    
    sudo apt-get install golang
    mkdir ~/.go
    echo "export GOPATH=/home/YOURNAME/.go"
    echo "export PATH=\$PATH:/home/YOURNAME/.go/bin" >> ~/.bashrc"

Clone the modified version of Google Code Search:

    go get github.com/lgessler/codesearch/cmd/...

Clone repo:

    cd ~
    git clone https://github.com/lgessler/conch.git

Now we're going to fetch our example data, HindMonoCorp:

    cd conch/data
    wget https://lindat.mff.cuni.cz/repository/xmlui/bitstream/handle/11858/00-097C-0000-0023-6260-A/hindmonocorp05.plaintext.gz?sequence=2&isAllowed=y
    gunzip hindmonocorp05.plaintext.gz

We need to split the file into files of 5000 lines each so Code Search can efficiently index them. `process.py` will do this:

    mkdir conch-files
    python3 process.py hindmonocorp05.plaintext

Tell Code Search to index this directory:

    # this'll take some time!
    cindex ./conch-files
    # if you want to see whether it worked, try calling `csearch` directly:
    csearch स्वामिभक्त

Now we'll start Meteor. 

    cd ../app
    cp settings-dev.json.example settings-dev.json

    # use your favorite editor here to update the paths to `csearch` and `cindex`
    # these should be $GOPATH/csearch and $GOPATH/cindex, but write out the absolute
    # path just to be safe.
    vim settings-dev.json

## Windows

Contact me if you need help and we can figure it out together to fill this
section out :^)

------------------------

# License

MIT 
