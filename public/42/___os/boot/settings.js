system42("settings", function(le) {
  "use strict";

  // local settings
  var ok = Object.assign({}, le._settings);
  le._settings = $store(
    "settings.json",
    le._settings,
    function(val) {
      le._settings = val;
    },
    function() {
      return le._settings;
    }
  );

  // $store('settings.json', le._settings);
  if (typeof le._settings === "string") le._settings = ok;
  else le._settings = Object.assign(ok, le._settings);

  le._settings.skin = "w93";

  le._init.home = function() {
    le._path.home = "/a/";
    le._path.key.home = "";
    le._path.desktop = "/a/desktop/";
    le._path.key.desktop = "desktop/";
    le._path.skin = "/c/sys/skins/" + le._settings.skin + "/";
  };

  le._init.home();
});
