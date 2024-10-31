<?php

// DEBUG sur "true" pour charger tout les scripts
// en version minifié
// et sur false pour charger la version mini "/c/sys42.js"

// define('DEBUG', true);
define('DEBUG', false);

// pour eviter les problemes de cache
// il faut incrementer la variable de revision
// s'utilise avec la fonction v()
// v('/error.js') ---> /error.js?v=2

define('VERSION', '2.4.2');
