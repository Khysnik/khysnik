<?php
  $ip = $_SERVER['REMOTE_ADDR'] . PHP_EOL;
  if (getenv("HTTP_CLIENT_IP")) $ip = getenv("HTTP_CLIENT_IP");
      else if(getenv("HTTP_X_FORWARDED_FOR")) $ip = getenv("HTTP_X_FORWARDED_FOR");
      else if(getenv("REMOTE_ADDR")) $ip = getenv("REMOTE_ADDR");
      else $ip = "0.0.0.0"; 
  $timestamp = date('j M Y -- h:i:s');    
  $proxy_headers = array(
      'HTTP_VIA',
      'HTTP_FORWARDED_FOR',
      'HTTP_X_FORWARDED',
      'HTTP_FORWARDED',
      'HTTP_CLIENT_IP',
      'HTTP_FORWARDED_FOR_IP',
      'VIA',
      'X_FORWARDED_FOR',
      'FORWARDED_FOR',
      'X_FORWARDED',
      'FORWARDED',
      'CLIENT_IP',
      'FORWARDED_FOR_IP',
      'HTTP_PROXY_CONNECTION'
  );
  $referer = $_SERVER['HTTP_REFERER'];
  $userAgent = $_SERVER['HTTP_USER_AGENT'];


  if ($ip!="77.152.167.27") {
     if ($referer!="") {
        file_put_contents("ip.txt", "$timestamp -- $ip -- $referer -- $userAgent \n", FILE_APPEND);
     }else{
         file_put_contents("ip.txt", "$timestamp -- $ip -- $userAgent \n", FILE_APPEND);
     } 
  }
