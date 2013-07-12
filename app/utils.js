/********************************************************
 * Variables
 *********************************************************/
var nrOfTracks = 0;

var tracklist;

/********************************************************
 * Initialize
 *********************************************************/
$(document).ready(function() {
    
    seekbar();

    //Adds the playlist and starts playing it
    test(4);
});

function play(track){
    mopidy.on("state:online", function () {
        mopidy.playback.play();
    });
}

function next(){ 
    mopidy.on("state:online", function () {
        mopidy.playback.next();
    });
}

function previous(){
    mopidy.on("state:online", function () {
        mopidy.playback.previous();
    });
}

/********************************************************
 * Add row to queue
 *********************************************************/
function addRow(track, artist, time, album){
         if (!document.getElementsByTagName) return;
         
         tabBody=document.getElementsByTagName("TBODY").item(0);
         row=document.createElement("TR");
         
         cell1 = document.createElement("TD");
         cell2 = document.createElement("TD");
         cell3 = document.createElement("TD");
         cell4 = document.createElement("TD");
         
         textnode1=document.createTextNode(track);
         textnode2=document.createTextNode(artist);
         textnode3=document.createTextNode(time);
         textnode4=document.createTextNode(album);

         cell1.appendChild(textnode1);
         cell2.appendChild(textnode2);
         cell3.appendChild(textnode3);
         cell4.appendChild(textnode4);

         row.appendChild(cell1);
         row.appendChild(cell2);
         row.appendChild(cell3);
         row.appendChild(cell4);

         tabBody.appendChild(row);
}

/********************************************************
 * Get all the playlists
function getPlaylists() {
    // Get playlists without tracks
    mopidy.playlists.getPlaylists(false)
    .then(processGetPlaylists, console.error);  
}
 *********************************************************/


/********************************************************
 * process results of list of playlists of the user
 *********************************************************/
function processGetPlaylists(resultArr) {

    if ((!resultArr) || (resultArr == '')) {
        return;
    }

    for (var i = 0; i < resultArr.length; i++) {
        insertPlaylist("error-menu", i+1, resultArr[i].name);
    };
}

/********************************************************
 * Shows the number of playlists
 *********************************************************/
function showNrOfPlaylist(nr){
    $('p#nrOfPlaylists').text(nr);
}

/********************************************************
 * Shows the number of tracks
 *********************************************************/
function showNrOfTracks(nr){
    $('p#nrOfTracks').text(nr);
}

/********************************************************
 * Adds a playlist to the sidebar
 *********************************************************/
function insertPlaylist(myid, newListItem) {
    $('ul#' + myid).append('<li><a href="index.html">' + newListItem + '</a></li>');
}

function addMoreTracksToCounter(nr){
    nrOfTracks += list.length;
}

function setTrackList(list){
    tracklist = list;
}

