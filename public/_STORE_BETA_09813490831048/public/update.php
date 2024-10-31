<?php

/**
 * List all users with a link to edit
 */

require "../config.php";
require "../common.php";

try {
  $connection = new PDO($dsn, $username, $password, $options);

  $sql = "SELECT * FROM users";

  $statement = $connection->prepare($sql);
  $statement->execute();

  $result = $statement->fetchAll();
} catch(PDOException $error) {
  echo $sql . "<br>" . $error->getMessage();
}
?>
<?php require "templates/header.php"; ?>
        
<h2>Update users</h2>

<table>
    <thead>
        <tr>
          <th>#</th>
          <th>Name</th>
          <th>ip</th>          
          <th>Email Address</th>
          <th>Password</th>
          <th>userkey</th>
          <th>bio</th>
          <th>Location</th>
          <th>verified</th>
          <th>Date</th>
        </tr>
    </thead>
    <tbody>
      <?php foreach ($result as $row) : ?>
        <tr>
          <td><?php echo escape($row["id"]); ?></td>
          <td><?php echo escape($row["username"]); ?></td>
          <td><?php echo escape($row["ip"]); ?></td>          
          <td><?php echo escape($row["email"]); ?></td>
          <td><?php echo escape($row["pass"]); ?></td>          
          <td><?php echo escape($row["userkey"]); ?></td>
          <td><?php echo escape($row["bio"]); ?></td>
          <td><?php echo escape($row["location"]); ?></td>
          <td><?php echo escape($row["verified"]); ?></td>
          <td><?php echo escape($row["date"]); ?> </td>
        </tr>
      <?php endforeach; ?>
    </tbody>
</table>

<a href="index.php">Back to home</a>

<?php require "templates/footer.php"; ?>