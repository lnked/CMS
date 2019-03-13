<?php

declare(strict_types=1);

namespace Fastest\Core\Modules;

final class newsModule extends \Fastest\Core\Modules\Module
{
    public function router()
    {
        return $this->listMethod();
    }

    public function listMethod()
    {
        $cache = 'module.news.list';

        # Пагинация
        #
        $pager = $this->pager($this->countItem(), $this->limit);

        # Получение списка
        #
        if (!($news = $this->compiled($cache))) {
            $news = Q("SELECT
                            `n`.`id`,
                            `n`.`name`,
                            `n`.`system`,
                            `n`.`date`,
                            `n`.`anons`,
                            `f`.`file` as `photo`,
                            `f`.`alt` as `alt`,
                            if (`n`.`text`!='', 1, 0) as `text` " .
                        "FROM `#_mdd_news` AS `n` " .
                        "LEFT JOIN `#__sys_files` AS `f` ON (`n`.`photo` LIKE `f`.`gid` AND `f`.`prefix` LIKE 'preview' AND `f`.`visible`=1) " .
                        "WHERE `n`.`visible`=1 " .
                        "ORDER BY STR_TO_DATE(`n`.`date`, '%d.%m.%Y') DESC, `n`.`ord` DESC " .
                        "LIMIT ?i, ?i", [
                            $pager->start, $pager->limit
                        ])->all();

            if (!empty($news)) {
                foreach ($news as &$news_item) {
                    $this->prepareSEO($news_item);

                    $news_item['date'] = Dates($news_item['date'], $this->locale);
                    $news_item['link'] = $this->linkCreate($news_item['system']);
                }
            }

            $this->cache->setCache($cache, $news);
        }

        return [
            'assets'    =>    [ 'css/news.css', 'css/news.scss', 'js/news.js' ],
            'list'      =>    $news,
            'pager'     =>    $pager,
            'template'  =>    'list'
        ];
    }

    public function itemMethod ($system = '')
    {
        $cache = 'module.news.item.'.$system;

        if (!($news = $this->compiled($cache)))
        {
            $news = Q("SELECT `id`, `date`, `name`, `system`, `anons`, `text`,
    					`meta_title`, `meta_robots`, `meta_keywords`, `meta_description`, DATE_FORMAT(STR_TO_DATE(`date`, '%d.%m.%Y'), '%Y-%m-%d') AS `date_seo` " .
                        "FROM `#_mdd_news` " .
                        "WHERE `visible`=1 AND `system` LIKE ?s " .
                        "LIMIT 1", [
                            $system
                        ])->row();

            if (isset($news['date']))
            {
                $news['date'] = Dates($news['date'], $this->locale);
            }

            $this->cache->setCache($cache, $news);
        }

        if (empty($news))
        {
            return $this->errorPage;
        }

        # Мета теги
        #
        $meta = $this->metaData($news);

        # Хлебные крошки
        #
        $this->addBreadCrumbs($news, [ 'id', 'id', 'name', 'system' ]);

        return [
            'assets'        =>    [ 'js/news.js', 'js/news.css' ],
            'meta'          =>    $meta,
            'page'          =>    [ 'name' => $news['name'] ],
            'news'          =>    $news,
            'breadcrumbs'   =>    $this->breadcrumbs,
            'template'      =>    'item'
        ];
    }

    public function blockMethod ($system = '')
    {
        return [
            'assets'        =>  [ 'js/news.js', 'js/news.css' ],
            'news'          =>  [],
            'template'      =>  'block'
        ];
    }
}
