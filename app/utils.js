
/********************************************************
 * Variables
 *********************************************************/
var mopidy;

var playlists = {};
var currentPlaylist;
var play = false;
var log = false;

/********************************************************
 * Initialize
 *********************************************************/
$(document).ready(function() {

    //Get the playlists from the mopidy server
    initialize();
});

function initialize(){
     //Connect to the mopidy server
    mopidy = new Mopidy();

    mopidy.on("state:online", fetchFromMopidy);
    
     //Initialize volume control
    volumeControl();

    imageShow();

    //Set the volume to 100 (TODOjlk make the volume be 100 by default)
    //mopidy.on("event:volumeChanged", setVolume);

    //Eventlistener on track changed and starting to play
    mopidy.on("event:trackPlaybackStarted", trackplaybackstarted);

    //Log all events from mopidy
   // mopidy.on(console.log.bind(console));
}

function imageShow(){


    domReady(function(){
        var basic_2 = new ImageFlow();
        basic_2.init({ ImageFlowID: 'unique_name', 
                   reflections: false, 
                   reflectionP: 0.0 });
    });
}

function updateStatusOfAll(){

}

/**********************************************************
 * Event: When playback starts playing a song, show songdata to user
 *********************************************************/
function trackplaybackstarted () {
    mopidy.playback.getCurrentTrack()
    .then(printNowPlaying, console.error.bind(console));
}

//¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤

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
   //mopidy.playback.getRepeat()
    //.then(processRepeat, consoleError);

    //Get status if random mode is on/off
    //mopidy.playback.getRandom()
    //.then(processRandom, consoleError);

}
function processCurrentTrack(track){
    printNowPlaying(track);
}
function processCurrentTimePosition(data){
    var pos = secondsToString(data);
    var posInt = parseInt(data);
    console.log("TODO: processCurrentTimePosition: toString: " + pos + " parseInt: " + posInt);
}
function processPlayState(state){
    console.log("TODO: state: " + state);

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

/*********************************************************
 * Put the playlists on the UI
 *********************************************************/
function processGetPlaylists(playlists){
    //console.log("processGetPlaylists: " + playlists);

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
    console.log("setCurrentTracklist: sample: " + tracks[0].track.name);

    var nrOfItems = tracks.length;
    showNrOfTracklisted(tracks.length);

    for(var j = 0; j<10; j++){
        addRow(tracks[j].name, 
            tracks[j].album.artists[0].name, 
            secondsToString(tracks[j].length), 
            tracks[j].album.name);
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

    for(var i = 0; i<tracks.length; i++){
        addRow(tracks[i].name, 
            tracks[i].album.artists[0].name, 
            secondsToString(tracks[i].length), 
            tracks[i].album.name);
    }

    showNrOfTracklisted(tracks.length);
}

/*********************************************************
* Clears the tracklist and star playing the input tracks
*********************************************************/
function clearAndAddNewTrackList(tracks){
    mopidy.playback.stop(true);
    mopidy.tracklist.clear();
    mopidy.tracklist.add(tracks);
    mopidy.playback.play();
    //printNowPlaying(tracks[0]);
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
    console.log("countTotalNrOfTracks: starting calculating...");

    var nrOfTracks = 0;
    for(var i = 0; i<playlists.length; i++){
        var list = getTracks(playlists[i]);
        var size = list.length;
        nrOfTracks += size;
    }
    //Put the number of tracks found on the GUI
    showNrOfTracks(nrOfTracks);
}


//¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤

/********************************************************
 * Set the volume on the mopidy server
 *********************************************************/
function setVolume(){
	console.log("setVolume(): volume_changed event called");
	
    //mopidy.playback.setVolume(100);
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
    console.log("clearRows: clearing table of content: Queue");
    document.getElementById("tbody").innerHTML = "";
}

/********************************************************
 * Add row to tracklist
 *********************************************************/
function addRow(track, artist, time, album){

    console.log("ADDROW CALLED");
    
    if (!document.getElementsByTagName) return;

    tabBody=document.getElementById("tbody");
    newRow=document.createElement("TR");
         
    cell1 = document.createElement("TD");
    cell2 = document.createElement("TD");
    cell3 = document.createElement("TD");
    cell4 = document.createElement("TD");

    textnode1=document.createTextNode(track);
    textnode2=document.createTextNode(artist);
    textnode3=document.createTextNode(time);
    textnode4=document.createTextNode(album);

    cell1.appendChild(textnode1);
    cell2.appendChild(textnode2);
    cell3.appendChild(textnode3);
    cell4.appendChild(textnode4);

    newRow.appendChild(cell1);
    newRow.appendChild(cell2);
    newRow.appendChild(cell3);
    newRow.appendChild(cell4);

    tabBody.appendChild(newRow);
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
}

 function secondsToString(millis) {
    var minutes = Math.floor( ( millis % (1000*60*60) ) / (1000*60));
    var seconds = Math.floor( ( millis % (1000*60*60) ) % (1000*60) ) / 1000;

    if(seconds < 10){
        return minutes + ":" + "0" + seconds;
    }
    return minutes + ":" + seconds;
}
