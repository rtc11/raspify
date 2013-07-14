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
 * Shows the number of queued tracks
 *********************************************************/
function showNrOfQueued(nr){
    $('span#nrOfQueued').text(nr);
}

/********************************************************
 * Shows the number of tracks in track list
 *********************************************************/
function showNrOfTracklisted(nr){
    $('span#nrOfTracklisted').text(nr);
}

/********************************************************
 * Adds a playlist to the sidebar
 *********************************************************/
function insertPlaylist(myid, newListItem, id) {
    $('ul#' + myid).append('<li><a href="#'+id+'" onClick="loadPlaylist('+id+')">'+newListItem+'</a></li>');
}
