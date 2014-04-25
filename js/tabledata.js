var model = new Backbone.Model({name: "Planet"});
 
var people = ko.observableArray([]);

function addPlaylist(playlist){
	self.people.push({ name: playlist });
}

self.addPerson = function(playlist) {
        self.people.push({ name: playlist });
};

var ViewModel = function(model) {
  this.name = kb.observable(model, 'name');
};
 
var view_model = new ViewModel(model);
 
ko.applyBindings(view_model, $('#kb_observable')[0]);