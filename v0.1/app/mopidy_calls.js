function processGetPlaylists(playlists){
    if ((!playlists) || (playlists == '')) {return;}
    for (var i = 0; i < playlists.length; i++) {
         insertPlaylist("error-menu", playlists[i].name, i);
    };
    setPlaylists(playlists);
    showNrOfPlaylists(playlists.length);
    countTotalNrOfTracks(playlists);
}

function setCurrentTracklist(tracks){
    var nrOfItems = tracks.length;
    showNrOfTracklisted(tracks.length);

    var queueAdder = new addRow();
    for(var j = 0; j<tracks.length; j++){

        queueAdder.add(
            tracks[j].track.name,
            tracks[j].track.album.artists[0].name,
            secondsToString(tracks[j].track.length),
            tracks[j].track.album.name,
            tracks[j].track,
            (j+1));
    }

    mopidy.playback.getTracklistPosition()
    .then(paintRow, console.error.bind(console));
}

function processCurrentTrack(track){
    printNowPlaying(track);
}

function processCurrentTimePosition(data){
    var pos = secondsToString(data);
    var posInt = parseInt(data);

    //First time when we fetch from mopidy
    currentTrackPositionTime = posInt;
    //print.d("Current time: " + currentTrackPositionTime);
}

function processPlayState(state){
    print.d("State: " + state);
    if(state == "playing"){
        changePlayButton("pause");
        play = true;
    }
    if(state == "paused"){
        changePlayButton("play");
        play = false;
    }
}

function processVolume(volume){
    print.d("current volume: " + volume);
    $('.knob')
    .val(volume)
    .trigger('change');
}

function processRepeat(state){
    print.d("Repeat: " + state);
    changeRepeatButton(state);
    this.repeat = state;
}

function processRandom(state){
    print.d("Shuffle: " + state);
    changeShuffleButton(state);
    this.shuffle = state
}