!(function(global) {
  "use strict";

  var timerId;
  function rAF() {
    console.log("Left", $keyboard.Left);
    console.log("Up", $keyboard.Up);
    console.log("Right", $keyboard.Right);
    console.log("Down", $keyboard.Down);
    timerId = requestAnimationFrame(rAF);
  }

  //rAF()

  // function sTo(delay) {
  //   //console.dir($keyboard.on.Left);
  //   timerId = setTimeout(sTo, delay);
  // }
  // sTo(1000);

  function $gamepad(arg) {
    "use strict";
    console.log(arg);
  }

  global.$gamepad = $gamepad;
})(this);
