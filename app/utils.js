
/********************************************************
 * Variables
 *********************************************************/
var mopidy;
var seekbar;
var playlists = {};
var currentPlaylist;
var play = false;
var log = false;
var shuffle = 0;
var repeat = 0;
var currentTrackPositionTime = 0;
var currentTrackMaxTime = 0;
var self = this;

/********************************************************
 * Auto run method
 *********************************************************/
$(document).ready(function() {
    initialize();
});

/********************************************************
 * Initialize
 *********************************************************/
function initialize(){
    //Connect to the mopidy server
    mopidy = new Mopidy();

    //Create the seekbar
    seekbar = new Seekbar();

    //Fetch playlists and tracks from mopidy
    mopidy.on("state:online", fetchFromMopidy);

    //Eventlistener on track changed and starting to play
    mopidy.on("event:trackPlaybackStarted", trackplaybackstarted);

    mopidy.on("event:trackPlaybackPaused", trackplaybackpaused);

    //Listen to event: 'volumeChanged'
    mopidy.on("event:volumeChanged", volumeChanged);
    
    //Initialize volume control
    volumeControl();

    //Initialize the volume control
    imageShow();

    //Log all events from mopidy
    //mopidy.on(console.log.bind(console));
}

/********************************************************
 * Image Flow initialization
 *********************************************************/
function imageShow(){
    domReady(function(){
        var basic_2 = new ImageFlow();
        basic_2.init({ ImageFlowID: 'unique_name', 
                   reflections: false, 
                   reflectionP: 0.0 });
    });
}

/**********************************************************
 * Event: When playback state is pausing, 
 * update the seekbar position (might be some millies wrong)
 *********************************************************/
function trackplaybackpaused(){
    mopidy.playback.getTimePosition()
    .then(seekbar.setCurrentPos, console.error.bind(console));
}

/**********************************************************
 * Event: When playback starts playing a song, show songdata to user
 *********************************************************/
function trackplaybackstarted () {
    mopidy.playback.getCurrentTrack()
    .then(printNowPlaying, console.error.bind(console));

    //When a song changes, it starts on time 0
    currentTrackPositionTime = 0;
    console.log("% Current time: " + currentTrackPositionTime);
}

/**********************************************************
 * Get playlists from Mopidy with tracks and put on UI
 *********************************************************/
function fetchFromMopidy() {
    var consoleError = console.error.bind(console);

    //Get all the playlists
    mopidy.playlists.getPlaylists()
    .then(processGetPlaylists, consoleError);

    //Get the current tracklist
    mopidy.tracklist.getTlTracks()
    .then(setCurrentTracklist, consoleError);

    //Get current playing track
    mopidy.playback.getCurrentTrack()
    .then(processCurrentTrack, consoleError);

    //Get time position to current track
    mopidy.playback.getTimePosition()
    .then(processCurrentTimePosition, consoleError);

    //Get play state: paused, playing, stopped
    mopidy.playback.getState()
    .then(processPlayState, consoleError);

    //Get current volume from mopidy
    mopidy.playback.getVolume()
    .then(processVolume, consoleError);

    //Get status if repeat mode is on/off
    mopidy.playback.getRepeat()
    .then(processRepeat, consoleError);

    //Get status if shuffle is on/off
    mopidy.playback.getRandom()
    .then(processRandom, consoleError);

}

function processRepeat(state){
    console.log("processRepeat: " + state);
    changeRepeatButton(state);
    this.repeat = state;
}
function processRandom(state){
    console.log("processRandom: " + state);
    changeShuffleButton(state);
    this.shuffle = state
}
function processCurrentTrack(track){
    printNowPlaying(track);
}
function processCurrentTimePosition(data){
    var pos = secondsToString(data);
    var posInt = parseInt(data);

    //First time when we fetch from mopidy
    currentTrackPositionTime = posInt;
    console.log("# Current time: " + currentTrackPositionTime);
}
function processPlayState(state){
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
    console.log("current volume: " + volume);
    $('.knob')
    .val(volume)
    .trigger('change');
}
function processGetPlaylists(playlists){
    if ((!playlists) || (playlists == '')) {return;}
    for (var i = 0; i < playlists.length; i++) {
         insertPlaylist("error-menu", playlists[i].name, i);
    };

    setPlaylists(playlists);
    showNrOfPlaylists(playlists.length);
    countTotalNrOfTracks(playlists);
}

