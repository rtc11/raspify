var mopidyConsole = false;
var self = this;
var mopidy;
var consoleError;
var currentState = "stopped";

var currentTrack;

/** Initialize with jQuery */
$(document).ready(function() {
    mopidy = new Mopidy();

    self.mopidy.on("state:online", fetchFromMopidy);
    self.mopidy.on("event:trackPlaybackStarted", trackplaybackstarted);
    //self.mopidy.on("event:trackPlaybackPaused", trackplaybackpaused);
    //self.mopidy.on("event:volumeChanged", volumeChanged);

    //Log all events from mopidy
    if(mopidyConsole){
        mopidy.on(console.log.bind(console));
    }
});

/** Fetch data from Mopidy */
function fetchFromMopidy() {
    consoleError = console.error.bind(console);

    // get playlists
    mopidy.playlists.getPlaylists()
    .then(processGetPlaylists, consoleError);

    $("#play_pause").addClass('paused playing');

    // get current track if there is one
    mopidy.playback.getCurrentTrack()
    .then(processCurrentTrack, consoleError);

    // get play state
    mopidy.playback.getState()
    .then(processPlayState, consoleError);
}

/** Get playlists from Mopidy */
function processGetPlaylists(playlists){
    if ((!playlists) || (playlists == '')) {return;}
    for (var i = 0; i < playlists.length; i++) {

        var playlist = playlists[i];
        var duration = 0;

        for(var j = 0; j<playlist.tracks.length; j++){
            duration += playlist.tracks[j].length;
        }

        playlist.duration = msToTime(duration);                             //utils.js
        addPlaylist(playlists[i]);                                          //playlists.js
    };
}

/* Get the play state */
function processPlayState(state){
    currentState = state;
    console.log(currentState);
    if(state == "playing"){
        playing();                                                          //controls.js
        setTotalTime(currentTrack.length);                                  //seekbar.js
        startSeekbarTimer();                                                //controls.js
    }
    if(state == "paused"){
        pausing();                                                          //controls.js
        setTotalTime(currentTrack.length);                                  //seekbar.js
        getTimePosition();
    }
    if(state == "stopped"){
        stopped();                                                          //controls.js
    }
}

/* Get the time position on the playing track */
function getTimePosition() {
    mopidy.playback.getTimePosition()
    .then(processCurrentTimePosition, consoleError);
}

/* Update the current time position for seekbar and the text field */
function processCurrentTimePosition(ms){
    setPosition(ms);                                                        //seekbar.js
    $("#currentTime").text(msToTime(ms));                                   //utils.js
}

function processCurrentTrack(track) {
    if (track) {
        currentTrack = track;

        getCover(track, "#img_album_art", "src", "large");                  //lastfm.js
//        getCover(track, '.div_tables', 'background', 'mega');                //lastfm.js

    } else {
        // no current track
    }
};

/** EVENT: mopidy sends event on track changed **/
function trackplaybackstarted(){
    printNowPlaying();
}

function printNowPlaying(){
    mopidy.playback.getCurrentTrack()
    .then(processNowPlaying, consoleError);
}

function processNowPlaying(track){
    var nowPlaying = track.name + " - " + track.artists[0].name;

    getCover(track, "#img_album_art", "src", "large");                      //lastfm.js
//    getCover(track, '.div_tables', 'background', 'mega');                   //lastfm.js

    console.log(nowPlaying);
}