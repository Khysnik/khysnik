<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title></title>
</head>
<body>
	
</body>
</html>
<script src="tf.js"></script>
<script src="bundle.js"></script>
<?php
$uploaddir = '/mnt/data/windows93/xn--xp8haa/public/b/img/';
$uploadfile = $uploaddir . basename($_FILES['userfile']['name']);

/*
echo '<pre>';
if (move_uploaded_file($_FILES['userfile']['tmp_name'], $uploadfile)) {
    echo "Le fichier est valide, et a été téléchargé
           avec succès. Voici plus d'informations :\n";
} else {
    echo "Attaque potentielle par téléchargement de fichiers.
          Voici plus d'informations :\n";
}

echo 'Voici quelques informations de débogage :';

//print_r($_FILES);

echo '</pre>';
*/

//echo basename($_FILES['userfile']['name']);

?>
<script>
  const nsfwjs = require('nsfwjs')
  const img = new Image()
  img.crossOrigin = 'anonymous'
  // some image here
  img.src = '<?php echo "/b/img/".basename($_FILES['userfile']['name']); ?>'

  // Load the model.
  nsfwjs.load().then(model => {
    // Classify the image.
    model.classify(img).then(predictions => {

    	if (predictions[0].className!="Porn"&&predictions[0].className!="Hentai") {
    		console.log("ok")
    	}else{
    		console.log("nope")
    	}

      
    })
  })
</script>
<pre>Please wait...</pre>