!(function(global) {
  "use strict";

  // http://stackoverflow.com/a/5379408

  var _selection = {
    get: function() {
      var txt = "";
      if (window.getSelection) {
        txt = window.getSelection().toString();
      } else if (document.selection && document.selection.type != "Control") {
        txt = document.selection.createRange().text;
      }
      return txt;
    },

    create: function(field, start, end) {
      if (field.createTextRange) {
        var selRange = field.createTextRange();
        selRange.collapse(true);
        selRange.moveStart("character", start);
        selRange.moveEnd("character", end);
        selRange.select();
        field.focus();
      } else if (field.setSelectionRange) {
        field.focus();
        field.setSelectionRange(start, end);
      } else if (typeof field.selectionStart != "undefined") {
        field.selectionStart = start;
        field.selectionEnd = end;
        field.focus();
      }
    },

    copy: function(el) {
      if (typeof el === "string") {
        var textarea = document.createElement("textarea");
        textarea.value = el;
        document.body.appendChild(textarea);
        console.log(textarea);
        el = textarea;
      }

      if (el) {
        window.getSelection().removeAllRanges();
        if (el.select) {
          el.focus();
          el.select();
        } else {
          var range = document.createRange();
          range.selectNode(el);
          window.getSelection().addRange(range);
        }
      }

      try {
        // Now that we've selected the anchor text, execute the copy command
        var successful = document.execCommand("copy");
        var msg = successful ? "successful" : "unsuccessful";
        console.log("Copy command was " + msg);
      } catch (err) {
        console.log("Oops, unable to copy");
      }

      if (el) {
        // Remove the selections - NOTE: Should use
        // removeRange(range) when it is supported
        window.getSelection().removeAllRanges();
      }
    },
  };

  global.$selection = _selection;
})(this);
