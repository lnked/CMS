<?php

declare(strict_types=1);

namespace Fastest\Core\Api;

/**
 * @SWG\Definition(
 *    definition="Modules",
 *    description="The unique identifier of a product in our catalog"
 * )
 */
final class Modules extends \Fastest\Core\Api\Api
{
    /**
     * The cart list.
     *
     * @var string
     * @SWG\Property()
     */
    public $list = [];

    /**
     * The products list.
     *
     * @var string
     * @SWG\Property()
     */
    private $products = null;

    /**
     * The session cart key name.
     *
     * @var string
     *
     * @SWG\Property(
     *   property="session",
     *   type="string",
     *   description="The key name"
     * )
     */
    private $session = 'cartform';

    /**
     * @SWG\Property(ref="#/definitions/product_id")
     */
    private $product_id = 0;

    /**
     * @SWG\Property(
     *   ref="$/definitions/product_id",
     *   format="int32"
     * )
     */
    public $id;

    public function __construct()
    {
        parent::__construct();
    }

    /**
     * @SWG\Get(
     *     path="/api/modules/list",
     *     @SWG\Response(response="200", description="An example resource")
     * )
     */
    public function list()
    {
        $list = Q('SELECT * FROM `#__mdd_modules`')->all();

        return $this->response($list);
    }
}
