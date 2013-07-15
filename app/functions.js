/*********************************************************
 * Shows the number of playlists
 *********************************************************/
function showNrOfPlaylists(nr){
    console.log("showNrOfTracklisted: " + nr);

    $('p#nrOfPlaylists').text(nr);
}
/*********************************************************
 * Shows the number of tracks
 *********************************************************/
function showNrOfTracks(nr){
    console.log("showNrOfTracks: " + nr);

    $('p#nrOfTracks').text(nr);
}
/*********************************************************
 * Shows the number of queued tracks
 *********************************************************/
function showNrOfQueued(nr){
    console.log("showNrOfQueued: " + nr);

    $('span#nrOfQueued').text(nr);
}
/*********************************************************
 * Shows the number of tracks in track list
 *********************************************************/
function showNrOfTracklisted(nr){
    console.log("showNrOfTracklisted: " + nr);

    $('span#nrOfTracklisted').text(nr);
}

/*********************************************************
 * Adds a playlist to the sidebar
 *********************************************************/
function insertPlaylist(myid, playlist_name, playlist) {
    console.log("Inserted playlist: " + playlist_name);

    $('ul#' + myid).append('<li><a href="#'+playlist_name+'" onClick="putTracksOnTrackList('+playlist+')">'+playlist_name+'</a></li>');
}