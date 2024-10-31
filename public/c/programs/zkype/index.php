<?php
$title = "Zkype";
include $_SERVER['DOCUMENT_ROOT'] . '/42/inc/functions.php';
include $_SERVER['DOCUMENT_ROOT'] . '/42/inc/head.php';
?>
	<body>

		<?php include 'zkype.html' ?>

			<script src="js/utils.js"></script>
			<script src="js/clmtrackr.js"></script>
			<script src="js/model_pca_20_svm.js"></script>
			<script src="js/face_deformer.js"></script>
			<script src="js/poisson_new.js"></script>

			<?php include $_SERVER['DOCUMENT_ROOT'] . '/42/inc/scripts.php' ?>

			<script src="zkype.js"></script>
	</body>
</html>
