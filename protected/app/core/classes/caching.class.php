<?php

declare(strict_types=1);

namespace Fastest\Core;

use Phpfastcache\CacheManager;
use Phpfastcache\Config\ConfigurationOption;
use Phpfastcache\Drivers\Memcached\Config as MemcachedConfig;

class Caching
{
    private $cache = null;
    private $prefix = null;
    private $enabled = true;
    private $compress = null;
    private $lifetime = 3600;
    private $environment = 'page';

    private static $_instance = null;

    public function __construct()
    {
        $this->prefix = md5(gethostname());
        $this->enabled = defined('ENABLECACHE') && ENABLECACHE;
        $this->compress = defined('MEMCACHE_COMPRESSED') && MEMCACHE_COMPRESSED;

        if (extension_loaded('memcache') || extension_loaded('memcached')) {
            $this->init('Memcached', new MemcachedConfig([
              'host' => '127.0.0.1',
              'port' => 11211,
            ]));
        } else {
            $this->init('Files', new ConfigurationOption([
              'path' => PATH_CACHE,
              'itemDetailedDate' => false,
            ]));
        }

        if (!$this->enabled) {
            $this->clearCache();
        }
    }

    public static function getInstance()
    {
        if (!(self::$_instance instanceof self)) {
            self::$_instance = new self();
        }

        return self::$_instance;
    }

    protected function getKey($key = '')
    {
        $key = str_replace([' ', ',', ':'], '_', $key);

        return md5($this->prefix.$key);
    }

    protected function init($driver = '', $config = [])
    {
        $this->cache = CacheManager::getInstance($driver, $config);
    }

    public function getCache($key = '')
    {
        $key = $this->getKey($key);

        if (!$this->enabled) {
            return false;
        }

        if (!($this->cache->getItem($key) === false)) {
            return $this->cache->getItem($key);
        }

        return false;
    }

    public function setCache($key = '', $value = '')
    {
        $key = $this->getKey($key);

        if ($this->enabled) {
            $cacheItem = $this->cache->getItem($key);
            $cacheItem->set($value)->expiresAfter($this->lifetime);
            $this->cache->save($cacheItem);

            unset($cacheItem);
        }
    }

    public function getCompiled($key = '')
    {
        $key = $this->getKey($key);

        if (!$this->enabled || !($node = $this->cache->getItem($key))) {
            return false;
        }

        return $node->get();
    }

    public function deleteCache($key = '')
    {
        $key = $this->getKey($key);

        if ($this->enabled && $key) {
            $this->cache->delete($key);
        }

        gc_collect_cycles();
    }

    public function clearCache()
    {
        if ($this->enabled) {
            $this->cache->clear();
        }

        gc_collect_cycles();
    }
}