/*********************************************************
 * Add current tracklist to queue
 *********************************************************/
function setCurrentTracklist(tracks){
    var nrOfItems = tracks.length;
    showNrOfTracklisted(tracks.length);

    var queueAdder = new addRow();
    for(var j = 0; j<10; j++){
        queueAdder.add(
            tracks[j].track.name,
            tracks[j].track.album.artists[0].name,
            secondsToString(tracks[j].track.length),
            tracks[j].track.album.name);
    }
}

/*********************************************************
* Put the tracks from the playlists on the UI
* - id: the position in the local variable 'playlists'
*       to the desired playlist
*********************************************************/
function putTracksOnTrackList(id) {
    var playlist = playlists[id];

    console.log("putTracksOnTrackList: " + playlist.name + " on id: " + id);

    tracks = getTracks(playlist);
    clearRows();
    clearAndAddNewTrackList(tracks);
    showNrOfTracklisted(tracks.length);
    changePlayButton("pause");
    play = true;

    var addr = new addRow();
    for(var i = 0; i<tracks.length; i++){
        addr.add(tracks[i].name, 
            tracks[i].album.artists[0].name, 
            secondsToString(tracks[i].length), 
            tracks[i].album.name);
    }
}

/*********************************************************
* Clears the tracklist and star playing the input tracks
*********************************************************/
function clearAndAddNewTrackList(tracks){
    mopidy.playback.stop(true);
    mopidy.tracklist.clear();
    mopidy.tracklist.add(tracks);
    mopidy.playback.play();
    currentPlaylist = tracks;
}

/*********************************************************
* Print out now playing track
*********************************************************/
function printNowPlaying(track) {
    var nowPlaying = trackDesc(track);

    if(play){
        console.log("Now playing:", nowPlaying);
        $('h1#nowPlaying').text(nowPlaying);
    }
    else{
        console.log("Now pausing:", nowPlaying);
        $('h1#nowPlaying').text(nowPlaying);
    }

    currentTrackMaxTime = track.length;
    console.log("% Max time: " + currentTrackMaxTime);
    this.seekbar.initialize(currentTrackMaxTime, currentTrackPositionTime);
};

function trackDesc(track) {
    return track.name + " - " + track.artists[0].name;
};

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

/********************************************************
 * Set the volume on the mopidy server
 *********************************************************/
function volumeChanged(){
    mopidy.playback.getVolume()
    .then(function(volume){
        console.log("volumeChanged: " + volume), 
        console.error.bind(console)
    });
}

/********************************************************
 * Set the current playlist
 *********************************************************/
function setPlaylists(li){
    playlists = li;
}

/********************************************************
 * Clears the rows in the tracklist
 *********************************************************/
function clearRows(){
    console.log("clearRows: clearing the queue");
    document.getElementById("tbody").innerHTML = "";
}

/********************************************************
 * Add row to tracklist object
 *********************************************************/
function addRow(){

    //Function for adding a row to tracklist
    this.add = function(track, artist, time, album){

        //Find the tbody in the right table
        tabBody=document.getElementById("tbody");

        //Create a new row element
        newRow=document.createElement("TR");
             
        //Create a cell (column) for 'track', 'artist', 'time' and 'album'
        cell1 = document.createElement("TD");
        cell2 = document.createElement("TD");
        cell3 = document.createElement("TD");
        cell4 = document.createElement("TD");

        //Create text nodes and put them to variables
        trackVar=document.createTextNode(track);
        artistVar=document.createTextNode(artist);
        timeVar=document.createTextNode(time);
        albumVar=document.createTextNode(album);

        //Add the text nodes to the cells
        cell1.appendChild(trackVar);
        cell2.appendChild(artistVar);
        cell3.appendChild(timeVar);
        cell4.appendChild(albumVar);

        //Add the cells to the row element
        newRow.appendChild(cell1);
        newRow.appendChild(cell2);
        newRow.appendChild(cell3);
        newRow.appendChild(cell4);

        //Add the row to the table
        tabBody.appendChild(newRow);
    }
}

/********************************************************
 * Volume control
 *********************************************************/
