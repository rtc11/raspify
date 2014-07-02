/** Create the Backbone model */
var model_tracks = new Backbone.Model({
    track: "track",
    artist: "artist",
    time: "1h 12m 34s",
    album: "album"
});

/** Add a list of tracks */
var tracks = ko.observableArray([]);

/** Populate the tracklist with a playlist's tracks */
function addTracks(tracks){
    self.tracks([]);
    for(var i = 0; i<tracks.length; i++){
        self.tracks.push({
            track: tracks[i].name,
            artist: tracks[i].album.artists[0].name,
            time: msToTime(tracks[i].length),
            album: tracks[i].album.name
        });
    }
}

/** Add track to the model */
function addTrack(track){
	self.tracks.push({
	    track: track.name,
	    artist: track.album.artists[0].name,
	    time: msToTime(track.length),
	    album: track.album.name
	});
}

/** View model of the observables */
var ViewModelTracks = function(model_tracks) {
  this.track = kb.observable(model_tracks, 'track');
  this.artist = kb.observable(model_tracks, 'artist');
  this.time = kb.observable(model_tracks, 'time');
  this.album = kb.observable(model_tracks, "album")
};

/** Create the View Model with the Backbone model */
var view_model_tracks = new ViewModelTracks(model_tracks);

/** Bind the View Model to the observables */
ko.applyBindings(view_model_tracks, document.getElementById("table_tracks"));