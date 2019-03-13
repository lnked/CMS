<?php
/**
* CELEBRO.CMS (http://cms.celebro.ru)
*
* @copyright Copyright (c) CELEBRO lab. (http://celebro.ru)
* @license http://cms.celebro.ru/license.txt
*/

$t1 = microtime(true);

include_once '../define.php';

$_SESSION['file_array'] = [];

$cp = new cpLoader;
$cp->run();

/*
 * Log load time
 */

// $cp->log($t1, false);
