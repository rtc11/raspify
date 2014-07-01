//API:  http://api.jqueryui.com/slider/
$(function() {
    $( "#slider" ).slider();
});




//Slider
function vidSeek(){
    var seekTo = vid.duration * (seekbar.value / 100);
	vid.currentTime = seekTo;
}

//Volume
function changeVolume(){
	vid.volume = (volumeBar.value / 100);
}

//Time
function seekTimeUpdate(){
	var newTime = vid.currentTime * (vid.duration / 100);
	seekbar.value = newTime;

	//currentTime & duration display//
	var curSec = Math.floor(vid.currentTime / 60);
	var curMin = Math.floor(vid.currentTime - curSec * 60);
	var durSec = Math.floor(vid.duration / 60);
	var durMin = Math.floor(vid.duration - durSec * 60);

	if(curSec < 10){
		curSec = "0"+curSec;
	}
	if(curMin < 10){
		curMin = "0"+curMin;
	}
	if(durSec < 10){
		durSec = "0"+durSec;
	}
	if(durMin < 10){
		durMin = "0"+durMin;
	}

	currentTimeText.innerHTML = curSec+":"+curMin;
	durationTimeText.innerHTML = durSec+":"+durMin;
}