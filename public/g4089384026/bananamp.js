
system42.on('apps:ready', function(le) { 'use strict'

  le._files = filesJson;

  var songs = [];
  var waitReady = [];

  le._apps['bananamp'] = {
    categories: 'Audio',
    name: 'Bananamp',
    icon: 'apps/bananamp.png',
    accept: '.mp3,.ogg,.flac,.mod,.xm,.it,.s3m,.amd,.rad,.hsc',
    exec: function(url) {


      // var songs
      if (url) {
        // songs = Array.prototype.slice.call(arguments, 0, -1)
        songs.push(url);
      } else {

        if (le.bananampOpen) return

        // songs = [];
        // $io.obj.each(le._files.g.files.music.modules, function (obj, folder) {
        //   $io.obj.each(obj, function (_, file) {
        //     songs.push('/g/files/music/modules/' + folder + '/' + file);
        //   });
        // });
        // $io.arr.shuffle(songs);

        // console.log(le._files.g.files.music.goto80['2017 - Compatible with windows 93']);
        // console.log();



        $io.obj.each(le._files.g.files.music.goto80["2017 - Compatible with windows 93"], function (obj, file) {
          songs.push('/g/files/music/goto80/2017 - Compatible with windows 93/' + file);
        });

        songs.sort()

        // console.log(11, le._files);
      }


      if (le.bananampOpen) {
        if (le.bananampReady) {
          le.bananampReady(songs)
          songs.length = 0;
        }
        return;
      }

      le.bananampOpen = true;

      $window.call(this, {
        width: 842,
        height: 560,
        url: '/g/programs/bananamp/index.php',
        onready: function () {
          var that = this
          that.el.iframe.contentWindow.le = le
          that.el.iframe.contentWindow.$file = $file
          that.el.iframe.contentWindow.loadSongs(songs)
          le.bananampReady = that.el.iframe.contentWindow.loadSongs
          songs.length = 0;
        },
        onclose: function () {
          le.bananampReady = false
          le.bananampOpen = false
        }
      })
    }
  }

})
