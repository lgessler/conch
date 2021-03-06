# Conch

<img src="https://cdn.rawgit.com/lgessler/conch/master/app/public/conch.svg" 
  height="250" width="auto"></img>

Surgical search for enormous natural language corpuses

(This is just a prototype!)

<!--![](https://travis-ci.org/lgessler/conch.svg?branch=master)-->
[![Gitter](https://badges.gitter.im/lgessler/conch.svg)](https://gitter.im/lgessler/conch?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=body_badge)

-----------------------

* <a href="#intro">Introduction</a>
* <a href="#demo">Demo</a>
* <a href="#install">Reference Installation</a>
* <a href="#components">Components Used</a>
* <a href="#license">License</a>

<a name="intro"></a>
Introduction
------------
**Conch**  is for searching through large
(billions of tokens) [linguistic corpora](https://en.wikipedia.org/wiki/Corpus_linguistics).
It is intended to be useful for both language instructors and researchers by
providing them an easy interface for linguistic corpora which otherwise
might have remained out of technical reach.

Conch accepts regular expressions on its web interface and uses [a lightly modified version of Google Code Search](https://github.com/lgessler/codesearch) to match it against the loaded corpora.

Conch was developed for the 
[HindMonoCorp](https://lindat.mff.cuni.cz/repository/xmlui/handle/11858/00-097C-0000-0023-6260-A)
corpus, but it can be adapted for other corpora as well.

<a name="demo"></a>
Demo
----

Go to [conch.lgessler.com](http://conch.lgessler.com). (Edit 2/21/2017: sorry, offline for now :()

Right now Conch works by matching regular expressions against raw text. So to find all the instances of चाहता at the end of a sentence, we'd enter चाहता[\s+]?[.!?।] into the search bar and [let it rip!](http://conch.lgessler.com/search/%E0%A4%9A%E0%A4%BE%E0%A4%B9%E0%A4%A4%E0%A4%BE%5B%5Cs%2B%5D%3F%5B.!%3F%E0%A5%A4%5D)

<a name="install"></a>
Reference Installation with HindMonoCorp 
----------------------------------------

Currently, only Ubuntu/Debian Linux is supported. 

First, install Meteor:

    curl https://install.meteor.com/ | sh

Now, install Go and set up your GOPATH:
    
    sudo apt-get install golang
    mkdir ~/.go
    read YOUR_HOME
    echo "export GOPATH=/home/$YOUR_HOME/.go" >> ~/.bashrc
    echo "export PATH=\$PATH:/home/$YOUR_HOME/.go/bin" >> ~/.bashrc

Reload bash and clone the modified version of Google Code Search:

    bash
    go get github.com/lgessler/codesearch/cmd/...

Clone repo:

    cd ~
    git clone https://github.com/lgessler/conch.git

Now we're going to fetch our example data, HindMonoCorp:

    cd conch/data
    wget https://lindat.mff.cuni.cz/repository/xmlui/bitstream/handle/11858/00-097C-0000-0023-6260-A/hindmonocorp05.plaintext.gz?sequence=2&isAllowed=y
    gunzip hindmonocorp05.plaintext.gz

We need to split the file into files of 5000 lines each so Code Search can efficiently index them. `process.py` will do this:

    mkdir -p conch-files/hmc

    # two arguments: the file we're splitting up, and the directory
    # inside conch-files the resulting files will go to
    python3 process.py hindmonocorp05.plaintext hmc

Tell Code Search to index this directory:

    # this'll take some time!
    cindex ./conch-files
    # if you want to see whether it worked, try calling `csearch` directly:
    csearch स्वामिभक्त

Now we'll start Meteor. 

    cd ../app
    cp settings-production.json.example settings-production.json

    # use your favorite editor here to update the paths to `csearch` and `cindex`
    # these should be $GOPATH/csearch and $GOPATH/cindex, but write out the absolute
    # path just to be safe.
    vim settings-production.json
    
    # if you're behind a reverse proxy, set HTTP_FORWARDED_COUNT to 1. 
    # if you're not, set it to 0. (This is for IP logging.)
    vim launch.sh

    # by default, this will log all server-side log messages to ./meteor.log
    ./launch.sh

Now conch will be accepting connections on 0.0.0.0:3000--success!

<a name="components"></a>
Components used 
---------------

* [Meteor.js](https://www.meteor.com)
    * [Differential's Meteor Boilerplate Lite](https://github.com/Differential/meteor-boilerplate-lite)
* [Bootstrap 3](http://getbootstrap.com/)
* [Google Code Search](https://github.com/google/codesearch) 
* [Build-Regex](https://github.com/stevenwadejr/Build-Regex)
* [This excellent conch SVG](https://openclipart.org/detail/30709/conch)

<a name="license"></a>
License
-------

MIT 
