var spotify = require("../node_modules/spotify.js");

spotify.albums("doolittle", function(err, albums) {
    console.log(albums);
});