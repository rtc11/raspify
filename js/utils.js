/** Convert milliseconds to time */
function msToTime(s) {
    var ms = s % 1000;
    s = (s - ms) / 1000;
    var secs = s % 60;
    s = (s - secs) / 60;
    var mins = s % 60;
    var hrs = (s - mins) / 60;

    if(hrs > 0){
        return hrs + 'h ' + mins + 'm ' + secs + 's';
    }
    return mins + 'm ' + secs + 's';
}