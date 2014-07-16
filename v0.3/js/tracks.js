/** Create the Backbone model */
var model_tracks = new Backbone.Model({
    song: "song",
    uri: "uri",
    artist: "artist",
    time: "1h 12m 34s",
    ms: "23423424",
    album: "album",
    track: ""
});

/** Add a list of tracks */
var tracks = ko.observableArray([]);

var selectTrack = function(track){

    console.log("Song: " + track.song); //TODO: remove when not in use

    // set slider total time to track length
    setTotalTime(track.ms);                                                 //seektime.js

    // start the seekbar timer
    startSeekbarTimer();                                                    //controls.js

    mopidy.tracklist.clear();
    mopidy.tracklist.add(null, null, track.uri);

    // start the song and update the gui / logic
    play();                                                                 //controls.js

    getCover(track.track, '#img_album_art', 'src', 'large');                //lastfm.js
//    getCover(track, '.div_tables', 'background', 'mega');                   //lastfm.js
}

/** Populate the tracklist with a playlist's tracks */
function addTracks(tracks){
    self.tracks([]);
    for(var i = 0; i<tracks.length; i++){
        self.tracks.push({
            song: tracks[i].name,
            uri: tracks[i].uri,
            artist: tracks[i].album.artists[0].name,
            time: msToTime(tracks[i].length),
            ms: tracks[i].length,
            album: tracks[i].album.name,
            track: tracks[i]
        });
    }
}
/** Populate the tracklist with a TlTracks from mopidy tracklist (queue)*/
function addTlTracks(tracks){
    self.tracks([]);
    for(var i = 0; i<tracks.length; i++){
        self.tracks.push({
            song: tracks[i].track.name,
            uri: tracks[i].track.uri,
            artist: tracks[i].track.album.artists[0].name,
            time: msToTime(tracks[i].track.length),
            ms: tracks[i].track.length,
            album: tracks[i].track.album.name,
            track: tracks[i].track
        });
    }
}

/** Add track to the model */
function addTrack(track){
	self.tracks.push({
	    song: track.name,
	    uri: track.uri,
	    artist: track.album.artists[0].name,
	    time: msToTime(track.length),
	    ms: track.length,
	    album: track.album.name,
	    track: track
	});
}

/** View model of the observables */
var ViewModelTracks = function(model_tracks) {
  this.song = kb.observable(model_tracks, 'song');
  this.artist = kb.observable(model_tracks, 'artist');
  this.time = kb.observable(model_tracks, 'time');
  this.album = kb.observable(model_tracks, "album");
};

/** Create the View Model with the Backbone model */
var view_model_tracks = new ViewModelTracks(model_tracks);

/** Bind the View Model to the observables */
ko.applyBindings(view_model_tracks, document.getElementById("table_tracks"));