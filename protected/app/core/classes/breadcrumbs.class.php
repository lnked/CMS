<?php

declare(strict_types=1);

namespace Fastest\Core\Modules;

class BreadCrumbs extends \Fastest\Core\Init
{
    use \Tools, \Singleton;

    private $list = [];

    public function __construct()
    {
        $this->cache_enable = defined('ENABLECACHE') && ENABLECACHE;

        parent::__construct();
    }

    public function add()
    {
    }

    public function remove()
    {
    }

    public function clear()
    {
    }
}
