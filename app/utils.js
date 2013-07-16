/********************************************************
 * Variables
 *********************************************************/
var mopidy;

var playlists = {};
var currentPlaylist;
var play = true;

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
    
    //Set the number of queued elements to 0
    showNrOfQueued(0);

     //Initialize volume control
    volumeControl();

    //Set the volume to 100 (TODO: make the volume be 100 by default)
    mopidy.on("state:online", setVolume);

    mopidy.on("state:tracklist_changed", tracklist_changed);
}

function tracklist_changed () {
    console.log(new_state);

    mopidy.tracklist.getCurrentTrack()
    .then(printNowPlaying, consoleError);
}

//¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤

/**********************************************************
 * Get playlists from Mopidy with tracks and put on UI
 *********************************************************/
function fetchFromMopidy() {
    var consoleError = console.error.bind(console);

    //Get all the playlists
    mopidy.playlists.getPlaylists()
    .then(processGetPlaylists, consoleError)
    .then(countTotalNrOfTracks, consoleError);

    //Get the current tracklist
    mopidy.tracklist.getTlTracks()
    .then(getCurrentTracklist, consoleError);
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
}

function getCurrentTracklist(currentTrackList){
    console.log("getCurrentTracklist:");

    currentPlaylist = currentTrackList;

    putTracksOnTrackList2(currentTrackList);
}

function getFirstTrack(tracklist){
    return tracklist.tracks[0];
}

//TODO: temporary function for adding current tracklist to UI
function putTracksOnTrackList2(tracks){
    console.log("putTracksOnTrackList2: " + tracks.length);

    clearRows();

    var items = tracks.length;

    if(items > 200){ items = 200}

    for(var i = 0; i<items; i++){

        //TODO: issues with calling method from here
        addRow( tracks[i].track.name, 
                tracks[i].track.album.artists[0].name,
                secondsToString(tracks[i].track.length),
                tracks[i].album.track.name);
    }

    showNrOfTracklisted(tracks.length);
}

/*********************************************************
* Put the tracks from the playlist on the UI
*********************************************************/
function putTracksOnTrackList(id) {
    var playlist = playlists[id];

    console.log("putTracksOnTrackList: " + playlist.name + " on id: " + id);

    tracks = getTracks(playlist);

    clearRows();

    clearAndAddNewTrackList(tracks);

    for(var i = 0; i<tracks.length; i++){
        addRow( tracks[i].name, 
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
    console.log("Now playing:", trackDesc(track));
};

function trackDesc(track) {
    return track.name + " by " + track.artists[0].name +
        " from " + track.album.name;
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
    mopidy.playback.setVolume(100);
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
    if (!document.getElementsByTagName) return;

    tabBody=document.getElementsByTagName("TBODY").item(0);
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

    //tabBody.rows[0].onclick=function(){alert('event added');};

    tabBody.appendChild(newRow);
}

/********************************************************
 * Volume control
 *********************************************************/
function volumeControl(){
    $(function($) {

        $(".knob").knob({
            change : function (value) {
                //console.log("change : " + value);
            },
            release : function (value) {
                //console.log(this.$.attr('value'));
                console.log("release : " + value);
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
            }
            else {
                mopidy.playback.pause();
                console.log("CONTROL: Pause");
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
        conosle.log("CONTROL: Previous");
        
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
