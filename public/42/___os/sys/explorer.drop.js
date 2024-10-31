system42.on('explorer:ready', function(le) {

  // todo: check extract functions from block
  // 'use strict';

  var draggedKeyInst = $key().combo({
    'left': function() {
      if (draggedList.length) {
        draggedIsAutoOrga = true; draggedAutoOrga.x += 2;autoOrga();
      }
    },
    'right': function() {
      if (draggedList.length) {
        draggedIsAutoOrga = true; draggedAutoOrga.x -= 2;autoOrga();
      }
    },
    'up': function() {
      if (draggedList.length) {
        draggedIsAutoOrga = true; draggedAutoOrga.y += 2;autoOrga();
      }
    },
    'down': function() {
      if (draggedList.length) {
        draggedIsAutoOrga = true; draggedAutoOrga.y -= 2;autoOrga();
      }
    },
    'esc': function() {
      if (draggedList.length) {
        draggedIsAutoOrga = false; draggedAutoOrga = {x:0,y:0};autoOrga();
      }
    }
  });

  var orgaCfg = {grid:[le._icons.w,le._icons.h]}
  function autoOrga() {
    if (draggedList.length) {
      for (var i = 0, l = draggedList.length; i < l; i++) {
        var el = draggedList[i].el;
        var ghost = draggedList[i].ghost;
        var rect = draggedList[i].rect;
        var x, y;
        if (draggedIsAutoOrga) {
          y = $drag.y - (draggedAutoOrga.y*(i));
          x = $drag.x - (draggedAutoOrga.x*(i));
        } else if ($key['r']) {
          y = rect.top - (Math.random() * (dragged_rect.top - $drag.y));
          x = rect.left - (Math.random() * (dragged_rect.left - $drag.x));
        } else {
          y = rect.top - (dragged_rect.top - $drag.y);
          x = rect.left - (dragged_rect.left - $drag.x);
        }
        if ($key['space']) {
          x = ~~((x+(orgaCfg.grid[0]/2))/orgaCfg.grid[0]) * orgaCfg.grid[0];
          y = ~~((y+(orgaCfg.grid[1]/2))/orgaCfg.grid[1]) * orgaCfg.grid[1];
        }
        ghost.style.top = y + 'px';
        ghost.style.left = x + 'px';
      }
    }
  }

  function eachDragged(cb) {
    for (var i = 0, l = draggedList.length; i < l; i++) {
      cb(draggedList[i].el, draggedList[i].ghost, draggedList[i].rect, draggedList[i], i)
    }
  }

  function resetDragged() {
    draggedList.length = 0;
    dragged_rect = null;
    draggedIsAutoOrga = false;
    draggedAutoOrga.x = 0;
    draggedAutoOrga.y = 0;
  }

  var draggedList = [];
  var dragged_rect = null;
  var draggedIsAutoOrga = false;
  var draggedAutoOrga = {x:0,y:0};

  var isFromDesktop = false;

  function switchDraggStates(e) {
    if (isFromDesktop) {
      if (e === true || e.ctrlKey || e.shiftKey) {
        eachDragged(function(el, ghost) {
          ghost.style.opacity = '.6';
          el.classList.remove('hide')
        });
      } else {
        eachDragged(function(el, ghost) {
          ghost.style.opacity = '1';
          el.classList.add('hide')
        });
      }
    }
  }
  var switchDraggStatesT = $io.fn.throttle(switchDraggStates, 100);
  var rightClick = false;

  //$drag(le._dom.screen, '.ui_explorer .ui_icon', {
  $drag(le._dom.screen, '.ui_explorer--local .ui_icon', {
    ghost: true,
    grid: function() {
      return $key['space'] ? [le._icons.w,le._icons.h] : false;
    },
    onstart: function(e) {
      isFromDesktop = $drag.elem.parentNode.classList.contains('ui_explorer--workspace');
      if (!$drag.elem.classList.contains('ui_selected')) {
        $explorer.selection
          .reset()
          .add($drag.elem)
          .display()
        ;
        $drag.ghost.classList.add('ui_selected')
      };

      dragged_rect = $drag.elem.getBoundingClientRect();
      draggedList.length = 0; // to be sure
      draggedList.push({focus:true, el:$drag.elem, ghost:$drag.ghost, rect:dragged_rect})

      $explorer.selection.each(function(el, i) {
        if ($drag.elem === el) return;
        var ghost = $drag.createGhost(el);
        ghost.style.zIndex = 9998 - i;
        var rect = el.getBoundingClientRect();
        document.body.appendChild(ghost);
        draggedList.push({el:el, ghost:ghost, rect:rect})
      })

      if (e.button === 2) rightClick = true, switchDraggStates(true);
      else rightClick = false, switchDraggStates(e);
    },
    /*onDataTransfer: function(e, dataTransfer) {
      var elem = document.createElement('div');
      elem.setAttribute('data-mime', "text/plain");
      elem.setAttribute('data-icon', "/c/sys/skins/w93/shortcut.png");
      elem.setAttribute('data-name', "link.lnk42");
      elem.style.cssText = "position:fixed;";
      elem.className = "ui_icon ui_icon__file ui_icon__lnk42"
      elem.innerHTML = '<img width="32" height="32" src="/c/sys/skins/w93/shortcut.png"><span>link</span>';
      document.body.appendChild(elem);
      return elem
    },*/
    ondrag: function(e) {
      autoOrga()
    },
    onstop: function(e) {
      //if ($drag.zone) $explorer.setCurrent($drag.zone);
    },
    ondrop: function(e) { // called only if no zone was reached
      // if dragging outside the screen : auto-organize icons
      if ($drag.y < 0 || $drag.x < 0) {
        draggedList.sort(function(a, b) {
          var aa = a.el.getAttribute('data-name');
          var bb = b.el.getAttribute('data-name');
          return bb.toLowerCase().localeCompare(aa.toLowerCase())
        });
        dragAction.pos();
      }
      else dragAction.cancel();
    },
    zone: {
      '.ui_explorer, [data-exe^="/a/"][data-exe$="/"], [data-exe^="/~/"][data-exe$="/"]': {
        move: function(e, zone) {
          if (!rightClick) switchDraggStatesT(e);
        },
        enter: function(e, zone) {
          enter(e, zone);
        },
        leave: function(e, zone) {
          leave(zone);
        },
        drop: function(e, zone, el) {
          leave(zone);
          //var context = {el:el, zone:zone};
          //console.log($drag.zone, zone);
          if (e.button === 2) {
            MENUS.dragMenu.show(zone, {of: e, within: le._dom.screen});
          } else {
            dragAction.move();
          }
        }
      }
    }
  });

  function enter(e, zone) {
    if (zone.classList.contains('ui_explorer--not_local')) zone.classList.add('ui_dropzone--no-drop');
    zone.classList.add('ui_dropzone');
    //console.log($drag.elem);
    if ($drag.elem.parentNode !== zone) zone.classList.add('ui_dropzone--droppable');
  }
  function leave(el) {
    el.classList.remove('ui_dropzone');
    el.classList.remove('ui_dropzone--copy');
    el.classList.remove('ui_dropzone--move');
    el.classList.remove('ui_dropzone--link');
    el.classList.remove('ui_dropzone--droppable');
    el.classList.remove('ui_dropzone--no-drop');
  }

  function removeGhost(ghost) {
    if (ghost && ghost.parentNode && ghost.parentNode === document.body) document.body.removeChild(ghost);
  }
  function revertGhost(el, ghost, rect) {
    $transition.revert(ghost, {x:rect.left, y:rect.top}, function() {
      el.classList.remove('hide')
      if (ghost && ghost.parentNode && ghost.parentNode === document.body) document.body.removeChild(ghost);
    });
  }

  function moveFiles(zone, cb) {
    var destFolderPath;
    var expl;
    var list = [];
    if (zone.classList.contains('ui_explorer--local')) {
      expl = $explorer.instances[zone.getAttribute('data-id')*1];
      destFolderPath = expl.getPath();
    } else {
      destFolderPath = zone.getAttribute('data-exe');
    }
    if (destFolderPath) {
      $state.loading();
      var timestamp = Date.now();
      var toFocus;
      $io.arr.enum([draggedList], function(item, i, check) {
        var oldPath = item.el.getAttribute('data-path');
        var isFolder = $fs.utils.isFolder(oldPath);
        var newPath = destFolderPath + item.el.getAttribute('data-name') + (isFolder ?'/':'');
        try {
          cb.call(item, oldPath, newPath, destFolderPath, function(path) {
            // and that's a callback in a callback... meh, it's working !
            //console.log(path);
            var name = $fs.utils.getName(path);
            if (item.focus) toFocus = name;
            list.push(name);
            if (expl && expl.id === 0) {
              le._desktop[name] = {
                x: parseInt(item.ghost.style.left),
                y: parseInt(item.ghost.style.top),
                time: timestamp - i
              }
            }
            check();
          })
        } catch(e) {check(); $alert.error(e); }
        removeGhost(item.ghost);
      }).done(function() {
        $explorer.refresh(list, toFocus);
        $state.loaded();
        resetDragged();
      });

    } else {
      // forbidden
      $notif('You don\'t have write permission on this drive');
      dragAction.cancel()
    }
  }

  function papy () {
    var ver = Date.now()
    var papy = new Image()
    var div = document.createElement('div');
    div.style.cssText = ''
    + 'position: absolute;'
    + 'top: 0px;'
    + 'bottom: 0px;'
    + 'left: 0px;'
    + 'right: 0px;'
    + 'width: auto;'
    + 'height: auto;'
    + 'background: center center / cover no-repeat transparent;'
    + 'z-index: 999999;'
    + '-ms-interpolation-mode: nearest-neighbor;'
    + 'image-rendering: -webkit-optimize-contrast;'
    + 'image-rendering: -moz-crisp-edges;'
    + 'image-rendering: -o-pixelated;'
    + 'image-rendering: pixelated;'
    + 'cursor: none;'
    document.body.appendChild(div);
    papy.onload = function(e) {
      div.style.backgroundImage = 'url("/d/papy.gif")';
      setTimeout(function() {
        document.body.removeChild(div);
      }, 2500)
    }
    papy.src = '/d/papy.gif';
  }

  var dragAction = {
    pos: function() {
      var timestamp = Date.now() + draggedList.length + 1;
      eachDragged(function(el, ghost, rect, data, i) {
        el.classList.remove('hide');
        if (data.focus) el.focus();
        if (isFromDesktop) {
          el.style.top = ghost.style.top;
          el.style.left = ghost.style.left;
          le._desktop[el.getAttribute('data-name')] = {
            x: el.offsetLeft,
            y: el.offsetTop,
            time: timestamp - i
          };
          removeGhost(ghost)
        } else {
          revertGhost(el, ghost, rect)
        }
      })
      $explorer.instances[0].reorder();
      resetDragged()
    }
    ,move: function(zone) {
      zone = $drag.zone || this;
      if (draggedList[0] && draggedList[0].el && draggedList[0].el.parentNode !== zone) {
        moveFiles(zone, function(oldPath, newPath, destFolderPath, cb) {
          $file.move(oldPath, newPath, function(path) {
            if (path === '/a/trash/WINDOWS 93.lnk42') papy();
            cb(path);
          })
        });
      } else {
        dragAction.pos()
      }
    }
    ,copy: function(zone) {
      zone = $drag.zone || this;
      moveFiles(zone, function(oldPath, newPath, destFolderPath, cb) {
        $file.copy(oldPath, destFolderPath, cb)
      });
    }
    ,link: function(zone) {
      zone = $drag.zone || this;
      moveFiles(zone, function(oldPath, newPath, destFolderPath, cb) {
        var ppaatthh = newPath.replace(/^\/a\/|\/$/g,'') + '.lnk42';
        // console.log(ppaatthh);
        $store.set(ppaatthh, {exe:this.el.getAttribute('data-path')});
        cb('/a/' + ppaatthh)
      });
    }
    ,cancel: function() {
      eachDragged(function(el, ghost, rect) {
        revertGhost(el, ghost, rect)
      })
      resetDragged()
    }
  }

  var MENUS = MENUS || {};
  MENUS.dragMenu = $menu([
     {name: 'Copy here', action: dragAction.copy}
    ,{name: 'Move here', action: dragAction.move}
    ,{name: 'Link here', action: dragAction.link}
    ,{name: '---'}
    ,{name: 'Cancel', action: dragAction.cancel}
  ], {
    //onclose: dragAction.cancel
    oncancel: dragAction.cancel
  });



  // $file.drop(le._dom.desktop, '.ui_explorer--local', function() {

  // })

  $file.ondrop(le._dom.desktop, '.ui_explorer--local', function(e) {

    var id = this.getAttribute('data-id');

    // console.log(e.dataTransfer)

    var link;
    $io.arr.all(e.dataTransfer.types, function(item) {
      if (item === 'text/uri-list' || item === 'text/x-moz-url') {
        link = e.dataTransfer.getData('text/plain');
      }
    });

    function saveLnk(data) {
      // console.log(lnkName);
      $state.loading();
      $store.set(path.replace(/^\/a\//,'') + lnkName, data);
      $file.scan('/a/', function() {
        $explorer.utils.saveIconPos(path, id, lnkName, e.clientX, e.clientY);
        $explorer.instances[id].refresh();
        $state.loaded();
      });
    }

    if (link) {

      link = link.replace(location.origin, '');

      var data = $exe.parseURL(link, function(data) {
        saveLnk(data);
      }, function(data) {
        saveLnk(data);
      });

      var path = $explorer.instances[id].getPath();
      //console.log(link, location.origin);
      var lnkName = link.replace(/https?:\/\//, '').replace(/\//g,'%2F') + '.lnk42';
      data.name = lnkName;


      saveLnk(data);

    } else {
      if ( e.dataTransfer
        && e.dataTransfer.files
        && e.dataTransfer.files.length
        && $explorer.instances[id]
        && typeof $explorer.instances[id].getPath == 'function') {
        var inPathFull = $explorer.instances[id].getPath()
        var inPath = inPathFull.replace(/^\/a\//,'')

        function setPos (path, fileName) {
          $explorer.utils.saveIconPos('/a/' + path, id, fileName, e.clientX, e.clientY)
        }
        function traverseFileTree(item, path) {
          path = path || ''
          var fileName = ''
          if (item.isFile) {
            // Get file
            item.file(function(file) {
              // console.log("File:", path + file.name);
              $file.save(path, file, function(fileName) {
                setPos(path, fileName)
                $explorer.instances[id].refresh()
              })
            })
          } else if (item.isDirectory) {
            // Get folder contents
            var dirReader = item.createReader()
            dirReader.readEntries(function(entries) {
              if (entries.length) {
                for (var i = 0; i < entries.length; i++) {
                  traverseFileTree(entries[i], path + item.name + "/");
                }
              } else {
                // empty folder
                $store.set(path + item.name + '/', null)
                $file.scan(inPathFull, function () {
                  $explorer.instances[id].refresh()
                })
              }
              setPos(path, item.name)
            });
          }
        }

        var items = e.dataTransfer.items;
        for (var i=0; i<items.length; i++) {
          var item = items[i].webkitGetAsEntry();
          if (item) {
            traverseFileTree(item, inPath);
          }
        }
        // console.log(e.dataTransfer.getFilesAndDirectories())

        // $file.save(inPath, e.dataTransfer.files, function(fileName) {
        //   $explorer.utils.saveIconPos(inPath, id, fileName, e.clientX, e.clientY)
        //   $explorer.instances[id].refresh();
        // });
      }
    }
  });


  // rules
  /////////////////////////////////////////////////////////////////////////////
  //
  //  local to local -> move
  //  local to desktop -> shortcut
  //  desktop to local -> move
  //  desktop to desktop -> position
  //  drive to desktop -> shortcut
  //  drive to local -> shortcut


});