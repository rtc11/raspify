/********************************************************
 * CONTROLS
 *********************************************************/
function control(){
        
    var mopidy = new Mopidy();

    //PLAY
    this.play = function(){
        mopidy.on("state:online", function () {
            if (!play) {
                mopidy.playback.play();
                changePlayButton("pause");
            }
            else {
                mopidy.playback.pause();
                changePlayButton("play");
            }
            play = !play;
        });
    }

    //NEXT
    this.next = function(){
        mopidy.on("state:online", function () {
            mopidy.playback.next();
        });
    }

    //PREVIOUS
    this.previous = function(){
        mopidy.on("state:online", function () {
            mopidy.playback.previous();
        });
    }

    //SHUFFLE
    this.shuffle = function(){
        mopidy.on("state:online", function() {
            shuffle = !shuffle;
            changeShuffleButton(shuffle);

            if(shuffle){
                mopidy.playback.setRandom(1);
            }
            else{
                mopidy.playback.setRandom(0);
            }

        });
    }

    //REPEAT
    this.repeat = function(){
        mopidy.on("state:online", function() {
            repeat = !repeat;
            changeRepeatButton(repeat);
            if(repeat){
                mopidy.playback.setRepeat(1);
            }
            else{
                mopidy.playback.setRepeat(0);
            }
        });
    }
}