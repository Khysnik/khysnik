<%- include('/42/inc/head.php', {title: "KEY TEST>"}) %>
<body>
  <div id="cont">

    <input id="yo" type="text" value="yo">
    <textarea name="" id="" cols="30" rows="10"></textarea>
    <select name="" id="">
      <option>1</option>
      <option>2</option>
      <option>3</option>
    </select>
  </div>

  <%- include('/42/inc/scripts.php') %>

  <script>

  var cont = document.getElementById('cont');
  var yo = document.getElementById('yo');
  //console.log(yo);
  $el(cont).on('change click keyup', 'input, textarea, select', function(e) {
    console.log(this.value)
  });

  yo.value = 'HAAAA';
  $el(yo).trigger('change');
  /*$el(yo).on('change', function(e) {
    console.log(e)
  });*/
  </script>
</body>
</html>