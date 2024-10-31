
system42(function(le) { 'use strict';

  function $editor(opt, arg2) {
    var ed, winInstance, lastVisitedFolder;
    var app = this.app;

    opt = opt || {};
    opt.filePath = typeof opt.filePath === 'string' ? opt.filePath : '';
    var fileNfo = {};

    var explorerTypes = [];

    function getExplorerType() {
      if (app.ext) {
        $io.arr.all(app.ext, function(item) {
          var mime = le._get.ext.mime['.' + item];
          if (mime) explorerTypes.push(mime);
        })
      } else if (app.mimetype) {
        if ($io.is.arr(app.mimetype)) explorerTypes = app.mimetype;
        else explorerTypes = [app.mimetype];
      }
    }
    getExplorerType()

    var FILENAME;
    function processFile(filePath, nfo, val) {
      //console.log(winInstance);
      if (winInstance) {
        winInstance.changeTitle((filePath ? filePath + ' - ' : '') + app.name);
        winInstance.changeFooter(nfo.mime || '&nbsp');
      }
      FILENAME = $fs.utils.getFileName(filePath);
      fileNfo = nfo;
      ed.readFile.call(nfo, val);
    }

    var openedAs = 'String';
    function openFile(filePath) {
      opt.filePath = filePath;
      var TYPE = opt.type || 'String';
      if (TYPE === 'URL') {
        $file.getUrl(filePath, function(val) {
          openedAs = 'URL';
          processFile(filePath, $fs.utils.getInfo(filePath), val);
        });
      } else {
        //console.log(222, filePath, TYPE)
        $file.open(filePath, TYPE, function(val, asType) {
          //console.log('openedAs', asType);
          openedAs = asType;
          processFile(filePath, this, val);
        });
      }
    }

    /////////////////////////////////////////////////////////////////////////////
    var action = {
      New: function() {ed.setValue(''); return false;},
      Open: function() {
        var filePath = opt.defaultFolder || lastVisitedFolder || opt.filePath || le._path.home;
        setTimeout(function () {
          $explorer(filePath, {
            browse: true,
            list: true,
            //types: explorerTypes,
            accept: app.accept || '*',
            window: {
              animationIn: '',
              animationOut: '',
              center: true
            },
            onclose: function(ok, file) {
              if (ok) {
                lastVisitedFolder = $fs.utils.getFolderPath(file);
                openFile(file);
              };
            }
          });
        }, 0)
        return false;
      },
      SaveAs: function() {
        function doSaveAs(mimetype, type) {
          if (type) openedAs = type
          //var filepPath = opt.filePath.indexOf('/a/') === 0 ? opt.filePath : le._path.home + (opt.filePath ? $fs.utils.getFilename(opt.filePath) : '');
          //console.log(opt.filePath);
          var filePath = opt.filePath.indexOf('/a/') === 0 ? opt.filePath : le._path.desktop + (opt.filePath ? $fs.utils.getFileName(opt.filePath) : '');
          //console.log(filePath);
          //console.log(filePath, opt.filePath);
          //console.log((opt.filePath ? $fs.utils.getFileName(opt.filePath) : ''));
          //console.log(mimetype);

          setTimeout(function () {
            $explorer(filePath, {
              save: true,
              list: true,
              //types: mimetype || explorerTypes,
              accept: mimetype || app.accept || '*',
              window: {
                animationIn: '',
                animationOut: '',
                center: true
              },
              onclose: function(ok, file) {
                if (ok) {
                  lastVisitedFolder = $fs.utils.getFolderPath(file);
                  opt.filePath = file;
                  fileNfo = $fs.utils.getInfo(file);
                  action.Save();
                };
              }
            });
          }, 0)
        }
        if (ed.beforeSaveAs) {
          ed.beforeSaveAs(doSaveAs);
        } else {
          doSaveAs()
        }
        return false;
      },
      Save: function() {
        var saveAsType = openedAs;
        //console.log(222222222222222, saveAsType)
        function doSave(content) {
          $file.save(opt.filePath, content, function() {
            //openFile(opt.filePath); // re-open file
          });
        }
        if (opt.filePath && opt.filePath.indexOf('/a/') === 0) {
          var mimetype = fileNfo.mime;
          //console.log(444, mimetype)
          ed.getValue(function(val) {
            var type = $io.type(val);
            if (saveAsType === 'Blob') {
              $io[type].Blob(val, function(blob) {
                doSave(blob);
              }, mimetype);
            } else {
              $io[type][saveAsType](val, function(v) {
                //console.log(v);
                doSave(v);
              });
            }
          }, mimetype);
        } else {
          action.SaveAs();
        }
        return false;
      },
      Import: function() {
        $file.upload(function(files) {
          var file = files[0];
          $io.File[opt.type || 'String'](file, function(val) {
            processFile(file.name, {file: file.name, mime: file.type}, val);
          });
        }, {accept: app.accept || '*'})
      },
      Export: function() {
        function doExport(mimetype) {
          ed.getValue(function(val) {
            var type = $io.type(val);
            $io[type].Blob(val, function(blob) {
              $file.download(blob, FILENAME);
            }, mimetype || fileNfo.mime);
          }, mimetype || fileNfo.mime);
        }
        if (ed.beforeSaveAs) {
          ed.beforeSaveAs(doExport);
        } else {
          doExport()
        }
      },
      Undo: function() {
        ed.undo();
        return false;
      },
      Redo: function() {
        ed.redo();
        return false;
      },
      Quit: function() {
        winInstance.close();
        return false;
      }
    };

    if (opt.save === false) {
      var menu = [
        {name: 'File', items: [
          {name: 'New', action: action.New/*, key:'alt+n'*/},
          {name: 'Open', action: action.Open, key:'ctrl+o'},
          //{name: '---'},
          //{name: 'Import file', action: action.Import, key:'ctrl+alt+o'},
          //{name: 'Export file', action: action.Export, key:'ctrl+alt+s'},
          {name: '---'},
          {name: 'Quit', action: action.Quit}]}
      ];
    } else {
      var menu = [
        {name: 'File', items: [
          {name: 'New', action: action.New/*, key:'alt+n'*/},
          {name: 'Open', action: action.Open, key:'ctrl+o'},
          {name: 'Save', action: action.Save, key:'ctrl+s', disabled:!true},
          {name: 'Save As...', action: action.SaveAs, key:'ctrl+shift+s'},
          //{name: '---'},
          //{name: 'Import file', action: action.Import, key:'ctrl+alt+o'},
          //{name: 'Export file', action: action.Export, key:'ctrl+alt+s'},
          {name: '---'},
          {name: 'Open File With...', items: function() {
            return $fs.utils.getMenuOpenWith(opt.filePath);
          }},
          {name: 'Open Containing Folder', key:'ctrl+alt+enter', action: function() {
            setTimeout(function () {
              $explorer(opt.filePath)
            }, 0)
          }},
          {name: '---'},
          {name: 'Quit', action: action.Quit}]}
      ];
    }

    if (opt.undo) {
      menu.push(
        {name: 'Edit', items: [
          {name: 'Undo', action: action.Undo, key:'ctrl+z'},
          {name: 'Redo', action: action.Redo, key:'ctrl+y'}
        ]})
    }

    if (opt.help) {
      var helpMenu = [];
      if (opt.help.instructions) {
        helpMenu.push({
          name: 'Instructions', action: function() {
            $alert.help({
              title: 'Instructions',
              html: opt.help.instructions/*,
              img: null,
              onopen: $noop*/
            });
          }
        })
      }
      if (opt.help.about) {
        helpMenu.push({
          name: 'About', action: function() {
            if (typeof opt.help.about === 'string') opt.help.about = {msg: opt.help.about};
            $alert({
              title: 'About',
              msg: opt.help.about.msg,
              img: opt.help.about.img || app.icon || null,
              onopen: $noop
            });
          }
        })
      }
      menu.push({name: 'Help', items: helpMenu})
    }
    if (opt.about) {
      menu.push({
        name: 'About', action: function() {
          if (typeof opt.about === 'string') opt.about = {msg: opt.about};
          $alert({
            title: 'About',
            msg: opt.about.msg,
            img: opt.about.img || app.icon || null,
            onopen: $noop
          });
        }
      })
    }
    /////////////////////////////////////////////////////////////////////////////
    var winData = {};
    if (opt.nodeType && opt.nodeType === 1) {
      // inline app constructor
      var el = opt;
      opt = arg2;
      ed = opt.create(el);
    } else {
      if (typeof opt.create === 'function') {
        winData.url = null;
        winData.onopen = function() {
          if (this.el.footer.firstChild) this.el.footer.firstChild.className = "ui_editor__footer skin_base_text_info"
          ed = opt.create(this.el.body);
          if (opt.filePath) openFile(opt.filePath);
          else ed.setValue('');
        }
      } else {
        // iframe
        winData.url = winData.url + (opt.filePath ? '?path=' + opt.filePath : '');
        winData.onready = function() {
          if (this.el.footer.firstChild) this.el.footer.firstChild.className = "ui_editor__footer skin_base_text_info";
          var iframe = this.el.iframe;
          if (iframe && iframe.contentWindow.$iframeInit) {
            ed = iframe.contentWindow.$iframeInit.call(this);
            /*ed = iframe.contentWindow.$iframeInit.call(this, function(doc) {
              console.log('OK');
            });*/
            /*console.log(iframe.contentWindow);
            $key(iframe.contentWindow.document.documentElement)
              .down(function(k) {
                console.log(k)
              })
            ;*/
            //console.log(ed);
            //console.log('???', opt);
            if (opt.filePath) openFile(opt.filePath);
            else if (ed.setValue) ed.setValue('');
          }
        }
      }
      if (this.app.icon) winData.icon = this.app.icon;
      winData.menu = menu;
      /*winData.contextmenu = {'before:0': [
        //{name:'Open File With...', action: function() {
        //  console.log(this)
        //}},
        {name:'Open Containing Folder', action: function() {
          //$explorer($fs.utils.getFolderPath(opt.filePath))
          $explorer(opt.filePath)
        }},
        {name:'---'}]};*/
      winData.footer = "&nbsp";
      winData.title = (opt.filePath ? opt.filePath + ' - ' : '') + this.app.name;
      winInstance = $window.call(this, $extend(winData, opt.window));
    }
  }

  window.$editor = $editor;

});
