<form action="index.php"><input type="submit" value="Back" /></form>
<?php
require "../config.php";
require "../common.php";


//";""
try {
  $connection = new PDO($dsn, $username, $password, $options);
  $sql = "TRUNCATE TABLE apps";
  $statement = $connection->prepare($sql);
  $statement->execute();
  $sql = "TRUNCATE TABLE users";
  $statement = $connection->prepare($sql);
  $statement->execute();
} catch(PDOException $error) {
  echo $sql . "<br>" . $error->getMessage();
}

$di = new RecursiveDirectoryIterator($privatefolder, FilesystemIterator::SKIP_DOTS);
$ri = new RecursiveIteratorIterator($di, RecursiveIteratorIterator::CHILD_FIRST);
foreach ( $ri as $file ) {
    $file->isDir() ?  rmdir($file) : unlink($file);
}
return true;
?>