/** Create the Backbone model */
var model = new Backbone.Model({name: "Planet", duration: "1h 12m 34s", tracks: 34});

/** Add a list of playlists */
var people = ko.observableArray([]);

/** Add playlist to the model */
function addPlaylist(playlist){
	self.people.push({
	    name: playlist.name,
	    duration: playlist.duration,
	    tracks: playlist.tracks.length
	});
}

/** View model of the observables */
var ViewModel = function(model) {
  this.name = kb.observable(model, 'name');
  this.duration = kb.observable(model, 'duration');
  this.tracks = kb.observable(model, 'tracks');
};

/** Create the View Model with the Backbone model */
var view_model = new ViewModel(model);

/** Bind the View Model to the observables */
ko.applyBindings(view_model, $('#kb_observable')[0]);