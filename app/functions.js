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
 * Shows the number of playlists
 *********************************************************/
function showNrOfPlaylists(nr){
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
