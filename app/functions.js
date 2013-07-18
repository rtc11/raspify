/*********************************************************
 * Shows the number of playlists
 *********************************************************/
function showNrOfPlaylists(nr){
    console.log("showNrOfPlaylists: " + nr);

    $('p#nrOfPlaylists').text(nr);
}

/*********************************************************
 * Shows the number of tracks
 *********************************************************/
function showNrOfTracks(nr){
    console.log("showNrOfTracks: ...calculated: " + nr);

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
function insertPlaylist(myid, playlist_name, id) {
    $('ul#' + myid).append('<li><a href="#'+playlist_name+'" onClick="putTracksOnTrackList('+id+')">'+playlist_name+'</a></li>');
}

/*********************************************************
 * Changes the play-button state and image
 *********************************************************/
function changePlayButton(state){
    var src = "";

    if(state == "pause"){
        src = "img/player-pause.png";
    }
    if(state == "play"){
        src = "img/player-play.png";
    }

    document.getElementById('playPauseButton').setAttribute('src', src);
}