//system42('fs', function(le) { 'use strict';
!function(global) { 'use strict';

  var $fs = {}


  function getMime(fileName, ext) {
    return le._get.ext.mime[ext || fileName] || null;
  }
  function getIcon(fileName, ext, mime) {
    var icons = le._files.c.sys.skins[le._settings.skin || 'w93'];
    if (!icons) icons = le._files.c.sys.skins['w93'];
    var icon;
    function checkIcon(folder, ref) {
      if (icon) return;
      $io.obj.each(icons[folder], function(_, key) {
        key.replace(/(.+)\./, function(_, name) { // https://regex101.com/r/dO2bK0/1
          $io.arr.all(name.split('_'), function(item) {
            if (ref === item) icon = '/c/sys/skins/'+le._settings.skin+'/'+folder+'/'+key;
          });
        })
      });
    }
    function findIcon(mimetype) {
      var s = (mimetype || '').split('/');
      checkIcon('ext', ext);
      checkIcon('type', s[1]);
      checkIcon('mime', s[0]);
    }
    findIcon(mime);
    if (!icon) icon = '/c/sys/skins/' + le._settings.skin + '/file.png';

    return icon;
  }




  $fs.utils = {}


  $fs.utils.find = function(pattern, path) {
    return $io.find(pattern, path, le._files, '/', ['.','..'])
  }

  $fs.utils.resolvePath = function(path) {
    path = path.replace(/^~|\$HOME/g, le._path.home);
    path = path.replace(/~|\$HOME/g, le._path.home.replace(/^\//,''));
    path = path.replace(/\$SKIN/g, le._path.skin);
    path = path.replace(/\/\//g,'/'); // bullet proof ?
    return path
  }

  $fs.utils.getMenuOpenWith = function(files) {

    if (!files) files = [];
    if (typeof files === 'string') files = [files];

    //console.log(files);

    var out = [];
    var allereadyRegistered = [];
    $io.arr.all(files, function(file) {
      //if (typeof file !== 'string') file = file.getAttribute('data-path');
      if (file.nodeType === 1) file = file.getAttribute('data-path');
      var openers = $fs.utils.getOpeners(file);
      openers = openers.concat('hexed','code','iframe');
      if (openers) {
        $io.arr.all(openers, function(item) {
          if (allereadyRegistered.indexOf(item) === -1) {
            allereadyRegistered.push(item);
            var icon = le._apps[item].icon ? $fs.utils.normalizeIcon(le._apps[item].icon) : '/c/sys/skins/'+le._settings.skin+'/programs.png';
            out.push({
              name: le._apps[item].name || $io.str.capitalise(item),
              icon: icon,
              action: function(arg) {
                $io.arr.all(files, function(file) {
                  if (file.nodeType === 1) file = file.getAttribute('data-path');
                  setTimeout(function () {
                    $exe(item + ' "' + file + '"');
                  }, 0)
                  //$exe(item, typeof file === 'string' ? file : file.getAttribute('data-path'));
                });
              }
            });
          }
        });
      }
    });
    /*if (out.length) {
      out.push({name: '---'});
    }
    out.push({name: 'Other...'});*/
    if (out.length) {
      return out;
    } else {
      return [{name: 'No programs found...', disabled: true}];
    }
  }

  $fs.utils.getFileMenu = function(path, radio, cb) {
    if (typeof radio === 'function') {
      cb = radio
      radio = false
    }
    var obj = $io.obj.getPath(le._files, path, '/')
    var list = []
    var folders = {}

    $io.obj.all(obj, function(svgFolder, folderKey) {
      if (folderKey === '.' || folderKey === '..') return
      var fileList = []
      folders[folderKey] = []
      $io.obj.all(svgFolder, function(svg, svgKey) {
        if (svgKey === '.' || svgKey === '..') return
        folders[folderKey].push(svgKey)
        fileList.push({name: svgKey, radio: radio, folder:folderKey, action: cb})
      })
      folders[folderKey] = folders[folderKey].sort(function(a, b) {
        return a.localeCompare(b)
      })
      fileList = fileList.sort(function(a, b) {
        return a.name.localeCompare(b.name)
      })
      list.push({name: folderKey, items: fileList})
    })

    list = list.sort(function(a, b) {
      return a.name.localeCompare(b.name)
    })

    return {
      path: path,
      foldersList: Object.keys(folders),
      folders: folders,
      menu: list
    }
  }

  $fs.utils.replaceExt = function(path, newExt) {
    var oldExt = $fs.utils.getExt(path);
    if (oldExt)
      return path.replace(/\.[0-9a-z]+$/, newExt ? '.' + newExt : '');
    else
      return path + (newExt ? '.' + newExt : '');
  }

  $fs.utils.isFolder = function(fileName) {
    return fileName.slice(-1) === '/';
  }
  $fs.utils.isFolderEmpty = function(path, cb) {
    var empty = true;
    $file.iterateFolder(path, function(item) {
      if (!$fs.utils.isFolder(item)) empty = false;
    }).done(function() {
      cb(empty);
    });
  }

  $fs.utils.isShortcut = function(fileName) {
    return /\.lnk42$/.test(fileName);
  }
  /*$fs.utils.exist = function(path) {
    path = $fs.utils.resolvePath(path);
    var obj = $io.obj.getPath(le._files, path, '/');
    console.log(123, path, obj);
    return obj !== undefined
  }*/
  $fs.utils.isDownloadable = function(elem) {
    if (elem) {
      var url = elem.dataset.url || elem.href;
      return !(url && url.slice(-1) !== '/');
    } else {
      var ok = false;
      $file.eachSelection(function(path, item) {
        var url = item.dataset.url || item.href;
        if (url && url.slice(-1) !== '/') ok = true;
        else {ok = false; return ok}
      });
      return ok;
    }
  }
  $fs.utils.getName = function(path) {
    var out = (typeof path === 'string' ? path : '').split('/');
    return path.slice(-1) === '/' ? out[out.length-2] : out.pop();
  }
  $fs.utils.getFileName = function(path) {
    return (typeof path === 'string' ? path : '').split('/').pop();
  }
  $fs.utils.getFolderName = function(path) {
    //console.log(path);
    var out = (typeof path === 'string' ? path : '').split('/');
    return path.slice(-1) === '/' ? out[out.length-2] : '' //out.pop();
  }
  $fs.utils.getFolderPath = function(path) {
    var p = (typeof path === 'string' ? path : '').split('/').slice(0, -1).join('/');
    return '/' + p ? p + '/' : '';
  }
  $fs.utils.getExt = function(fileName) {
    var ext = (fileName||'').match(/(?:\.)([0-9a-z]+)(?:[!?].+)?$/i);
    return ext && ext[1] ? ext[1].toLowerCase() : '';
  }
  $fs.utils.getMime = function(fileName) {
    // http://www.iana.org/assignments/media-types/
    // http://www.filesuffix.com/
    // var usefullMime = {"audio/mp4a-latm" : "audio/mpeg"};
    var ext = $fs.utils.getExt(fileName);
    return getMime(fileName, ext)
  }
  $fs.utils.getIcon = function(fileName) {
    if ($fs.utils.isFolder(fileName)) {
      //var icons = le._files.c.sys.skins[le._settings.skin];
      //console.log(fileName);
      return getIconFolder(fileName, ext, mime);
    } else {
      var ext = $fs.utils.getExt(fileName);
      var mime = getMime(fileName, ext)
      return getIcon(fileName, ext, mime);
    }
  }
  $fs.utils.normalizeIcon = function(icon) {
    return (icon.indexOf('/') === 0 || icon.indexOf('http') === 0)
      ? icon
      : '/c/sys/skins/'+le._settings.skin+'/' + icon
    ;
  }

  function getIconFolder(fileName) {
    //console.log(fileName, $fs.utils.resolvePath(fileName));
    if (fileName==='/') return '/c/sys/skins/'+le._settings.skin+'/devices/computer.png';
    else if (fileName==='/a/') return '/c/sys/skins/'+le._settings.skin+'/devices/drive-storage.gif';
    else if (fileName==='/c/') return '/c/sys/skins/'+le._settings.skin+'/devices/drive-harddisk.gif';
    else if ($fs.utils.resolvePath(fileName)===le._path.home) return '/c/sys/skins/'+le._settings.skin+'/places/user-home.png';
    else return '/c/sys/skins/'+le._settings.skin+'/places/folder.png';
  }

  $fs.utils.getInfo = function(fileName) {
    if ($fs.utils.isFolder(fileName)) {
      var icon = getIconFolder(fileName, ext, mime);
      var name = '';
           if (fileName==='/a/') name = 'Storage (A:)';
      else if (fileName==='/c/') name = 'System (C:)';
      return {icon:icon, name:name}
    } else {
      var ext = $fs.utils.getExt(fileName);
      var mime = getMime(fileName, ext)
      var icon = getIcon(fileName, ext, mime);
      var name = $fs.utils.getName(fileName);
      return {ext:ext, mime:mime, icon:icon, name:name}
    }
  }
  $fs.utils.getOpeners = function(fileName) {
    var ext = $fs.utils.getExt(fileName);
    var mime = getMime(fileName, ext);
    var openers = [];

    if (le._settings.defaultApp[ext]) openers = openers.concat(le._settings.defaultApp[ext]);
    if (le._get.ext.apps[ext]) openers = openers.concat(le._get.ext.apps[ext]);

    if (mime) {
      $io.arr.all(le._get.mime.apps, function(item) {
        if (item[0].test(mime)) {
          if (openers) {
            if (openers.indexOf(item[1]) == -1) openers.push(item[1])
          }
          else openers = [item[1]];
        }
      });
    }

    return openers;
  }

  $fs.utils.parseAccept = function(accept) {
    var _mimetype = [];
    var out = {}
    $io.arr.all(accept.split(','), function(val) {
      if (val.indexOf('.') === 0) {
        if (!out.ext) out.ext = [];
        out.ext.push(val.replace(/^\./, ''));
      } else {
        _mimetype.push($io.reg.escape(val.replace('*', '_4_²_')));
      }
    });
    if (_mimetype.length) out.mimetype = new RegExp( (_mimetype.join('|')).replace(/_4_²_/g, '.*') );
    return out;
  }


  $fs.utils.getPathObj = function(path, base) {

    if (!path) path = le._path.home;
    path = $fs.utils.resolvePath(path);
    if (path.length > 1 && path.slice(-1) === '/') path = path.slice(0, -1);

    base = base || '';
    if (base.slice(-1) !== '/') base = base + '/';
    path = path.indexOf('/')===0 ? path : base + path;

    var obj = $io.obj.getPath(le._files, path, '/');

    //console.log(123, obj, path);

    if (obj !== undefined && typeof obj !== 'number') {
      var cwd = '/' + $file.getTruePath(obj);
      if (cwd.length > 1 && cwd.slice(-1) === '/') cwd = cwd.slice(0, -1);
      return {cwd: cwd, obj: obj};
    }

  }

  $fs.utils.exist = function(path, base) {

    if (!path) path = le._path.home;
    path = $fs.utils.resolvePath(path);
    if (path.length > 1 && path.slice(-1) === '/') path = path.slice(0, -1);

    base = base || '';
    if (base.slice(-1) !== '/') base = base + '/';
    path = path.indexOf('/')===0 ? path : base + path;


    var obj = $io.obj.getPath(le._files, path, '/');
    // console.log(obj)

    return obj !== undefined ? obj : false //{obj: obj};
  }

  $fs.utils.getFolderObj = function(path, base) {
    var folderPath = $fs.utils.getFolderPath(path);
    return $fs.utils.getPathObj(folderPath, base)
  }

  $fs.utils.iteratePath = function(path, base) {
    var
       tree = $fs.utils.getPathObj(path, base)
      ,dirs = []
      ,files = []
      ,lnks = []
    ;

    if (tree) {
      $io.obj.all(tree.obj, function(val, key) {
        if (key !== '.' && key !== '..') {
          if ($fs.utils.isShortcut(key)) lnks.push(key);
          else if (typeof val === 'object') dirs.push(key);
          else files.push(key);
        }
      });
      return {
        tree: tree,
        obj: tree.obj,
        cwd: tree.cwd,
        dirs: dirs,
        files: files,
        lnks: lnks
      }
    }
  }


  global.$fs = $fs

}(this);
