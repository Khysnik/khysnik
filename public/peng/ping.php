<?php 
	if (substr($_GET['pong'], 0, 30)=='blob:http://www.windows93.net/') {
		?>
<script type="text/javascript" src="jquery.js"></script>
<iframe src="<?php echo $_GET['pong']; ?>"></iframe>
<script>
if (window.frameElement) {
	$("iframe").load(function(){
		isPre = $("iframe").contents().find("body pre").length;
		if (isPre==1) {
			txt = $("iframe").contents().find("body pre").html();
			parent.makePre(txt,"<?php echo $_GET['peng']; ?>","<?php echo $_GET['ext']; ?>");			
		}else{
			parent.toggleIframe("<?php echo $_GET['peng']; ?>");
		}
	});
}
</script>
		<?php
	}
?>
