/********************************************************
 * Variables
 *********************************************************/
var nrOfTracks = 0;

/********************************************************
 * Initialize
 *********************************************************/
$(document).ready(function() {
    
    //Adds the playlist and starts playing it
    test(4);

    //This should be called when a track is played
    loadTimer();

    // Connect to mopidy server
    var mopidy = new Mopidy();
     mopidy.on("state:online", function() {

        //Fetch the playlists
        getPlaylists();
    });
});

function play(track){
    mopidy.on("state:online", function () {
        mopidy.playback.play();
    });
}

function next(){ 
    mopidy.on("state:online", function () {
        mopidy.playback.next();
    });
}

function previous(){
    mopidy.on("state:online", function () {
        mopidy.playback.previous();
    });
}

/********************************************************
 * Add row to queue
 *********************************************************/
function addRow(track, artist, time, album){
         if (!document.getElementsByTagName) return;
         
         tabBody=document.getElementsByTagName("TBODY").item(0);
         row=document.createElement("TR");
         
         cell1 = document.createElement("TD");
         cell2 = document.createElement("TD");
         cell3 = document.createElement("TD");
         cell4 = document.createElement("TD");
         
         textnode1=document.createTextNode(track);
         textnode2=document.createTextNode(artist);
         textnode3=document.createTextNode(time);
         textnode4=document.createTextNode(album);

         cell1.appendChild(textnode1);
         cell2.appendChild(textnode2);
         cell3.appendChild(textnode3);
         cell4.appendChild(textnode4);

         row.appendChild(cell1);
         row.appendChild(cell2);
         row.appendChild(cell3);
         row.appendChild(cell4);

         tabBody.appendChild(row);
}

/********************************************************
 * Get all the playlists
 *********************************************************/
function getPlaylists() {
    // Get playlists without tracks
    mopidy.playlists.getPlaylists(false)
    .then(processGetPlaylists, console.error);  
}


/********************************************************
 * process results of list of playlists of the user
 *********************************************************/
function processGetPlaylists(resultArr) {

    if ((!resultArr) || (resultArr == '')) {
        return;
    }

    for (var i = 0; i < resultArr.length; i++) {
        insertPlaylist("error-menu", i+1, resultArr[i].name);
    };

    //Set the number of playlists found
    showNrOfPlaylist(resultArr.length);
}

/********************************************************
 * Shows the number of playlists
 *********************************************************/
function showNrOfPlaylist(nr){
    $('p#nrOfPlaylists').text(nr);
}

/********************************************************
 * Shows the number of tracks
 *********************************************************/
function showNrOfTracks(nr){
    $('p#nrOfTracks').text(nr);
}

function loadTimer(){
    var loader = $('#timer').percentageLoader();
    //loader.setValue('1:23');
    //loader.setProgress(0.35);
}
/********************************************************
 * Adds a playlist to the sidebar
 *********************************************************/
function insertPlaylist(myid, newListItem) {
    $('ul#' + myid).append('<li><a href="index.html">' + newListItem + '</a></li>');
}

//playlistNr is a position on which playlist to be loaded.
function test(playlistNr){
    var consoleError = console.error.bind(console);

    var getFirst = function (list) {
        return list[playlistNr];
    };

    var extractTracks = function (playlist) {
        return playlist.tracks;
    };

    var printTypeAndName = function (model) {
        console.log(model.__model__ + ": " + model.name);
        // By returning the playlist, this function can be inserted
        // anywhere a model with a name is piped in the chain.
        return model;
    };

    var trackDesc = function (track) {
        return track.name + " by " + track.artists[0].name +
            " from " + track.album.name;
    };

    var printNowPlaying = function () {
        // By returning any arguments we get, the function can be inserted
        // anywhere in the chain.
        var args = arguments;
        return mopidy.playback.getCurrentTrack().then(function (track) {
            console.log("Now playing:", trackDesc(track));
            return args;
        });
    };

    var queueAndPlayFirstPlaylist = function () {
        mopidy.playlists.getPlaylists()
            // => list of Playlists
            .then(getFirst, consoleError)
            // => Playlist
            .then(printTypeAndName, consoleError)
            // => Playlist
            .then(extractTracks, consoleError)
            // => list of Tracks
            .then(mopidy.tracklist.add, consoleError)
            // => list of TlTracks
            .then(getFirst, consoleError)
            // => TlTrack
            .then(mopidy.playback.play, consoleError)
            // => null
            .then(printNowPlaying, consoleError);
    };

    var mopidy = new Mopidy();             // Connect to server
    mopidy.on(console.log.bind(console));  // Log all events
    mopidy.on("state:online", queueAndPlayFirstPlaylist);
}