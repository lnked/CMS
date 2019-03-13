<?php

require '../define.php';

use Jenssegers\ImageHash\ImageHash;
use Jenssegers\ImageHash\Implementations\DifferenceHash;

$hasher = new ImageHash(new DifferenceHash());
$hash1 = $hasher->hash('../upload_dir/3e/013d_07f104667.jpg');
$hash2 = $hasher->hash('../upload_dir/30/b586_07f104667_crop_preview.jpg');

$distance = $hasher->distance($hash1, $hash2);

echo $hash1->toHex();

echo '<br />' ;
echo $hash2->toHex();
echo '<br />' ;
echo $distance;

// // or
// $distance = $hash1->distance($hash2);

// echo $hash->toHex(); // 7878787c7c707c3c
// echo $hash->toBin(); // 0111100001111000011110000111110001111100011100000111110000111100
// echo $hash->toInt(); // 8680820757815655484

// $hash = Hash::fromHex('7878787c7c707c3c');
// $hash = Hash::fromBin('0111100001111000011110000111110001111100011100000111110000111100');
// $hash = Hash::fromInt('8680820757815655484');
