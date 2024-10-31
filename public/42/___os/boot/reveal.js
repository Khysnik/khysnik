system42("reveal", function(le, voila) {
  "use strict";

  // le._settings.userData.localInit = true;

  if (!le.devmode) le._sound.boot.play();

  setTimeout(function() {
    le._dom.splash.parentNode.removeChild(le._dom.splash);
    le._dom.taskbar.classList.remove("hide");
    le._dom.desktop.classList.remove("invisible");

    if (!le.devmode) {
      setTimeout(function() {
        $el.each(".ui_icon", function(el) {
          setTimeout(function() {
            el.classList.remove("hide");
          }, Math.abs(Math.random() * 1000) + 100);
        });
      }, 100);
    }

    // window.addEventListener("resize", $io.fn.debounce(function() {
    //   desktop.reorder();
    // }, 50), false);

    $el(le._dom.desktop).on("click", ".js_error a", function(e) {
      if (e.target.href) $exe("code", e.target.href);
      return false;
    });
    $el(le._dom.screen)
      // disabled default drop
      .on("drag dragenter dragover dragleave drop", function(e) {
        e.preventDefault();
      });
    $route.on("change", function(hash) {
      $exe(hash);
    });
    $route.init();

    // $io.arr.each(le._pins, function(val, i) {
    //   $exe.call({silent:true, pinned:i, window:val[1]}, val[0]);
    // });

    document.documentElement.focus();

    window.onerror = function() {
      $alert.error(arguments);
    };
    voila();
  }, le.devmode ? 0 : 600);
});
