
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
var print = new Print();

var logOn = true;

//Generates JSON content and prints to console
var generateJSON = false; 

//If this is true, the console will log events from mopidy server      
var mopidyConsole = false;

/********************************************************
 * Initialize
 *********************************************************/
$(document).ready(function() {
    //Connect to the mopidy server
    mopidy = new Mopidy();
    //Create the seekbar
    seekbar = new Seekbar();

    //Fetch playlists and tracks from mopidy
    mopidy.on("state:online", fetchFromMopidy);
    //Eventlistener on track changed and starting to play
    mopidy.on("event:trackPlaybackStarted", trackplaybackstarted);
    //Eventlistener on track paused
    mopidy.on("event:trackPlaybackPaused", trackplaybackpaused);
    //Listen to event: 'volumeChanged'
    mopidy.on("event:volumeChanged", volumeChanged);
    
    //Initialize jquery.knob.js
    volumeControl();
    //Initialize imageflow.js
    imageShow();

    //Log all events from mopidy
    if(mopidyConsole){mopidy.on(console.log.bind(console));}
});

   
/********************************************************
 * Typeahead.js initialization
 *********************************************************/
function processTypeaheadContent(){
    $('.example-twitter-oss .typeahead').typeahead({                              
      name: 'twitter-oss',                                                        
      prefetch: 'app/typeaheadcontent.json',                                             
      template: [
        '<p class="lul">{{uri}}</p>',
        '<p class="type>{{type}}</p>',                              
        '<p class="name">{{name}}</p>',                                   
        '<p class="description">{{description}}</p>'
      ].join(''),
      limit: 7,
      engine: Hogan
    });

    //TODO: 
    $('.example-twitter-oss .typeahead').on("typeahead:selected", test);
}

//TODO:
function test(object, datum){
    print.d(toObjectSource(datum));
}

/********************************************************
 * ImageFlow.js initialization
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
    print.d("% Current time: " + currentTrackPositionTime);
}

/**********************************************************
 * Get playlists from Mopidy with tracks and put on UI
 *********************************************************/
