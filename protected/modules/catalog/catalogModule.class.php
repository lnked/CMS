<?php

declare(strict_types=1);

namespace Fastest\Core\Modules;

final class catalogModule extends \Fastest\Core\Modules\Module
{
    public function listMethod()
    {
        $ids = [];

        $cache_list = 'module.catalog.list';
        $cache_count = 'module.catalog.count';
        $cache_category = 'module.catalog.category';

        # Получение категорий
        #
        if (!($category = $this->compiled($cache_category)))
        {
            $category = Q("SELECT `id`, `pid`, `name`, `system`, `picture`, `description`
                           FROM `#__shop_category`
                           WHERE `visible`=1
                           ORDER BY `ord`, `name`")->all('id');

            foreach ($category as $item)
            {
                $children = Q("SELECT `id`, `pid`, `name`, `system`, `picture`, `description`
                           FROM `#__shop_category`
                           WHERE `visible`=1 AND `pid`=?i
                           ORDER BY `ord`, `name`", [ $item['id'] ])->all('id');

                if (!empty($children))
                {
                    $category = $category + $children;
                }
            }

            $this->cache->setCache($cache_category, $category);
        }

        $category_list = array_keys($category);

        if (!($count = $this->compiled($cache_count)))
        {
            $this->cache->setCache(
                $cache_count,
                $count = Q("SELECT COUNT(`id`) as `count` FROM `#__shop_catalog` WHERE `visible`=1 AND `category` IN (?li) LIMIT 1", [
                    $category_list
                ])->row('count')
            );
        }

        # Пагинация
        #
        $pager = $this->pager($count, $this->limit);

        # Получение товаров
        #
        if (!($catalog = $this->compiled($cache_list)))
        {
            $catalog = [];

            $temp = Q("SELECT `c`.`id`, `c`.`name`, `c`.`system`, `c`.`category`, `c`.`price`, `c`.`weight`, `c`.`particle_price`, `c`.`particle_weight`, `c`.`description`, `f1`.`file` as `photo`, `f2`.`file` as `zoom`
                       FROM `#__shop_catalog` as `c`
                       LEFT JOIN `#__sys_files` as `f1` ON `f1`.`gid` LIKE `c`.`photo` AND `f1`.`prefix` LIKE 'preview'
                       LEFT JOIN `#__sys_files` as `f2` ON `f2`.`gid` LIKE `c`.`photo` AND `f2`.`prefix` LIKE 'original'
                       WHERE `c`.`visible`=1 AND `c`.`category` IN (?li)
                       GROUP BY `c`.`id`
                       ORDER BY `c`.`id`, `c`.`name`", [ $category_list ])->all();

            if (!empty($temp))
            {
                foreach ($temp as $item)
                {
                    $photo = '';
                    $modification = [];

                    $modification[] = [
                        'weight'    => $item['weight'],
                        'price'     => $item['price']
                    ];

                    if ($item['particle_weight'])
                    {
                        $modification[] = [
                            'weight'    => $item['particle_weight'],
                            'price'     => $item['particle_price']
                        ];
                    }

                    if ($item['photo'])
                    {
                        $photo = $item['photo'];
                    }

                    $product = [
                        'id'            => $item['id'],
                        'name'          => addslashes($item['name']),
                        'category'      => $item['category'],
                        'system'        => $item['system'],
                        'description'   => $item['description'],
                        'modification'  => $modification,
                        'photo'         => $photo,
                        'zoom'          => $item['zoom'],
                    ];

                    $catalog[] = $product;
                }
            }

            $this->cache->setCache($cache_list, $catalog);
        }

        if (!empty($category) && !empty($catalog))
        {
            foreach ($catalog as $product)
            {
                $id = $product['category'];

                if (isset($category[$id]))
                {
                    if (!isset($category[$id]['items']))
                    {
                        $category[$id]['items'] = [];
                    }

                    $category[$id]['items'][] = $product;
                }
            }
        }

        $tree = $this->makeTree($category, 0, 'pid', 'id', 'tree');

        return [
            'pager'     =>  $pager,
            'menu'      =>  $category,
            'template'  =>  'list'
        ];
    }

    public function itemMethod($system = '')
    {
        // $cache = 'module.catalog.item.'.$system;

        // if (!($catalog = $this->compiled($cache)))
        // {
        //     $catalog = Q("SELECT * FROM `#_mdd_catalog` WHERE `visible`='1' AND `system` LIKE ?s LIMIT 1", [ $system ])->row();

        //     $catalog['link'] = $this->linkCreate($catalog['system']);
        //     $catalog['date'] = Dates($catalog['date'], $this->locale);

        //     $file = new Files;

        //     if (isset($catalog['photo']))
        //     {
        //         $catalog['photo'] = $file->getFilesByGroup($catalog['photo'], ['sm', 'original'], ['id', 'title', 'file', 'ord', 'created'], true);
        //     }

        //     $this->cache->setCache($cache, $catalog);
        // }

        // # Мета теги
        // #
        // $meta = $this->metaData($catalog);

        // # Хлебные крошки
        // #
        // $this->addBreadCrumbs($catalog, [ 'id', 'id', 'name', 'system' ]);

        // return [
        //     'meta'              =>  $meta,
        //     'page'              =>  [ 'name' => '' ],
        //     'catalog'     =>  $catalog,
        //     'breadcrumbs'       =>  $this->breadcrumbs,
        //     'template'          =>  'item'
        // ];
    }
}
