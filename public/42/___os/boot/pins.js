system42("pins", function(le) {
  "use strict";
  //throw new Error('lol')
  le._pins = $store(
    le._path.key.home + ".config/pins.json",
    [],
    function(val) {
      le._pins = val;
    },
    function() {
      return le._pins;
    }
  );
});
