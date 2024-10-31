!(function(global) {
  "use strict";

  function _drop(parent, childs, cb) {
    var cnt = 0;
    function dragenter(e) {
      e.preventDefault();
      //console.log('????')
      cnt++;
      this.classList.add("ui_dropzone--droppable");
      //return false
    }
    function dragover(e) {
      return false;
    }
    function dragleave(e) {
      e.preventDefault();
      cnt--;
      if (cnt === 0) this.classList.remove("ui_dropzone--droppable");
      //return false
    }
    $el(parent)
      .on("dragenter", childs, dragenter)
      .on("dragover", childs, dragover)
      .on("dragleave", childs, dragleave)
      .on(
        "drop",
        childs,
        function(e) {
          e.preventDefault();
          this.classList.remove("ui_dropzone--droppable");
          cb.apply(this, arguments);
          return false;
        },
        true
      );
  }

  global.$drop = _drop;
})(this);
