/* Create a cache object */
var cache = new LastFMCache();

/* Create a LastFM object */
var lastfm = new LastFM({
  apiKey    : '3e72b0d70961b3931a5abc3d60765299',
  apiSecret : '3b88386bffc4ef6795f4826aac4ada9a',
  cache     : cache
});

/*  track: mopidy track
    field: which tag we want to change: <img>, <div> etc. E.g: 'div#logo' or 'body'
    attribute: which attribute to change: 'src', 'backgorund-image', etc
    size: string valued 'small', 'medium', 'large', 'extralarge' or 'mega'
*/
function getCover(track, field, attribute, size) {
    lastfm.album.getInfo({
        artist: track.album.artists[0].name,
        album: track.album.name
    }, {success: function(data){
        for (var i = 0; i < data.album.image.length; i++) {
            if ( data.album.image[i]['size'] == size) {
                console.log("Image: " + data.album.image[i]['#text']);

                // set img variable to path from last fm
                var lastFm_img_path = data.album.image[i]['#text'];

                // no image retrieved, set to default
                if(!data.album.image[i]['#text']){
                    lastFm_img_path = '../img/menu/album_default.png';
                }

                // update GUI to match retrieved or default cover art
                if(attribute == "background"){
                    var tmp = "url(" + lastFm_img_path + ") no-repeat";
                    $(field).css('background', tmp);
//                    $(field).css('background-color', '#111');
                    $(field).css("background-size", 'cover');
//                    $(field).css("background-position", 'cover');
                }
                else{
                    $(field).attr(attribute, lastFm_img_path);
                }

                //return in case its necessary
                return lastFm_img_path
            }
        }
    }, error: function(code, message){
        $(field).attr(attribute, '../img/menu/album_default.png');

        return '../img/menu/album_default.png';
    }});
}

