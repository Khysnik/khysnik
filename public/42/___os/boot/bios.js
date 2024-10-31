system42("bios", function(le) {
  "use strict";

  $boot.BOOTLOG.innerHTML += "\nWindows93 v" + $boot.VERSION + " booting on...";
  $boot.BOOTLOG.innerHTML += "\n" + platform.description;
  $boot.BOOTLOG.innerHTML += "\n";
});
