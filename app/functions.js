//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
/*********************************************************
 * Shows the number of playlists
 *********************************************************/
function showNrOfPlaylists(nr){
    $('p#nrOfPlaylists').text(nr);
}
/*********************************************************
 * Shows the number of tracks
 *********************************************************/
function showNrOfTracks(nr){
    $('p#nrOfTracks').text(nr);
}
/*********************************************************
 * Shows the number of queued tracks
 *********************************************************/
function showNrOfQueued(nr){
    $('span#nrOfQueued').text(nr);
}
/*********************************************************
 * Shows the number of tracks in track list
 *********************************************************/
function showNrOfTracklisted(nr){
    $('span#nrOfTracklisted').text(nr);
}
//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

/**********************************************************
 * Get playlists from Mopidy with tracks and put on UI
 *********************************************************/
function fetchFromMopidy() {
    var consoleError = console.error.bind(console);

    mopidy.playlists.getPlaylists()
    .then(processGetPlaylists, consoleError)
    .then(countTotalNrOfTracks, consoleError);
}

/*********************************************************
 * Put the playlists on the UI
 *********************************************************/
function processGetPlaylists(playlists){
    if ((!playlists) || (playlists == '')) {return;}
    for (var i = 0; i < playlists.length; i++) {
         insertPlaylist("error-menu", playlists[i].name, playlists[i]);
    };

    setPlaylists(playlists);
    showNrOfPlaylists(list.length);
}

/*********************************************************
 * Adds a playlist to the sidebar
 *********************************************************/
function insertPlaylist(myid, playlist_name, playlist) {
    $('ul#' + myid).append('<li><a href="#'+playlist_name+'" onClick="putTracksOnTrackList('+playlist+')">'+playlist_name+'</a></li>');
}

/*********************************************************
 * Put the tracks from the playlist on the UI
 *********************************************************/
function putTracksOnTrackList(playlist) {
    tracks = getTracks(playlist);

    clearRows();

    for(var i = 0; i<tracks.length; i++){
        addRow( tracks[i].track.name, 
                tracks[i].track.album.artists[0].name,
                secondsToString(tracks[i].track.length),
                tracks[i].track.album.name);
    }
    showNrOfTracklisted(tracks.length);
}

/*********************************************************
 * Get the tracks from a playlist
 *********************************************************/
function getTracks(playlist){
    return playlist.tracks;
}

/*********************************************************
 * Counts the total number of tracks
 *********************************************************/
function countTotalNrOfTracks(playlists){
    var nrOfTracks = 0;
    for(var i = 0; i<playlists.length; i++){
        var list = getTracks(playlists[i]);
        var size = list.length;
        nrOfTracks += size;
    }
    //Put the number of tracks found on the GUI
    showNrOfTracks(nrOfTracks);
}