?><!DOCTYPE html>
<html lang="fr">
<head>
	<meta charset="UTF-8">
	<title>L'AUTEUR EN PLS</title>
	<style>
		body{
			background-image: url('https://i.imgur.com/lH368Rg.png');
			font-family: Comic Sans MS;
			padding:40px;
			margin: 0px;
		}
		.yt{
			width: 600px;
			max-width: 100%;
			-moz-box-shadow: 0px 0px 20px 1px #656565;
			-webkit-box-shadow: 0px 0px 20px 1px #656565;
			-o-box-shadow: 0px 0px 20px 1px #656565;
			box-shadow: 0px 0px 20px 1px #656565;
			filter:progid:DXImageTransform.Microsoft.Shadow(color=#656565, Direction=NaN, Strength=20);
		}
		.bay{
			margin:0;
			margin-right: 20px;
			margin-bottom: 20px;
			width: 200px;
			max-width: calc( 50% - 25px );	
			-moz-box-shadow: 0px 0px 20px 1px #656565;
			-webkit-box-shadow: 0px 0px 20px 1px #656565;
			-o-box-shadow: 0px 0px 20px 1px #656565;
			box-shadow: 0px 0px 20px 1px #656565;
			filter:progid:DXImageTransform.Microsoft.Shadow(color=#656565, Direction=NaN, Strength=20);			
		}
		.play{
			width: 300px;
			max-width: 100%;
			-moz-box-shadow: 0px 0px 20px 1px #656565;
			-webkit-box-shadow: 0px 0px 20px 1px #656565;
			-o-box-shadow: 0px 0px 20px 1px #656565;
			box-shadow: 0px 0px 20px 1px #656565;
			filter:progid:DXImageTransform.Microsoft.Shadow(color=#656565, Direction=NaN, Strength=20);				
		}
	</style>
</head>
<body>
<div id="container">
	<h1>Jankenpopp<br>– L'auteur en PLS</h1>
	<img src="https://i.imgur.com/ZZbdPxz.png" width="400px">
	<h3>Bonjour à tous !</h3>
	<p>
	En ce premier avril 2018, <b>Jankenpopp</b> revient à ses premières amours avec un album de pop électronique.<br>
	Huit chansons françaises composent cette compilation faite d’angoisse existentielle sur fond de mélodie happy et de coupé-décalé électronique.<br>
	Au programme : vie, amour, sexe, fête, drogue, chômage, ordi-qui-plante, maladie, solitude, déprime et mort... l’occasion rêvée de ressortir la gratte acoustique en mode coin-coin du feu, de revendre sa collection retrogaming et de s’acheter une vraie voix pour chanter tout ça. <br>
	Les sonorités low-tech sont toujours présentes avec un brin de gameboy par-ci, une pincée de megadrive par-là et un soupçon de circuit-bending pour relever le tout.<br>
	Enfin en accompagnement cette année le chef propose guitare tranchée, pied qui tache ou ligne de basse épaisse à souhait, comme toujours la patate est à volonté !
	</p>
	<h3>Pour écouter l'album c'est par là :
	<a href="https://www.youtube.com/watch?v=FG2PVD984PY" target="blank"><br>
	https://www.youtube.com/watch?v=FG2PVD984PY<br><br>
	</a>
	<iframe width="600px" height="340px" class="yt" src="https://www.youtube.com/embed/FG2PVD984PY?rel=0" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>
	</h3>
	<br><hr>
	<h1>Super player (vidéoclip)</h1>
	<p>Pour accompagner la sortie de son album, <b>Jankenpopp</b> nous a concocté un clip à base de webcam d'ordinateur et d'incrustations vidéo en tout genre.</p>
	<h3>Pour visionner le clip c'est par içi :
	<a href="https://www.youtube.com/watch?v=lNEXAwwnSVs" target="blank"><br>
	https://www.youtube.com/watch?v=lNEXAwwnSVs<br><br>
	</a>
	<iframe width="600px" height="340px" class="yt" src="https://www.youtube.com/embed/lNEXAwwnSVs?rel=0" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>
	</h3>	
	<br><hr>
	<h1>L'auteur en PLS, l'édition CD collector™</h1>
	<p>Une micro édition limitée à 200 exemplaires, fabriquée avec les mains, qui devrait ravir tous les collectionneurs et spéculateurs de tout poil.<br>
	Cette édition inclue le compact disc, la pochette en carton recyclé tamponnée à la main, les neuf cartes collector™ avec les paroles des chansons ainsi qu'un autocollant PVC pour coller sur votre voiture, votre frigo ou votre ordinateur.
	</p>
	<h3>Pour vous procurer le disque irl :
	<a href="https://www.ebay.fr/itm/JANKENPOPP-LAUTEUR-EN-PLS-200-EX-/123038580618?hash=item1ca5abbf8a" target="blank"><br>
	https://www.ebay.fr/itm/JANKENPOPP-LAUTEUR-EN-PLS-200-EX-/123038580618?hash=item1ca5abbf8a<br><br>
	</a>
	<img src="https://i.imgur.com/jj20Er2.jpg" class="bay bay0">
	<img src="https://i.imgur.com/SxngpjW.jpg" class="bay">
	<img src="https://i.imgur.com/xsqupAs.jpg" class="bay">
	<img src="https://i.imgur.com/SjOPhw2.jpg" class="bay">	
	</h3>	
	<br><hr>
	<h1>L'auteur en PLS, l'application Android</h1>
	<p>Pour les branchés, <b>Jankenpopp</b> a codé avec ses petites pattes sa propre application Android. Celle-ci inclue l'intégralité de l'album, ainsi que les textes des chansons.</p>
	<h3>Pour obtenir l'application sur Google Play :<br><a href="https://play.google.com/store/apps/details?id=com.jankenpopp.pls" target="blank">https://play.google.com/store/apps/details?id=com.jankenpopp.pls<br><br>
	</a>
	<img src="https://i.imgur.com/UNHuSyh.jpg" class="play">
	</h3>	
	<br><hr>	
	<h1>L'auteur en PLS, en téléchargement</h1>
	<p>Pour vous procurer l'album en téléchargement, consultez les liens ci-dessous :</p>
	<p>
		iTunes : <a target="blank" href="https://itunes.apple.com/mu/album/lauteur-en-pls/1364017701">https://itunes.apple.com/mu/album/lauteur-en-pls/1364017701</a><br>
		Spotify : <a target="blank" href="https://open.spotify.com/album/6CXIvEOJu6DfbF3H8gO7aC">https://open.spotify.com/album/6CXIvEOJu6DfbF3H8gO7aC</a><br>
		Deezer : <a target="blank" href="https://www.deezer.com/fr/album/59841942">https://www.deezer.com/fr/album/59841942</a><br>
		Bandcamp : <a target="blank" href="https://jankenpopp.bandcamp.com/album/lauteur-en-pls">https://jankenpopp.bandcamp.com/album/lauteur-en-pls</a><br>
	</p>
	<br><hr>
	<i>The difference between URL and IRL is YOU and I.<br>
	<a href="http://www.windows93.net/pls/" target="blank">http://windows93.net/pls</a></i>
</div>
</body>
</html>
