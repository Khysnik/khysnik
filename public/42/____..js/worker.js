!(function(global) {
  "use strict";

  // based on https://github.com/cdsanchez/SimpleWorker

  var URL = window.URL || window.webkitURL || window;

  var workerSource = function __workerEnv() {
      var functionRegExp = /^function\s*([a-zA-Z0-9_$]*)\s*\(([a-zA-Z0-9_$,\s]*)\)\s*[^{]*{\s*([\d\D]*)\s*}[^}]*$/gim;
      var absoluteUrlRegExp = /^https?:/;

      function postResult(result) {
        self.postMessage(result);
        self.close();
      }

      function deserializeFunction(functionText) {
        var functionParts = functionRegExp.exec(functionText),
          functionArgs = functionParts[2].split(/\s*,\s*/),
          functionBody = functionParts[3]; // + ';console.log("from worker")';

        return Function.apply(null, functionArgs.concat(functionBody));
      }

      var console = {};
      // Provide basic console interface:
      ["log", "debug", "error", "info", "warn", "time", "timeEnd"].forEach(
        function(meth) {
          console[meth] = function() {
            self.postMessage({
              cmd: "console",
              method: meth,
              args: [].slice.call(arguments),
            });
          };
        }
      );

      self.onmessage = function(evt) {
        var commandObject = evt.data,
          invokeFn,
          invokeArguments,
          invokeResult;

        switch (commandObject.command.toLowerCase()) {
          case "import":
            importScripts.apply(null, commandObject.arguments);
            break;
          case "invoke":
            invokeFn = deserializeFunction(commandObject.arguments[0]);
            invokeArguments = commandObject.arguments.slice(1);

            invokeResult = invokeFn.apply(this, invokeArguments);

            // The result is a Promise-like object. Wait until it's resolved.
            if (
              invokeResult != null &&
              typeof invokeResult.then == "function"
            ) {
              invokeResult.then(postResult);
            }
            // Has immediate value. Post back.
            else {
              postResult(invokeResult);
            }
            break;
        }
      };
    }
      .toString()
      .replace(/^[^{]*{\s*([\d\D]*)\s*}[^}]*$/, "$1"),
    workerBlob = new Blob([workerSource]),
    workerUrl = window.URL.createObjectURL(workerBlob);

  // Transform relative script URLs into absolute URLs
  function getScriptUrl(scriptPath) {
    if (absoluteUrlRegExp.test(scriptPath)) {
      return scriptPath;
    }

    return (
      location.protocol +
      "//" +
      location.hostname +
      (location.port && ":" + location.port) +
      "/" +
      scriptPath
    );
  }

  function makeWorker(workerFunction, imports) {
    var importUrls = (imports || []).map(getScriptUrl);

    return function() {
      var worker = new Worker(workerUrl),
        args = [workerFunction.toString()].concat([].slice.call(arguments));

      return new Promise(function(resolve, reject) {
        worker.addEventListener(
          "message",
          function(evt) {
            var data = evt.data;
            if (data && data.cmd === "console") {
              if (window.console) {
                window.console.group("worker " + workerFunction.name);
                window.console[data.method].apply(window.console, data.args);
                window.console.groupEnd("worker " + workerFunction.name);
              }
            } else {
              resolve(data);
            }
          },
          false
        );

        worker.addEventListener(
          "error",
          function(errorEvent) {
            reject(errorEvent);
          },
          false
        );

        worker.postMessage({
          command: "import",
          arguments: importUrls,
        });

        worker.postMessage({
          command: "invoke",
          arguments: args,
        });
      });
    };
  }

  /*function _worker(obj) {

    var out = {}

    for (var prop in obj) {
      if (obj.hasOwnProperty(prop)) {
        out[prop] = makeWorker(obj[prop])
        //console.log(obj[prop])
      }
    }

    return out

  }*/

  //global.$worker = global.operative
  global.$worker = makeWorker; //_worker
})(this);

/*  var doCrazy = $worker(function doCrazy(nb) {
    console.log('nb', nb)
    return new Promise(function(resolve, reject) {
      console.time('Craziness');
      for (var i = 0; i < nb; ++i);
      console.timeEnd('Craziness');
      resolve('I am done!');
      //cb('I am done!');
    })
  })
  doCrazy(1000000000).then(function(arg) {
    console.log(arg)
  })*/

/*var doCrazy = $worker(function doCrazy() {
  console.log('nb', fetch.toString())
})
doCrazy()*/
