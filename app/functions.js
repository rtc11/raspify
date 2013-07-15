/*********************************************************
 * Shows the number of playlists
 *********************************************************/
function showNrOfPlaylists(nr){
    console.error("showNrOfTracklisted: " + nr);

    $('p#nrOfPlaylists').text(nr);
}
/*********************************************************
 * Shows the number of tracks
 *********************************************************/
function showNrOfTracks(nr){
    console.error("showNrOfTracks: " + nr);

    $('p#nrOfTracks').text(nr);
}
/*********************************************************
 * Shows the number of queued tracks
 *********************************************************/
function showNrOfQueued(nr){
    console.error("showNrOfQueued: " + nr);

    $('span#nrOfQueued').text(nr);
}
/*********************************************************
 * Shows the number of tracks in track list
 *********************************************************/
function showNrOfTracklisted(nr){
    console.error("showNrOfTracklisted: " + nr);

    $('span#nrOfTracklisted').text(nr);
}

/*********************************************************
 * Adds a playlist to the sidebar
 *********************************************************/
function insertPlaylist(myid, playlist_name, playlist) {
    console.error("Inserted playlist: " + playlist_name);

    $('ul#' + myid).append('<li><a href="#'+playlist_name+'" onClick="putTracksOnTrackList('+playlist+')">'+playlist_name+'</a></li>');
}