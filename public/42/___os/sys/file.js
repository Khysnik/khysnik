
// blob
/////////////////////////////////////////////////////////////////////////////
// http://qnimate.com/an-introduction-to-javascript-blobs-and-file-interface/

// indexedDB
/////////////////////////////////////////////////////////////////////////////
// http://stackoverflow.com/a/18350531
// https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API


/*
  888888 88 88     888888
  88__   88 88     88__
  88""   88 88  .o 88""
  88     88 88ood8 888888
*/

!function(global) { 'use strict';

  //console.log('$file');

  window.URL || (window.URL = window.webkitURL);

  var $file = {};


  /*
     dP""b8 888888 888888 88   88 88""Yb 88
    dP   `" 88__     88   88   88 88__dP 88
    Yb  "88 88""     88   Y8   8P 88"Yb  88  .o
     YboodP 888888   88   `YbodP' 88  Yb 88ood8
  */

  $file.getUrl = function(path, cb, nfo) {
    if (!nfo) nfo = $fs.utils.getInfo(path);
    if ((path+'').indexOf('/a/')===0) {
      $file.open(path, 'Blob', function(blob) {
        //console.log(blob);
        var url = window.URL.createObjectURL(blob);
        (cb || $noop)(url);
      }, nfo.mime);
    } else {
      if ((path+'').indexOf('c/')===0) path = '/' + path;
      (cb || $noop)(path);
    }
  }

  global.$file = $file;


system42(function(le) { 'use strict';


  /*
     dP"Yb  88""Yb 888888 88b 88
    dP   Yb 88__dP 88__   88Yb88
    Yb   dP 88"""  88""   88 Y88
     YbodP  88     888888 88  Y8
  */

  $file.open = function(path, type, cb) {
    if (typeof path !== 'string') throw new Error('$file.open : no path specified');
    var storeKey = path;
    var nfo = $fs.utils.getInfo(path);
    if (typeof type == 'function' && !cb) {
      cb = type;
      type = 'String';
    }

    var asType = 'String';

    function out(val) {
      cb.call(nfo, val, asType);
    }
    if (path.indexOf('/a/')===0) {
      storeKey = path.replace(/^\/a\//,'');

      if ($store.keys().indexOf(storeKey) > -1) {
        var mime;
        if (type === 'Blob') mime = $fs.utils.getMime(storeKey);
        $io.String[type]($store.getRaw(storeKey), out, mime || 'text/plain');
      } else {
        $db.getRaw(storeKey, function(err, val) {
          asType = $io.type(val);

          //console.log('$file.open', asType, type);
          $io[asType][type](val, out, nfo.mime);

          /*if (asType == 'ArrayBuffer') {
            $io.ArrayBuffer[type](val, out, nfo.mime);
          } else if (asType == 'Blob') {
            $io.Blob[type](val, out, nfo.mime);
          } else if (asType == 'String') {
            $io.String[type](val, out, nfo.mime);
          } else {
            out(val)
          }*/
        });
      }
    } else {
      // console.log(path)
      $ajax.get(path, {arraybuffer: type !== 'String'})
        .done(function(data, status, xhr, isJson) {
          var ct = xhr.getResponseHeader("content-type") || "";
          //console.log(ct);
          var mime = isJson ? 'application/json' : ct.split(';').shift();
          if (type === 'String') {
            asType = 'String';
            cb.call(nfo, xhr.responseText, type);
          } else {
            asType = 'ArrayBuffer';
            //$io.ArrayBuffer[type](xhr.response, out, 'ArrayBuffer');
            //console.log('mime', mime, type)
            $io.ArrayBuffer[type](xhr.response, out, mime);
          }
        })
        .fail(function() {
          console.log(arguments)
          $alert.error('Can\'t load file');
        })
      ;
    }
  }


  /*
    88""Yb 88""Yb  dP"Yb   dP""b8 888888 .dP"Y8 .dP"Y8
    88__dP 88__dP dP   Yb dP   `" 88__   `Ybo." `Ybo."
    88"""  88"Yb  Yb   dP Yb      88""   o.`Y8b o.`Y8b
    88     88  Yb  YbodP   YboodP 888888 8bodP' 8bodP'
  */

  function process(path, store, db, error) { 'use strict';
    var storeKey = path;
    if (path.indexOf('/a/')===0) {
      storeKey = path.replace(/^\/a\//,'');
      if ($store.keys().indexOf(storeKey) > -1) {
        ;(store || $noop)(storeKey)
      } else {
        ;(db || $noop)(storeKey)
      }
    } else {
      $notif('You don\'t have write permission on this drive', path)
      ;(error || $noop)()
    }
  }

  $file.iterateFolder = function(folderPath, cb) {
    //console.log(111, folderPath);
    var done
    if (folderPath.indexOf('/a/')===0) {
      var storeKey = folderPath.replace(/^\/a\//,'')
      $io.arr.all($store.keys(), function(item) {
        if (item.indexOf(storeKey) === 0) cb(item, 'store', storeKey)
      })
      $db.keys(function(err, keys) {
        $io.arr.all(keys, function(item) {
          if (item.indexOf(storeKey) === 0) cb(item, 'db', storeKey)
        })
        if (typeof done === 'function') done()
      })
    } else {
      $io.arr.all($fs.utils.find('/.*/', folderPath), function(item) {
        cb(item, 'server', folderPath)
      })
      setTimeout(done, 1)
      //throw new Error('Iteration in /c/ is not implemented yet...')
    }
    return {
      done: function(cb) {
        done = cb
      }
    }
  }

  /*
    8888b.  888888 88     888888 888888 888888
     8I  Yb 88__   88     88__     88   88__
     8I  dY 88""   88  .o 88""     88   88""
    8888Y"  888888 88ood8 888888   88   888888
  */

  function setFolderIfEmpty(folderPath, cb) {
    $db.keys(function(err, keys) {
      var noMoreFileInFolder = true;
      $io.arr.all(keys.concat($store.keys()), function(item) {
        if (item.indexOf(folderPath) === 0) noMoreFileInFolder = false;
      });
      // do not remove folder even if empty
      if (noMoreFileInFolder) $db.set(folderPath, null, cb);
      else cb(null);
    });
  }

  $file.delete = function(path, cb) {
    // console.log(path);
    if (path === '/a/system32.dll') {
      $exe('vega')
    }
    var isFolder = $fs.utils.isFolder(path);
    function end() {
      //$file.scan('/a/', function() {
        //console.log(path);
        cb && cb(path);
      //});
    }
    if (path.indexOf('/a/')===0) {
      var storeKey = path.replace(/^\/a\//,'');
      if (isFolder) {
        $io.arr.all($store.keys(), function(item) {
          if (item.indexOf(storeKey) === 0) $store.del(item);
        });
        $db.keys(function(err, keys) {
          var toSuppr = [];
          $io.arr.all(keys, function(item) {
            if (item.indexOf(storeKey) === 0) toSuppr.push(item);
          });
          if (toSuppr.length) {
            $io.arr.each(toSuppr, function(item, i) {
              if (i === toSuppr.length-1) $db.del(item, end);
              else $db.del(item);
            });
          } else {
            end(null)
          }
        });
      } else {
        var folderPath = $fs.utils.getFolderPath(storeKey);
        $store.del(storeKey);
        $db.del(storeKey, function(err) {
          setFolderIfEmpty(folderPath, end);
        });
      }
    }
    else {
      $notif('You don\'t have write permission on this drive', path)
    }
  }


  /*
    8b    d8  dP"Yb  Yb    dP 888888
    88b  d88 dP   Yb  Yb  dP  88__
    88YbdP88 Yb   dP   YbdP   88""
    88 YY 88  YbodP     YP    888888
  */



  function getCopyNameFn(fileName) {
    var shortcut = '';
    var ext = '';
    var name = fileName
      .replace(/(\.lnk42)$/, function(_, a) {
        if (a) shortcut = '.lnk42'; return '';
      })
      .replace(/(?:.+)(\.[0-9a-z]+)$/i, function(_, a) {
        if (a) ext = a; return '';
      })
    ;
    return function(n) {return name + ' ('+n+')' + ext + shortcut}
  }

  $file.copy = function(fromPath, destFolderPath, cb) {

    var folderObj = $fs.utils.getFolderObj(destFolderPath);
    var fileName = $fs.utils.getName(fromPath);
    var isFolder = $fs.utils.isFolder(fromPath);

    var copyName = fileName;

    if (folderObj && folderObj.obj) {
      if (folderObj.obj[fileName] === undefined) {
        copyName = fileName;
      } else {
        var getCopyName = getCopyNameFn(fileName);
        var i = 1;
        while (folderObj.obj[copyName] !== undefined) copyName = getCopyName(i++);
      }
    }

    $file.move(fromPath, destFolderPath + copyName + (isFolder ?'/':''), function(path) {
      cb(path);
    }, true);
  }

  $file.rename = function(path, newName, cb) {
    if ($fs.utils.isFolder(path)) {
      var t = path.split('/').slice(0, -2);
      t.push(newName);
      var newPath = t.join('/') + '/';
    } else {
      var newPath = $fs.utils.getFolderPath(path) + newName;
    }
    $file.move(path, newPath, cb);
  }

  function moveWithStore(key, toPath, noDelete, end) {
    var val = $store.getRaw(key);
    $store.set(toPath, val);
    if (!noDelete) $store.del(key);
    end();
  }
  function moveWithDb(key, toPath, noDelete, end) {
    $db.getRaw(key, function(err, val) {
      $db.set(toPath, val, function() {
        if (!noDelete) $db.del(key, end);
        else end();
      })
    })
  }
  $file.move = function(fromPath, toPath, cb, noDelete) {

    var isFolder = $fs.utils.isFolder(fromPath);

    $fs.utils.isFolderEmpty(fromPath, function(empty) {

      var storeKey = fromPath.replace(/^\/a\//, '');
      toPath = toPath.replace(/^\/a\//, '');

      function end() {
        var folderPath = $fs.utils.getFolderPath(storeKey);
        if (isFolder) {
          if (cb) cb('/a/' + toPath);
        } else {
          setFolderIfEmpty(folderPath, function() {
            if (cb) cb('/a/' + toPath);
          });
        }
      }

      function checkIfExist(key, toPath, noDelete, move, end) {
        if (key === toPath) {
          end()
        } else if ( $fs.utils.exist('/a/' + toPath) ) {
          var wasLoading = $state.isLoading();
          if (wasLoading) $state.loaded();
          $confirm(toPath + ' already exist ! Overwrite ?', function(ok) {
            if (wasLoading) $state.loading();
            if (ok) move(key, toPath, noDelete, end)
            else end()
          });
        } else {
          move(key, toPath, noDelete, end)
        }
      }

      if (isFolder && !empty) {
        var filesInFolder = [];
        $file.iterateFolder(fromPath, function(item) {
          filesInFolder.push(item);
        }).done(function() {
          $io.arr.each(filesInFolder, function(item, i) {
            if (i === filesInFolder.length-1) {
              $file.move('/a/' + item, '/a/' + item.replace(storeKey, toPath), function() {
                if (!noDelete) $file.delete(fromPath, end)
                else end()
              }, noDelete)
            }
            else
              $file.move('/a/' + item, '/a/' + item.replace(storeKey, toPath), null, noDelete);
          })
        })
      } else {
        process(
          fromPath,
          function(key) {
            checkIfExist(key, toPath, noDelete, moveWithStore, end)
          },
          function(key) {
            checkIfExist(key, toPath, noDelete, moveWithDb, end)
          }
        )
      }
    })
  }


  /*
    .dP"Y8    db    Yb    dP 888888
    `Ybo."   dPYb    Yb  dP  88__
    o.`Y8b  dP__Yb    YbdP   88""
    8bodP' dP""""Yb    YP    888888
  */

  $file.save = function(path, content, cb) {
    function end(filename) {
      // $notif('File saved'+ ($fs.utils.isFolder(path)?' in':'') +' : <a href="#!'+path+'">' + path + '<a>');
      $notif('File saved', path)
      var name = filename || $fs.utils.getFileName(path)
      var folderPath = $fs.utils.getFolderPath(path)
      //console.log('folderPath', folderPath)
      if (folderPath === le._path.desktop && !le._desktop[name]) {
        $explorer.utils.saveIconPos(path,1,name)
      }
      le._events.trigger('change:' + path)
      $explorer.refresh()
      cb && cb(name)
      $state.loaded()
    }

    function fileToDb (file) {
      $io.File.Blob(file, function(blob) {
        //console.log(file.name)
        $db.set((path||'').replace(/^\/a\//,'') + file.name, blob, function() {
          end(file.name)
        })
      }, file.type)
    }

    $state.loading()

    var type = $io.type(content)

    if (type === 'FileList') {
      $io.arr.all(content, function(file) {
        fileToDb(file)
      })
    } else if (type === 'File') {
      fileToDb(content)
    } else {
      process(
        path,
        function(key) {
          var type = $io.type(content)
          if (type === 'Blob') {
            $io.Blob.String(content, function(val) {
              $store.set(key, val)
              end()
            })
          } else {
            if (path.endsWith('.json')) {
              try {
                content = JSON.parse(content)
                $store.set(key, content)
                end()
              } catch(e) {
                $notif('Can\'t save changes', path + '<br>' + e)
              }
            } else {
              $store.set(key, content)
              end()
            }
          }
        },
        function(key) {
          $db.set(key, content, end)
        },
        function() {
          // error
          $state.loaded()
        }
      )
    }
  }


  /*
    8888b.   dP"Yb  Yb        dP 88b 88 88      dP"Yb     db    8888b.
     8I  Yb dP   Yb  Yb  db  dP  88Yb88 88     dP   Yb   dPYb    8I  Yb
     8I  dY Yb   dP   YbdPYbdP   88 Y88 88  .o Yb   dP  dP__Yb   8I  dY
    8888Y"   YbodP     YP  YP    88  Y8 88ood8  YbodP  dP""""Yb 8888Y"
  */


  $file.download = function(path, name) {

    function fakeDowloadLink(path, name) {
      // thanks : https://gist.github.com/MrSwitch/3552985
      var a = document.createElement('a');
      // Test for download link support
      if ( "download" in a ){
        a.setAttribute('href', path);
        a.setAttribute('download', name);
        $el(a).trigger('click');
      } else {
        // fallover, open resource in new tab.
        window.open(path, '_blank', '');
      }
    }

    if (!path) throw new Error('No path specified');
    if (!name) {
      if (typeof path === 'string') name = path.split('/').pop();
      else name = 'derp';
    };

    if ($io.type(path) == 'Blob') window.saveAs(path, name);
    else if (path.indexOf('/a/')===0) {
      $file.open(path, 'Blob', function(blob) {
        window.saveAs(blob, name);
      })
    } else {
      fakeDowloadLink(path, name);
    }
  }
  /*if (/\.html?$/.test(path)) {
    $file.getUrl(path, function(url) {
      //console.log(url)
      //fakeDowloadLink(url, 'toto.txt');
      fakeDowloadLink(url, name);
    }, {mime:'text/plain; charset=UTF-8'});
  } else */


  /*
    88   88 88""Yb 88      dP"Yb     db    8888b.
    88   88 88__dP 88     dP   Yb   dPYb    8I  Yb
    Y8   8P 88"""  88  .o Yb   dP  dP__Yb   8I  dY
    `YbodP' 88     88ood8  YbodP  dP""""Yb 8888Y"
  */

  var fileInput = document.createElement('input');
  fileInput.type = "file";
  $file.upload = function(cb, opt) {
    opt = opt || {};
    fileInput.accept = opt.accept || '*';
    fileInput.multiple = opt.multiple || false;
    fileInput.onchange = function(e) {
      var that = this;
      setTimeout(function() {
        cb(that.files);
        fileInput.onchange = null;
      }, 0);
    }
    fileInput.click();
  }


  /*
     dP"Yb  88b 88 8888b.  88""Yb  dP"Yb  88""Yb
    dP   Yb 88Yb88  8I  Yb 88__dP dP   Yb 88__dP
    Yb   dP 88 Y88  8I  dY 88"Yb  Yb   dP 88"""
     YbodP  88  Y8 8888Y"  88  Yb  YbodP  88
  */

  $file.ondrop = function(parent, childs, cb) {
    var cnt = 0
    function dragenter(e) {e.preventDefault()
      cnt++
      this.classList.add('ui_dropzone--droppable')
    }
    function dragover(e) {return false}
    function dragleave(e) {e.preventDefault()
      cnt--
      if (cnt === 0) this.classList.remove('ui_dropzone--droppable')
    }

    function clean () {
      this.classList.remove('ui_dropzone--droppable')
      $el(parent).off('click', childs, clean)
    }

    $el(parent)
      .on('dragenter', childs, dragenter)
      .on('dragover', childs, dragover)
      .on('dragleave', childs, dragleave)
      .on('click', childs, clean)
      .on('drop', childs, function(e) {
        e.preventDefault()
        this.classList.remove('ui_dropzone--droppable')
        cb.apply(this, arguments)
        return false
      }, true)

  }



  /*
    .dP"Y8  dP""b8    db    88b 88
    `Ybo." dP   `"   dPYb   88Yb88
    o.`Y8b Yb       dP__Yb  88 Y88
    8bodP'  YboodP dP""""Yb 88  Y8
  */

  $file.setDotFolders = function(obj) {
    $io.obj.each(obj, function(val, key) {
      if (typeof val !== 'number' && key !== '..' && key !== '.' && !$fs.utils.isShortcut(key)) {
        //val['..'] = obj;
        //val['.'] = val;
        Object.defineProperties(val, {
          '..': {enumerable:false, value: obj},
          '.': {enumerable:false, value: val}
        })
        $file.setDotFolders(val)
      }
    });
  }

  $file.getTruePath = function(obj, str) {
    if (typeof str !== 'string') str = '';
    if (obj['..']) {
      for (var key in obj['..']) {
        if (obj['..'].hasOwnProperty(key)) {
          if (obj['..'][key] === obj) {
            str = key + '/' + str;
            return $file.getTruePath(obj['..'], str);
          }
        }
      }
      return str
    }
    else return str
  }

  var fileInfos = {};
  $file.scan = function(path, cb) {
    if (path.indexOf('/a/')===0) {
      $db.keys(function(err, keys) {
        var out = {};
        if ($db.store._driver != 'localStorageWrapper') {
          keys = keys.concat($store.keys());
        }
        //console.log(1, keys);
        $io.arr.all(keys, function(key, val) {
          if ($fs.utils.isFolder(key)) {
            //console.log(1, key);
            $io.obj.path.call('/', out, key, {});
          }
          else {
            //console.log(2, key);
            $io.obj.path.call('/', out, key, 0);
          }
        });
        le._files.a = out;
        $file.setDotFolders(le._files);
        //console.log(le._files);
        cb && cb($io.obj.getPath(le._files, path, '/'));
      });
    } else {
      cb && cb($io.obj.getPath(le._files, path, '/'));
    }
  }

  /////////////////////////////////////////////////////////////////////////////

  /*
    888888  dP"Yb  88""Yb 8b    d8    db    888888
    88__   dP   Yb 88__dP 88b  d88   dPYb     88
    88""   Yb   dP 88"Yb  88YbdP88  dP__Yb    88
    88      YbodP  88  Yb 88 YY 88 dP""""Yb   88
  */

  $file.format = function(cb) {
    $store.clear();
    $db.clear(function() {
      if (typeof cb === 'function') cb();
    })
  }


  window.$file = $file;

});

}(this);






/////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////
  /*
    888888 Yb  dP 88 .dP"Y8 888888
    88__    YbdP  88 `Ybo."   88
    88""    dPYb  88 o.`Y8b   88
    888888 dP  Yb 88 8bodP'   88
  */

  // $file.exist = function(path, cb) {
  //   var found = false;
  //   if (path.indexOf('/a/')===0) {
  //     var storeKey = path.replace(/^\/a\//,'');
  //     if ($store.keys().indexOf(storeKey) > -1) found = true;
  //     if (found) {
  //       (cb || $noop)(found, path);
  //       return;
  //     };
  //     $db.keys(function(err, keys) {
  //       if (keys.indexOf(storeKey) > -1) found = true;
  //       if (found) {
  //         (cb || $noop)(found, path);
  //         return;
  //       } else {
  //         (cb || $noop)(found, path);
  //       }
  //     });
  //   } else {
  //     $alert('$file.exist not implemented for /c/ drive yet...');
  //   }
  // }

/*
  88 8b    d8 88""Yb  dP"Yb  88""Yb 888888
  88 88b  d88 88__dP dP   Yb 88__dP   88
  88 88YbdP88 88"""  Yb   dP 88"Yb    88
  88 88 YY 88 88      YbodP  88  Yb   88
*/

/*$file.import = function(files, path, cb) {
  console.log($io.type(files));
  if (files) {
    files = files.length ? files : [files];
    $io.arr.all(files, function(item) {
      //var infoSuffix = '_4_²_' + item.lastModified + '.' + item.size;
      $io.File.Blob(item, function(blob) {
        $db.set((path||'').replace(/^\/a\//,'') + item.name, blob, function() {
          $file.scan('/a/', function() {
            cb && cb(path || '/a/');
          });
        });
      }, item.type);
    });
  } else {
    $alert('No files to import');
  }
}*/


/*$db.get('DBblob.html', function(err, val) {
  console.log('blob test?', err, val);
  console.dir(val);
  window.saveAs(val, 'test.html')
});

//console.log('blob');
var blob = new Blob(['<a id="a"><b id="b">hey!</b></a>'], {
      type: "text/html;charset=utf-8"
    });

//console.log(blob);
var reader = new FileReader();
reader.addEventListener("loadend", function() {
   // reader.result contains the contents of blob as a typed array
   //console.log($io.type(reader.result));
   //window.saveAs(reader.result, 'test.html')
   $db.set('DBblob.html', reader.result, function() {
     console.log('ok?');
   });
});
reader.readAsArrayBuffer(blob);
*/