function volumeControl(){
    $(function($) {

        $(".knob").knob({
            change : function (value) {
                //Change colum on scroll
                mopidy.playback.setVolume(value);
            },
            release : function (value) {
                //Change volum on drag (mouse click)
                mopidy.playback.setVolume(value);
            },
            cancel : function () {
                console.log("cancel : ", this);
            },
            draw : function () {

                // "tron" case
                if(this.$.data('skin') == 'tron') {

                    var a = this.angle(this.cv)  // Angle
                        , sa = this.startAngle          // Previous start angle
                        , sat = this.startAngle         // Start angle
                        , ea                            // Previous end angle
                        , eat = sat + a                 // End angle
                        , r = 1;

                    this.g.lineWidth = this.lineWidth;

                    this.o.cursor
                        && (sat = eat - 0.3)
                        && (eat = eat + 0.3);

                    if (this.o.displayPrevious) {
                        ea = this.startAngle + this.angle(this.v);
                        this.o.cursor
                            && (sa = ea - 0.3)
                            && (ea = ea + 0.3);
                        this.g.beginPath();
                        this.g.strokeStyle = this.pColor;
                        this.g.arc(this.xy, this.xy, this.radius - this.lineWidth, sa, ea, false);
                        this.g.stroke();
                    }

                    this.g.beginPath();
                    this.g.strokeStyle = r ? this.o.fgColor : this.fgColor ;
                    this.g.arc(this.xy, this.xy, this.radius - this.lineWidth, sat, eat, false);
                    this.g.stroke();

                    this.g.lineWidth = 2;
                    this.g.beginPath();
                    this.g.strokeStyle = this.o.fgColor;
                    this.g.arc( this.xy, this.xy, this.radius - this.lineWidth + 1 + this.lineWidth * 2 / 3, 0, 2 * Math.PI, false);
                    this.g.stroke();

                    return false;
                }
            }
        });

        // Example of infinite knob, iPod click wheel
        var v, up=0,down=0,i=0
            ,$idir = $("div.idir")
            ,$ival = $("div.ival")
            ,incr = function() { i++; $idir.show().html("+").fadeOut(); $ival.html(i); }
            ,decr = function() { i--; $idir.show().html("-").fadeOut(); $ival.html(i); };
        $("input.infinite").knob({
            min : 0, max : 20, stopper : false, change : function () {
            
                if(v > this.cv){
                    if(up){
                        decr();
                        up=0;
                    }
                    else{
                        up=1;down=0;
                    }
                } 
                else {
                    if(v < this.cv){
                        if(down){
                            incr();
                            down=0;
                        }
                        else{
                            down=1;up=0;
                        }
                    }
                }
                v = this.cv;
            }
        });
    });
}

/********************************************************
 * CONTROLS
 *********************************************************/
function control(){
        
    var mopidy = new Mopidy();

    this.play = function(){
        mopidy.on("state:online", function () {
            if (!play) {
                mopidy.playback.play();
                console.log("CONTROL: Play");
                changePlayButton("pause");
            }
            else {
                mopidy.playback.pause();
                console.log("CONTROL: Pause");
                changePlayButton("play");
            }
            play = !play;
        });
    }
    this.next = function(){
        console.log("CONTROL: Next");
        
        mopidy.on("state:online", function () {
            mopidy.playback.next();
        });
    }
    this.previous = function(){
        console.log("CONTROL: Previous");
        
        mopidy.on("state:online", function () {
            mopidy.playback.previous();
        });
    }
    this.shuffle = function(){
        console.log("CONTROL: Shuffle");

        mopidy.on("state:online", function() {
            shuffle = !shuffle;
            changeShuffleButton(shuffle);

            if(shuffle){
                mopidy.playback.setRandom(1);
            }
            else{
                mopidy.playback.setRandom(0);
            }

        });
    }
    this.repeat = function(){
        console.log("CONTROL: Repeat");

        mopidy.on("state:online", function() {
            repeat = !repeat;
            changeRepeatButton(repeat);
            if(repeat){
                mopidy.playback.setRepeat(1);
            }
            else{
                mopidy.playback.setRepeat(0);
            }
        });
    }
}

 function secondsToString(millis) {
    var minutes = Math.floor( ( millis % (1000*60*60) ) / (1000*60));
    var seconds = Math.floor( ( millis % (1000*60*60) ) % (1000*60) ) / 1000;

    if(seconds < 10){
        return minutes + ":" + "0" + seconds;
    }
    return minutes + ":" + seconds;
}
