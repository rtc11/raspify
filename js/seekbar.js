//Make sure the document has loaded and that jQuery is ready
$(document).ready(function() {
    self.slider(120);
    self.setPosition(40);
});

var totalSecond;
var self = this;

function slider(total){
    this.totalSecond = Math.round(total);
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

//        console.log("range: " + range + ", total seconds: " + totalSecond);
    }
});

