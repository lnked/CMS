<?php
/**
 * CELEBRO.CMS (https://cms.celebro.ru).
 *
 * @copyright Copyright (c) CELEBRO lab. (https://celebro.ru)
 * @license https://cms.celebro.ru/license.txt
 */
$t1 = microtime(true);

require 'define.php';

$app = new Fastest\Core\App();

$app->terminate($_SERVER);

# Load time
$app->logger($t1);
