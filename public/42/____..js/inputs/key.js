
!function(global) { 'use strict';

  // JavaScript Madness: Keyboard Events
  // http://unixpapa.com/js/key.html

  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/fromCodePoint
  // https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key
  // https://w3c.github.io/uievents/#widl-KeyboardEvent-key
  // https://w3c.github.io/DOM-Level-3-Events-key/
  // https://msdn.microsoft.com/en-us/library/dd375731(v=VS.85).aspx

  // thanks Moustrap & CodeMirror

  // Element matches Polyfill
  !function(p) {
    if (Element && !p.matches) p.matches = p.matchesSelector
      || p.mozMatchesSelector || p.msMatchesSelector
      || p.oMatchesSelector || p.webkitMatchesSelector
    ;
  }(Element.prototype);

  var
     docEl = document.documentElement
    //,SfCC = String.fromCodePoint
    ,SfCC = String.fromCharCode
    ,CapsLockON = false

    ,sessions = []
    ,listeners = [{data:{}}]

    // choosen favorite aliases (with capitalisation auto-detect)
    ,FAVORITES = 'ctrl super altgr left up right down space caps scroll print menu esc ins del'
    //,FAVORITES = 'CTRL SUPER ALTGR LEFT UP RIGHT DOWN SPACE'
    //,FAVORITES = 'Ctrl Super AltGr Left Up Right Down Space'
    // every aliases for combo writing
    ,ALIAS = [
       '⌫ Bksp Backspace'
      ,'↲ Enter'
      ,'⇧ Shift'
      //,'Shift'
      ,'⇫ Caps CapsLock'
      //,'Caps CapsLock'
      //,'↹ Tab'
      //,'⌥ Option Alt'
      ,'Option Alt'
      //,'^ Ctrl Control'
      ,'Ctrl Control'
      ,'🍐 ♥  ⌘ Cmd Win Meta Super Command OS'
      ,'⇞ PgUp PageUp'
      ,'⇟ PgDn PgDown PageDown'
      ,'↖ Home'
      ,'↘ End'
      ,'↤ ← Left ArrowLeft'
      ,'↥ ↑ Up ArrowUp'
      ,'↦ → Right ArrowRight'
      ,'↧ ↓ Down ArrowDown'
      ,'⎵ Space Spacebar'
      ,'Del Delete'
      ,'Ins Insert'
      //,'⎙ Print PrintScr PrintScreen'
      ,'Print PrintScr PrintScreen'
      ,'☰ Menu Apps Context_menu ContextMenu'
      ,'ScrLk Scroll ScrollLock'
      ,'AltGr AltGraph'
      ,'Break Pause'
      ,'Esc Escape'
      ,'Multiply *'
      ,'Add +'
      ,'Subtract -'
      ,'Decimal Period .'
      ,'Divide Slash /'
      ,'Backslash \\'
      ,'Equals ='
      ,'Semicolon ;'
      ,'Comma ,'
      ,'Hash Sharp Hashtag Octothorpe #'
    ]

    // w3c key
    ,code__w3c = {
      3:"Enter",8:"Backspace",9:"Tab",12:"Clear",13:"Enter",16:"Shift",17:"Control",18:"Alt",
      19:"Pause",20:"CapsLock",27:"Escape",32:"Spacebar",33:"PageUp",34:"PageDown",35:"End",36:"Home",
      37:"ArrowLeft",38:"ArrowUp",39:"ArrowRight",40:"ArrowDown",
      44:"PrintScreen",45:"Insert",46:"Delete",
      //52:"Enter",54:"Meta",55:"Meta",
      91:"OS",92:"OS",93:"ContextMenu",96:"Insert",108:"Enter",124:"PrintScreen",127:"Delete",
      144:"NumLock",145:"ScrollLock",
      //0xA6:"BrowserBack",167:"BrowserForward",
      224:"OS",225:"AltGraph",
      63232:"ArrowUp",63233:"ArrowDown",63234:"ArrowLeft",63235:"ArrowRight",63272:"Delete",
      63273:"Home",63275:"End",63276:"PageUp",63277:"PageDown",63302:"Insert"
    }
    ,alias__w3c = {}
    ,w3c__small = {}
    ,w3c__symbol = {}
    ,code__favs = {}
    ,w3c__favs = {}
    ,favs__w3c = {}

    ,Shift
    ,Alt
    ,AltGraph
    ,Control
    ,CapsLock

    ,MODS = {}

    ,i
  ;
  // Function keys
  for (i = 1; i <= 12; i++) code__w3c[i + 111] = code__w3c[i + 63235] = "F" + i;

  function setAliases() {
    for (var i = 0, l = ALIAS.length; i < l; i++) {
      var n = ALIAS[i].split(' ');
      var ref = n.pop();
      for (var j = n.length - 1; j >= 0; j--) {
        if (n[j].length < 3) w3c__symbol[ref] = n[j], w3c__symbol[ref+'Right'] = n[j];
        else if (n[j].length < ref.length) w3c__small[ref] = n[j], w3c__small[ref+'Right'] = n[j];
        alias__w3c[n[j].toLowerCase()] = ref;
      }
    }
    var favs = FAVORITES.split(' ');
    var favCase = favs[0].toLowerCase() === favs[0] ? 'toLowerCase' : favs[0].toUpperCase() === favs[0] ? 'toUpperCase' : null;
    for (var i = 0, l = favs.length; i < l; i++) {
      w3c__favs[alias__w3c[favs[i].toLowerCase()]] = favs[i]
    }
    for (var prop in code__w3c) {
      if (code__w3c.hasOwnProperty(prop)) {
        code__favs[prop] = w3c__favs[code__w3c[prop]] || (favCase ? code__w3c[prop][favCase]() : code__w3c[prop]);
        w3c__favs[code__w3c[prop]] = code__favs[prop];
        favs__w3c[code__favs[prop]] = code__w3c[prop];
      }
    }
    Shift = w3c__favs['Shift'];
    Alt = w3c__favs['Alt'];
    AltGraph = w3c__favs['AltGraph'];
    Control = w3c__favs['Control'];
    CapsLock = w3c__favs['CapsLock'];

    for (var prop in MODS) if (MODS.hasOwnProperty(prop)) delete MODS[prop];

    MODS.normal = {normal:{}};
    MODS.normal[Alt] = {};
    MODS.normal[AltGraph] = {};
    MODS.normal[Control] = {};
    MODS[Shift] = {normal:{}};
    MODS[Shift][Alt] = {};
    MODS[Shift][AltGraph] = {};
    MODS[Shift][Control] = {};
    MODS[CapsLock] = {normal:{}};
    MODS[CapsLock][Alt] = {};
    MODS[CapsLock][AltGraph] = {};
    MODS[CapsLock][Control] = {};
  }
  setAliases();


  // helpers
  /////////////////////////////////////////////////////////////////////////////

  function stopEvent(e) {
    // You shall not pass!
    if (e.preventDefault) e.preventDefault();
    else e.returnValue = false;
    //if (e.stopPropagation) e.stopPropagation();
    //else e.cancelBubble = true;
    return false;
  }

  function isCapslock(e) {
    // http://stackoverflow.com/a/3815931
    var ch = SfCC(e.which);
    if (ch.toUpperCase() === ch.toLowerCase()) return;
    return ((e.shiftKey && ch.toLowerCase() === ch) ||
           (!e.shiftKey && ch.toUpperCase() === ch))
  }

  function translateCode(code, set) {
    var pathToranslate = MODS[
        (CapsLockON && _key[Shift]) ? 'normal'
        : CapsLockON ? CapsLock
        : _key[Shift] ? Shift
        : 'normal'
      ][
        _key[Alt] ? Alt
        : _key[AltGraph] ? AltGraph
        : _key[Control] ? Control
        : 'normal'
      ]
    ; // okay, thats some weird javascript here
    if (set && !pathToranslate[code]) pathToranslate[code] = set;
    return pathToranslate[code];
  }
  function translate(code) {
    var hasTransl = translateCode(code);
    return {
      key: hasTransl ? SfCC(hasTransl) : (SfCC(code))[(_key[Shift] || CapsLockON) ? 'toUpperCase' : 'toLowerCase'](), // >_<
      code: hasTransl || code
    }
  }

  function sendInfo(sess) {
    var out = $extend({}, sess.data);

    /////////////////////////////////////////////////////////////////////////////
    out.session = sess
    /////////////////////////////////////////////////////////////////////////////

    out.w3c = favs__w3c[sess.data.key] || sess.data.key;
    //console.log(out.w3c);
    out.loc = out.w3c; //sess.data.key;
    out.pos = 'Standard';
    if (sess.data.event && sess.data.event.location) {
      if (sess.data.event.location === 3) {
        out.pos = 'Numpad';
        out.loc = 'Numpad' + out.w3c
      } else if (!sess.data.char) {
        //out.pos = (sess.data.event.location === 2 ? 'Right' : 'Left');
        out.pos = (sess.data.event.location === 2 ? 'Right' : '');
        out.loc = out.w3c + out.pos;
      }
    }
    out.CapsLock = CapsLockON;

    return out
  }

  function process(e, sess) {
    //console.log('porcess sess', sess)
    if (!sess) return

    var nfo;
    function run(fn) {
      if (fn) {
        var res = fn.call(sess.thisArg, sess.data.key, nfo = nfo || sendInfo(sess))
        //console.log('res', fn, res)
        if (sess.preventDefault || res === false) {
          stopEvent(e);
        }
      }
    }
    function removePossibleCombo(combo) {
      if (combo) {
        var comboIndex = sess.possibleCombo.indexOf(combo);
        if (comboIndex > -1) sess.possibleCombo.splice(comboIndex, 1);
        if (combo.then) removePossibleCombo(combo.then);
      }
    }
    var keys;
    function checkCombo(combo) {
      keys = keys || _key.keys;
      //console.log(keys)
      for (var i = 0, l = combo.length; i < l; i++) {
        var ok = false;
        for (var j = 0, m = combo[i].keys.length; j < m; j++) {
          if (keys.indexOf(combo[i].keys[j]) === -1) {
            if (sess.comboStrict) {
              ok = false;
              removePossibleCombo(combo[i].parent);
              break
            } else {
              if (keys.indexOf(combo[i].keys[j].toUpperCase()) === -1) {
                ok = false;
                removePossibleCombo(combo[i].parent);
                break
              }
            }
          }
          ok = true;
        }
        if (ok) {
          if (combo[i].run) {
            //stopEvent(e);
            run(combo[i].run);
            removePossibleCombo(combo[i].parent);
            if (sess.stopPropagation || sess.uniqueCombo) break;
            //if (sess.uniqueCombo) break;
          }
          else if (combo[i].then && sess.possibleCombo.indexOf(combo[i].then) === -1) sess.possibleCombo.push(combo[i].then);
        }
      }
    }

    function done() {
      if (!sess.data.key) {
        var translated = translate(sess.data.code);
        sess.data.code = translated.code;
        sess.data.char = sess.data.key = translated.key;
      }
      _key[sess.data.key] = true;

      run(sess.down);
      checkCombo(sess.combo ? sess.combo.concat(sess.possibleCombo) : sess.possibleCombo);

      for (var prop in sess.data) if (sess.data.hasOwnProperty(prop)) delete sess.data[prop];
    }

    sess.data.event = e;

    //console.log(e.keyCode)

    if (e.type === 'keydown') {
      //console.log()
      if (sess.repeat === false && e.repeat) {done = null; stopEvent(e); return}

      sess.data.code = e.which;
      sess.data.key = code__favs[e.which] || null;
      sess.data.char = '';
      //console.log(e.ctrlKey, sess.data.key);
      if (sess.preventDefault && (e.ctrlKey || sess.data.key)) stopEvent(e), e.stopImmediatePropagation(); // don't fire "keypress"
      if (e.ctrlKey || e.shiftKey || sess.data.key) { // keypress is not needed
        //console.log('???', e.ctrlKey || sess.data.key, e.ctrlKey, sess.data.key);
        done();
        done = null;
        sess.data.safe = true;
      }
      //if (sess.preventDefault) stopEvent(e);
    }
    if (e.type === 'keypress') {
      sess.data.char = SfCC(e.which);
      //console.log(1111, sess.data.char)
      translateCode(sess.data.code, e.which);
      var CapsLockHint = isCapslock(e);
      if (typeof CapsLockHint === 'boolean') CapsLockON = CapsLockHint;
      if (!sess.repeat && e.repeat || sess.data.safe) {
        //console.log('dafuck', sess.data.safe)
        done = null; return
      }

      if (!sess.data.key) {
        sess.data.code = e.which;
        sess.data.key = SfCC(e.which);
      }
    }
    if (e.type === 'keyup') {
      //console.log('keyup');
      done = null;

      var translated = translate(e.which);
      sess.data.code = translated.code;
      sess.data.char = translated.key;
      sess.data.key = code__favs[e.which] || translated.key;

      _key[sess.data.key] = false;

      run(sess.up);

      // delete key from modifier if modifier is release
      var releasedKey = sess.data.key;
      for (var mod1 in MODS) {
        if (MODS.hasOwnProperty(mod1)) {
          for (var mod2 in MODS[mod1]) {
            //console.log(releasedKey, mod1, mod2);
            if (MODS[mod1].hasOwnProperty(mod2) && (releasedKey === mod1 || releasedKey === mod2)) {
              for (var mod in MODS[mod1][mod2]) if (MODS[mod1][mod2].hasOwnProperty(mod)) {
                sess.data.code = MODS[mod1][mod2][mod];
                sess.data.key = SfCC(sess.data.code)
                _key[sess.data.key] = false;
                //console.log('???', sess.data.key)
                //run(sess.up);
              }
            }
          }
        }
      }
      for (var prop in sess.data) if (sess.data.hasOwnProperty(prop)) delete sess.data[prop];

      if (sess.preventDefault) stopEvent(e);
    }

    // setTimeout trick to make keydown and keypress trigger the down listener only once
    // after a lot of research it's the most reliable way to have true internationnal charCode with
    // keydown and keyup events...
    // Shity situations :
    // - when the Ctrl key is pressed : keypress will not fire :(
    // - composable keys, if the first time you press a key, it's during a composable, it will become the translated key....
    // KeyboardEvent.key will replace that one day, but right now it's a crossbrowser hell
    sess.timer = setTimeout(done, 1);

    //console.log('????')

    if (sess.stopPropagation === true) return false;
  }

  function globalHandler(e) {
    e = e || window.event;
    if (typeof e.which !== 'number') e.which = e.keyCode; // http://stackoverflow.com/a/4285801
    for (var i = 0, l = sessions.length; i < l; i++) if (process(e, sessions[i]) === false) break;
  }

  docEl.addEventListener('keydown', globalHandler, false);
  docEl.addEventListener('keypress', globalHandler, false);
  docEl.addEventListener('keyup', globalHandler, false);

  // because most element don't have native focus/tabindex, keyevents won't work correctly !
  // Instead of adding fake tabindex, we delegate clicks to find any element with $key listener
  docEl.setAttribute('tabindex', '0');
  // docEl.addEventListener('blur', delegate, true);
  // docEl.addEventListener('focusout', delegate, true);
  // docEl.addEventListener('focusin', function (e) {
  //   console.log('k focusin')
  //   delegate(e)
  // }, true);
  docEl.addEventListener('focus', function (e) {
    // console.log('k focus')
    delegate(e)
  }, true);
  docEl.addEventListener('click', function (e) {
    // console.log('k click')
    delegate(e)
  }, true);
  docEl.focus();

  function delegate(e) {
    // console.log('delegate')
    var targ = e.target;
    sessions.length = 0;

    if (listeners.length) {
      while (targ && targ.nodeType === 1) {
        for (var i = 0, l = listeners.length; i < l; i++) {
          var sess = listeners[i];
          if (sess.selector) {
            if (targ.matches(sess.selector)) sessions.push($extend({thisArg: targ}, sess));
          } else {
            // if (targ.isSameNode(sess.el)) sessions.push($extend({thisArg: targ}, sess));
            // if (targ.isEqualNode(sess.el)) sessions.push($extend({thisArg: targ}, sess));
            if (targ === sess.el) sessions.push($extend({thisArg: targ}, sess));
          }
        }
        targ = targ.parentNode;
      }
    }

    // console.log(sessions)
  }



  // if a keydown shortcut call a function that focus outside the document
  // the keyup event is not called, so we must clean all pressed keys manualy
  docEl.addEventListener('focusout', function(e) {
    // console.log('focusout')
    setTimeout(function() {
      if (!document.hasFocus()) {
        //console.log('DOCUMENT OUT');
        for (var prop in _key) if (_key.hasOwnProperty(prop)) _key[prop] = false;
      }
    }, 0);
  }, false);

  // simple test, does everyone double click when something is broken ?
  // (like when a key is blocked in a video game)
  docEl.addEventListener('dblclick', function(e) {
    for (var prop in _key) if (_key.hasOwnProperty(prop)) _key[prop] = false;
  }, false);

  function parseCombo(combo) {
    var parsedCombos = [];
    for (var prop in combo) {
      if (combo.hasOwnProperty(prop)) {
        var multiples = prop.replace(/\+\+/g,'+add').split(', ');
        for (var i = 0, l = multiples.length; i < l; i++) {
          var parsedCombo = {};
          parsedCombos.push(parsedCombo);
          var register = multiples[i].split(' ');
          var curr = parsedCombo;
          for (var j = 0, m = register.length; j < m; j++) {
            var normalised = register[j].split('+');
            for (var k = 0, n = normalised.length; k < n; k++) {
              normalised[k] = w3c__favs[normalised[k]] || w3c__favs[alias__w3c[normalised[k].toLowerCase()]] || alias__w3c[normalised[k].toLowerCase()] || normalised[k];
            }
            curr.keys = normalised;
            if (j!==0 && register.length>1) curr.parent = parsedCombo;
            if (j===register.length-1) {
              curr.run = combo[prop];
            } else {
              curr = curr.then = {};
            }
          }
        }
      }
    }

    //console.log(parsedCombos);
    return parsedCombos;
  }

  function _key(el) {
    var session = {data:{}, possibleCombo:[]};
    if (typeof el === 'string') session.selector = el;
    else if (el && el.nodeType === 1) session.el = el;
    else session.el = docEl;
    var index = listeners.push(session);

    session.stack = (new Error('stack')).stack.split('\n')
    session.stack.shift()
    session.stack = session.stack.join('\n')
    //console.log(session.stack)

    var chain = {
      session: session,
      config: function(opt) {
        if (opt) {
          $extend( session, opt);
          return chain;
        }
        else return session
      }
      ,up: function(fn) {
        session.up = fn
        return chain;
      }
      ,down: function(fn) {
        session.down = fn
        return chain;
      }
      ,combo: function(combo) {
        //session.combo = parseCombo(combo);
        var parsedCombo = parseCombo(combo);
        if (!session.combo) session.combo = parsedCombo
        else session.combo = session.combo.concat(parsedCombo)
        session.combo = session.combo.sort(function(a, b) {
          return b.keys.length - a.keys.length
        })
        //console.log(session.combo)
        return chain;
      }
      ,destroy: function() {
        // console.log('$key destroyed');
        listeners.splice(index-1, 1);
      }
    }
    // retrofuture compatibility
    chain.set = chain.combo
    return chain
  }


  Object.defineProperties(_key, {
    'alias': {
      //value: w3c__favs
      value: {
        small: function(k) {
          return w3c__small[k] || k
        },
        symbol: function(k) {
          //console.log(111, k);
          return w3c__symbol[k] || w3c__small[k] || k
        },
        favorite: function(k) {
          return code__favs[k] || k
        }
      }
    }
    ,'keys': {
      get: function() {
        var out = [], prop;
        for (prop in _key) if (_key.hasOwnProperty(prop) && _key[prop]) out.push(prop);
        return out
      }
    }
    ,'activate': {
      value: function() {
        console.log('active')
      }
    }
  });


  global.$key = _key;
}(this);

/*$key()
  .up(function(k, nfo) {
    console.log("up", k)
    //console.log($key.keys)
  })
  .down(function(k, nfo) {
    //console.log($key.keys)
    //console.log('down', k)
  })*/