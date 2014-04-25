/********************************************************
* Editable variables
*********************************************************/
//Console will log events from mopidy server      
var mopidyConsole = false;

/********************************************************
 * Variables
 *********************************************************/
var self = this;
//Mopidy server
var mopidy;
//Object for print funtions
var print = new Print();

/********************************************************
 * Initialize with jQuery
 *********************************************************/
(function init() {
    //Connect to the mopidy server
    mopidy = new Mopidy();

    //Listen on mopidy events
    self.mopidy.on("state:online", fetchFromMopidy);
    //mopidy.on("event:trackPlaybackStarted", trackplaybackstarted);
    //mopidy.on("event:trackPlaybackPaused", trackplaybackpaused);
    //mopidy.on("event:volumeChanged", volumeChanged);

    //Log all events from mopidy
    if(mopidyConsole){mopidy.on(console.log.bind(console));}
})();

/**********************************************************
 * Event: When playback state is pausing, 
 * update the seekbar position (might be some millies wrong)
 *********************************************************/
function trackplaybackpaused(){
    mopidy.playback.getTimePosition()
    .then(seekbar.setCurrentPos, console.error.bind(console));
}

/**********************************************************
 * Get playlists from Mopidy with tracks and put on UI
 *********************************************************/
function fetchFromMopidy() {
    var consoleError = console.error.bind(console);

    //Get all the playlists
    mopidy.playlists.getPlaylists()
    .then(processGetPlaylists, consoleError);
}

function processGetPlaylists(playlists){
    if ((!playlists) || (playlists == '')) {return;}
    for (var i = 0; i < playlists.length; i++) {
        addPlaylist(playlists[i].name);
         
    };
}

function Print(){
    this.d = function(text){
        if(logOn){
            console.log(text);
        }
    }
    
}