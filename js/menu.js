$(document).ready(function(){
    $(function(){
        $(".menu_item_queue").click("click", function (event) {
            mopidy.tracklist.getTlTracks()
            .then(processGetTlTracks, consoleError);
        });
        $(".menu_item_playlists").click("click", function (event) {
            toggleTable("table_playlists");                                 //playlists.js
        });
    });
});

function processGetTlTracks(tlTracks){
    addTlTracks(tlTracks);                                                  //tracks.js
}