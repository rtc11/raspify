var totalSecond;
var self = this;

function slider(total){
    this.totalSecond = Math.round(total);
}

function setTotalTime(time){
    $(".seekbar").slider('option', 'max', time);

    // set text total time to track length
    $("#totalTime").text(msToTime(time));                                   //utils.js
}

function setPosition(time){
    $(".seekbar").slider('value', time);
}

$(".seekbar").slider({
    min: 0,
    max:100,
    range: "min",
    animate: true,
    slide: function(event, ui) {
        var range=ui.value;
        var currentTime=(self.totalSecond*range)/100;
    }
});

function parseSpotifyURI(event){
    // If key = 'enter'
    if (event.which == 13 || event.keyCode == 13) {

        var tb = document.getElementById("pub_url").value;

        mopidy.playback.stop(true);
        mopidy.tracklist.clear();
        mopidy.tracklist.add(null, null, tb);
        mopidy.playback.play();

        // Add tracks to queue list
        mopidy.tracklist.getTlTracks()
        .then(processGetTlTracks, consoleError);

        return false;
    }
}

