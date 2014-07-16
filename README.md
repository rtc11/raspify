![alt text](https://cdn1.iconfinder.com/data/icons/simply-8-bits-11/96/spotify.png "Raspify") Raspify
=======

# 1. NodeJS
Go to project root and run **_npm start_** or **_nodemon_** for automatically serverrestart on changes in source. 
_npm start_ will perform the package.json preferences.

#### Link
http://nodejs.org/

## 1.1 Node modules

### 1.1.1 npm
Node Package Module: https://www.npmjs.org/

Package manager for nodejs

### 1.1.2 node-spotify
Wrapper for libspotify. It is native module mainly written in C++ and therefore requires _node-gyp_.

#### Links
http://www.node-spotify.com/index.html

https://developer.spotify.com/technologies/libspotify/

#### Requires
1. Spotify Premium
2. Libspotify (and appkey from devleoper.spotify.com
3. Linux or OSX

#### Dependencies
**node-gyp** and **libspotify** are required for building. You also need libasound2-dev.
  _sudo npm install -g node-gyp_ 
   

**libasound2-dev** which is a required package for ALSA library (Advanced Linux Sound Architecture)   
  _sudo apt-get install libasound2-dev_

#### Compile
We need to tell node-gyp which node module we want to 'interpret as a native'.
Go to the root dir of the node-spotify module, e.g /usr/lib/node_modules/node-spotify and make sure that the
_binging.gyp_ file is present. Then perform: _sudo node-gyp configure_ and _sudo node-gyp build_.

### 1.1.3 nodemon
Module for monitoring changed in source and automatically restarts server.
