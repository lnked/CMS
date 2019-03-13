<?php

declare(strict_types=1);

namespace Fastest\Core\Modules;

final class galleryModule extends \Fastest\Core\Modules\Module
{
    public function listMethod()
    {
        $limit = 24;

        $cache = 'module.gallery.list';
        $cache_pager = 'module.gallery.list.pager'.$limit;

        // if (!($pager = $this->compiled($cache_pager)))
        // {
        //     $count = Q("SELECT COUNT(`id`) as `count` FROM `#_mdd_gallery` WHERE `visible`=1 LIMIT 1")->row('count');

        //     $pager = [
        //         'page'  => 0,
        //         'count' => $count,
        //         'limit' => $limit,
        //         'pages' => ceil($count / $limit)
        //     ];

        //     $this->cache->setCache($cache_pager, $pager);
        // }

        // $_SESSION['gallery_pager'] = $pager;

        if (!($gallery = $this->compiled($cache)))
        {
            $gallery = [];
            // $gallery = Q("SELECT
            //                     `g`.`id`, `g`.`name`, `g`.`timestamp`, `g`.`system`, `g`.`preview`, `g`.`theme`, `f`.`file` as `photo`
            //                 FROM `#_mdd_gallery` as `g`
            //                 LEFT JOIN `#__sys_files` as `f` ON `f`.`gid` LIKE `g`.`image`
            //                 WHERE `g`.`visible`=1 AND `f`.`prefix` LIKE 'preview' AND `f`.`file` != ''
            //                 GROUP BY `g`.`id`
            //                 ORDER BY `g`.`timestamp` DESC, `g`.`ord` DESC
            //                 LIMIT ?i, ?i", [
            //                     $pager['page'] * $pager['limit'], $pager['limit']
            //                 ])->all();

            // if (!empty($gallery))
            // {
            //     $file = new Files();
            //     $currentYear = date('Y');

            //     foreach ($gallery as &$gitem)
            //     {
            //         $year = date('Y', $gitem['timestamp']);

            //         $gitem['time'] = $gitem['timestamp'];

            //         $gitem['timestamp'] = implode([date('d', $gitem['timestamp']), Month(date('m', $gitem['timestamp']), $this->locale)], ' ');

            //         if ($year !== $currentYear)
            //         {
            //             $gitem['timestamp'] = $gitem['timestamp'] . ', ' . $year;
            //         }

            //         $gitem['link'] = $this->linkCreate(implode([$gitem['id'], $gitem['system']], '-'));
            //     }
            // }

            $this->cache->setCache($cache, $gallery);
        }

        $title ='';

        // // $title[] = SITE_NAME;
        // $title[] = 'Фотоотчеты';

        // $title = implode(' — ', array_reverse($title));

        return [
            'page'      =>  [ 'title' => $title ],
            // 'gallery'   =>  $gallery,
            // 'limit'     =>  $pager['limit'],
            // 'count'     =>  $pager['count'],
            'template'  =>  'list'
        ];
    }

    public function itemMethod($system = '')
    {
        $id = intval($system);

        $limit = 24;

        $cache = 'module.gallery.item.'.$system;
        $cache_pager = 'module.gallery.item.pager'.$system.$limit;

        $gallery = [];
        $breadcrumbs = [];

        // if (!($gallery = $this->compiled($cache)))
        // {
        //     $gallery = Q("SELECT `id`, `name`, `timestamp`, `system`, `image`, `theme`, `views`, `description`,
        //                     `meta_title`, `meta_keywords`, `meta_description`, `meta_robots`
        //                     FROM `#_mdd_gallery`
        //                     WHERE `visible`=1 AND `id`=?i
        //                     LIMIT 1", [
        //                         $id
        //                     ])->row();

        //     $date_seo = date('Y-m-d', $gallery['timestamp']).'T'.'00:00:00';

        //     $gallery['date_seo'] = $date_seo;
        //     $gallery['description'] = stripslashes($gallery['description']);

        //     $this->cache->setCache($cache, $gallery);
        // }

        // if (!empty($gallery))
        // {
        //     $gallery['groupid'] = $gallery['image'];

        //     if (!empty($gallery['timestamp'])) {
        //         $gallery['timestamp'] = Dates($gallery['timestamp'], $this->locale, false);
        //     }

        //     if (!empty($gallery['image']))
        //     {
        //         if (!($pager = $this->compiled($cache_pager)))
        //         {
        //             $count = Q("SELECT COUNT(`id`) as `count` FROM `#__sys_files` WHERE `visible`=1 AND `gid` LIKE ?s AND `prefix` LIKE 'preview' LIMIT 1", [
        //                 $gallery['image']
        //             ])->row('count');

        //             $pager = [
        //                 'page'  => 0,
        //                 'count' => $count,
        //                 'limit' => $limit,
        //                 'pages' => ceil($count / $limit)
        //             ];

        //             $this->cache->setCache($cache_pager, $pager);
        //         }

        //         $_SESSION['galleryitem-'.$id.'_pager'] = $pager;

        //         $gallery['image'] = Q("SELECT `f2`.`file` as `preview`, `f1`.`file` as `original`
        //                 FROM `#__sys_files` as `f1`
        //                 LEFT JOIN `#__sys_files` as `f2` ON `f2`.`fid` = `f1`.`id`
        //                 WHERE `f1`.`visible`=1 AND `f1`.`gid` LIKE ?s AND `f1`.`prefix` LIKE 'original' AND `f2`.`prefix` LIKE 'preview'
        //                 GROUP BY `f1`.`id`, `f2`.`id`
        //                 ORDER BY `f1`.`id` ASC
        //                 LIMIT ?i, ?i", [
        //                     $gallery['image'], $pager['page'] * $pager['limit'], $pager['limit']
        //                 ])->all();
        //     }
        // }

        if (empty($gallery))
        {
            return $this->errorPage;
        }

        # Мета теги
        #
        $meta = $this->metaData($gallery);

        # Хлебные крошки
        #
        $breadcrumbs = [
            'id'        => $gallery['id'],
            'pid'       => '',
            'name'      => stripslashes($gallery['name']),
            'sys_name'  => $gallery['system'],
            'link'      => $this->linkCreate($gallery['system'])
        ];

        $page_name = $gallery['name'] . ', ' . $gallery['timestamp'];

        $title = [];

        $title[] = SITE_NAME;
        $title[] = 'Фотоотчеты';
        $title[] = $page_name;

        $title = implode(' — ', array_reverse($title));

        if (!isset($meta['title']) || empty($meta['title']))
        {
            $meta['title'] = $title;
        }

        return [
            'page'          =>  [ 'name' => $page_name, 'title' => $title ],
            'meta'          =>  $meta,
            'limit'         =>  $pager['limit'],
            'count'         =>  $pager['count'],
            'gallery'       =>  $gallery,
            'breadcrumbs'   =>  $breadcrumbs,
            'template'      =>  'item'
        ];
    }
}
