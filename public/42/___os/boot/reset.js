system42("reset", function(le, voila) {
  "use strict";
  $store.clear();
  $db.clear(function() {
    voila();
  });
});
