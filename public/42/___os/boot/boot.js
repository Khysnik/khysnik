system42("boot", function(le, voila) {
  "use strict";
  Promise.all([
    $loader([le._temp.files, le._temp.mimetypes]),
    $loader.audio(le._settings.sounds.boot),
    $loader.audio(le._settings.sounds.alert),
    $loader.audio(le._settings.sounds.error),
  ]).then(function(res) {
    le._files = res[0][0];
    le._get.mime.ext = res[0][1];
    le._sound.boot = res[1];
    le._sound.alert = res[2];
    le._sound.error = res[3];
    voila();
  });
});
