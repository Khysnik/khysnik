<h1>yo</h1>
<?php

include 'Gibberish.class.php';

$trainingDir = 'gibberish';
$dir = dirname(__FILE__).'/'.$trainingDir.'/';
$big_text_file = $dir.'big.txt';
$good_text_file = $dir.'good.txt';
$bad_text_file = $dir.'bad.txt';
const MATRIX_FILE = $dir.'matrix.txt';
$test_file = $dir.'test.txt';

function runGibberishTest($test){
    $isGibberish = Gibberish::test($test, MATRIX_FILE) === true;
    return $isGibberish;
}


$some = 'gfzetyfzyettyzeduqsmdlk kml km lklkzuyzetuyztyutz';
	
	echo $some.'<br>';

	if (runGibberishTest($some)) {
		echo 'true';
	}else{
		echo 'false';
	}

?>