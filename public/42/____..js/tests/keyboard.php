<%- include('/42/inc/head.php', {title: "KEY TEST>"}) %>
<body>
  <strong id="haha">HAHAHAH</strong>
  <%- include('/42/inc/scripts.php') %>

  <script>
  var el = document.getElementById("haha");
  $keyboard()
    .down(function(k, sess) {
      console.log("iframe down", k);
      el.innerHTML = $keyboard.keys;
      window.top.document.documentElement.focus()
      //el.innerHTML = sess.pressed;
    })
    .up(function(k, sess) {
      console.log("iframe up", k);
      //el.innerHTML = sess.pressed;
    })
  ;

  setInterval(function() {
    el.innerHTML = $keyboard.keys;
  }, 500);

  </script>
</body>
</html>