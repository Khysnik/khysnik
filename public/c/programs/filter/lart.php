<?php
$title = "filter";
include $_SERVER['DOCUMENT_ROOT'] . '/42/inc/functions.php';
include $_SERVER['DOCUMENT_ROOT'] . '/42/inc/head.php';
?>

<link href='https://fonts.googleapis.com/css?family=Roboto' rel='stylesheet' type='text/css'>

<body class="skin_alpha">
  <div class="ui_layout">
    <header style="flex: 0 150px;">
      <div id="preview_cont">
        <h1>Donation <span id="preview">Jacques Henri</span> Lartigue</h1>
      </div>
    </header>
    <section>
      <div class="ui_layout">
        <section>
          <textarea id="code" name="code">
          <circle id="cornea" cx="100" cy="100" r="50" fill="url(#corneaSurface)"/>
          <radialGradient id="corneaSurface">
            <stop offset="0%"   stop-color="black" stop-opacity="1"/>
            <stop offset="100%" stop-color="black" stop-opacity="0"/>
          </radialGradient>

          <feGaussianBlur stdDeviation="3"  in="SourceAlpha" />
            <feOffset dx="0" dy="0"           result="offsetblur"/>
            <feFlood flood-color="#ced237"/>
            <feComposite operator="in" in2="offsetblur"/>
            <feMerge>

              <feMergeNode/>
              <feMergeNode                    in="cornea"/>
              <feMergeNode                    in="SourceGraphic"/>
            </feMerge>
          </textarea>
        </section>
        <header>
          <select name="" id="fx"></select>
        </header>
      </div>
    </section>

  </div>




  <?php include $_SERVER['DOCUMENT_ROOT'] . '/c/effects.svg'; ?>


  <link rel="stylesheet" href="/c/libs/codemirror/lib/codemirror.css">
  <link rel="stylesheet" href="/c/libs/codemirror/theme/cobalt.css">
  <script src="/c/libs/codemirror/lib/codemirror.js"></script>
  <script src="/c/libs/codemirror/mode/xml/xml.js"></script>
  <script src="/c/libs/codemirror/mode/javascript/javascript.js"></script>
  <script src="/c/libs/codemirror/mode/css/css.js"></script>
  <script src="/c/libs/codemirror/mode/htmlmixed/htmlmixed.js"></script>
  <script src="./emmet.js"></script>

  <style>

    body {
      background: #1F1F1F;
    }

    #fx {
      width: 100%;
    }

    .CodeMirror {
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      width: auto;
      height: auto;

      background: #1F1F1F;
      color: #f8f8f8;

      font-family: "Tomo";
      font-size: 8px;
    }
    .CodeMirror-cursor { border-left: 1px solid #fff; }
    .CodeMirror-focused div.CodeMirror-selected,
    div.CodeMirror-selected {
      background: #0B0B0B;
    }

    .CodeMirror .cm-keyword { color: #a4ed2d; }
    .CodeMirror .cm-atom { color: #dd6988; }
    .CodeMirror .cm-number { color: #dd6988; }
    .CodeMirror .cm-def { color: #fff; }
    .CodeMirror .cm-keyword + span.cm-def { color: #f0562c; }
    .CodeMirror .cm-variable { color: #77ddbf; }
    .CodeMirror .cm-variable-2 { color: #fff; }
    .CodeMirror .cm-variable-3 { color: #2AD494; }
    .CodeMirror .cm-qualifier { color: #67c969; }
    .CodeMirror .cm-operator { color: #a4ed2d; }
    .CodeMirror .cm-property { color: #dd7758; }
    .CodeMirror .cm-comment { color: #316E96; /*#3D8686;*/ }
    .CodeMirror .cm-string { color: #ffd852; }
    .CodeMirror .cm-string-2 { color: #80ff82; }
    .CodeMirror .cm-meta { color: #D8FA3C; }
    .CodeMirror .cm-builtin { color: #f0562c; }
    .CodeMirror .cm-tag { color: #00e7e7; }
    .CodeMirror .cm-attribute { color: #8DA6CE; }
    .CodeMirror .cm-header { color: #FF6400; }
    .CodeMirror .cm-hr { color: #AEAEAE; }
    .CodeMirror .cm-link { color: #8DA6CE; }
    .CodeMirror .cm-error { color: #f06;}

    /* #preview {
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      width: auto;
      height: auto;
      background: #fff;
      padding: 3%;
    } */
    #preview_cont {
      text-align: center;
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      width: auto;
      height: 200px;
      background: #fff;
      padding: 3%;
    }

    h1 {
      font-family: 'Roboto';
      font-size: 500%;
      color: #000;
      /* color: #0ff; */
      /* text-shadow: 5px 5px 10px #f0f; */
    }
    h1 span {
      color: #ced237;
    }

  </style>
  <script>
    var delay;
    // Initialize CodeMirror editor with a nice html5 canvas demo.
    var editor = CodeMirror.fromTextArea(document.getElementById('code'), {
      mode: 'text/xml',
      profile: 'xhtml',
      lineWrapping: true
    });
    emmetCodeMirror(editor, {
      'Ctrl-Up': 'emmet.increment_number_by_1',
      'Ctrl-Down': 'emmet.decrement_number_by_1',
      'Shift-Ctrl-Up': 'emmet.increment_number_by_01',
      'Shift-Ctrl-Down': 'emmet.decrement_number_by_01',
    });
    editor.on("change", function() {
      clearTimeout(delay);
      delay = setTimeout(updatePreview, 10);
    });

    function updatePreview() {
      filter.innerHTML = editor.getValue()
      applyFilter()
    }
    setTimeout(updatePreview, 10);


    /////////////////////////////////////////////////////////////////////////////

    var svg = document.querySelector('svg')
    //console.log(svg.outerHTML)
    var filters = document.querySelectorAll('filter')
    var preview = document.getElementById('preview')
    var filter = document.getElementById('fx_convo')

    console.log(filter)

    /*var select = document.getElementById('fx')

    for (var i = 0, l = filters.length; i < l; i++) {
      select.appendChild(new Option(filters[i].id))
    }

    select.onchange = function() {
      filter = document.getElementById(this.value)
      editor.setValue(filter.innerHTML)
      //var filter = btoa(svg.outerHTML)
      //var url = 'data:image/svg+xml;utf8,'+filter+'#'+this.value
      applyFilter()
    }*/

    function applyFilter() {
      var url = 'data:image/svg+xml;utf8,' + btoa('<svg>' + filter.outerHTML + '</svg>') +'#'+filter.id
      preview.style.webkitFilter = preview.style.filter = "url('"+url+"')"
    }

    //select.onchange()

    setTimeout(function() {
      editor.refresh()
    }, 10);

  </script>

</body>
</html>