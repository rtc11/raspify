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
