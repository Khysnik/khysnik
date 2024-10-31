!(function(global) {
  "use strict";

  function $archive(path, name) {
    name = name || $fs.utils.getName(path + "") || "derp";
    var progress = $alert.progress("Creating Archive...", "Archive");

    function onend(blob) {
      $file.download(blob, name + ".zip");
    }
    function onprogress(bytes, total) {
      progress.update(bytes / total * 100);
    }
    function onerror(err) {
      console.error(err);
    }

    $loader(["/c/libs/zip/zip.js", "/c/libs/zip/zip-fs.js"], function() {
      zip.workerScriptsPath = "/c/libs/zip/";

      var fs = new zip.fs.FS();

      function add(path, cb) {
        name = name || $fs.utils.getName(path);
        var tree = $fs.utils.getPathObj(path);

        //console.log(path, tree)

        function iterate(curPath, zipDir, dir, done) {
          $io.enum(
            [dir],
            function(val, key, check) {
              if (key !== "." && key !== "..") {
                if ($fs.utils.isShortcut(key) || typeof val !== "object") {
                  $file.open(curPath + "/" + key, "Blob", function(blob) {
                    zipDir.addBlob(key, blob);
                    check();
                  });
                } else {
                  iterate(
                    curPath + "/" + key,
                    zipDir.addDirectory(key),
                    val,
                    check
                  );
                }
              } else {
                check();
              }
            },
            function() {
              done();
            }
          );
        }

        if (tree) {
          iterate(
            tree.cwd,
            fs.root.addDirectory($fs.utils.getName(tree.cwd)),
            tree.obj,
            cb
          );
        } else {
          $file.open(path, "Blob", function(blob) {
            fs.root.addBlob(this.name, blob);
            cb();
          });
        }
      }

      function end() {
        fs.root.exportBlob(onend, onprogress, onerror);
      }

      if (typeof path === "string") add(path, end);
      else {
        $io.enum(
          path,
          function(val, key, check) {
            //console.log(val)
            //return
            if ($io.isElement(val)) {
              name = null;
              var exe = val.getAttribute("data-exe");
              var pat = val.getAttribute("data-path");
              if ($fs.utils.exist(exe)) add(exe, check);
              else add(pat, check);
            } else add(val, check);
          },
          end
        );
      }
    });
  }

  global.$archive = $archive;
})(this);

/*

      //var yo = fs.root.addDirectory('yo');
      //console.log(fs);
      //console.log(yo);
      $file.iterateFolder('/a/', function(path, type, key) {
        console.log(path, type, key)
      }).done(function(arg) {
        console.log(arg)
      })

      //fs.root.exportBlob(onend, onprogress, onerror)

*/

/*!function(global) { 'use strict';

  function $archive(cb) {
    $loader(['/c/libs/zip/zip.js'], function() {
      zip.workerScriptsPath = '/c/libs/zip/';
      function zipBlob(filename, blob, callback) {
        // use a zip.BlobWriter object to write zipped data into a Blob object
        zip.createWriter(new zip.BlobWriter("application/zip"), function(zipWriter) {
          // use a BlobReader object to read the data stored into blob variable
          zipWriter.add(filename, new zip.BlobReader(blob), function() {
            // close the writer and calls callback function
            zipWriter.close(callback);
          });
        }, onerror);
      }

      function unzipBlob(blob, callback) {
        // use a zip.BlobReader object to read zipped data stored into blob variable
        zip.createReader(new zip.BlobReader(blob), function(zipReader) {
          // get entries from the zip file
          zipReader.getEntries(function(entries) {
            // get data from the first file
            entries[0].getData(new zip.BlobWriter("text/plain"), function(data) {
              // close the reader and calls callback function with uncompressed data as parameter
              zipReader.close();
              callback(data);
            });
          });
        }, onerror);
      }

      function onerror(message) {
        console.error(message);
      }

      cb({
        zip: zipBlob,
        unzip: unzipBlob,
        onerror: onerror
      })
    });
  }

  global.$archive = $archive;
}(this);*/
