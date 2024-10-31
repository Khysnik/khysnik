!(function(global) {
  "use strict";

  var _fileInput = document.createElement("input");
  _fileInput.type = "file";

  function _upload(cb, opt) {
    var fileInput = _fileInput.cloneNode();
    opt = opt || {};
    //console.log(opt.accept)
    if (opt.accept) fileInput.setAttribute("accept", opt.accept);
    if (opt.multiple) fileInput.setAttribute("multiple", opt.multiple);
    //fileInput.accept = opt.accept || '*'
    //fileInput.multiple = opt.multiple || false
    fileInput.onchange = function(e) {
      var that = this;
      setTimeout(function() {
        cb.call(that, that.files);
        fileInput = null;
      }, 0);
    };
    fileInput.click();
  }

  global.$upload = _upload;
})(this);
