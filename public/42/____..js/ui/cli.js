/*
  88      dP"Yb   dP""b8
  88     dP   Yb dP   `"
  88  .o Yb   dP Yb  "88
  88ood8  YbodP   YboodP
*/

!(function(global) {
  "use strict";

  var line,
    switches = [
      "clear",
      "error",
      "error",
      "succes",
      "fail",
      "pass",
      "warn",
      "info",
      "bold",
      "italic",
      "red",
      "blue",
      "green",
      "white",
      "yellow",
      "cyan",
      "magenta",
      "html",
      "autolink",
      "code",
      "pad",
      "right",
      "center",
      "repeat",
      "stack",
      "save",
      "stay",
      "id",
      "fast",
      "group",
      "noop",
      "obj",
      "end",
    ],
    cfg = { el: null },
    props = {},
    classes = "";
  for (var i = 0, l = switches.length; i < l; i++) {
    cfg[switches[i]] = "";
    props[switches[i]] = (function(val) {
      return function() {
        cfg[val] = "1";
      };
    })(switches[i]);
  }

  function stringify(txt) {
    if (typeof txt === "string") return txt; //$io.stringify(txt, 2); //html ? txt : $str$.htmlEncode(txt);
    if ($io.isNumber(txt)) return '<span class="sh_number">' + txt + "</span>";
    if (txt === undefined) return "undefined";
    if (txt === null) return "null";
    if (typeof txt === "function") return $io.str.hilit($io.fn.str(txt));
    if ($io.isObject(txt) || $io.isArray(txt))
      return $io.str.hilit($io.stringify(txt, 2));

    if (typeof txt.constructor === "function")
      return (
        "<span class=sh_init>" +
        txt.constructor.name +
        "</span> " +
        $io.str.hilit($io.stringify(txt, 2), true)
      );

    return txt;
  }

  function traceObj(obj, ignore) {
    for (var key in obj) {
      var item = obj[key];
      if (key == ignore) return;
      if (
        typeof item == "string" ||
        typeof item == "number" ||
        typeof item == "boolean"
      ) {
        _log.pad(key, item + "", ".");
      } else if ($io.is.Object(item)) traceObj(item, ignore);
    }
  }

  function _log(str, st2, st3) {
    // handle options
    if (cfg.clear) {
      cfg.el.innerHTML = "";
      cfg.clear = "";
      return;
    }
    if (cfg.repeat) (str = str.repeat(cfg.cols)), (cfg.repeat = "");
    if (cfg.code) (str = $io.str.hilit(str)), (cfg.code = "");
    if (cfg.pass)
      (str = "✔ " + str), (classes += "ui_log__green"), (cfg.pass = "");
    if (cfg.fail)
      (str = "✘ " + str), (classes += "ui_log__red"), (cfg.fail = "");
    if (cfg.info)
      (str = "ℹ " + str), (classes += "ui_log__blue"), (cfg.info = "");
    if (cfg.italic) (classes += " italic"), (cfg.italic = "");
    if (cfg.bold) (classes += " bold"), (cfg.bold = "");
    if (cfg.white) (classes += " ui_log__white"), (cfg.white = "");
    if (cfg.yellow) (classes += " ui_log__yellow"), (cfg.yellow = "");
    if (cfg.cyan) (classes += " ui_log__cyan"), (cfg.cyan = "");
    if (cfg.magenta) (classes += " ui_log__magenta"), (cfg.magenta = "");
    if (cfg.blue) (classes += " ui_log__blue"), (cfg.blue = "");
    if (cfg.red) (classes += " ui_log__red"), (cfg.red = "");
    if (cfg.succes) (classes += " ui_log__green"), (cfg.succes = "");
    if (cfg.green) (classes += " ui_log__green"), (cfg.green = "");
    if (cfg.error) (classes += " ui_log__red js_error"), (cfg.error = "");
    if (cfg.obj) {
      cfg.obj = "";
      traceObj(str, st2);
      return;
    }

    // if error
    if ($io.type(str) === "Error") {
      str =
        str.constructor.name + "\n" + str.message + $io.str.autolink(str.stack);
    }

    //console.log('??', cfg);
    if (cfg.pad) {
      var dot;
      if (st3) dot = st3;
      else (dot = st2), (st2 = "");
      var nb = cfg.cols - 3 - (str.length + (st2 || "").length + (st2 ? 2 : 1));
      str =
        str +
        " " +
        dot.repeat((3 + (nb >= 0 ? nb : 0)) / dot.length) +
        (st2 ? " " + st2 : "");
      if (str.length > cfg.cols)
        str = str.match(new RegExp(".{1," + cfg.cols + "}", "g")).join("\n");
      cfg.pad = "";
    } else if (st2) {
      var args = $io.arg.arr(arguments);
      str = args.join(", ");
    }

    // do nothing if there is no element destination
    if (!cfg.el) return;

    line = document.createElement("div");
    line.innerHTML = stringify(str);
    line.className = classes;
    cfg.el.appendChild(line);

    _log.trigger("addline");
    classes = "";
    return line;
  }

  _log.config = function(opt) {
    $extend(cfg, opt);
    //console.log(cfg);
    return _log;
  };

  $watch(_log);

  global.$log = $chain(_log, props, props);
})(this);

