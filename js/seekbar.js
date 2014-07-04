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

