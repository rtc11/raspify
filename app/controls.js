/********************************************************
 * CONTROLS
 *********************************************************/
function control(){
        
    var mopidy = new Mopidy();

    this.play = function(){
        mopidy.on("state:online", function () {
            if (!play) {
                mopidy.playback.play();
                console.log("CONTROL: Play");
                changePlayButton("pause");
            }
            else {
                mopidy.playback.pause();
                console.log("CONTROL: Pause");
                changePlayButton("play");
            }
            play = !play;
        });
    }
    this.next = function(){
        console.log("CONTROL: Next");
        
        mopidy.on("state:online", function () {
            mopidy.playback.next();
        });
    }
    this.previous = function(){
        console.log("CONTROL: Previous");
        
        mopidy.on("state:online", function () {
            mopidy.playback.previous();
        });
    }
    this.shuffle = function(){
        console.log("CONTROL: Shuffle");

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
    this.repeat = function(){
        console.log("CONTROL: Repeat");

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