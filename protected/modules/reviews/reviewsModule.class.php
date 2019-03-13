<?php

declare(strict_types=1);

namespace Fastest\Core\Modules;

final class reviewsModule extends \Fastest\Core\Modules\Module
{
    public function router()
    {
        if (isset($this->arguments[0])) {
            return $this->errorPage;
        }

        return $this->listMethod();
    }

    public function listMethod()
    {
        $cache = 'module.reviews.list';

        # Пагинация
        #
        $pager = $this->pager($this->countItem(), $this->limit);

        if (!($reviews = $this->compiled($cache))) {
            $reviews = Q("SELECT *, DATE_FORMAT(STR_TO_DATE(`date`, '%d.%m.%Y'), '%Y-%m-%d') AS `date_seo` FROM `#_mdd_reviews` WHERE `visible`=1 ORDER BY STR_TO_DATE(`date`, '%d.%m.%Y') DESC, `ord` DESC LIMIT ?i, ?i", array(
                $pager->start, $pager->limit
            ))->all();

            if (!empty($reviews)) {
                foreach ($reviews as &$reviews_item) {
                    $reviews_item['date'] = Dates($reviews_item['date'], $this->locale);
                }
            }

            $this->cache->setCache($cache, $reviews);
        }

        return [
            'reviews'       =>    $reviews,
            'pager'         =>    $pager,
            'template'      =>    'list'
        ];
    }

    public function blockMethod()
    {
        return [
            'template'        =>    'block'
        ];
    }
}
