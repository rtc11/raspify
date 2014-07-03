$(document).ready(function(){

    var playing = true;

    $(function(){
        $(".play_pause").click("click", function (event) {

            if(playing){
                playing = false;
                stopTimer();
                $(".play_pause").css('content', 'url(../img/pause.png)');
                mopidy.playback.pause();
            }
            else{
                playing = true;
                startTimer();
                $(".play_pause").css('content', 'url(../img/play.png)');
                mopidy.playback.resume();
            }

        });
    });
});

var myVar;

function stopTimer(){
    window.clearInterval(myVar)
}

function startTimer(){
    myVar = setInterval(function(){
        myTimer()
    },1000);
}

function myTimer() {
    var consoleError = console.error.bind(console);
    mopidy.playback.getTimePosition()
    .then(processCurrentTimePosition, consoleError);
}

function processCurrentTimePosition(ms){
    setPosition(ms);
    $("#currentTime").text(msToTime(ms));
//    msToTime(ms);
}