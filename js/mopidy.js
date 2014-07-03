var mopidyConsole = false;
var self = this;
var mopidy;

/** Initialize with jQuery */
(function init() {
    mopidy = new Mopidy();

    self.mopidy.on("state:online", fetchFromMopidy);
    //self.mopidy.on("event:trackPlaybackStarted", trackplaybackstarted);
    //self.mopidy.on("event:trackPlaybackPaused", trackplaybackpaused);
    //self.mopidy.on("event:volumeChanged", volumeChanged);

    //Log all events from mopidy
    if(mopidyConsole){
        mopidy.on(console.log.bind(console));
    }
})();

/** Fetch data from Mopidy */
function fetchFromMopidy() {
    var consoleError = console.error.bind(console);
    mopidy.playlists.getPlaylists()
    .then(processGetPlaylists, consoleError);

    //TODO: get current time pos
}

/** Get playlists from Mopidy */
function processGetPlaylists(playlists){
    if ((!playlists) || (playlists == '')) {return;}
    for (var i = 0; i < playlists.length; i++) {

        var playlist = playlists[i];
        var duration = 0;

        for(var j = 0; j<playlist.tracks.length; j++){
            duration += playlist.tracks[j].length;
//            addTrack(playlist.tracks[j]);
        }

        playlist.duration = msToTime(duration);
        addPlaylist(playlists[i]);
    };
}

/** Convert milliseconds to time */
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