/********************************************************
 * CONTROLS
 *********************************************************/
function control(){
        
    var mopidy = new Mopidy();

    this.play = function(){
        mopidy.on("state:online", function () {
            if (!play) {
                mopidy.playback.play();
                print.d("Control: Play");
                changePlayButton("pause");
            }
            else {
                mopidy.playback.pause();
                print.d("Control: Pause");
                changePlayButton("play");
            }
            play = !play;
        });
    }
    this.next = function(){
        //print.d("Control: Next");
        
        mopidy.on("state:online", function () {
            mopidy.playback.next();
        });
    }
    this.previous = function(){
        //print.d("Control: Previous");
        
        mopidy.on("state:online", function () {
            mopidy.playback.previous();
        });
    }
    this.shuffle = function(){
        print.d("Control: Shuffle");

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
        print.d("Control: Repeat");

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