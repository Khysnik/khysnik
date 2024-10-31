<form enctype="multipart/form-data" action="wait.php" method="post">
  <!-- MAX_FILE_SIZE doit précéder le champ input de type file -->
  <!-- Le nom de l'élément input détermine le nom dans le tableau $_FILES -->
  Envoyez ce fichier : <input name="userfile" type="file" />
  <input type="submit" value="Envoyer le fichier" />
</form>