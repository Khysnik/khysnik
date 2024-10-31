!(function(global) {
  "use strict";

  var alertDefault = {
    baseClass: "ui_alert",
    height: "auto",
    minHeight: "auto",
    footer: "",
    minimizable: false,
    maximizable: false,
    resizable: false,
    center: true,
    pinnable: false,
    btnOk: "OK",
    animationIn: "none",
    // ,animationOut: 'none'
    // ,animationIn: 'random'
    animationOut: "random",
    width: 330,
  };

  var def = {
    sound: $noop,
  };

  function $alert(msg, cb) {
    var cfg = $extend(
      {
        title: "Alert",
        baseClass: "ui_alert",
        msg: msg,
        img: "/c/sys/skins/w93/alert.png",
        cb: cb,
        sound: "alert",
        onopen: function() {
          if (this.cfg.sound) def.sound(this.cfg.sound);
          var focusOn = input || this.el.btnOk;
          if (focusOn) {
            setTimeout(function() {
              focusOn.focus();
            }, 100);
          }
        },
        onactive: function() {
          var focusOn = input || this.el.btnOk;
          if (focusOn) {
            setTimeout(function() {
              focusOn.focus();
            }, 100);
          }
        },
        onclose: function(ok) {
          (cb || msg.cb || $noop)(ok);
        },
      },
      msg
    );

    // console.log(cfg.baseClass)
    var BBB = cfg.baseClass.split(" ")[0];

    if (typeof cfg.msg !== "string") {
      try {
        cfg.msg = JSON.stringify(cfg.msg, null, 2);
        cfg.bodyClass = alertDefault.bodyClass + " " + BBB + "--code";
      } catch (e) {
        cfg.msg = cfg.msg + "";
        cfg.bodyClass =
          alertDefault.bodyClass +
          " " +
          BBB +
          "--code" +
          " " +
          BBB +
          "--center";
      }
    }

    var cont = document.createElement("div"),
      txt = document.createElement("div"),
      docfrag = document.createDocumentFragment();

    cont.className = "clearfix";

    if (cfg.img) {
      var img = new Image();
      img.className = BBB + "__img";
      img.width = 32;
      img.height = 32;
      cont.appendChild(img);
    }
    txt.innerHTML = cfg.msg;
    txt.className = BBB + "__text";
    cont.appendChild(txt);

    if (typeof cfg.prompt == "string") {
      var form = document.createElement("form");
      //var input = document.createElement('input');
      //input.type = 'text';
      var input = document.createElement("textarea");
      //input.className = 'fullscreen';
      input.style.width = "100%";
      input.value = cfg.prompt;
      input.name = "prompt";
      //input.setAttribute('autofocus', "autofocus"); // ??
      input.onkeydown = function(e) {
        e = e || window.event;
        if (typeof e.which !== "number") e.which = e.keyCode;
        if (e.which === 13 && !e.shiftKey) {
          $el(form).trigger("submit");
          if (e.preventDefault) e.preventDefault();
          else e.returnValue = false;
          if (e.stopPropagation) e.stopPropagation();
          else e.cancelBubble = true;
          e.stopImmediatePropagation();
          return false;
        }
      };
      //form.style.textAlign = 'center';

      form.appendChild(input);
      txt.appendChild(form);
      txt.style.textAlign = "left";
    }

    cfg.html = cont;

    var async = null;
    if (cfg.img) {
      var isLoaded = false;
      async = function() {
        if (!isLoaded) {
          $window($extend({}, alertDefault, cfg));
        }
        isLoaded = true;
      };
      img.onload = async;
      img.onerror = async;
      img.onabort = async;
      img.src = cfg.img;
    } else {
      return $window($extend({}, alertDefault, cfg));
    }
  }

  $alert.error = $io.fn.leading(function(e, cb) {
    console.error(e);
    var err = $error(e);
    var msg = {
      bodyClass: "js_error",
      title: err.name || "Error",
      msg: err.html,
    };
    /*if (e instanceof Error || $io.isArguments(e)) {
      msg.btnCancel = 'Report Error';
      msg.oncancel = function() {
        window.open(err.reportLink);
      }
    }*/
    $alert(
      $extend(
        {
          title: "Error",
          msg: msg,
          img: "/c/sys/skins/w93/error.png",
          cb: cb,
          sound: "error",
        },
        msg
      )
    );
  }, 1000);

  $alert.info = function(msg, icon) {
    $alert(
      $extend(
        {
          title: "Info",
          msg: msg,
          img: icon || "/c/sys/skins/w93/info.png",
          onopen: $noop,
          sound: null,
        },
        msg
      )
    );
  };

  $alert.progress = function(msg, title) {
    var bar = document.createElement("div");
    var prog = document.createElement("div");
    prog.className = "ui_progress__bar";
    bar.className = "skin_inset_deep h20p mt5 relative ui_progress";
    var div = document.createElement("div");
    var cont = document.createElement("div");
    div.textContent = msg;
    bar.appendChild(prog);
    cont.appendChild(div);
    cont.appendChild(bar);
    title = title || "Progress";
    var p = $window(
      $extend(
        {},
        alertDefault,
        {
          title: title,
          html: cont,
          btnOk: null /*,
      btnCancel: 'Cancel'*/,
        },
        msg
      )
    );

    return {
      update: function(perc) {
        perc = ~~perc;
        p.changeTitle(perc + "% - " + title);
        prog.style.width = perc + "%";
        if (perc >= 100) p.close();
      },
    };
  };

  $alert.help = function(msg, cb) {
    $window(
      $extend(
        {},
        alertDefault,
        {
          title: "Help",
          html: msg,
          bodyClass: "ui_alert--help skin_inset_deep skin_light pa10",
          sound: null,
        },
        msg
      )
    );
  };

  $window.form = function(title, data, cb) {
    if (typeof title !== "string") {
      cb = data;
      data = title;
      title = "Form";
    }
    var form = $form.build(data);
    // console.log(111, form)
    $window.call(
      this,
      $extend({}, alertDefault, {
        resizable: true,
        title: title,
        html: form.el,
        btnOk: "OK",
        btnCancel: "Cancel",
        onsubmit: function(ok, data, form) {
          //if (ok && typeof cb === 'function') cb(form.post);
          // console.log("???", data);
          var res = $form.validate(form);
          if (res) {
            (cb || $noop)(ok, data);
          } else {
            console.log(res);
            return false;
          }
          //return false;
        },
      })
    );
  };

  var $confirm = function(msg, cb) {
    $alert(
      $extend(
        {
          title: "Confirm",
          msg: msg,
          img: "/c/sys/skins/w93/question.png",
          onopen: $noop,
          sound: null,
          cb: cb,
          btnCancel: "Cancel",
        },
        msg
      )
    );
  };

  var $prompt = function(msg, def, cb) {
    if (typeof def == "function") {
      cb = def;
      def = "";
    }

    $alert(
      $extend(
        {
          title: "Prompt",
          msg: msg,
          img: null, //'/c/sys/ico32/question.png',
          sound: null,
          cb: cb,
          prompt: def,
          onclose: function(ok, form) {
            var val = form.prompt;
            (cb || msg.cb || $noop)(ok, val);
          },

          btnCancel: "Cancel",
        },
        msg
      )
    );
  };

  $alert.config = function(opt) {
    $extend(def, opt);
  };

  global.$alert = $alert;
  global.$confirm = $confirm;
  global.$prompt = $prompt;
})(this);
