!(function(global) {
  "use strict";

  var notes = [],
    dummyDiv = document.createElement("div");

  function getTxt(body) {
    // chrome is thinking it's fine to add <div> and <div><br></div> on newline =_=
    dummyDiv.innerHTML = body.innerHTML.replace(
      /\n|<br>|<div><br><\/div>|<div>/g,
      "_newline___ktlu_"
    );
    var txt = dummyDiv.innerText || dummyDiv.textContent;
    return $io.str.autolink(txt.replace(/\n|_newline___ktlu_/g, "<br>"));
  }

  var initText = "--- Type something ---";

  function saveChanges() {
    //$db.set('.config/Pinned.json', saveAll());
  }
  var debounce = $io.fn.debounce(saveChanges, 300);

  function _note(msg) {
    var instanceIndex = 0;
    if (!msg) msg = initText;
    $window(
      $extend(
        {
          baseClass: "ui_note",
          icon: "c/sys/skins/w93/apps/pin.png",
          title: "Note",
          html: msg,
          baseHeight: 200,
          baseWidth: 200,
          img: null,
          dock: null,
          maximi: true,
          resizable: true,
          onopen: function(el, body) {
            instanceIndex = notes.push({ el: el, body: body }) - 1;
            body.setAttribute("tabindex", "0");
            body.innerHTML = getTxt(body);
            body.onblur = function() {
              body.contentEditable = false;
              body.innerHTML = getTxt(body);
              saveChanges();
            };
            body.onfocus = function() {
              body.contentEditable = true;
              body.style.borderColor = "#000";
            };
            body.onkeyup = function() {
              debounce();
            };
          },
          onclose: function(el, body) {
            notes[instanceIndex] = null;
            saveChanges();
          },
          onresize: debounce,
          ondragstop: debounce,
        },
        msg
      )
    );
  }

  //var def = ['Lorem ipsum dolor sit amet,\n www.windows93.net', 'ho yeah'];
  var def = [];

  function saveAll() {
    var out = [];
    $io.arr.all(notes, function(item) {
      if (item) {
        //console.log(getTxt(item.body));
        out.push({
          html: getTxt(item.body),
          baseWidth: item.el.offsetWidth,
          baseHeight: item.el.offsetHeight,
          top: item.el.offsetTop,
          left: item.el.offsetLeft,
        });
      }
    });
    return out;
  }

  /*$db(def, '.config/Pinned.json',
    function(err, val) {
      if ($io.is.arr(val)) {
        $io.arr.all(val, function(item) {
          $note(item);
        });
      }
    }
  );*/

  global.$note = _note;
})(this);
