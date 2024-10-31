<?php 
require "templates/header.php";
require "../config.php";
require "../common.php";

if ($isdev == false) {
  echo "ERROR: Not logged as developper.";
  die;
}


   // Function to remove folders and files 
    function rrmdir($dir) {
        if (is_dir($dir)) {
            $files = scandir($dir);
            foreach ($files as $file)
                if ($file != "." && $file != "..") rrmdir("$dir/$file");
            rmdir($dir);
        }
        else if (file_exists($dir)) unlink($dir);
    }

    // Function to Copy folders and files       
    function rcopy($src, $dst) {

        $src = str_replace("//", "/", $src);
        $dst = str_replace("//", "/", $dst);

        //if (file_exists ( $dst ))
        //    rrmdir ( $dst );
        if (is_dir ( $src )) {
            
            if (is_dir($dst)==false && $dst != "." && $dst != "..") {
             mkdir ( $dst );
            }

            $files = scandir ( $src );
            foreach ( $files as $file )
                if ($file != "." && $file != ".."){
                   if (is_dir ( $file )) {
                       echo 'THIS IS A DIRRRR: '.$file;

                   }
                    //echo "src="."$src/$file"."<br>"."des="."$src/$file"."<br>";
                    rcopy ( "$src/$file", "$dst/$file" );
                }

        } else if (file_exists ( $src ))
            copy ( $src, $dst );

        rrmdir($src);
    }



try {
  $connection = new PDO($dsn, $username, $password, $options);







} catch(PDOException $error) {
  echo $sql . "<br>" . $error->getMessage();
}