/*
   dP""b8 88     88
  dP   `" 88     88
  Yb      88  .o 88
   YboodP 88ood8 88
*/

!(function(global) {
  "use strict";

  function scrollBottom(el) {
    el.scrollTop = el.scrollHeight;
  }
  function autoResize(el) {
    //setTimeout(function() {
    el.style.height = el.scrollHeight + "px";
    //}, 10)
  }

  //http://stackoverflow.com/a/4238971/1289275
  function placeCaretAtEnd(el) {
    el.focus();
    var rng, sel;
    if (
      typeof window.getSelection != "undefined" &&
      typeof document.createRange != "undefined"
    ) {
      (rng = document.createRange()), (sel = window.getSelection());
      rng.selectNodeContents(el);
      rng.collapse(false);
      sel.removeAllRanges();
      sel.addRange(rng);
    } else if (typeof document.body.createTextRange != "undefined") {
      rng = document.body.createTextRange();
      rng.moveToElementText(el);
      rng.collapse(false);
      rng.select();
    }
  }

  var historyLimit = 5;
  _cli.clearhistory = function() {
    historyGlobal.length = 0;
  };
  //var historyGlobal = [];
  var historyGlobal = global.$store
    ? $store(
        ".config/history.json",
        [],
        function(val) {
          historyGlobal = val;
        },
        function() {
          //if(historyGlobal.length > historyLimit) historyGlobal.splice(0, historyGlobal.length-historyLimit);
          return historyGlobal;
        }
      )
    : [];

  function _cli(el, opt) {
    var def = {
        cols: 59,
        //el: document.body,
        exe: $noop,
        prompt: ">",
        history: historyGlobal,
      },
      cfg = $extend(def, opt),
      //cfg = $extend({}, def, opt)
      el_content = document.createElement("code"),
      el_out = document.createElement("div"),
      el_in = document.createElement("div"),
      el_prompt = document.createElement("span"),
      el_input = document.createElement("textarea");

    if (!el) return;

    cfg.prompt += "&nbsp;";
    el_prompt.innerHTML = cfg.prompt;

    el_input.innerHTML = "";
    el_input.spellcheck = false; //el_input.focus();el_input.blur();
    el_input.rows = "1";
    el_input.style.outline = "0 none";
    el_input.style.boxShadow = "0 0 transparent";
    el_input.style.textShadow = "0 0 transparent";
    el_input.style.border = "0 none";
    el_input.style.verticalAlign = "top";
    el_input.style.resize = "none";
    el_input.style.padding = "0";
    el_input.style.margin = "0";
    el_input.style.height = "auto";
    el_input.style.width = "100%";
    el_input.style.color = "inherit";
    el_input.style.font = "inherit";
    el_input.style.fontSize = "inherit";
    el_input.style.background = "transparent";
    el_input.style.overflow = "hidden";
    el_input.style.textIndent = "0";

    el_in.style.display = "table";
    el_in.style.tableLayout = "fixed";
    el_input.style.display = "table-cell";
    el_prompt.style.display = "table-cell";
    el_prompt.style.width = "1%";
    el_prompt.style.whiteSpace = "nowrap";

    el_in.appendChild(el_prompt);
    el_in.appendChild(el_input);
    el_content.appendChild(el_out);
    el_content.appendChild(el_in);
    el_content.style.display = "block";
    el_content.style.width = cfg.cols + "ch";
    el_content.style.whiteSpace = "pre-wrap";
    el_content.style.wordBreak = "break-word";
    el_content.style.wordWrap = "break-word";

    el.appendChild(el_content);
    el.style.overflowY = "scroll";
    if (cfg.rows) el.style.height = cfg.rows + "em";

    function current() {
      $log.config({ cols: cfg.cols, el: el_out });
    }

    function setFocus() {
      if (global.$selection) {
        if (!$selection.get()) {
          //placeCaretAtEnd(el_input);
          setTimeout(function() {
            el_input.focus();
            current();
          }, 200);
        }
      }
    }

    // events
    /////////////////////////////////////////////////////////////////////////////

    $log.on("addline", function() {
      scrollBottom(el);
    });

    el.addEventListener("mouseup", setFocus, false);
    el.addEventListener("contextmenu", setFocus, false);
    // setFocus()

    el_input.addEventListener(
      "mouseup",
      function(e) {
        if (e.stopPropagation) e.stopPropagation();
        else e.cancelBubble = true;
        e.stopImmediatePropagation();
        current();
      },
      false
    );

    el_input.addEventListener(
      "paste",
      function(e) {
        //e.preventDefault();
        setTimeout(function() {
          triggerHeightChange(el_input);
        }, 0);
      },
      false
    );

    function triggerHeightChange(el) {
      autoResize(el);
      scrollBottom(el);
    }

    var histCur = 0;
    var isBrowsingHint = false;
    var keyInst = $key(el).down(function(k, code, e) {
      // var keyInst = $key(el_content).down(function(k, code, e) {
      // var keyInst = $key(el_input).down(function(k, code, e) {

      // console.log('???', k);

      triggerHeightChange(el_input);
      var l = cfg.history.length;

      if (instance.onkey(k, el_input.value) === false) return false;

      if (k == "enter") {
        var v = $io.str.trim(el_input.value);
        if (!v) {
          instance.log(cfg.prompt);
          return false;
        }
        el_input.value = "";
        el_input.style.height = "auto";
        histCur = 0;
        if (instance.onenter(v) === false) return false;
        instance.log(cfg.prompt + v);
        if (cfg.history[l - 1] != v) cfg.history.push(v);

        if (!cfg.exe.call(instance, v)) {
          try {
            instance.log(eval.call(window, v));
          } catch (e) {
            instance.log.error(e.message + "\n");
            //$log.error.autolink(e.message+' \n'+$io.str.autolink(e.stack.replace(e.message,'')))
          }
        }
        return false;
      }

      if (!el_input.value) isBrowsingHint = false;

      if (!isBrowsingHint) {
        if (k == "up") {
          histCur++;
          if (histCur > l) histCur = l;
          el_input.value = cfg.history[l - histCur] || "";
          triggerHeightChange(el_input);
          return false;
        }
        if (k == "down") {
          histCur--;
          if (histCur < 0) histCur = 0;
          el_input.value = cfg.history[l - histCur] || "";
          triggerHeightChange(el_input);
          return false;
        }
      }
    });

    var logInst = $log.config({ cols: cfg.cols, el: el_out });
    //console.log(logInst);

    var instance = {
      cli: true,
      cfg: cfg,
      destroy: function() {
        keyInst.destroy();
        this.ondestroy();
        console.log("@todo : terminal destroy");
      },
      setFocus: setFocus,
      ondestroy: $noop,
      onenter: $noop,
      onkey: $noop,
      prompt: el_prompt,
      input: el_input,
      log: logInst,
    };

    return instance;
  }

  global.$cli = _cli;

  /////////////////////////////////////////////////////////////////////////////
  /*$hint(el_input, {
    classes: {
      ul: 'cli-hints',
      li: 'cli-hints__hint',
      active: 'cli-hints__hint--active'
    }
    ,source: function(req) {
      req = req.split(' ').pop();
      var reg = new RegExp('^'+$io.reg.escape(req), 'i');
      var out = [];
      for (var prop in window) {
        if (window.hasOwnProperty(prop))
          if (reg.test(prop)) out.push('<b>'+prop+'<b>');
        else
          if (reg.test(prop)) out.push('<em>'+prop+'<em>');
      }
      isBrowsingHint = out.length > 1;
      return out.sort();
    }
  });*/
  /////////////////////////////////////////////////////////////////////////////

  /*$('#term').terminal(function(command, term) {
      if (command == 'foo') {
          term.push(function(command) {
              if (command.match(/y|yes/i)) {
                  term.echo('execute your command here');
                  term.pop();
              } else if (command.match(/n|no/i)) {
                  term.pop();
              }
          }, {
              prompt: 'Are you sure? '
          });
      }
  });*/
})(this);
