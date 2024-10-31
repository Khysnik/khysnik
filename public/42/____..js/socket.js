!(function(global) {
  "use strict";

  function Socket(url) {
    var callbacks = {};
    var ws_url = url;
    var conn;

    this.on = function(event_name, callback) {
      callbacks[event_name] = callbacks[event_name] || [];
      callbacks[event_name].push(callback);
      return this; // chainable
    };

    this.send = function(event_name, event_data) {
      this.conn.send(event_data);
      return this;
    };

    this.connect = function() {
      if (typeof MozWebSocket == "function") this.conn = new MozWebSocket(url);
      else this.conn = new WebSocket(url);

      // dispatch to the right handlers
      this.conn.onmessage = function(evt) {
        //console.log(evt)
        dispatch("message", evt.data);
      };

      this.conn.onclose = function() {
        dispatch("close", null);
      };
      this.conn.onopen = function() {
        dispatch("open", null);
      };
    };

    this.disconnect = function() {
      this.conn.close();
    };

    var dispatch = function(event_name, message) {
      var chain = callbacks[event_name];
      if (typeof chain == "undefined") return; // no callbacks for this event
      for (var i = 0; i < chain.length; i++) {
        chain[i](message);
      }
    };
  }

  function _socket(url) {
    return new Socket(url);
  }

  global.$socket = _socket;
})(this);
