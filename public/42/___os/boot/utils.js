system42("utils", function(le) {
  "use strict";

  var ext = {};
  $io.obj.each(le._get.mime.ext, function(val, type) {
    $io.obj.each(val, function(val, subtype) {
      $io.arr.all(val[0].split(","), function(e) {
        ext[e] = type + "/" + subtype;
      });
    });
  });
  le._get.ext.mime = ext;

  $io.obj.each(le._apps, function(app, key) {
    if (typeof app === "string") {
      le._apps[key] = {
        alias: app,
        exec: function() {
          // console.log('ALIAS');
          var arg = [];
          for (var i = 0, l = arguments.length; i < l; i++) {
            if (typeof arguments[i] === "string") arg.push(arguments[i]);
          }
          $exe.silent(app + " " + arg.join(" "));
        },
      };
      return;
    }

    //if (app.init) app.init.call({le: le, app: app});

    if (app.accept) $extend(app, $fs.utils.parseAccept(app.accept));
    if (app.ext) {
      $io.arr.all(app.ext, function(type) {
        if (le._get.ext.apps[type]) le._get.ext.apps[type].push(key);
        else le._get.ext.apps[type] = [key];
      });
    }
    if (app.mimetype) {
      le._get.mime.apps.push([app.mimetype, key]);
    }

    if (app.icon) app.icon = $fs.utils.normalizeIcon(app.icon);

    if (app.install) {
      system42.on("storage:ready", function(le) {
        app.install = app.install.replace(/^~\//, "/a/" + le._path.key.home);
        $io.obj.path.call("/", le._files, app.install, {
          exe: key,
          icon: app.icon,
        });
      });
    }
    if (app.init) {
      system42.on("config:ready", function(le) {
        app.init.call({ le: le, app: app });
      });
    }

    if (app.exec) {
      var appExec = app.exec;
      var expectedArg = $io.fn.arg(appExec);
      app.exec = function() {
        var icon = app.icon;
        if (this.arg.options && this.arg.options.icon) {
          icon = this.arg.options.icon = $fs.utils.normalizeIcon(
            this.arg.options.icon || this.arg.launcher.icon
          );
        }

        this.app = app;

        if (!this.that.window) this.that.window = {};
        if (!this.that.window.icon) this.that.window.icon = icon;
        if (!this.that.window.title)
          this.that.window.title = this.arg.launcher
            ? this.arg.launcher.title
            : app.name;
        if (!this.that.window.title) delete this.that.window.title;

        //console.log(this.arg.options)
        //if (this.arg.options.width) this.that.window.width = this.arg.options.width
        //if (this.arg.options.height) this.that.window.height = this.arg.options.height

        var args = this.arg.arguments.concat([this.arg.options]);

        if (app.inject === "arguments") {
          args = this.arg.arguments;
        } else {
          $io.arr.each(expectedArg, function(item, i) {
            if (item === "url" && typeof args[i] !== "string") args[i] = "";
            if (item === "opt" && typeof args[i] !== "object") args[i] = {};
          });
        }

        var ok;
        try {
          ok = appExec.apply(this, args);
          ok = ok === undefined ? 1 : ok;
        } catch (e) {
          $alert.error(e);
          ok = 0;
        }
        return ok;
      };
    }
  });
});
