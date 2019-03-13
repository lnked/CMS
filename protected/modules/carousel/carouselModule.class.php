<?php

declare(strict_types=1);

namespace Fastest\Core\Modules;

final class carouselModule extends \Fastest\Core\Modules\Module
{
    public function router()
    {
        return $this->blockMethod();
    }

    public function blockMethod()
    {
        $cache = 'module.slider.list';

        // # Получение списка
        // #
        // if (!($slider = $this->compiled($cache)))
        // {
        //     $slider = Q("SELECT `s`.`title`, `f`.`file`
        //                  FROM `#_mdd_slider` as `s`
        //                  LEFT JOIN `#__sys_files` as `f` ON `f`.`gid` LIKE `s`.`image`
        //                  WHERE `s`.`visible`=1 AND `f`.`visible`=1 AND `f`.`file`!=''
        //                  ORDER BY `s`.`ord` DESC, `f`.`ord` DESC")->all();

        //     $this->cache->setCache($cache, $slider);
        // }

        return [
            'page'      =>  ['name' => ''],
            // 'count'     =>  count($slider),
            // 'slider'    =>  $slider,
            'template'  =>  'slider'
        ];
    }
}
