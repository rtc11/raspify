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

        var playlist = playlists[i];

        var duration = 0;

        for(var j = 0; j<playlist.tracks.length; j++){
            duration += playlist.tracks[j].length;
        }

        playlist.duration = msToTime(duration);
        addPlaylist(playlists[i]);
    };
}

function msToTime(s) {
  var ms = s % 1000;
  s = (s - ms) / 1000;
  var secs = s % 60;
  s = (s - secs) / 60;
  var mins = s % 60;
  var hrs = (s - mins) / 60;

  if(hrs > 0){
    return hrs + 'h ' + mins + 'm ' + secs + 's';
  }

  return mins + 'm ' + secs + 's';

}