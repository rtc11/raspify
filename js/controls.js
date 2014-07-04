var seekbarTimer;

$(document).ready(function(){
    $(function(){
        $("#play_pause").click("click", function (event) {

            if(currentState == "playing"){
                currentState = pause();                                     //currentState: mopidy.js
            }
            else if(currentState == "paused"){
                currentState = resume();                                    //currentState: mopidy.js
            }
            else if(playing == "stopped"){
//                playing = play(); //nothing to play
            }
        });
    });
});

function play(){
    mopidy.playback.play();
    return playing();
}
function pause(){
    mopidy.playback.pause();
    return pausing();
}
function resume(){
    mopidy.playback.resume();
    return playing();
}

function playing(){
    $("#play_pause").toggleClass('playing');
    return startSeekbarTimer();
}

function pausing(){
    $("#play_pause").toggleClass('paused');
    console.log("button should be play-button");
    return stopSeekbarTimer();
}

function stopped(){
    $("#play_pause").toggleClass('paused');
}

function stopSeekbarTimer(){
    window.clearInterval(seekbarTimer)
    return "paused";
}

function startSeekbarTimer(){
    seekbarTimer = setInterval(function(){getTimePosition()}, 1000);        //mopidy.js
    return "playing";
}