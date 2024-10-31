<?php include "templates/header.php"; ?>

<?php
require "../config.php";
require "../common.php";


$showuser = false;

try {
  $connection = new PDO($dsn, $username, $password, $options);

  $sql = "SELECT * FROM apps ORDER BY likes DESC";


    if(isset($_GET['sort'])) {

      if ($_GET['sort']=="new") {
         $sql = "SELECT * FROM apps ORDER BY id DESC";
      }

      if ($_GET['sort']=="popular") {
         $sql = "SELECT * FROM apps ORDER BY likes DESC";
      }


    }

     if(isset($_GET['user'])) {

         $userSearch = xss_cleaner($_GET['user']);
         $sql = "SELECT * FROM apps WHERE creator = '".$userSearch."'";
         $showuser = true;
     }


  $statement = $connection->prepare($sql);
  $statement->execute();
  $result = $statement->fetchAll();



} catch(PDOException $error) {
  echo $sql . "<br>" . $error->getMessage();
}

    

?>

<?php 
    $resultcount=0;
    foreach ($result as $row) : 
        $resultcount=$resultcount+1;
    endforeach; 
    if ($resultcount==0){
        $userSearch='';
        echo 'Nope.';
        die;
    }else{
       
    }



    if ($showuser) {
        try {
          $connection = new PDO($dsn, $username, $password, $options);
          $sql = "SELECT * FROM users WHERE username = '".$userSearch."'";
          $statement = $connection->prepare($sql);
          $statement->execute();
          $resultUser = $statement->fetchAll();
        } catch(PDOException $error) {
          echo $sql . "<br>" . $error->getMessage();
        }
        foreach ($resultUser as $row) : 
            echo "<h3><b>User</b> ".escape($row["username"])."</h3>";
            echo "<b>Bio</b> ".escape($row["bio"])."<br>";
            echo "<b>Location</b> ".escape($row["location"])."<br>";
            echo "<b>Member since</b> ".escape($row["date"])."";
        endforeach; 



    }

?>




<h3>applications</h3>

<table>
    <thead>
        <tr>
            <th>Id</th>
            <th>Name</th>            
            <th>Developper</th>
            <th>description</th>
            <th>icon</th>
            <th>screenshot</th>
            <th>type</th>
            <th>category</th>
            <?php if($isAdmin){?><th>ip</th><?php } ?>
            <th>likes</th>
            <th>version</th>
            <?php if($isAdmin){?><th>download</th><?php } ?>
            <?php if($isAdmin){?><th>url</th><?php } ?>
            <th>Date</th>
            <?php if($isAdmin){?><th>Verified</th><?php } ?>
            <?php if($isAdmin){?><th>Edit</th><?php } ?>
        </tr>
    </thead>






    <tbody>
    <?php foreach ($result as $row) : 
        if (($row["verified"])||($isAdmin)) {
        
        ?>
        <tr>
            <td><?php echo escape($row["id"]); ?></td>
            <td><?php echo "<a href='app.php?id=".$row["id"]."'>".$row["appname"]."</a>"; ?></td>            
            <td><?php echo "<a href='?user=".$row["creator"]."'>".$row["creator"]."</a>"; ?></td>
            <td><?php echo escape($row["description"]); ?></td>

            <td>               
                <?php 
                    $imagedata = file_get_contents(escape($row["icon"]));
                    // alternatively specify an URL, if PHP settings allow
                    $base64 = base64_encode($imagedata);  
                    echo "<img src='data:image/jpeg;base64, ".$base64."' style='max-width:32px;max-height:32px;'>";   
                ?>
            </td>

            <td>
                <?php 
                    $imagedata = file_get_contents(escape($row["screenshot"]));
                    // alternatively specify an URL, if PHP settings allow
                    $base64 = base64_encode($imagedata);  
                    echo "<img src='data:image/jpeg;base64, ".$base64."' style='max-width:32px;max-height:32px;'>";  
                ?>
            </td>
            <td><?php echo escape($row["type"]); ?></td>
            <td><?php echo escape($row["category"]); ?></td>

            <?php if($isAdmin){
                echo "<td>".$row["ip"];
            }  ?>
            
            <td><?php echo escape($row["likes"]); ?></td>
            <td><?php echo escape($row["version"])/10+0.1; ?></td>


            <?php if($isAdmin){ ?>
                <td><a href='<?php echo escape($row["appurl"]); ?>' target='blank'><?php echo escape($row["appurl"]); ?></a></td>
            <?php } ?>            

            <?php if($isAdmin){ ?>
                <td><a href='<?php echo escape($row["appfile"]); ?>' target='blank'><?php echo escape($row["appfile"]); ?></a></td>
            <?php } ?>    

            <td><?php echo escape($row["date"]); ?> </td>

            <?php if($isAdmin){ ?>
                <td><?php echo escape($row["verified"]); ?> </td>
            <?php } ?>  

            <?php if($isAdmin){ ?>
                <td><a href="update-single.php?id=<?php echo escape($row["id"]); ?>">Edit</a></td>
             <?php } ?>

        </tr>
    <?php 

        # code...
        }


    endforeach; ?>
    </tbody>




</table>
<br>



	
	
<?php
	if ($isdev) { 
?>
	<form action="submit.php"><input type="submit" value="Submit your App" /></form>
	<?php
	}






?>


<?php if ($isAdmin) { ?>
    <br><br>
    <div>
    <b>Admin board</b></br>
        <a href="read.php"><strong>Read</strong></a> - find a user<br>
        <a href="update.php"><strong>Update</strong></a> - edit a user<br>
        <a href="delete.php"><strong>Delete</strong></a> - delete a user<br>
    </div>
<?php } ?>



<?php include "templates/footer.php"; ?>







