/** Create the Backbone model */
var model_playlists = new Backbone.Model({
    name: "Planet",
    duration: "1h 12m 34s",
    size: 34,
    tracks: ""
});

/** Add a list of playlists */
var playlists = ko.observableArray([]);

/** Populate the tracklist with all of the playlist-tracks */
var selectPlaylist = function(playlist){
    addTracks(playlist.tracks);
}

/** Starts the playlist with shuffled order */
var startPlaylist = function(playlist){
    mopidy.playback.stop(true);
    mopidy.tracklist.clear();
    mopidy.tracklist.add(playlist.tracks);
    mopidy.tracklist.shuffle(0, playlist.length -1);
    mopidy.playback.play();
}

function toggleTable(table_id) {
    var lTable = document.getElementById(table_id);
    lTable.style.display = (lTable.style.display == "none") ? "table" : "none";
}

/** Add playlist to the model */
function addPlaylist(playlist){

//    var imgPath = getCover(playlist.tracks[0], '#test_img', 'src', 'small');

	self.playlists.push({
	    name: playlist.name,
	    duration: playlist.duration,
	    size: playlist.tracks.length,
	    tracks: playlist.tracks
	});
}

/** View model of the observables */
var ViewModelPlaylists = function(model_playlists) {
    this.name = kb.observable(model_playlists, 'name');
    this.duration = kb.observable(model_playlists, 'duration');
    this.size = kb.observable(model_playlists, 'size');
    this.tracks = kb.observable(model_playlists, 'tracks');
};

/** Create the View Model with the Backbone model */
var view_model_playlists = new ViewModelPlaylists(model_playlists);

/** Bind the View Model to the observables */
ko.applyBindings(view_model_playlists, document.getElementById("table_playlists"));