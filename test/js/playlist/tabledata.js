
var playlists;

var model = {first_name: "Planet", last_name: "Earth"};
 
var ViewModel = function(model) {

  this.first_name = ko.observable(model.first_name);
  this.last_name = ko.observable(model.last_name);
  
  this.full_name = ko.computed((function() {return "" + (this.first_name()) + " " + (this.last_name());}), this);
};
 
var view_model = new ViewModel(model);
 
ko.applyBindings(view_model, $('#ko_basic')[0]);

//Creates a new instance of view model
Knockback.viewModel = function(model, options) { 
	return new Knockback.ViewModel(model, options); 
};
	
function initialize(){

	playlists = new Backbone.Model({
		name: 'Playlist', nr_of_tracks: '100'
	});
}

function populatePlaylist(playlist){

}