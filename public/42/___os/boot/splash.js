system42("splash", function(le, voila) {
  "use strict";

  var bootIframe;
  var desktop = $explorer(le._path.desktop, le._dom.desktop, {
    silent: true,
    backgroundClass: "",
    viewType: "workspace",
  });

  if (!le.devmode) {
    $el.each(".ui_icon", function(el) {
      el.classList.add("hide");
    });
  }

  if (!le.started && le._settings.noSplash !== true) {
    bootIframe = document.createElement("iframe");
    le._dom.splash.appendChild(bootIframe);
    bootIframe.className = "fillspace";
    bootIframe.style.position = "fixed";
    bootIframe.style.visibility = "hidden";
    bootIframe.onload = function() {
      bootIframe.style.visibility = "visible";
      setTimeout(function() {
        voila();
      }, 2500);
    };
    bootIframe.src = le._temp.splash;
  } else {
    voila();
  }
});
