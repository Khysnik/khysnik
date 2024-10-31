!(function(global) {
  "use strict";

  // thanks : http://stackoverflow.com/a/32709371

  function _onResize(element, callback) {
    if (!_onResize.watchedElementData) {
      // First time we are called, create a list of watched elements
      // and hook up the event listeners.
      _onResize.watchedElementData = [];

      var checkForChanges = function() {
        _onResize.watchedElementData.forEach(function(data) {
          if (
            element.offsetWidth !== data.offsetWidth ||
            element.offsetHeight !== data.offsetHeight
          ) {
            data.offsetWidth = element.offsetWidth;
            data.offsetHeight = element.offsetHeight;
            data.callback();
          }
        });
      };

      // Listen to the window's size changes
      window.addEventListener("resize", checkForChanges);

      // Listen to changes on the elements in the page that affect layout
      var observer = new MutationObserver(checkForChanges);
      observer.observe(document.body, {
        attributes: true,
        childList: true,
        characterData: true,
        subtree: true,
      });
    }

    // Save the element we are watching
    _onResize.watchedElementData.push({
      element: element,
      offsetWidth: element.offsetWidth,
      offsetHeight: element.offsetHeight,
      callback: callback,
    });
  }

  global.$on = {
    resize: _onResize,
  };
})(this);
