<?php include "templates/header.php"; ?>

<?php
require "../config.php";
require "../common.php";


$showuser = false;

try {
  $connection = new PDO($dsn, $username, $password, $options);

  $sql = "SELECT * FROM apps ORDER BY likes DESC";

     if(isset($_GET['id'])) {

         $appSearch = xss_cleaner($_GET['id']);
         $sql = "SELECT * FROM apps WHERE id = '".$appSearch."'";
         //$showuser = true;
     }


  $statement = $connection->prepare($sql);
  $statement->execute();
  $result = $statement->fetchAll();



} catch(PDOException $error) {
  echo $sql . "<br>" . $error->getMessage();
}

    

?>

<?php 

	$gotProperty = false;


    $resultcount=0;
    foreach ($result as $row) : 

        $resultcount=$resultcount+1;

		if (!$usernotlogged) {
			if ( escape($row["creator"]) == $name){
				$gotProperty= true;
			}
		}

    endforeach; 


    if ($resultcount==0){
        $appSearch='';
        echo 'No app found!';
        die;
    }else{
       
    }


   

	function generateRandomString($length = 10) {
	    return substr(str_shuffle(str_repeat($x='0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ', ceil($length/strlen($x)) )),1,$length);
	}


	function listDir($appfile, $remove, $level, $appname){
		$files = array_diff(scandir($appfile), array('..', '.','app.zip','screenshot.png', 'icon.png'));

			$tab = "";
			/*
			for ($i=0; $i < $level ; $i++) { 
				$tab = $tab."_";
			}
			*/

			foreach ( $files as $file ){
				
				if (is_dir ( $appfile.$file )) {

					listDir($appfile.$file.'/',$remove, $level+1, $appname);

				}else{
					
					$preview = htmlentities(file_get_contents($appfile.$file));
					if ($preview!="") {
						$randomName = generateRandomString();

						echo $tab.'<input type="checkbox" onclick="x=document.getElementById(\''.$randomName.'\');if (x.style.display === \'none\') {x.style.display = \'block\';} else {x.style.display = \'none\';}"> <b>'.str_replace($remove, "", $appfile.$file).'</b> <pre id="'.$randomName.'" style="display:none;">'.$preview.'</pre><br>';

						?>
						<script>
							dest = '/a/programs/<?php echo $appname; ?>/<?php echo str_replace($remove, "", $appfile.$file); ?>'
							content = $('#<?php echo $randomName; ?>').text();
							window.parent.$file.save(dest, content);
						</script>
						<?php
					}else{

						

						if (is_image($appfile.$file)) {
													
							$randomName = generateRandomString();
 							$imagedata = file_get_contents($appfile.$file);
					        $base64 = base64_encode($imagedata);  
					        
					        echo $tab.'<input type="checkbox" onclick="x=document.getElementById(\''.$randomName.'\');if (x.style.display === \'none\') {x.style.display = \'block\';} else {x.style.display = \'none\';}"> <b>'.str_replace($remove, "", $appfile.$file).'</b> <br><pre id="'.$randomName.'" style="display:none;"><img src="data:image/jpeg;base64, '.$base64.'" style="max-width:calc( 100% ); max-height:300px;"></pre>';

							?>
							<script>
							

							dest = '/a/programs/<?php echo $appname; ?>/<?php echo str_replace($remove, "", $appfile.$file); ?>';
								window.parent.fetch("<?php echo 'data:image/jpeg;base64, '.$base64; ?>").then(function(res){return res.blob()}).then(function(blob){
									window.parent.$file.save(dest, blob, function(){})
								});

								//window.parent.$file.save('/a/programs/<?php echo $appname ?>/index.html', '<?php echo $preview ?>');



							</script>
							<?php


						}else{
							echo $tab.'<b>'.str_replace($remove, "", $appfile.$file).'</b>';
						}

					}
					
				}
				
			}

	}

	function is_image($path) {
	    $a = getimagesize($path);
	    $image_type = $a[2];
	     
	    if(in_array($image_type , array(IMAGETYPE_GIF , IMAGETYPE_JPEG ,IMAGETYPE_PNG , IMAGETYPE_BMP)))
	    {
	        return true;
	    }
	    return false;
	}

?>

    <?php foreach ($result as $row) : 
        if (($row["verified"])||($isAdmin)||($gotProperty)) {






	    		$appfile = escape($row["appfile"]);

				$files = array_diff(scandir($appfile), array('..', '.','app.zip','icon.png','screenshot.png'));

				echo '<input type="checkbox" onclick="$(\'input:checkbox\').not(this).click()"> <b>FILES</b><br>';
				$appname = escape($row["appname"]);
				listDir($appfile,$appfile,0, $appname);

				
	    

		}
    endforeach;
	?>


<script>
	//window.parent.$file.save('/a/desktop/myapp/yooooo.txt', 'lamp', window.parent.$alert('cool') );
	//window.parent.$file.save('/a/programs/<?php echo $appname ?>/index.html', 'lamp');
</script>

<!--
<script>window.parent.$file.save('/a/programs/<?php echo $appname ?>/index.html', 'lamp');</script>
-->

<?php include "templates/footer.php"; ?>







