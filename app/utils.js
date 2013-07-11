/********************************************************
 * Variables
 *********************************************************/


/********************************************************
 * Add row to queue
 *********************************************************/
function addRow(track, artist, time, album){
         if (!document.getElementsByTagName) return;
         
         tabBody=document.getElementsByTagName("TBODY").item(0);
         row=document.createElement("TR");
         
         cell1 = document.createElement("TD");
         cell2 = document.createElement("TD");
         cell3 = document.createElement("TD");
         cell4 = document.createElement("TD");
         
         textnode1=document.createTextNode(track);
         textnode2=document.createTextNode(artist);
         textnode3=document.createTextNode(time);
         textnode4=document.createTextNode(album);

         cell1.appendChild(textnode1);
         cell2.appendChild(textnode2);
         cell3.appendChild(textnode3);
         cell4.appendChild(textnode4);

         row.appendChild(cell1);
         row.appendChild(cell2);
         row.appendChild(cell3);
         row.appendChild(cell4);

         tabBody.appendChild(row);
}

/********************************************************
 * Playlists
 *********************************************************/

function getPlaylists() {
    // Get playlists without tracks
    mopidy.playlists.getPlaylists(false)
    .then(processGetPlaylists, console.error);  
}

/********************************************************
 * Initialize
 *********************************************************/
$(document).ready(function() {
    
    // Connect to server
    mopidy = new Mopidy();

     mopidy.on("state:online", function() {
        getPlaylists();
    });

});


/********************************************************
 * process results of list of playlists of the user
 *********************************************************/
function processGetPlaylists(resultArr) {

    if ((!resultArr) || (resultArr == '')) {
        return;
    }

    var tmp = '';

    for (var i = 0; i < resultArr.length; i++) {
        insertItemToList("error-menu", 0, resultArr[i].name);
    };

    
}

function insertItemToList(myid, position, newListItem) {
    var ul = document.getElementById(myid);
    var li = document.createElement("li");
    li.innerHTML=newListItem;
    ul.insertBefore(li, ul.getElementsByTagName("li")[position]);
}