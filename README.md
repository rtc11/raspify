![alt text](https://cdn1.iconfinder.com/data/icons/simply-8-bits-11/96/spotify.png "Raspify") Raspify
=======

# 1. NodeJS
Go to project root and run **_npm start_** or **_nodemon_** for automatically serverrestart on changes in source. 
_npm start_ will perform the package.json preferences.

#### Link:
http://nodejs.org/

## 1.1 Node modules

### 1.1.1 npm
Node Package Module: https://www.npmjs.org/

Package manager for nodejs

### 1.1.2 node-spotify
Spotify module. 

#### Links:
http://www.node-spotify.com/index.html

https://developer.spotify.com/technologies/libspotify/

#### Requires:
1. Spotify Premium
2. Libspotify (and appkey from devleoper.spotify.com
3. Linux or OSX

#### Dependencies:
**node-gyp** which is a native addon build tool:
  _sudo npm install -g node-gyp_ 
   

**libasound2-dev** which is a required package for ALSA library (Advanced Linux Sound Architecture)   
  _sudo apt-get install libasound2-dev

### 1.1.3 nodemon
Module for monitoring changed in source and automatically restarts server.
