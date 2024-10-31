

/*
  88""Yb 88     88   88  dP""b8 88 88b 88 .dP"Y8
  88__dP 88     88   88 dP   `" 88 88Yb88 `Ybo."
  88"""  88  .o Y8   8P Yb  "88 88 88 Y88 o.`Y8b
  88     88ood8 `YbodP'  YboodP 88 88  Y8 8bodP'
*/

!function(global) { 'use strict';

  $form.plugin.explorer = function(field, cfg) {
    var combo = document.createElement('div')
    field.btn = document.createElement('button')
    field.btn.innerHTML = '<img height=16 width=16 src="'+ le._path.skin +'places/16/folder-open.png">';
    // combo.className = "ui_toolbar flex--nowrap"
    combo.className = "ui_form_combo w100"
    combo.appendChild(field.actionZone)
    combo.appendChild(field.btn)

    field.actionZone = combo

    field.btn.onclick = function(e) {
      e.preventDefault();
      setTimeout(function () {
        $explorer($extend({path: '/', browse: true, onclose:function(ok, val) {
          //console.log(ok, val);
          if (ok) {
            field.input.value = val;
            $el(field.input).trigger('change');
          }
        }}, cfg));
      }, 0)
    }

    return field
  }

  $form.plugin.icon = function(field, cfg) {

    var combo = document.createElement('div');
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'block left mr10 h50p w50p';
    //btn.textContent = 'browse';
    btn.style.backgroundRepeat = 'no-repeat';
    btn.style.backgroundPosition = 'center';
    btn.style.backgroundSize = '32px 32px';
    if (!field.input.value) field.input.value = '/c/sys/skins/w93/shortcut.png';
    field.input.value = $fs.utils.normalizeIcon(field.input.value);
    function changeIcon() {
      btn.style.backgroundImage = 'url(' + (field.input.value) + ')';
    }
    changeIcon();
    btn.onclick = function(e) {
      e.preventDefault();
      setTimeout(function () {
        $explorer($extend({
          path: '/c/files/images/icons/',
          accept: 'image/*',
          browse: true,
          onclose:function(ok, val) {
            if (ok) {
              field.input.value = val;
              changeIcon();
            }
          }
        }, cfg));
      }, 0)
    }

    setTimeout(function () {
      var __form = field.input.form
      if (cfg && cfg.watch && __form[cfg.watch]) {
        //console.log(__form[cfg.watch]);
        __form[cfg.watch].addEventListener('change', function(e) {
          //console.log('???', this.value);
          //console.log(111, $fs.utils.getIcon(this.value));
          if (field.input.value === '/c/sys/skins/w93/shortcut.png') {
            var icon;
            var maybeApps = (this.value||'').split(' ')[0]
            if (le._apps[maybeApps] && le._apps[maybeApps].icon) {
              icon = le._apps[maybeApps].icon;
            } else {
              icon = $fs.utils.getIcon(this.value);
            }
            //console.log(icon);
            if (icon && icon !== '/c/sys/skins/w93/file.png') field.input.value = icon, changeIcon();
          }
        }, false);
        $el(__form[cfg.watch]).trigger('change');
      }
      //__form.firstChild.classList.add('right');
      //__form.firstChild.classList.add('w80');
      __form.insertBefore(btn, __form.firstChild);
    }, 0)


    field.div.classList.add('hide');

    return field
  }

}(this);