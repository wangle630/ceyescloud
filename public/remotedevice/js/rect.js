'use strict'

function Rect(){
    this.doc = document.getElementById('pp');
    if(!this.doc) return;
    this.width = '';
    this.height = '';
}

var startX = 1;
var startY = 1;
var video_left = 1;
var video_top = 1;
var video_width = 1;
var video_height = 1;
var isMouseDown = false;
var isAlreadyDown = false;

Rect.prototype.down = function(e){
    isMouseDown = true;

 //console.log("MOUSE DOWN");

    if (isAlreadyDown) {
     //console.log("IS already mouse down");
        Rect.prototype.up(e);
        return;
    }

    // Delete exist box
    var ab = document.getElementById("active_box");
    if(ab !== null) {
        ab.parentNode.removeChild(ab);
    }
    ab = document.getElementById("keep_box");
    if(ab !== null) {
        ab.parentNode.removeChild(ab);
    }

    // Get video size
    var video_res = $("#size").val();
 //console.log("video_res="+video_res);
    var arrRes = video_res.split("x");
    var video_res_width = arrRes[0];
    var video_res_height = arrRes[1];
    var video_ratio = video_res_width/video_res_height;
 //console.log("video_ratio="+video_ratio);

    // Get player size
    var player_offset = $("#player").offset();
    var player_width = $("#player").width();
    var player_height = $("#player").height();
    var player_ratio = player_width/player_height;
 //console.log("player_size="+player_width+","+player_height+", player_ratio="+player_ratio);

    // Check letter box
    var dw = 1;
    var dh = 1;

    if (video_ratio < player_ratio){
        // black padding at left and right
        video_height = player_height;
        video_width = video_height * video_ratio;
        dw = (player_width - video_width)/2;
        dh = 0;
    } else {
        // black padding at top and bottom
        video_width = player_width;
        video_height = video_width / video_ratio;
        dh = (player_height - video_height)/2;
        dw = 0;
    }
 //console.log("video_width="+video_width+", video_height="+video_height);
 //console.log("dw="+dw+", dh="+dh);

    // Get video position
    video_left = player_offset.left + dw;
    video_top = player_offset.top + dh;
 //console.log("video_left="+video_left+", video_top="+video_top);

    e = e?e:window.event;
    startX = e.pageX?e.pageX:e.clientX + document.documentElement.scrollLeft || document.body.scrollLeft;
    startY = e.pageY?e.pageY:e.clientY + document.documentElement.scrollTop || document.body.scrollTop;
 //console.log("startX="+startX+", startY="+startY);

    // Check point if valid
    if (startX<video_left || startX>(video_left+video_width) || startY<video_top || startY>(video_top+video_height)){
     //console.log("ignore this point");
        return;
    }

    // create box
    var rectBox = document.createElement("div");
    rectBox.id = "active_box";
    rectBox.style.left = startX + 'px';
    rectBox.style.top = startY + 'px';
    document.body.appendChild(rectBox);

    isAlreadyDown = true;
 //console.log("create rectBox");
}

Rect.prototype.move = function(e){
    var ab = document.getElementById("active_box");
    if(ab !== null) {
        if (!isMouseDown) {
         //console.log("mouse is not down");
            ab.remove();
            return;
        }

        var cx = e.pageX?e.pageX:e.clientX + document.documentElement.scrollLeft || document.body.scrollLeft;
        var cy = e.pageY?e.pageY:e.clientY + document.documentElement.scrollTop || document.body.scrollTop;
     //console.log("cx="+cx+", cy="+cy);

        // Constrint box in video rect
        if (cx < video_left){
            cx = video_left;
         //console.log("cx < video_left");
        }

        if (cx > video_left + video_width){
            cx = video_left + video_width;
         //console.log("cx > video_left + video_width");
        }

        if (cy < video_top){
            cy = video_top;
         //console.log("cy < video_top");
        }

        if (cy > video_top + video_height){
            cy = video_top + video_height;
         //console.log("cx > video_top + video_height");
        }

        // support mouse move to left and top direction
        if (cx < startX) {
            ab.style.left = cx + 1 + "px";
        }

        if (cy < startY) {
            ab.style.top = cy + 1 + "px";
        }

        ab.style.width = Math.abs(cx - startX) - 1 + 'px';
        ab.style.height = Math.abs(cy - startY) - 1 + 'px';

     //console.log("width="+ab.style.width+", height="+ab.style.height);
    }
}

Rect.prototype.up = function(e){
    isMouseDown = false;
    isAlreadyDown = false;
 //console.log("MOUSE UP");

    var ab = document.getElementById("active_box");
    if(ab !== null) {
     //console.log("ab.offsetWidth="+ab.offsetWidth+", ab.offsetHeight="+ab.offsetHeight);

        // if box is too small, then remove it
        if (ab.offsetWidth < 5 || ab.offsetHeight < 5) {
         //console.log("box is too small");
            ab.parentNode.removeChild(ab);
            return;
        }

        var p_left = (ab.offsetLeft - video_left)/video_width;
        var p_top = (ab.offsetTop - video_top)/video_height;
        var p_width = ab.offsetWidth/video_width;
        var p_height = ab.offsetHeight/video_height;
        var msg = p_left + "," + p_top + "," + p_width + "," + p_height;
     //console.log("msg="+msg);

        // Keep box until timeout
        ab.id = "keep_box";
        setTimeout(function () {
            ab.remove();
        }, 5000);

        // send text msg
        var hashed_id = $('#hashed_id').text();
        var author = $('#author').text();
        $.ajax({
            url: '/mylives/' + hashed_id + '/send_txt_msg',
            type: 'GET',
            data: {content: msg, author: author, action: 2},
            success: function (result) {
                try {
                 //console.log("text msg sent");
                } catch (e) {
                 //console.log(e);
                }
            }
        });
    }
}

Rect.prototype.addEventListener = function(o,e,l){
    if(o.addEventListener){
        o.addEventListener(e,l,false);
    }
    else if (o.attachEvent) {
        o.attachEvent('on'+e,function() {
            l(window.event);
        });
    }
}