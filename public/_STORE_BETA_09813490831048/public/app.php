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

    	if ($row["verified"]==0){
        	$appSearch='';
	        echo '<i>The application has not been validated yet.</i><br>';
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


	function listDir($appfile, $remove, $level){
		$files = array_diff(scandir($appfile), array('..', '.','app.zip','screenshot.png', 'icon.png'));

			$tab = "";
			/*
			for ($i=0; $i < $level ; $i++) { 
				$tab = $tab."_";
			}
			*/

			foreach ( $files as $file ){
				
				if (is_dir ( $appfile.$file )) {

					listDir($appfile.$file.'/',$remove, $level+1);

				}else{
					
					$preview = htmlentities(file_get_contents($appfile.$file));
					if ($preview!="") {
						$randomName = generateRandomString();

						echo $tab.'<input type="checkbox" onclick="x=document.getElementById(\''.$randomName.'\');if (x.style.display === \'none\') {x.style.display = \'block\';} else {x.style.display = \'none\';}"> <b>'.str_replace($remove, "", $appfile.$file).'</b> <pre id="'.$randomName.'" style="display:none;">'.$preview.'</pre><br>';
					}else{

						

						if (is_image($appfile.$file)) {
													
							$randomName = generateRandomString();
 							$imagedata = file_get_contents($appfile.$file);
					        $base64 = base64_encode($imagedata);  
					        
					        echo $tab.'<input type="checkbox" onclick="x=document.getElementById(\''.$randomName.'\');if (x.style.display === \'none\') {x.style.display = \'block\';} else {x.style.display = \'none\';}"> <b>'.str_replace($remove, "", $appfile.$file).'</b> <br><pre id="'.$randomName.'" style="display:none;"><img src="data:image/jpeg;base64, '.$base64.'" style="max-width:calc( 100% ); max-height:300px;"></pre>';

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

        ?>
	<b>
		<?php 

	        $imagedata = file_get_contents(escape($row["icon"]));
	        // alternatively specify an URL, if PHP settings allow
	        $base64 = base64_encode($imagedata);  
	        echo "<img src='data:image/jpeg;base64, ".$base64."' style='max-width:32px;max-height:32px;'> ";   
	        echo escape($row["appname"]); ?>
	</b><br>
	<?php echo "<b>Category</b> ".escape($row["category"])."<br>"; ?>
	<?php echo "<b>Developper</b> <a href='index.php?user=".$row["creator"]."'>".$row["creator"]."</a><br>"; ?>
	<?php 
	    $imagedata = file_get_contents(escape($row["screenshot"]));
	    // alternatively specify an URL, if PHP settings allow
	    $base64 = base64_encode($imagedata);  
	    echo "<img src='data:image/jpeg;base64, ".$base64."' style='max-width:500px;max-height:300px;border:1px solid black;'><br>";  
	?>


	<?php echo "<b>Description</b> ".escape($row["description"])."<br>"; ?>
	<?php echo "<b>Uploaded</b> ".escape($row["date"])."<br>"; ?>
	<?php echo "<b>Version</b> ".($row["version"]/10+0.1)."<br>"; ?>
	<?php echo "<b>Type</b> ".escape($row["type"])."<br>"; ?> 
	<?php echo "<b>Popularity</b> ".escape($row["likes"])."<br>"; ?>










	<br>
	<a href="install.php?id=<?php echo escape($row["id"]); ?>"><input type="submit" value="INSTALL" /></a>
	<a href="like.php?id=<?php echo escape($row["id"]); ?>"><input type="submit" value="LIKE" /></a>
	<a href="hate.php?id=<?php echo escape($row["id"]); ?>"><input type="submit" value="HATE" /></a>
	<?php


		 	if (($isAdmin)||($gotProperty)) {
	    	echo '<a href="edit.php?app='.escape($row["id"]).'"><input type="submit" value="EDIT" /></a>';
	    
	    		echo '<br><br>';
	    		$appfile = escape($row["appfile"]);

				$files = array_diff(scandir($appfile), array('..', '.','app.zip','icon.png','screenshot.png'));

				echo '<input type="checkbox" onclick="$(\'input:checkbox\').not(this).click()"> <b>FILES</b><br>';
				listDir($appfile,$appfile,0);
	    	}

		}
    endforeach;
	?>







<?php if ($isAdmin) { ?>
    <br>
    <div>
    <b>Admin board</b></br>
        <a href="read.php"><strong>Read</strong></a> - find a user<br>
        <a href="update.php"><strong>Update</strong></a> - edit a user<br>
        <a href="delete.php"><strong>Delete</strong></a> - delete a user<br>
    </div>
<?php } ?>



<?php include "templates/footer.php"; ?>







