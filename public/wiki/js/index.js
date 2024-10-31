/* 
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@.            @@@@@#@@@@@@@@@@@@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@#             *#@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@#-,-.            ~~~#@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
@@@@@@ @ @@ @@@@@@@@@@@@@@@@~~--,.           ,~~~~~@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
@@@@@@ @ @@@@@@@@@@@@@@@#@@~:::;:~           ~~:::~~#@@@@@@@@@@@@@@@@@@@@@@@@@@@
@@@@@@   @@ @@@@@@@@@@@@@@#;;!!!!~~~:::::;;:;;;;;;;::@@@@@@@@@@@@@@@@@@@@@@@@@@@
@@@@@@ @ @@ @@@@@@@@@@@@@#:;;;!!;:~~::::;;!;;;;!!!;;:@@@@@@@@@@@@@@@@@@@@@@@@@@@
@@@@@@ @ @@ @@@@@@@@@@@@# .~:!;!:~~::;!!!*!*!!!**!!;~ @@@@@@@@@@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@@@@@@#.  .~:~--~:::!;!!!;!;;!*!:~ .@@@@@@@@@@@@@@@@@@@@@@@@@@
@   @ @ @   @    @   @@@#   :;;---~;*!!;!;!!!!!;!!:~ ~@@@@@@@@@@@@@@@@@@@@@@@@@@
@@ @@ @ @ @@@ @@ @ @@@@@#. ~::!-,---;*!*;*!*!;;!!*;:.#@@@@@@@@@@@@@@@@@@@@@@@@@@
@@ @@   @  @@   @@  @@@@#  --        -::~;~:...,,-~;.@@@@@@@@@@@@@@@@@@@@@@@@@@@
@@ @@ @ @ @@@ @ @@ @@@@@$# -~:~-,-~:~,-;*!:-:;;~;**:.#=@@@@@@@@@@@@@@@@@@@@@@@@@
@@ @@ @ @   @ @@ @   @#!@#.,~~:::::::~~!**!!!;!!*=*:,#*$@@@@@@@@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@@@@@~~* .---~::;;-~:!*=*;!*!!;;;,#=!#@@@@@@@@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@@@@@@@#  .---~::,-~:!*!!;;!!;;:~ *=#@@@@@@@@@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@@@@@@@@#   ,,-~-~~~,:;;!!!;;;:-  *@@@@@@@@@@@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@@@@@@@@#     ,,   :;:!-,,,::- ..:@@@@#@@@@@@@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@@@@@@@#~-      ,-~;;~~:-,-    . *$#@@@@@@@@@@@@@@@@@@@@@@@@@@
@@@@@@@@@@#@@@@@@@@@@#$,.;=-      .,,~;;!!:~,     !!=! #@@@@@@@@@@@@@@@@@@@@@@@@
@@@#@@@@@@@@@@@@#$;::~!,-;!!-     ..--..-~~,    ,=**$#.-:**#@@@@@@@@@@@@@@@@@@@@
@@@@@#@@@@@##*-,!#~~-;!,~-!~!*       ..,..    ;!:;!$;$# ,*-=$:;#@@#@@@@@@@@@@@@@
@@@@###;:==-~!**..~$,~~*-#;-!,~~.          ,=*!:$$!:#=:, ~-:-;;,:;$@@@@@@@@@@@@@
@#$::::~~,,!$;.!~; -**.~=**!:$=~~:.,~--::;:*=~=;::=**:;~.~,:,!$,=,:-~-::*##@##@@
:;:::::::~~$~,-,;#=~~:$*~!*$-$!;-=;,=*=~:;:~$~;~#;!==#;!~*-!-.*-!~,=:##=!=:##=:#
;:::::::::::,,, *-*=;.**~!#*$!$;$:#;;:*!#*#==~:$~*#!;$!,,$=!*,, : :~===========!
;:::::::::;;; , @;;-!..-=*:=,##*:$#*::-$;*-*~-~*~*#:##-.,*=$*,,:-.;::#=*!=:#=#~!
::::;:;;;;;;;;-..-=~;- #,!!-$#;==~#:#::~*!;;:=*!*=$-!~,,.*;===~~, ::;;;:;;;!!!!!
::::::;;;;;;;:.  ,..,-. -*-~:;:!$=;;*;:;#!::=~*=!#=;=.*,..,:=:-,  -:;~::;;;!!!!!
*/
$( "#newPage" ).click(function() {
  	var name;
	if (window.top === window) {
        name = prompt('Page name ?');
    } else {
       window.top.$prompt('Page name ?', '', function(ok, name) {
       });
    }
    window.location.href = 'http://www.windows93.net/wiki/edit.php?'+name;
});

$( "#login" ).click(function() {
  	var pass;
	if (window.top === window) {
        pass = prompt('?');
        console.log(pass);
    } else {
       window.top.$prompt('?', '', function(ok, pass) {
          console.log(pass);
       });
    }
    window.location.href = 'http://www.windows93.net/wiki/?'+pass;
});
//
$( document ).ready(function() {
    $('a[href^="http://"]').attr('target','_blank');
    $('a[href^="https://"]').attr('target','_blank');
    $("img").click(function(){
        $(this).toggleClass( "imgZoom" );
     });
    //
  function matchYoutubeUrl(url){
    var p = /www\.youtube\.com/;
     return (url.match(p)) ? true : false ;
  }
  $('a').each(function() {
    /*
    if(matchYoutubeUrl($(this).attr('href'))){
      id=$(this).attr('href').slice(32).trim();
      player='<iframe width="560" height="315" src="https://www.youtube.com/embed/'+id+'" frameborder="0" allowfullscreen></iframe><br><a href="'+$(this).attr('href')+'" target="blank">'+$(this).attr('href')+'</a> ';
      //console.log(this);
      $( this ).replaceWith( player );
    }
    */
  });  
  //  
  function matchSoundCloudUrl(url){
    var p = /soundcloud\.com/;
     return (url.match(p)) ? true : false ;
  }
  $('a').each(function() {
    if(matchSoundCloudUrl($(this).attr('href'))){
      parent = $(this).parent()[0].localName;
      if (parent=='blockquote'){ 
        var that = this;
        player = '';
        url = $(this).attr('href');
        var settings = {
          "parent": 'bla',
          "async": true,
          "crossDomain": true,
          "url": "http://soundcloud.com/oembed",
          "method": "POST",
          "headers": {},
          "data": {
            "format": "json",
            "url": url
          }
        }
        $.ajax(settings).done(function (response) {
          player = response.html;
          player = player.replace('width=\"100%\"', 'width=\"560px\"');
          player = player.replace('height=\"400\"', 'height=\"130px\"');
          player = player+'<br><a href="'+$(that).attr('href')+'" target="blank">'+$(that).attr('href')+'</a> '
          $( that ).replaceWith( player );
          console.log(response)
        });
      }
    }
  });
});
