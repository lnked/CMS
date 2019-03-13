<?php

require '../define.php';

use \wapmorgan\UnifiedArchive\UnifiedArchive;

$archive = UnifiedArchive::open('filename.rar');
// or
$archive = UnifiedArchive::open('filename.zip');
// or
$archive = UnifiedArchive::open('filename.7z');
// or
$archive = UnifiedArchive::open('filename.gz');
// or
$archive = UnifiedArchive::open('filename.bz2');
// or
$archive = UnifiedArchive::open('filename.xz');
// or
$archive = UnifiedArchive::open('filename.cab');
// or
$archive = UnifiedArchive::open('filename.tar');
// or
$archive = UnifiedArchive::open('filename.tar.gz');
// or
$archive = UnifiedArchive::open('filename.tar.bz2');
// or
$archive = UnifiedArchive::open('filename.tar.xz');
// or
$archive = UnifiedArchive::open('filename.tar.Z');
// or
$archive = UnifiedArchive::open('filename.iso');

var_dump($archive->getFileNames()); // array with files list

var_dump($archive->isFileExists('README.md')); // boolean

var_dump($archive->getFileData('README.md')); // ArchiveEntry with file information

var_dump($archive->getFileContent('README.md')); // string


$archive->extractFiles($outputFolder, $archiveFiles);

// to unpack all contents of archive
$archive->extractFiles('output');

// to unpack specific files from archive
$archive->extractFiles('output', ['README.md', 'composer.json']);

// to unpack the src catalog in archive in the sources catalog on a disk
$archive->extractFiles('output', '/src/', true);

// to unpack the bookmarks catalog in archive in the sources catalog on a
// disk
$archive->extractFiles('output', '/bookmarks/', true);


// To delete a single file from an archive
$archive->deleteFiles('README.md');

// To delete multiple files from an archive
$archive->deleteFiles(['README.md', 'MANIFEST.MF']);

// To delete directories from archive
$archive->deleteFiles('/src/', true);


// To add completely the catalog with all attached files and subdirectories (all directory contents will be stored in archive root)
$archive->addFiles('/var/log');

// To add one file (will be stored as one file "syslog")
$archive->addFiles('/var/log/syslog');

// To add some files or catalogs (all catalogs structure in paths will be kept)
$archive->addFiles([$directory, $file, $file2, ...]);

UnifiedArchive::archiveFiles('/var/log', 'Archive.zip');

// To pack one file
UnifiedArchive::archiveFiles('/var/log/syslog', 'Archive.zip');

// To pack some files or catalogs
UnifiedArchive::archiveFiles([$directory, $file, $file2, ...], 'Archive.zip');


UnifiedArchive::archiveFiles([
    '/var/www/site/abc.log' => 'abc.log',   // stored as 'abc.log'
    '/var/www/site/abc.log',                // stored as '/var/www/site/abc.log'
    '/var/www/site/runtime/logs' => 'logs', // directory content stored in 'logs' dir
    '/var/www/site/runtime/logs',           // stored as '/var/www/site/runtime/logs'
], 'archive.zip');
