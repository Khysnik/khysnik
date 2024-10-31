!(function(global) {
  "use strict";
  // riotjs 1.0.4 templates
  // https://github.com/muut/riotjs/blob/v1.0.4/lib/render.js
  // https://regex101.com/r/nS9aX8/2

  var template_escape = { "\\": "\\\\", "\n": "\\n", "\r": "\\r", "'": "\\'" };

  function $template(tmpl) {
    tmpl = tmpl || "";
    return new Function(
      "_",
      "return '" +
        tmpl
          .replace(/[\\\n\r']/g, function(char) {
            return template_escape[char];
          })
          //.replace(/\{%\s*(.*?)\s*}}([\s\S]*?)\{%\s*(.*?)\s*%}/g, "' + (_.$1?'$2':'') + '")
          .replace(
            /\{{#if\s*(.*?)\s*}}([\s\S]*?){{\/if}}/g,
            "' + (_.$1?'$2':'') + '"
          )
          .replace(
            /\{{#unless\s*(.*?)\s*}}([\s\S]*?){{\/unless}}/g,
            "' + (_.$1?'':'$2') + '"
          )
          .replace(/\{{\s*([\w\.]+)\s*}}/g, "' + (_.$1==null?'':_.$1) + '") +
        "'"
    );
  }

  global.$template = $template;
})(window);
