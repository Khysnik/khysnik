system42("register", function(le, voila) {
  "use strict";

  function end() {
    // alias
    le._dom.splash.classList.remove("hide");
    le._init.home();
    voila();
  }

  if (le._settings.userData.localInit === false) {
    le._dom.splash.classList.add("hide");
    var wizardFn = function() {
      var ready = false;
      var WELCOME = document.getElementById("WELCOME");
      var TERMS = document.getElementById("TERMS");
      var PROMPT = document.getElementById("PROMPT");
      var USERNAME = document.getElementById("USERNAME");
      var SERIAL = document.getElementById("SERIAL");

      // step 1
      /////////////////////////////////////////////////////////////////////////////
      if (
        TERMS.classList.contains("hide") &&
        PROMPT.classList.contains("hide")
      ) {
        WELCOME.classList.add("hide");
        TERMS.classList.remove("hide");
        this.el.btnOk.innerHTML = "Didn't Read Lol ^^";
      } else if (PROMPT.classList.contains("hide")) {
        TERMS.classList.add("hide");
        PROMPT.classList.remove("hide");
        this.el.btnOk.innerHTML = "Let's ROCK";
      } else {
        le._settings.userData.nick = USERNAME.value || "anonymous";
        le._settings.userData.localInit = true;
        end();
        return true;
      }
      return false;
    };
    $window({
      url: "/wizard.php",
      ajax: true,
      title: "Setup Wizard",
      btnCancel: "Nope",
      animationIn: "flip",
      animationOut: "",
      center: true,
      height: 350,
      width: 510,
      btnOk: "Cool Story, Bro",
      onok: wizardFn,
      oncancel: wizardFn,
    });

    //le.register = true;
  } else end();
});