if (isset($_POST['submit'])) {
  if (!hash_equals($_SESSION['csrf'], $_POST['csrf'])) die();


  echo "<div><h3>LOG:</h3>";

  try  {
    $connection = new PDO($dsn, $username, $password, $options);

      // tester integrités  formulaire et fichiers die si faux

      // tester si fichiers présents
      // tester si extentions correspondent


      // app name check
      if("" == trim($_POST['appname'])){
          echo "ERROR: App name needed.";
          die;
      }

      if (preg_match('/[\'^£$%&*()}{@#~?><>,|=_+¬-]/', trim($_POST['appname']) ))
      {
          echo "ERROR: No special characters in App name pls.";
          die;
      }

      // app description check
      if("" == trim($_POST['description'])){
          echo "ERROR: App description needed.";
          die;
      }

      /*
      if (preg_match('/[\'^£$%&*()}{@#~?><>,|=_+¬-]/', trim($_POST['description']) ))
      {
          echo "ERROR: No special characters in App description pls.";
          die;
      }
      */


      // icon check
      //
      if (file_exists($_FILES['icon']['tmp_name'])==false) {
        echo "ERROR: Icon needed.";
        die;
      }
      $iconextention = strtolower(  substr(  strrchr($_FILES['icon']['name'], '.')  ,1)  );
      if (in_array($iconextention, $iconextentions)==false) {
        echo "ERROR: Invalid icon type.";
        die;
      }
      //

      // screenshot test
      if (file_exists($_FILES['screenshot']['tmp_name'])==false) {
        echo "ERROR: Screenshot needed.";
        die;
      }
      $screenshotextention = strtolower(  substr(  strrchr($_FILES['screenshot']['name'], '.')  ,1)  );
      if (in_array($screenshotextention, $screenshotextentions)==false) {
        echo "ERROR: Invalid screenshot type.";
        die;
      }     

      // file test
      if (file_exists($_FILES['appfile']['tmp_name'])==false) {
        echo "ERROR: App File needed.";
        die;
      }
      $fileextention = strtolower( substr(  strrchr($_FILES['appfile']['name'], '.')  ,1)  );
      if (in_array($fileextention, $fileextentions)==false) {
        echo "ERROR: Invalid App extention.";
        die;
      }   

      /*
      // select check
      if (in_array($_POST['type'], $types)==false) {
        echo "ERROR: Invalid Application type.";
        die;
      }
      */
      if (in_array($_POST['category'], $categories)==false) {
        echo "ERROR: Invalid Catogery type.";
        die;
      }    
      //


      // fin test
      //

      // get current app id
      $sql = "SELECT count(*) as total FROM apps";
      $statement = $connection->prepare($sql);
      $statement->execute();
      $result = $statement->fetchAll();
      foreach ($result as $row) : 
        $count = $row['total']+1;
      endforeach;  

      

    


      $parentfolder = $privatefolder."/".$_POST['appname']."/";

      if(is_dir($parentfolder.$_POST['appname']."/")){
        $version = 0;
      }else{
        $version=count(glob($parentfolder."/*",GLOB_ONLYDIR));
      }

      $folder = $parentfolder.$version."/";
      mkdir($folder, 0777, true);
      // icon
      $name = $folder."/icon.".$iconextention;
      $result = move_uploaded_file($_FILES['icon']['tmp_name'],$name);
      // screenshot
      $name = $folder."/screenshot.".$screenshotextention;
      $result = move_uploaded_file($_FILES['screenshot']['tmp_name'],$name);      
      // file
      $name = $folder."/app.".$fileextention;
      
      $appfileurl = $folder.'app.'.$fileextention;

      if ($fileextention=="zip") {

        $appurl = $folder."app.zip";

        $result = move_uploaded_file($_FILES['appfile']['tmp_name'],$name);
        $path = pathinfo(realpath($name), PATHINFO_DIRNAME);
        $zip = new ZipArchive;
        $res = $zip->open($name);
        if ($res === TRUE) {
           for ($i = 0; $i < $zip->numFiles; $i++) {
            
             //$zip->getNameIndex($i)->extractTo($folder);

             if (substr( $zip->getNameIndex($i), 0, 8 ) === "__MACOSX") { continue; }
             if (substr( $zip->getNameIndex($i), 0, 9 ) === ".DS_Store") { continue; }
             if (substr( $zip->getNameIndex($i), 0, 1 ) === ".") { continue; }

             if (strpos( $zip->getNameIndex($i), '.php') !== false) { 
              array_map('unlink', glob("$folder/*.*"));
              rmdir($folder);
              if ($version==0) {rmdir($parentfolder);}
              echo "ERROR: no PHP pls.";
              die;
             }
             if (strpos( $zip->getNameIndex($i), '.svg') !== false) { 
              array_map('unlink', glob("$folder/*.*"));
              rmdir($folder);
              if ($version==0) {rmdir($parentfolder);}
              echo "ERROR: no SVG pls.";
              die;
             }
             if (strpos( $zip->getNameIndex($i), '.zip') !== false) { 
              array_map('unlink', glob("$folder/*.*"));
              rmdir($folder);
              if ($version==0) {rmdir($parentfolder);}
              echo "ERROR: Don't put ZIP files in your ZIP file pls.";
              die;
             }
             //echo $zip->getNameIndex($i)."<br>";
             
             $zip->extractTo($folder, array($zip->getNameIndex($i)));
          }

          $subfolderCount = count(glob("$folder/*",GLOB_ONLYDIR));
          $elementCount = count(glob("$folder/*"))-3;  // -3: icon, screenshot, zip

           //echo '<b>subfolder Count: '.$subfolderCount.'</b><br>';
           //echo '<b>zip count: '.$elementCount.'</b><br>';

           if (($elementCount==1)&&($subfolderCount==1)) { // this is a subfolder zip, let's fix this.
              $subfolder = "";
              foreach (glob("$folder*",GLOB_ONLYDIR) as $subfolderi) {
                $subfolder = $subfolderi;
              }
             
              rcopy($subfolder , $folder );
              //echo $subfolder." moved to ".$folder."...";
           }

          $zip->close();
          $appfileurl = $folder;
        } else {
          array_map('unlink', glob("$folder/*.*"));
          rmdir($folder);
          if ($version==0) {rmdir($parentfolder);}
          echo "ERROR: couldn't open $name";
          die;
        }
       
      }else{
        $appfileurl=$folder;
        $appurl = $appfileurl;
        //$appurl = $folder
        $result = move_uploaded_file($_FILES['appfile']['tmp_name'],$name);
      }
      
   

    echo "</div>";

    $new_app = array(
      "appname" => $_POST['appname'],
      "creator"  => $creatorname,
      "description"     => $_POST['description'],
      "icon"       => $folder.'icon.'.$iconextention,
      "screenshot"  => $folder.'screenshot.'.$screenshotextention,
      "type"  => $fileextention,
      "Category"  => $_POST['category'],
      "ip"  => $ip,
      "likes"  => 0,
      "version"  => $version,
      "appfile"  => $appfileurl,
      "appurl"  => $appurl,
      "verified"  => 0,
    );

    $sql = sprintf(
      "INSERT INTO %s (%s) values (%s)",
      "apps",
      implode(", ", array_keys($new_app)),
      ":" . implode(", :", array_keys($new_app))
    );
    
    $statement = $connection->prepare($sql);
    $statement->execute($new_app);
  } catch(PDOException $error) {
      echo $sql . "<br>" . $error->getMessage();
  }
}
?><?php if (isset($_POST['submit']) && $statement) : ?>
    <blockquote><?php echo escape($_POST['appname']); ?> successfully added, thanks!<br>Our team will soon check the integrity of your application<br>and publish it if everything is ok.</blockquote>
  <?php endif; ?>
    <h2>Submit your app!</h2>
    
    <form method="post" enctype="multipart/form-data">
      
      <input name="csrf" type="hidden" value="<?php echo escape($_SESSION['csrf']); ?>">
      <label for="appname">App Name</label>
      <input type="text" name="appname" id="appname">

      <?php 
        echo '<label for="category">Category</label><select name="category" id="category">';
        foreach ($categories as &$value) {
            echo '<option value="'.$value.'">'.$value.'</option>';
        }
        echo '</select>';
      ?>

      <label for="appfile">App File (html/css/js/zip archive)</label>
      <input type="file" name="appfile" id="appfile">

      <label for="icon">Icon (png/gif)</label>
      <input type="file" name="icon" id="icon">

      <label for="screenshot">Screenshot</label>
      <input type="file" name="screenshot" id="screenshot">

      <label for="description">Description</label>
      <textarea name="description" id="description"></textarea>
      <pre>Rules: 
  upload html/js/css/zip
  png/gif icon
  png/gif/jpg screenshot
  no php files
  no svg files
  no encrypted files
  no external files
  no script injections

Our team will review your application before any publication.  
If your application does not follow the rules it will not be published.</pre>
      <input type="submit" name="submit" value="Submit">

    </form>

    <br>
    <a href="index.php">Back to home</a>

<?php require "templates/footer.php"; ?>
