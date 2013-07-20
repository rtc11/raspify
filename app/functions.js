/*********************************************************
 * Shows the number of playlists
 *********************************************************/
function showNrOfPlaylists(nr){
    //console.log("showNrOfPlaylists: " + nr);
    $('p#nrOfPlaylists').text(nr);
}

/*********************************************************
 * Shows the number of tracks
 *********************************************************/
function showNrOfTracks(nr){
    //console.log("showNrOfTracks: " + nr);
    $('p#nrOfTracks').text(nr);
}

/*********************************************************
 * Shows the number of queued tracks
 *********************************************************/
function showNrOfQueued(nr){
    //console.log("showNrOfQueued: " + nr);
    $('span#nrOfQueued').text(nr);
}

/*********************************************************
 * Shows the number of tracks in track list
 *********************************************************/
function showNrOfTracklisted(nr){
    //console.log("showNrOfTracklisted: " + nr);
    $('span#nrOfTracklisted').text(nr);
}

/*********************************************************
 * Adds a playlist to the sidebar
 *********************************************************/
function insertPlaylist(myid, playlist_name, id) {
    $('ul#' + myid).append('<li><a href="#'+playlist_name+'" onClick="putTracksOnTrackList('+id+')">'+playlist_name+'</a></li>');
}

/*********************************************************
 * Changes the play-buttons image
 *********************************************************/
function changePlayButton(state){
    var src = "";
    if(state == "pause"){ src = "img/player-pause.png"; }
    if(state == "play"){ src = "img/player-play.png"; }
    document.getElementById('playPauseButton').setAttribute('src', src);
}

/*********************************************************
 * Changes the repeat-buttons image
 *********************************************************/
function changeRepeatButton(repeat){
    var src = "";
    if(repeat){ src = "img/player-repeat-on.png"; }
    else{ src = "img/player-repeat.png"; }
    document.getElementById('repeatButton').setAttribute('src', src);
}

/*********************************************************
 * Changes the shuffle-buttons image
 *********************************************************/
function changeShuffleButton(shuffle){
    var src = "";
    if(shuffle){ src = "img/player-shuffle-on.png"; }
    else{ src = "img/player-shuffle.png"; }
    document.getElementById('shuffleButton').setAttribute('src', src);
}

/*********************************************************
 * The seekbar object with its functions
 *********************************************************/
function Seekbar(){
    var max = 0;
    var pos = 0;
    var self = this;
    $( "div#slider" ).slider(); //Create empty seekbar

    //initialize and instantiate the seekbar
    this.initialize = function(maxVal, current){
        $( "div#slider" ).slider({ max: maxVal });
        $( "div#slider" ).slider({ min: 0 });
        $( "div#slider" ).slider({ value: current });
        //$( "div#slider" ).slider({ animate: "fast" }); //changes position while draging the slider
        $( "div#slider" ).slider({
            slide: function( event, ui ) {
                var mopidy = new Mopidy();
                mopidy.on("state:online", function(){
                    mopidy.playback.seek(ui.value);
                    if(!play){
                        mopidy.playback.pause();
                    }
                });
            }
        });

        window.setInterval(this.incrementCurrentPos, 1000);
    }

    //Set max value of seekbar
    this.setMax = function(input){
        $( "div#slider" ).slider( "option", "max", input );
        this.max = input;
    }

    //Increment the pointer every second
    this.incrementCurrentPos = function(){
        if(play){
            //using variable self, because 'this' is now incrementCurrentPos() and not seekbar()
            var curr = self.getCurrentPos();
            $('div#slider').slider("option", "value", curr + 1000);
        }
    }

    //Set current position of seekbar
    this.setCurrentPos = function(input){
        console.log("Current position updated to: " + input);
        $( "div#slider" ).slider( "option", "value", input );
        this.pos = input;
    }

    //Get max value of seekbar
    this.getMax = function(){
        var maxVal = $( "div#slider" ).slider( "option", "max" );
        return maxVal;
    }

    //Get current position of seekbar
    this.getCurrentPos = function(){
        var value = $( "div#slider" ).slider( "option", "value" );
        return value;
    }
}
