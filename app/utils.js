
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
        '<p class="type">{{type}}</p>',                              
        '<p class="name">{{name}}</p>',                                      
        '<p class="description">{{description}}</p>'
      ].join(''),
      limit: 7,
      engine: Hogan
    });
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
    for(var j = 0; j<10; j++){
        queueAdder.add(
            tracks[j].track.name,
            tracks[j].track.album.artists[0].name,
            secondsToString(tracks[j].track.length),
            tracks[j].track.album.name);
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
        console.log(content);
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
        self.add(name, description, type);
    }

    this.addTracks = function(tracks){
        for(var i = 0; i<tracks.length; i++){
            var name = tracks[i].name;
            var description = tracks[i].album.artists[0].name;
            var type = "Track";
            var value = tracks[i].name;
            self.add(name, description, type);
        }
    }

    this.getTemplate = function(){
        return content;
    }

    this.add = function(name, description, type){
        content.push({name: name, type: type, description: description, tokens: [name, type, description]});
    }
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
