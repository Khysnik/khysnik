
system42('exe', function(le) { 'use strict';

  var apps = le._apps;

  // display commands in the url
  /////////////////////////////////////////////////////////////////////////////

  function openLink(data) {
    // console.log(123, data);
    var domain = $url.getDomain(data.url);

    // external links
    if (domain && location.hostname != domain) {
      // $url.checkFavicon(data.url, function(ok, fav) {
      //   if (ok) data.icon = fav;
      //   else if (img) data.icon = $fs.utils.getIcon(data.url);
      //   $window(data);
      // });
      $window(data);
      return true;

    } else {

      if (data.url.slice(-1) === '/') {

        $explorer(data.url);
        return true;

      } else if (data.url) {
        var opener;
        if (data.openers) {
          opener = apps[data.openers.split(',')[0]];
        } else {
          var openers = $fs.utils.getOpeners(data.url);
          if (openers[0]) opener = apps[openers[0]];
          //console.log(1, openers[0], apps);
        }
        if (opener && opener.exec) {
          //console.log(opener);
          //opener.exec.call({le:le, cli:this, arg:{command: data.url, arguments:[data.url], options:data}});
          runCmd.call(this, opener, {command: data.url, arguments:[data.url], options:data});
          return true
        }
      }

      return false;

    }
    return false;
  }


  function runCmd(app, arg) {

    // if command must run in terminal and no terminal is opened
    var that = this || {};
    var isFromCli = that && that.cli;
    if (app.terminal === true && !isFromCli) {
      _exe.call(this, 'terminal', '', {
        onopen: function(cli) {
          //console.log('???');
          setTimeout(function() {
            //console.log('cli');
            app.exec.apply({le:le, that:that, cli:cli, arg:arg});
          }, 100);
        }
      })
    } else {
      app.exec.apply({le:le, that:that, cli:isFromCli ? that : null, arg:arg});
    }
    return true
  }

  /////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////

  function _exe(cmd, arg, opt) {

    // console.log(cmd)

    // multiple commands with pipe
    if (cmd && typeof cmd == 'string' && cmd.indexOf(' | ') != -1) {
      var that = this;
      var cmds = cmd.split(' | ');
      if (!that.silent) {$route(cmd); that.slient = true};
      $io.arr.each(cmds, function(cmd, i) {
        setTimeout(function() {
          _exe.call(that, cmd);
        }, 700*i);
      });
      return true;
    }

    if (cmd) {

      // if cmd is an element
      /////////////////////////////////////////////////////////////////////////////
      if (cmd.nodeType && cmd.nodeType === 1) {
        var data = $extend({}, cmd.dataset);
        //if (data.iframe) {data.url = data.iframe; $window(data); return true;}

        if (data.exe) return _exe(data.exe, arg, data);
        if (data.alert) {$alert(data.alert); return true;}
        if (data.error) {$alert.error(data.error); return true;}


        // if (data.url) {
        //   if (!data.icon) {
        //     var img = cmd.getElementsByTagName('img')[0];
        //     if (img) data.icon = img.src;
        //   };
        //   return openLink.call(this, data);
        // }
      }
      // if cmd is one of the apps
      /////////////////////////////////////////////////////////////////////////////
      else if (apps[cmd] && apps[cmd].exec) {
        var res = runCmd.call(this, apps[cmd], {command:cmd, arguments: Array.prototype.slice.call(arguments, 1)});
        if (res !== false && apps[cmd].silent !== true) $route(cmd);
        return res;
      }
      // if cmd is a string
      /////////////////////////////////////////////////////////////////////////////
      else if (typeof cmd == 'string') {

        // console.log(cmd)

        if (cmd.indexOf('http')===0) {
          if (opt && opt.iframable !== undefined) {
            openURL(cmd, opt)
          } else {
            _exe.parseURL(cmd, function(opt) {
              //console.log(123, opt)
              openURL(opt.exe, opt)
            })
          }
          return true;
        }

        var parsed;
        try {
          parsed = _parse(cmd);
        } catch(e) {}

        // console.log(1234, parsed)

        if (parsed && parsed.program && apps[parsed.program] && apps[parsed.program].exec) {
          if (opt) parsed.launcher = opt;
          return runCmd.call(this, apps[parsed.program], parsed);
        }
        else {
          try {
            // console.log('???????????')
            if (cmd.indexOf('/') !== 0 && this && this.cfg && this.cfg.cwd) cmd = this.cfg.cwd + '/' + cmd;
            //var found = $io.obj.getPath(le._files, cmd, '/');
            var found = $fs.utils.exist(cmd);
            // console.log(1234, found, cmd);
            if (found !== false) {
              // console.log('KKK')
              if (typeof found.obj === 'object' && cmd.slice(-1) !== '/') cmd += '/';
              return openLink.call(this, {url: cmd});
            }
          } catch(e) {}
        }
      }

    }

    return false;

  }



  _exe.parseURL = function(link, cb, faviconCb) {
    var data = {title: link.replace(/https?:\/\/(www\.)?/, '').replace(/\/$/, ''), exe: link, icon: 'shortcut.png'};

    console.log(link, data)

    $url.checkFavicon(link, function(ok, icon) {
      if (ok) data.icon = icon, (faviconCb || $noop)(data);
      $ajax.post('/proxy.php', {url:link, favicon:!ok})
        .done(function(res) {
          //console.log(res)
          if (res.favicon) {
            $url.checkImage(res.favicon, function(ok) {
              data.icon = res.favicon;
              data.iframable = res.iframable;
              cb(data);
            })
          } else {
            data.iframable = res.iframable;
            cb(data);
          }
        })
      ;
    });

    return data;
  }

  _exe.silent = function() {
    return _exe.apply({silent:true}, arguments);
  }


  /*
    88""Yb    db    88""Yb .dP"Y8 888888
    88__dP   dPYb   88__dP `Ybo." 88__
    88"""   dP__Yb  88"Yb  o.`Y8b 88""
    88     dP""""Yb 88  Yb 8bodP' 888888
  */

  function _parse(cmd) {
    var parsedCommand = [];
    var parsedOptions = [];
    var options = {long:{},short:{}};
    var beginString = false;
    var beginOption = false;
    var optionLong = false;
    var Oindex = 0;
    var Cindex = 0;
    var c;
    for (var i = 0, l = cmd.length; i <= l; i++) {
      c = cmd.charAt(i);
      if (!beginString && c === '-' && (beginOption || cmd.charAt(i-1) === ' ')) {
        if (cmd.charAt(i + 1) === '-') optionLong = true;
        beginOption = true;
        continue;
      };
      if (c === '"' && cmd.charAt(i - 1) !== '\\') {
        beginString = !beginString
        continue;
      };
      if ((!beginString && c === ' ') || i === l ) {
        if (beginOption) {
          var s = parsedOptions[Oindex].split('=');
          var key = s[0];
          var val = s[1];
          var num = val*1;
          val = num == val ? num : val;
          if (optionLong) {
            if (key.indexOf('.') > -1)
              $io.obj.path(options.long, key, val ? val : true);
            else
              options.long[key] = val ? val : true;
          } else {
            var o = key.split('');
            for (var j = 0, m = o.length; j < m; j++) {
              options.short[o[j]] = val ? val : true;
            }
          }
          Oindex++;
          optionLong = false;
          beginOption = false;
        }
        else Cindex++;
        continue;
      }

      if (beginOption) {
        parsedOptions[Oindex] = parsedOptions[Oindex] ? parsedOptions[Oindex] + c : c;
      } else {
        parsedCommand[Cindex] = parsedCommand[Cindex] ? parsedCommand[Cindex] + c : c;
      }
    };
    //////////////////////////////////
    // console.log(parsedCommand)
    var program = parsedCommand.shift();
    if (apps[program] && apps[program].exec) {
      $io.obj.each(options.short, function(val, key) {
        if (apps[program].options && apps[program].options[key]) {
          options.long[apps[program].options[key][0]] = val
        } else {
          options.long[key] = val
        }
      });

      //parsedCommand.push(options.long);
      return {
        command: cmd,
        program: program,
        arguments: parsedCommand, //parsedCommand.length === 1 ? parsedCommand[0] : parsedCommand,
        options: options.long
      }
    } else {
      return false;
    }
  }


  /*
    .dP"Y8 888888 88""Yb 88 88b 88  dP""b8 88 888888 Yb  dP
    `Ybo."   88   88__dP 88 88Yb88 dP   `" 88 88__    YbdP
    o.`Y8b   88   88"Yb  88 88 Y88 Yb  "88 88 88""     8P
    8bodP'   88   88  Yb 88 88  Y8  YboodP 88 88      dP
  */

  function _stringify(opt) {
    function stringWithSpace(val) { 'use strict';
      return (val+'').indexOf(' ') > -1 ? ('"' + val + '"') : val
    }
    if (typeof opt === 'string') return ' ' + stringWithSpace(opt);
    var str = '';
    $io.obj.each(opt, function(val, key) {
      //console.log(val, key)
      //if (key === 'openers') return;
      if (typeof val === 'string' || typeof val === 'number') {
        val = (val+'').replace(/\"/g, '\\\"');
        str += ' --' + key + '=' + stringWithSpace(val);
      }
    });
    return str;
    //console.log(str);
    //console.log(_parse('img' + str).options[0].hello+'');
  }

  _exe.parseGeometry = function(geom) {
    //console.log(geom);
    var out = {};
    // https://regex101.com/r/qC7vW5/1
    geom.replace(/(?:(\d+|auto)x(\d+|auto))?(?:([+-])(\d+|auto)([+-])(\d+|auto))?/,
      function(_, width, height, refx, x, refy, y) {
      out.width = width || 'auto';
      out.height = height || 'auto';
      if (refx) {
        out.top = refy === '+' ? y : 'auto';
        out.bottom = refy === '-' ? y : 'auto';
        out.left = refx === '+' ? x : 'auto';
        out.right = refx === '-' ? x : 'auto';
      } else {
        out.top = 'auto';
        out.bottom = 'auto';
        out.left = 'auto';
        out.right = 'auto';
      }
    });
    return out
  }

  var YOUTUBE = /youtube\.com/i;
  function openURL(cmd, opt) {

    // console.log(cmd);
    $io.obj.all(le._get.embed, function(item) {
      if (item.playerRegExp.test(cmd)) {
        opt.iframable = true;
        cmd.replace(item.playerRegExp, function(_, schema, id) {
          cmd = item.buildSrcURL(schema, id)
        });
        console.log(cmd);
        /*if (item.isAdditionaResRequired()) {
          $io.arr.all(item.additionalRes, function(val) {
            var div = document.createElement('div');
            div.innerHTML = val.element;
            document.body.appendChild(div);
          });
        }*/
        return true;
      }
    });

    if (opt.iframable === "true" || opt.iframable === true) {
      runCmd.call(this, apps['iframe'], {command: cmd, program:'iframe', arguments:[cmd], launcher:opt, options:opt});
    } else {
      $alert.info('<a target="_blank" href="' + cmd + '">'+cmd+'</a><br>don\'t allow iframe embeding...')
    }
  }

  /*_exe.on = function(cmd, cb) {
    var ok = _exe(cmd)
    //console.log(ok)
    setTimeout(function() {
      cb(ok)
    }, 0)
  }*/

  _exe.parse = _parse;
  _exe.stringify = _stringify;
  window.$exe = _exe;

  // thanks : https://github.com/erost/ng-videosharing-embed
  function videoSettings(whitelist, settings) { 'use strict';
    var params = [];
    $io.obj.all(settings, function (value, key) {
      if (whitelist.indexOf(key) != -1) params.push([key, value].join('='));
    });
    return params.length > 0 ? "?" + params.join('&') : "";
  }
  le._get.embed = {
    youtube: {
      type: "youtube",
      settings: {
        autoplay: 0,
        controls: 1,
        loop: 0
      },
      whitelist: ['autohide', 'cc_load_policy', 'color', 'disablekb', 'enablejsapi',
        'autoplay', 'controls', 'loop', 'playlist', 'rel', 'wmode', 'start', 'showinfo',
        'end', 'fs', 'hl', 'iv_load_policy', 'list', 'listType', 'modestbranding', 'origin',
        'playerapiid', 'playsinline', 'theme'],
      transformAttrMap: {},
      processSettings : function(settings, videoID) {
        if(settings['loop'] == 1 && (settings['playlist'] == undefined)) {
          settings['playlist'] = videoID;
        }
        return settings;
      },
      buildSrcURL: function(protocol, videoID) {
        return protocol + this.playerID + videoID + videoSettings(this.whitelist, this.processSettings(this.settings));
      },
      playerID: 'www.youtube.com/embed/',
      playerRegExp: /([a-z\:\/]*\/\/)(?:www\.)?(?:youtube(?:-nocookie)?\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/,
      timeRegExp: /t=(([0-9]+)h)?(([0-9]{1,2})m)?(([0-9]+)s?)?/,
      isAdditionaResRequired: function() {
        return false;
      },
      additionalRes: []
    },
    vimeo: {
      type: "vimeo",
      settings: {
        autoplay: 0,
        loop: 0,
        api: 0,
        player_id: ''
      },
      whitelist: ['autoplay', 'autopause', 'badge', 'byline', 'color', 'portrait', 'loop', 'api',
        'playerId', 'title'],
      transformAttrMap: { 'playerId' : 'player_id'},
      processSettings : function(settings, videoID) {
        return settings;
      },
      buildSrcURL: function(protocol, videoID) {
        return protocol + this.playerID + videoID + videoSettings(this.whitelist, this.processSettings(this.settings));
      },
      playerID: 'player.vimeo.com/video/',
      playerRegExp: /([a-z\:\/]*\/\/)(?:www\.)?vimeo\.com\/(?:channels\/[A-Za-z0-9]+\/)?([A-Za-z0-9]+)/,
      timeRegExp: '',
      isAdditionaResRequired: function() {
        return false;
      },
      additionalRes: []
    },
    dailymotion: {
      type: "dailymotion",
      settings: {
        autoPlay: 0,
        logo: 0
      },
      whitelist: ['api', 'autoPlay', 'background', 'chromeless', 'controls', 'foreground', 'highlight', 'html',
        'id', 'info', 'logo', 'network', 'quality', 'related', 'startscreen', 'webkit-playsinline', 'syndication'],
      transformAttrMap: {},
      processSettings : function(settings, videoID) {
        return settings;
      },
      buildSrcURL: function(protocol, videoID) {
        return protocol + this.playerID + videoID + videoSettings(this.whitelist, this.processSettings(this.settings));
      },
      playerID: 'www.dailymotion.com/embed/video/',
      playerRegExp: /([a-z\:\/]*\/\/)(?:www\.)?www\.dailymotion\.com\/video\/([A-Za-z0-9]+)/,
      timeRegExp: /start=([0-9]+)/,
      isAdditionaResRequired: function() {
        return false;
      },
      additionalRes: []
    },
    youku: {
      type: "youku",
      settings: {},
      whitelist: [],
      transformAttrMap: {},
      processSettings : function(settings, videoID) {
        return settings;
      },
      buildSrcURL: function(protocol, videoID) {
        return protocol + this.playerID + videoID + videoSettings(this.whitelist, this.processSettings(this.settings));
      },
      playerID: 'player.youku.com/embed/',
      playerRegExp: /([a-z\:\/]*\/\/)(?:www\.)?youku\.com\/v_show\/id_([A-Za-z0-9]+).html/,
      timeRegExp: '',
      isAdditionaResRequired: function() {
        return false;
      },
      additionalRes: []
    },
    vine: {
      type: "youku",
      settings: {
        audio: 0,
        start: 0,
        type: 'simple'
      },
      whitelist: ['audio','start','type'],
      transformAttrMap: {},
      processSettings : function(settings, videoID) {
        delete settings['type'];
        return settings;
      },
      buildSrcURL: function(protocol, videoID) {
        var type = this.settings['type'];
        return protocol + this.playerID + videoID + /embed/ + type + videoSettings(this.whitelist, this.processSettings(this.settings));
      },
      playerID: 'vine.co/v/',
      playerRegExp: /([a-z\:\/]*\/\/)(?:www\.)?vine\.co\/v\/([A-Za-z0-9]+)/,
      timeRegExp: '',
      isAdditionaResRequired: function() {
        return !window.VINE_EMBEDS;
      },
      additionalRes: [{element:'<script src="//platform.vine.co/static/scripts/embed.js"></script>'}]
    }
  };



});
