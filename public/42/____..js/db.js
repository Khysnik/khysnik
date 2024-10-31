!(function(global) {
  "use strict";

  var lf = global.localforage;

  if (lf) {
    lf.config({
      name: "fs",
      storeName: "a",
    });
    lf.setDriver(lf.INDEXEDDB);
  } else {
    throw new Error("Your browser don't support local save");
  }

  function _db(def, key, onready) {
    _db.get(key, function(err, val) {
      onready(err, val || def);
    });
  }

  _db.set = function(key, val, cb) {
    var content = val;
    lf.setItem(key, content, function(err, val) {
      if (err) $alert.error(err);
      (cb || $noop)(err, val);
    });
  };
  _db.get = function(key, cb) {
    lf.getItem(key, function(err, val) {
      var content = val;
      (cb || $noop)(err, content);
    });
  };
  _db.update = function(key, cb, done) {
    _db.get(key, function(err, val) {
      if (!err && typeof cb === "function")
        _db.set(key, cb(val), done || $noop);
    });
  };
  _db.getRaw = function(key, cb) {
    lf.getItem(key, cb || $noop);
  };
  _db.del = function(key, cb) {
    lf.removeItem(key, cb || $noop);
  };
  _db.clear = function(cb) {
    lf.clear(cb || $noop);
  };
  _db.keys = function(cb) {
    lf.keys(cb || $noop);
  };

  _db.store = lf;

  global.$db = _db;
})(this);

/*
  .dP"Y8 888888  dP"Yb  88""Yb 888888
  `Ybo."   88   dP   Yb 88__dP 88__
  o.`Y8b   88   Yb   dP 88"Yb  88""
  8bodP'   88    YbodP  88  Yb 888888
*/

!(function(global) {
  // https://developer.mozilla.org/en-US/docs/Using_Firefox_1.5_caching

  var ls = window.localStorage,
    onReady = {},
    onSave = {},
    def = {
      onerror: function(e) {
        console.error(e);
      },
    };

  if (!ls) throw new Error("Your browser don't support local save");

  function store(key, def, ready, quit) {
    var out = store.get(key); // || def;
    if (!out) out = store.set(key, def);
    if (typeof quit == "function") onSave[key] = quit;
    if (typeof ready == "function") (onReady[key] = ready), ready(out);
    return out;
  }

  store.set = function(key, val, noauto) {
    var content = val;
    if (typeof val !== "string") {
      try {
        content = JSON.stringify(val);
      } catch (e) {}
    }
    try {
      ls.setItem(key, content);
      if (!noauto) store.autoReady(key, val);
    } catch (e) {
      $alert.error(e);
    }
    return val;
  };
  store.get = function(key) {
    var val = ls.getItem(key);
    try {
      val = JSON.parse(val);
    } catch (e) {}
    return val;
  };
  store.update = function(key, cb) {
    var val = store.get(key);
    if (typeof cb === "function") {
      return store.set(key, cb(val));
    }
  };
  store.getRaw = function(key) {
    return ls.getItem(key);
  };
  store.del = function(key) {
    ls.removeItem(key);
    onReady[key] = null;
    onSave[key] = null;
  };

  store.onReady = function(key, cb) {
    if (typeof cb == "function") onReady[key] = cb;
    return onReady[key];
  };
  store.onSave = function(key, cb) {
    if (typeof cb == "function") onSave[key] = cb;
    return onSave[key];
  };
  store.autoReady = function(key, val) {
    if (onReady.hasOwnProperty(key) && typeof onReady[key] == "function")
      onReady[key](val);
  };
  store.autoSave = function(key) {
    if (onSave.hasOwnProperty(key) && typeof onSave[key] == "function") {
      store.set(key, onSave[key](), true);
    }
  };

  store.clear = function() {
    ls.clear();
    for (var key in onReady) {
      if (onReady.hasOwnProperty(key)) {
        onReady[key] = null;
      }
    }
    for (var key in onSave) {
      if (onSave.hasOwnProperty(key)) {
        onSave[key] = null;
      }
    }
  };
  store.keys = function() {
    return Object.keys(ls);
  };

  // @todo : find a solution for using beforeunload and preserve page caching
  if (window.self !== window.top && window.parent.$store) {
    global.$store = window.parent.$store;
  } else {
    window.addEventListener("beforeunload", function(event) {
      for (var key in onSave) {
        store.autoSave(key);
      }
      //var confirmationMessage = "\o/";
      //(event || window.event).returnValue = confirmationMessage;     //Gecko + IE
      //return confirmationMessage;
    });
    global.$store = store;
  }
})(this);

/*



!function(global) { 'use strict';

  // thanks : https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API/Using_IndexedDB

  // In the following line, you should include the prefixes of implementations you want to test.
  if (!window.indexedDB) window.indexedDB = window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
  if (!window.IDBTransaction) window.IDBTransaction = window.webkitIDBTransaction || window.msIDBTransaction;
  if (!window.IDBKeyRange) window.IDBKeyRange = window.webkitIDBKeyRange || window.msIDBKeyRange;

  var $idb = {};

  if (!window.indexedDB) {
    $idb.supported = false;
    console.error("Your browser doesn't support a stable version of IndexedDB.");
  } else $idb.supported = true;

  const DB_NAME = 'fs';
  const DB_VERSION = 1; // Use a long long for this value (don't use a float)
  const DB_STORE_NAME = 'a';

  var db;

  function openDb() {
    //console.info("openDb ...");
    var req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onsuccess = function (evt) {
      // Better use "this" than "req" to get the result to avoid problems with
      // garbage collection.
      db = this.result;
      //console.info("openDb DONE");
    };
    req.onerror = function (evt) {
      console.error("openDb:", evt.target.errorCode);
    };

    req.onupgradeneeded = function (evt) {
      console.info("openDb.onupgradeneeded");
      var store = evt.currentTarget.result.createObjectStore(
        DB_STORE_NAME, { autoIncrement: true });

      //store.createIndex('biblioid', 'biblioid', { unique: true });
      //store.createIndex('title', 'title', { unique: false });
      //store.createIndex('year', 'year', { unique: false });
    };
  }

  function getObjectStore(store_name, mode) {
    var tx = db.transaction(store_name, mode);
    return tx.objectStore(store_name);
  }

  $idb.import = function(data, cb, keyPrefix) {
    var store = getObjectStore(DB_STORE_NAME, 'readwrite');

    // Use transaction oncomplete to make sure the objectStore creation is
    // finished before adding data into it.
    store.transaction.oncomplete = function(event) {
      // Store values in the newly created objectStore.
      var customerObjectStore = db.transaction("a", "readwrite").objectStore("a");
      for (var key in data) {
        customerObjectStore.put(JSON.stringify(data[key]), keyPrefix + key);
      }
      if (typeof cb === 'function') cb();
    }
  }
  $idb.clear = function(data, cb, keyPrefix) {
    var store = getObjectStore(DB_STORE_NAME, 'readwrite');
    var req = store.clear();
    req.onsuccess = function(evt) {
      displayActionSuccess("Store cleared");
      displayPubList(store);
    };
    req.onerror = function (evt) {
      console.error("clearObjectStore:", evt.target.errorCode);
      displayActionFailure(this.error);
    };
  }

  openDb();

  global['$idb'] = $idb;

}(this);


*/
