//Make sure the document has loaded and that jQuery is ready
$(document).ready(function() {});

$(".seekbar").slider({
    min: 0,
    max: 100,
    value: 0,
    slide: function(event, ui) {
        setVolume(ui.value / 100);
    }
});