function fetchFromMopidy() {
    var consoleError = console.error.bind(console);

    //Get all the playlists
    mopidy.playlists.getPlaylists()
    .then(processGetPlaylists, consoleError);

    //Get current playing track
    mopidy.playback.getCurrentTrack()
    .then(processCurrentTrack, consoleError);

    //Get play state: paused, playing, stopped
    mopidy.playback.getState()
    .then(processPlayState, consoleError);

    //Get the current tracklist
    mopidy.tracklist.getTlTracks()
    .then(setCurrentTracklist, consoleError);


    //Get time position to current track
    mopidy.playback.getTimePosition()
    .then(processCurrentTimePosition, consoleError);

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
}
function processCurrentTrack(track){
    printNowPlaying(track);
}
function processCurrentTimePosition(data){
    var pos = secondsToString(data);
    var posInt = parseInt(data);

    //First time when we fetch from mopidy
    currentTrackPositionTime = posInt;
    print.d("# Current time: " + currentTrackPositionTime);
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

//Called from printNowPlaying
function processGetRowPosition(){
    mopidy.playback.getTracklistPosition()
    .then(paintRow, console.error.bind(console));
}

/*********************************************************
* Put the tracks from the playlists on the UI
* - id: the position in the local variable 'playlists'
*       to the desired playlist
*********************************************************/
function putTracksOnTrackList(id) {

    var playlist;

    //Check if id is a list/array
    if(isNaN(id)){
        playlist = id;
        tracks = playlist;
    }
    else{
        playlist = playlists[id];
        tracks = getTracks(playlist);
    }

    
    clearAndAddNewTrackList(tracks);
    showNrOfTracklisted(tracks.length);
    changePlayButton("pause");
    play = true;

    var addr = new addRow();
    for(var i = 0; i<tracks.length; i++){
        addr.add(tracks[i].name, 
            tracks[i].album.artists[0].name, 
            secondsToString(tracks[i].length), 
            tracks[i].album.name,
            tracks[i],
            (i+1));
    }
}

/*********************************************************
* Clears the tracklist and star playing the input tracks
*********************************************************/
function clearAndAddNewTrackList(tracks){

    //Empty the tracklist on the UI 
    clearRows();
    mopidy.playback.stop(true);
    mopidy.tracklist.clear();

    //Add tracks to mopidy tracklist
    mopidy.tracklist.add(tracks);
    mopidy.playback.play();
    play = true;
    
    //Update current playlist to the new tracks
    currentPlaylist = tracks;
}

/*********************************************************
* Print out now playing track
*********************************************************/
function printNowPlaying(track) {
    var nowPlaying = trackDesc(track);

    if(play){
        print.d("Now playing:" + nowPlaying);
        $('h1#nowPlaying').text(nowPlaying);
    }
    else{
        print.d("Now pausing:", nowPlaying);
        $('h1#nowPlaying').text(nowPlaying);
    }

    currentTrackMaxTime = track.length;
    print.d("% Max time: " + currentTrackMaxTime);
    this.seekbar.initialize(currentTrackMaxTime, currentTrackPositionTime);
    processGetRowPosition();
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

    var template = new typeaheadTemplate();

    for(var i = 0; i<playlists.length; i++){
        var list = getTracks(playlists[i]);

        if(generateJSON){
            template.addPlaylist(playlists[i]);
            template.addTracks(list);
        }
       
        var size = list.length;
        nrOfTracks += size;
    }

    if(generateJSON){
        var content = template.getTemplate();
        console.log(JSON.stringify(content, null, "\t"));
    }

    //Run the typeahead code
    processTypeaheadContent();

    //Put the number of tracks found on the GUI
    showNrOfTracks(nrOfTracks);
}

/*********************************************************
 * Generate JSON string used for typeahead
 *********************************************************/
function typeaheadTemplate(){

    var content = [];
    var self = this;

    this.addPlaylist = function(playlist){
        var name = playlist.name;
        var description = (playlist.tracks.length).toString();
        var type = "Playlist";
        var value = playlist.name;
        var token2 = playlist.tracks.length;
        self.add(name, description, type, playlist.uri);
    }

    this.addTracks = function(tracks){
        for(var i = 0; i<tracks.length; i++){
            var name = tracks[i].name;
            var description = tracks[i].album.artists[0].name;
            var type = "Track";
            var value = tracks[i].name;
            self.add(name, description, type, tracks[i].uri);
        }
    }

    this.getTemplate = function(){
        return content;
    }

    this.add = function(name, description, type, uri){
        content.push({name: name, type: type, description: description, tokens: [name, type, description], uri: uri});
    }
}

/********************************************************
 * Event from mopidy when volume changes
 *********************************************************/
function volumeChanged(){
    mopidy.playback.getVolume()
    .then(function(volume){
        print.d("volumeChangedEvent: " + volume), 
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
    print.d("clearRows: clearing the queue");
    document.getElementById("tbody").innerHTML = "";
}



function paintRow(pos){

    print.d("Current position: " + pos);

    tbody = document.getElementById("tbody");
    row = tbody.rows[pos];

    row.style.backgroundColor = "#66EE66";

    tbody.rows[pos - 1].style.backgroundColor = "#FFFFFF";
}

/********************************************************
 * Add row to tracklist object
 *********************************************************/
function addRow(){

    //Function for adding a row to tracklist
    this.add = function(track, artist, time, album, tltrack, id){
        //var uri = tltrack.uri;

        //Find the table body
        tabBody=document.getElementById("tbody");

        //Insert row
        newRow =  insertRow(track, artist, time, album);

        //Add click listener
        newRow.onclick = (function(){
                var playlist = [];
                playlist.push(tltrack);
                putTracksOnTrackList(playlist);
        });

        //Paint the row
        /*
        if(current){
            newRow.style.backgroundColor = "#66EE66";
        }
        else{
            newRow.style.backgrounColor = "#000000";
        }
        */

        //Add the row to the table body
        tabBody.appendChild(newRow);
    }

    var insertRow = function(track, artist, time, album){

        newRow=document.createElement("TR");
             
        cell1 = document.createElement("TD");
        cell2 = document.createElement("TD");
        cell3 = document.createElement("TD");
        cell4 = document.createElement("TD");

        trackVar=document.createTextNode(track);
        artistVar=document.createTextNode(artist);
        timeVar=document.createTextNode(time);
        albumVar=document.createTextNode(album);

        cell1.appendChild(trackVar);
        cell2.appendChild(artistVar);
        cell3.appendChild(timeVar);
        cell4.appendChild(albumVar);

        newRow.appendChild(cell1);
        newRow.appendChild(cell2);
        newRow.appendChild(cell3);
        newRow.appendChild(cell4);

        return newRow;
    }
}

/********************************************************
 * Convert milliseconds to human readable form (03:24)
 *********************************************************/
function secondsToString(millis) {
    var minutes = Math.floor( ( millis % (1000*60*60) ) / (1000*60));
    var seconds = Math.floor( ( millis % (1000*60*60) ) % (1000*60) ) / 1000;

    if(seconds < 10){
        return minutes + ":" + "0" + seconds;
    }
    return minutes + ":" + seconds;
}

var toObjectSource = function(obj)   {
     if(obj === null)   {
        return "[null]";
     }
     if(obj === undefined) {
        return "[undefined]";
     }

     var str = "[";
     var member = null;
     for(var each in obj)   {
        try   {
           member = obj[each];
           str += each + "=" + member + ", ";
        }catch(err) {
           alert(err);
        }
     }
     return str + "]";
  }

function printplaylist(){
    var current = "";

    mopidy.playback.getCurrentTlTrack().then(function(track){
        current = track.track.name;
    });

    mopidy.tracklist.getTlTracks().then(function(tracks){
        for(var i = 0; i < tracks.length; i++){
            if(current == tracks[i].track.name){
                console.log("--> " + tracks[i].track.name + " <--");
            }
            else{
                console.log(tracks[i].track.name);
            }
        }
        
    });
}

function Print(){
    this.d = function(text){
        if(logOn){
            console.log(text);
        }
    }
    
}

