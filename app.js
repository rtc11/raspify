
var spotify = require('/usr/lib/node_modules/node-spotify')({ appkeyFile: '/home/tordly/projects/raspify/spotify_appkey.key' });

var ready = function()  {
//    var starredPlaylist = spotify.sessionUser.starredPlaylist;
//    spotify.player.play(starredPlaylist.getTrack(0));
    console.log("Ready!");
};

var testPlaylistCount = function(){
    var myPlaylistContainer = spotify.playlistContainer;
    console.log("Playlists: " + myPlaylistContainer.numPlaylists);
}

spotify.on({
    ready: ready
});

spotify.login('rtc11', 'Spokptr06', false, false);


