<?php

function fillArrayWithFileNodes(DirectoryIterator $dir)
{
    $data = array();
    foreach ($dir as $node) {
        if ($node->isDir() && !$node->isDot()) {
            $fileName = $node->getFilename();
            if ($fileName != '.DS_Store') {
                $data[$fileName] = fillArrayWithFileNodes(new DirectoryIterator($node->getPathname()));
            }
        } else if ($node->isFile()) {
            $fileName = $node->getFilename();
            if ($fileName != '.DS_Store') {
                // $data[htmlentities($node->getFilename(), ENT_QUOTES, "UTF-8")] = floatval(($node->getCTime()) . '.' . $node->getSize());
                // $data[htmlentities($node->getFilename(), ENT_QUOTES, "UTF-8")] = 0;
                $data[$node->getFilename()] = 0;
            }
        }
    }
    return $data;
}
$c = fillArrayWithFileNodes(new DirectoryIterator('./c/'));
$a = fillArrayWithFileNodes(new DirectoryIterator('./a_/'));
try {
    // file_put_contents($_SERVER['DOCUMENT_ROOT'].'/files.json', json_encode(array('c'=>$c, 'a'=>$a)));
    echo file_put_contents('files.json', json_encode(array('c' => $c, 'a' => $a))) ? "ok" : "nope";
    // echo $_SERVER['DOCUMENT_ROOT'].'/files.json<br>';
    // echo '<a target="_blank" href="files.json">files.json</a> successfully updated';
    // echo 'ok';
} catch (Exception $e) {
    echo $e->getMessage();
} finally {
    // exit();
}
