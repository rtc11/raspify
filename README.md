![alt text](https://cdn1.iconfinder.com/data/icons/simply-8-bits-11/96/spotify.png "Raspify") RASPIFY
=======

# NodeJS
NodeJS for server-sided JavaScript.
http://nodejs.org/

## Node modules
### npm
Node Package Manager: https://www.npmjs.org/

### express
Fast, unopinionated, minimalist web framework for node.

### nodemon
Module for monitoring changed in source and automatically restarts server.

### node-spotify
Wrapper for libspotify. It is native module mainly written in C++ and therefore requires _node-gyp_.
http://www.node-spotify.com/index.html

#### Requires
1. Spotify Premium
2. Libspotify (and appkey from devleoper.spotify.com
3. Linux or OSX

#### Dependencies
**node-gyp** and **libspotify** are required for building. You also need libasound2-dev.
  _sudo npm install -g node-gyp_ 
   
**libasound2-dev** which is a required package for ALSA library (Advanced Linux Sound Architecture)   
  _sudo apt-get install libasound2-dev_

## Compile
We need to tell node-gyp which node module we want to 'interpret as a native'.
Go to the root dir of the node-spotify module, e.g /usr/lib/node_modules/node-spotify and make sure that the
_binging.gyp_ file is present. Then perform: _sudo node-gyp configure_ and _sudo node-gyp build_.
To run the application, use node, nodemon or npm. (Start backend and frontend as two different services). 
