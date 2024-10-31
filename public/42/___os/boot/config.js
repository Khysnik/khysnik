system42("config", function(le) {
  "use strict";

  var styleEl = document.createElement("style"),
    styleSheet;

  // Append style element to head
  document.head.appendChild(styleEl);

  // Grab style sheet
  styleSheet = styleEl.sheet;

  var effects = [];
  // scans styleSheets for class starting with "fx_"
  $io.arr.all(document.styleSheets, function(item) {
    if (/sys42/.test(item.href)) {
      $io.arr.all(item.rules || item.cssRules, function(rule) {
        if (rule.selectorText && /^\.fx_\w+/.test(rule.selectorText)) {
          effects.push(rule.selectorText.replace(".fx_", ""));
        }
      });
    }
  });

  //console.log(document.styleSheets[0])

  $el.each("filter", function(el) {
    effects.push(el.id.replace("fx_", ""));
    //styleSheet.insertRule('.'+el.id+' {-webkit-filter: url("/c/effects.svg#'+el.id+'");}', 0);
    //styleSheet.insertRule('.'+el.id+' {filter: url("/c/effects.svg#'+el.id+'");}', 0);
    styleSheet.insertRule(
      "." + el.id + ' {-webkit-filter: url("#' + el.id + '");}',
      0
    );
    styleSheet.insertRule("." + el.id + ' {filter: url("#' + el.id + '");}', 0);
    //styleSheet.insertRule(selector + '{' + propStr + '}', styleSheet.cssRules.length);
  });

  le._fx = effects.sort();
  //console.log(le._fx)

  $window.config({
    dest: le._dom.desktop,
    dock: document.getElementById("s42_dock"),

    ondestroy: function(windowFocused) {
      //console.log('yop', windowFocused);
      if (!windowFocused && le._selected.length) {
        le._selected[0].focus();
      }
    },
    //constrain: true,
    animationIn: le.devmode ? "" : "random",
    animationOut: le.devmode ? "" : "random",
    contextmenu: {
      "before:Close": [
        {
          name: "Glitch",
          action: function() {
            $exe.call({ silent: true }, "glitch", this.el.base);
          },
        },
        {
          name: "IE6",
          action: function() {
            //console.log(this.el.base);
            $exe.call({ silent: true }, "ie6", this.el.base);
          },
        },
        { name: "---" },
        {
          name: "FX",
          items: function() {
            var that = this;
            var out = [];
            $io.arr.all(["none"].concat(le._apps.fx.effects), function(fx) {
              if (!that.fx) that.fx = "none";
              out.push({
                name: fx,
                radio: "FX_list",
                selected: that.fx === fx,
                action: function(arg) {
                  that.fx = fx;
                  that.el.base.className = that.el.base.className.replace(
                    /fx_\w+/,
                    ""
                  );
                  if (fx !== "none")
                    $exe.call({ silent: true }, "fx", fx, that.el.base);
                },
              });
              //if (fx === 'none') out.push({name: '---'});
            });
            return out;
          },
        },
        { name: "---" },
      ],
    },
    headerBtn: [
      {
        name: "help",
        init: function() {
          return !!this.help;
        },
        action: function() {
          $alert.info(this.cfg.help);
        },
      },
      {
        name: "pin",
        title: "pin this window (it will reopen each time you boot windows93)",
        init: function() {
          //console.log(1, this);
          /*return false;
        if (this.caller && this.pinnable !== false) {
          console.log('caller', this.caller);
          if (this.caller.that.silent !== true && this.caller.arg.command) {
            var cmd = this.caller.arg.command;
            this.onactive = $io.fn.proxy(this.onactive, function() {
              $route(cmd);
            });

            $route(cmd);
          }

          var pinId = this.caller.that.pinned;
          if (typeof pinId === 'number' && le._pins[pinId]) {
            this.onclose = $io.fn.proxy(this.onclose, function() {
              $route('');
              le._pins.splice(pinId,1);
              //console.log(le._pins, pinId);
            });
            this.onresize = $io.fn.proxy(this.onresize, function() {
              le._pins[pinId][1].width = this.el.body.offsetWidth;
              le._pins[pinId][1].height = this.el.body.offsetHeight;
            });
            this.ondrag = $io.fn.proxy(this.ondrag, function() {
              //console.log(le._pins, pinId);
              le._pins[pinId][1].top = this.el.base.offsetTop;
              le._pins[pinId][1].left = this.el.base.offsetLeft;
            });
            return 'pressed';
          }
          return true;

        }*/
        },
        action: function(e) {
          //console.log(e.target);
          var btn = e.target;
          if (this.cfg.caller.that.pinned) {
            delete le._pins[this.cfg.caller.that.pinned];
            this.cfg.caller.that.pinned = null;
            btn.classList.remove("pressed");
          } else {
            var w = this.el.body.offsetWidth;
            var h = this.el.body.offsetHeight;
            var t = this.el.base.offsetTop;
            var l = this.el.base.offsetLeft;
            le._pins.push([
              this.cfg.caller.arg.command,
              {
                width: w,
                height: h,
                top: t,
                left: l,
              },
            ]);
            $route("");
            //console.log(le._pins);
            btn.classList.add("pressed");
          }
          /*console.log(w,h,t,l);
        console.log(this.cfg.caller.arg.command);*/
        },
      },
    ],
  });

  /*$key.config({
    onerror: function(e) {
      $alert.error(e);
      return false;
    }
  });*/

  $screenshot.config({ default: le._dom.screen });

  $notif.config({ default: le._dom.clock, dest: le._dom.desktop });

  $alert.config({
    sound: function(snd) {
      if (snd && le._sound[snd]) le._sound[snd].play();
    },
  });
});
