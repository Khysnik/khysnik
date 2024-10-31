<?php
$debug = true;
$title = "sys42";
include $_SERVER['DOCUMENT_ROOT'] . '/42/inc/functions.php';
include $_SERVER['DOCUMENT_ROOT'] . '/42/inc/head.php' ?>

<style>
	#code {
		position: relative;
		overflow: hidden;
		/*-webkit-filter: hue-rotate(-30deg);*/
	}
	#code .ui_hilit {
		margin: 0;
		white-space: pre;
		font-size: 8px;
		font-family: Tomo;
		position: absolute;
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;
		width: auto;
		height: auto;
		overflow: auto;
	}

</style>

<body class="ui_layout skin_nerd">
	<header><h1 class="mt0">sys42</h1></header>
	<article>
		<aside id="jslist" class="flex flex--column pr10 _hide _w150p">
			<?php
				// Open a known directory, and proceed to read its contents
				foreach(glob('{./js/sys/*.js,./js/io/*.js,./js/*.js,./js/API/*.js}', GLOB_BRACE) as $file)
				{
					echo "<button class='font_tomo txtleft' data-href='$file'>".str_replace("./js/", "", $file)."" . "</button>";
				}
			?>
		</aside>
		<section id="code" class="skin_inset skin_scrollbar" style="margin-right: 10px; flex: 0 0 400px">

		</section>
		<section class="skin_inset skin_scrollbar">
			<div id="log" class="ui_terminal fillspace"></div>
		</section>
	</article>

<?php include $_SERVER['DOCUMENT_ROOT'] . '/42/inc/scripts.php'; ?>

<script src="js/bdd.js"></script>

<script>
	var iframe = document.getElementById('source');
	var code = document.getElementById('code');
	var log = document.getElementById('log');
	var jslist = document.getElementById('jslist');
	var cli = $cli(log, {cols: 105, prompt:'>'});
	cli.input.focus();


	$el(jslist).on('click', 'button', function(e) {
	  e.preventDefault();
		$io.arr.all(jslist.querySelectorAll('button.pressed'), function(item) {
		  item.classList.remove('pressed');
		});
		this.classList.add('pressed');

		$log.clear();
		$bdd([this.dataset.href.replace('./js', './tests')], function(arg) {
	    //console.log(arg)
	  })
	  $ajax.get(this.dataset.href).done(function(arg) {
	    code.innerHTML = $io.str.hilit(arg);
	  })
	});

	//jslist.querySelector('button[data-href="' + './js/ui/cli.js' + '"]').click();
	//jslist.querySelector('button[data-href="' + './js/kernel/io.js' + '"]').click();
	//jslist.querySelector('button[data-href="' + './js/kernel/undo.js' + '"]').click();
	//jslist.querySelector('button[data-href="' + './js/dev/bdd.js' + '"]').click();
	//jslist.querySelector('button[data-href="' + './js/sys/kernel.js' + '"]').click();
	//jslist.querySelector('button[data-href="' + './js/extend.js' + '"]').click();
	jslist.querySelector('button[data-href="' + './js/API/History.js' + '"]').click();
</script>
</body>
</html>
