/********************************************************
 * Variables
 *********************************************************/
var nrOfTracks = 0;

/********************************************************
 * Initialize
 *********************************************************/
$(document).ready(function() {
    
    // Connect to mopidy server
    mopidy = new Mopidy();
     mopidy.on("state:online", function() {

        //Fetch the playlists
        getPlaylists();
    });


    var consoleError = console.error.bind(console);

    var trackDesc = function (track) {
        return track.name + " by " + track.artists[0].name +
            " from " + track.album.name;
    };


    var queueAndPlayFirstPlaylist = function () {
        mopidy.playlists.getPlaylists().then(function (playlists) {
            var playlist = playlists[0];
            console.log("Loading playlist:", playlist.name);
            mopidy.tracklist.add(playlist.tracks).then(function (tlTracks) {
                mopidy.playback.play(tlTracks[0]).then(function () {
                    mopidy.playback.getCurrentTrack().then(function (track) {
                        console.log("Now playing:", trackDesc(track));
                    }, consoleError);
                }, consoleError);
            }, consoleError);
        }, consoleError);
    };
    
    mopidy.on(console.log.bind(console));
    mopidy.on("state:online", queueAndPlayFirstPlaylist);


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

/********************************************************
 * Adds a playlist to the sidebar
 *********************************************************/
function insertPlaylist(myid, newListItem) {
    $('ul#' + myid).append('<li><a href="index.html">' + newListItem + '</a></li>');
}