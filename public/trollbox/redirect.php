<script src="jquery.js"></script>
<script>
	$(function() {
		var protocol = window.location.protocol
		console.log(protocol)

		if (protocol=="http:") {
			window.location='http://windows93.net:8081'
		}
		if (protocol=="https:") {
		<?php
			$ch = curl_init('https://windows93.net:8087');

			curl_setopt($ch, CURLOPT_NOBODY, true);
			curl_exec($ch);
			$retcode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
			// $retcode > 400 -> not found, $retcode = 200, found.

			if ($retcode == 200) {
			    $isUrlOk = true;
			    echo "window.location='https://windows93.net:8087'";
			} else {
			    $isUrlOk = false;
			    echo "console.log('problem...')";
			}

			curl_close($ch);
		?>
		}
	});
</script>


