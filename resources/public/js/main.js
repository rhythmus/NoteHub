var hash = function (input) {
    var shortMod = function(i) { return i % 32767 };
    var charCodes = input.split("")
        .filter(function(c){ return c != "\n" && c != "\r" })
        .map(function(c){ return c.charCodeAt(0) });
    var h = 0;
    for(var i in charCodes)
        h = shortMod(h + shortMod(charCodes[i] * (h % 2 != 0 ? 16381 ^ i : 16381 & i)));
    return h;
}

var $ = function(id){ return document.getElementById(id); }
var $draft = $("draft");
var $action = $("action");
var $preview = $("preview");
var $password = $("password");
var $plain_password = $("plain-password");
var $input_elems = $("input-elems");
var $dashed_line = $("dashed-line");
var iosDetected = navigator.userAgent.match("(iPad|iPod|iPhone)");
var timer = null;
var timerDelay = iosDetected ? 800 : 400;
var show = function(elem) { elem.style.display = "block" }

var updatePreview = function(){
    clearTimeout(timer);
    var content = $draft.value;
    var delay = Math.min(timerDelay, timerDelay * (content.length / 400));
    timer = setTimeout(function(){
            show($dashed_line);
            show($input_elems);
            $preview.innerHTML = marked(content);
        }, delay);
};

if($action.value == "update") updatePreview(); else $draft.value = "";
if(iosDetected) $draft.className += " ui-border"; else $draft.focus();
$draft.onkeyup = updatePreview;
$("publish-button").onclick = function(e) {
    if($plain_password.value != "") $password.value = md5($plain_password.value);
    $plain_password.value = null;
    $("session-value").value = hash($draft.value + $("session-key").value);
}