//playlistNr is a position on which playlist to be loaded.
function test(playlistNr){
    var consoleError = console.error.bind(console);

    var getFirstPlaylist = function (list) {

        //All playlists
        getAllPlaylists(list);

        //Set the number of playlists found
        showNrOfPlaylist(list.length);

        //Return the n'th playlist
        return list[playlistNr];
    };

    var getFirstTrack = function(list) {

        addMoreTracksToCounter(list.length);

        return list[0];
    }

    var getAllPlaylists = function(list){

        if ((!list) || (list == '')) {
            return;
        }

        for (var i = 0; i < list.length; i++) {
            insertPlaylist("error-menu", i+1, list[i].name);
        };

    }

    var extractTracks = function (playlist) {

        setTrackList(playlist.tracks);

        return playlist.tracks;
    };

    var printTypeAndName = function (model) {
        console.log(model.__model__ + ": " + model.name);
        // By returning the playlist, this function can be inserted
        // anywhere a model with a name is piped in the chain.
        return model;
    };

    var trackDesc = function (track) {
        return track.name + " by " + track.artists[0].name +
            " from " + track.album.name;
    };

    var printNowPlaying = function () {
        // By returning any arguments we get, the function can be inserted
        // anywhere in the chain.
        var args = arguments;
        return mopidy.playback.getCurrentTrack().then(function (track) {
            console.log("Now playing:", trackDesc(track));
            return args;
        });
    };

    var queueAndPlayFirstPlaylist = function () {
        mopidy.playlists.getPlaylists()
            // => list of Playlists
            .then(getFirstPlaylist, consoleError)
            // => Playlist
            .then(printTypeAndName, consoleError)
            // => Playlist
            .then(extractTracks, consoleError)
            // => list of Tracks
            .then(mopidy.tracklist.add, consoleError)
            // => list of TlTracks
            .then(getFirstTrack, consoleError)
            // => TlTrack
            .then(mopidy.playback.play, consoleError)
            // => null
            .then(printNowPlaying, consoleError)
    };

    var mopidy = new Mopidy();             // Connect to server
    mopidy.on(console.log.bind(console));  // Log all events
    mopidy.on("state:online", queueAndPlayFirstPlaylist);
}

/********************************************************
 * Seekbar initializing
 *********************************************************/
function seekbar(){
    $(function($) {

        $(".knob").knob({
            change : function (value) {
                //console.log("change : " + value);
            },
            release : function (value) {
                //console.log(this.$.attr('value'));
                console.log("release : " + value);
            },
            cancel : function () {
                console.log("cancel : ", this);
            },
            draw : function () {

                // "tron" case
                if(this.$.data('skin') == 'tron') {

                    var a = this.angle(this.cv)  // Angle
                        , sa = this.startAngle          // Previous start angle
                        , sat = this.startAngle         // Start angle
                        , ea                            // Previous end angle
                        , eat = sat + a                 // End angle
                        , r = 1;

                    this.g.lineWidth = this.lineWidth;

                    this.o.cursor
                        && (sat = eat - 0.3)
                        && (eat = eat + 0.3);

                    if (this.o.displayPrevious) {
                        ea = this.startAngle + this.angle(this.v);
                        this.o.cursor
                            && (sa = ea - 0.3)
                            && (ea = ea + 0.3);
                        this.g.beginPath();
                        this.g.strokeStyle = this.pColor;
                        this.g.arc(this.xy, this.xy, this.radius - this.lineWidth, sa, ea, false);
                        this.g.stroke();
                    }

                    this.g.beginPath();
                    this.g.strokeStyle = r ? this.o.fgColor : this.fgColor ;
                    this.g.arc(this.xy, this.xy, this.radius - this.lineWidth, sat, eat, false);
                    this.g.stroke();

                    this.g.lineWidth = 2;
                    this.g.beginPath();
                    this.g.strokeStyle = this.o.fgColor;
                    this.g.arc( this.xy, this.xy, this.radius - this.lineWidth + 1 + this.lineWidth * 2 / 3, 0, 2 * Math.PI, false);
                    this.g.stroke();

                    return false;
                }
            }
        });

        // Example of infinite knob, iPod click wheel
        var v, up=0,down=0,i=0
            ,$idir = $("div.idir")
            ,$ival = $("div.ival")
            ,incr = function() { i++; $idir.show().html("+").fadeOut(); $ival.html(i); }
            ,decr = function() { i--; $idir.show().html("-").fadeOut(); $ival.html(i); };
        $("input.infinite").knob({
            min : 0, max : 20, stopper : false, change : function () {
            
                if(v > this.cv){
                    if(up){
                        decr();
                        up=0;
                    }
                    else{
                        up=1;down=0;
                    }
                } 
                else {
                    if(v < this.cv){
                        if(down){
                            incr();
                            down=0;
                        }
                        else{
                            down=1;up=0;
                        }
                    }
                }
                v = this.cv;
            }
        });
    });
}