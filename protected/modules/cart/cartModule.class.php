<?php

declare(strict_types=1);

namespace Fastest\Core\Modules;

final class cartModule extends \Fastest\Core\Modules\Module
{
    private $payment;

    private $order = [];

    private $active = [];

    private $session = 'cartform';

    private $current = 1;

    private $required = [
        'delivery' => [
            'name', 'phone', 'email', 'street', 'house', 'apartment'
        ]
    ];

    private $desire = [
        'id' => 0,
        'name' => 'Желание гостя',
        'photo' => '/images/desire.png',
        'price' => 1,
        'weight' => '',
        'discount' => 0,
        'description' => ''
    ];

    private $pages = [
        'checkout'  =>  false,
        'delivery'  =>  false,
        'payment'   =>  false,
        'confirm'   =>  true,
        'complete'  =>  true
    ];

    private $steps = [
        [
            'name' => 'ваш заказ',
            'slug' => 'checkout',
            'passed' => true
        ],
        [
            'name' => 'адрес доставки',
            'slug' => 'delivery',
            'passed' => false
        ],
        [
            'name' => 'оплата',
            'slug' => 'payment',
            'passed' => false
        ],
        [
            'name' => 'подтверждение',
            'slug' => 'confirm',
            'passed' => false
        ],
        [
            'name' => 'завершение',
            'slug' => 'complete',
            'passed' => false,
            'hide' => true
        ]
    ];

    public function __construct()
    {
        parent::__construct();

        $this->order = [];
        $this->active = [];
        $this->payment = new \Payment;

        if (!empty($_SESSION[$this->session]['active']))
        {
            $this->active = $_SESSION[$this->session]['active'];
        }

        if (!empty($_SESSION[$this->session]['checkout']))
        {
            $this->order['checkout'] = $_SESSION[$this->session]['checkout']['data'];
            $this->pages['checkout'] = true;
        }

        if (!empty($_SESSION[$this->session]['delivery']))
        {
            $this->order['delivery'] = $_SESSION[$this->session]['delivery']['data'];
            $this->pages['delivery'] = $this->_hasRequired('delivery', $this->order['delivery']);
        }

        if (!empty($_SESSION[$this->session]['payment']))
        {
            $this->order['payment'] = $_SESSION[$this->session]['payment']['data'];
            $this->pages['payment'] = true;
        }

        if (!empty($_SESSION[$this->session]['order']))
        {
            $this->order['order'] = $_SESSION[$this->session]['order']['data'];
        }

        $last = false;

        foreach($this->steps as &$step)
        {
            if ($last)
            {
                $step['passed'] = $this->pages[$step['slug']];
            }

            $last = $this->pages[$step['slug']];
        }

        if (isset($this->path[1]) && !($this->pages[$this->path[1]]))
        {
            $this->_checkPrevious();
        }
    }

    public function router()
    {
        $response = [];

        if (empty($this->arguments[0]))
        {
            $first = current($this->steps);

            redirect($this->module_root . '/' . $first['slug']);
        }

        if (isset($this->arguments[0]) && $this->arguments[0] === 'checkout' && empty($_POST))
        {
            $response = $this->checkoutMethod();
        }

        if (isset($this->arguments[0]) && $this->arguments[0] === 'delivery' && empty($_POST))
        {
            $response = $this->deliveryMethod();
        }

        if (isset($this->arguments[0]) && $this->arguments[0] === 'payment' && empty($_POST))
        {
            $response = $this->paymentMethod();
        }

        if (isset($this->arguments[0]) && $this->arguments[0] === 'confirm' && empty($_POST))
        {
            $response = $this->confirmMethod();
        }

        if (isset($this->arguments[0]) && $this->arguments[0] === 'complete' && empty($_POST))
        {
            $response = $this->completeMethod();
        }

        if (isset($this->arguments[0]) && $this->arguments[0] === 'clean' && empty($_POST))
        {
            $response = $this->cleanMethod();
        }

        if (!empty($response))
        {
            return array_merge($response, ['assets' => [ 'css/cart.css', 'js/cart.js' ]]);
        }

        return $this->errorPage;
    }

    public function cleanMethod()
    {
        $_SESSION['cart'] = [
            'items' => [],
            'count' => 0,
            'amount' => 0
        ];

        redirect($this->module_root . '/' . $this->steps[0]['slug']);
    }

    private function _hasRequired($name = '', $data = [])
    {
        $status = true;

        if (isset($this->required[$name]))
        {
            foreach ($this->required[$name] as $n)
            {
                if (empty($data[$n]))
                {
                    $status = false;
                }
            }
        }

        return $status;
    }

    private function _checkPrevious()
    {
        $current = 'checkout';

        if (isset($this->path[1]))
        {
            $current = $this->path[1];
        }

        $prev = '';
        $pages = array_reverse($this->pages);

        foreach ($pages as $slug => $bool)
        {
            if (!$bool)
            {
                $prev = $slug;
            }
        }

        if ($prev && ($prev !== $current) && !in_array($current, [ 'complete' ]))
        {
            redirect('/cart/' . $prev);
        }
    }

    public function postMethod($data = [])
    {
        $data = $_POST;
        $errors = [];
        $current = 1;

        $action = $data['_action'];
        $backuri = $data['_backuri'];

        unset($_SESSION[$this->session][$action]);

        $pure = $data;

        unset($pure['_backuri'], $pure['_action'], $pure['authenticity_token']);

        $_SESSION[$this->session][$action]['data'] = $pure;

        if (!$this->checkCSRF($data))
        {
            redirect(base64_decode($backuri));
        }

        switch ($action) {
            case 'checkout':
                $count = $data['count'];

                if (empty($count)) {
                    redirect(base64_decode($backuri));
                }
            break;

            case 'delivery':

                $required = $this->required['delivery'];

                foreach ($required as $name)
                {
                    if (empty($data[$name]))
                    {
                        $errors[$name] = true;
                    }
                }

                if ((in_array('email', $required) && !$data['email']) || !is_email($data['email'])) {
                    $errors['email'] = true;
                }

                $current = 2;
            break;

            case 'payment':
                $payment = $data['payment'];

                $current = 3;
            break;

            case 'confirm':

                $this->orderMethod();

                $current = 4;
            break;
        }

        $_SESSION[$this->session][$action]['errors'] = $errors;

        if (!empty($_SESSION[$this->session][$action]['errors']))
        {
            redirect(base64_decode($backuri) . '#' . $action);
        }

        redirect($this->module_root . '/' . $this->steps[$current]['slug']);
    }

    private function _complete($pay_status = '')
    {
        $settings = [
            'title' => 'Отправка заказа',
            'subject' => 'Новый заказ на сайте',
            'success' => 'Ваша заказ принят',
            'failure' => 'Не удалось отправить заказ, произошла ошибка!',
            'sms_message' => 'Новый заказ от {{name}}, № {{order_number}}, {{status}}'
        ];

        $checkout = [
            'name' => [ 'title' => 'Имя' ],
            'count' => [ 'title' => 'Заказ', 'store' => true ],
            'email' => [ 'title' => 'Электронная почта' ],
            'phone' => [ 'title' => 'Номер телефона' ],
            'street' => [ 'title' => 'Улица' ],
            'house' => [ 'title' => 'Дом' ],
            'entrance' => [ 'title' => 'Подъезд' ],
            'apartment' => [ 'title' => 'Квартира' ],
            'comment' => [ 'title' => 'Комментарий к заказу' ],
            'payment' => [ 'title' => 'Способ оплаты' ],
            'status' => [ 'title' => 'Статус оплаты' ]
        ];

        # Отправка соообщения на почту
        $this->_sendMessage($checkout, $pay_status);

        # Отправка смс
        $this->_sendSms($settings['sms_message'], $pay_status);
    }

    private function _sendSms($message = '', $status = '')
    {
        $sms_api  = '9F88594C-B755-51C8-DE52-99E3A18D800A';
        $phones = getfl('phones');

        $data = [
            'name' => $this->order['delivery']['name'],
            'order_number' => $this->order['order']['number']
        ];

        if ($status)
        {
            $data['status'] = mb_strtolower($status);
        }

        if (!empty($data))
        {
            foreach ($data as $key => $value)
            {
                if (strstr($message, '{{'.$key.'}}'))
                {
                    $message = str_replace('{{'.$key.'}}', $value, $message);
                }
            }
        }

        $message = str_replace(', {{status}}', '', $message);

        if (!empty($phones) && $message && !DEV_MODE)
        {
            $inline = implode(',', array_keys($phones));

            $ch = curl_init('http://sms.ru/sms/send');

            curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
            curl_setopt($ch, CURLOPT_TIMEOUT, 30);
            curl_setopt($ch, CURLOPT_POSTFIELDS, [
                'json'          =>  true,
                'api_id'        =>  $sms_api,
                'to'            =>  $inline,
                'text'          =>  $message
            ]);

            $request = curl_exec($ch);
            curl_close($ch);
            $position = strpos($request, "\n");

            if(!empty($position))
            {
                $status = trim(substr($request, 0, $position));
            }
            else
            {
                $status = $request;
            }

            if($status == 100)
            {
                $result = 1;
            }
        }
    }

    private function _sendMessage($fields = [], $status = '')
    {
        if ($status)
        {
            $keys = [ 'order', 'name', 'phone', 'email', 'street', 'house', 'entrance', 'apartment', 'payment', 'status', 'comment', 'count' ];
        }
        else {
            $keys = [ 'order', 'name', 'phone', 'email', 'street', 'house', 'entrance', 'apartment', 'payment', 'comment', 'count' ];
        }

        $data = array_flip($keys);

        foreach ($this->order as $key => $list)
        {
            if (isset($data[$key]))
            {
                $data[$key] = $list;
            }
            else
            {
                foreach ($list as $k => $v)
                {
                    if (isset($data[$k]))
                    {
                        $data[$k] = $v;
                    }
                }
            }
        }

        if ($status)
        {
            $data['status'] = $status;
        }

        if (!empty($data))
        {
            # Отправка письма
            $domen = str_replace([ 'http://', 'www.', 'www' ], '', $_SERVER['SERVER_NAME']);

            $subject = 'Новый заказ на сайте';

            $body  = '';
            $body .= '<p>Здравствуйте,</p>';
            $body .= '<p>Новый заказ на сайте ' . $domen . '</p>';
            $body .= '<p>--------------------</p>';

            foreach ($data as $name => $value)
            {
                if (isset($fields[$name]) && $value)
                {
                    if ($name == 'payment')
                    {
                        $methods = $this->getSettings('payment');

                        if (isset($methods[$value['payment']]))
                        {
                            $value = $methods[$value['payment']];
                        }
                    }

                    if (isset($fields[$name]['store']) && is_array($value) && !empty($value))
                    {
                        $link = '';

                        if (isset($data['order']['id']) && isset($data['order']['number']))
                        {
                            $link = ', № <a href="https://delivery.eat-and-trip.ru/cp/shopping/orders/item/'.$data['order']['id'].'" style="font-weight:700;font-size:14px;color:blue;">'.$data['order']['number'].'</a>';
                        }

                        $body .= '<p style="color:#222222;font-size:16px;line-height:24px;margin-top:0;margin-bottom:10px;"><span style="color:#777777;">' . $fields[$name]['title'] . $link .':</span></p>';

                        $body .= '<table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse: collapse;">';

                        # Colgroup
                        #
                        $body .= '<colgroup>';
                        $body .= '<col>';
                        $body .= '<col width="100">';
                        $body .= '<col width="100">';
                        $body .= '<col width="100">';
                        $body .= '</colgroup>';

                        # Thead
                        #
                        $body .= '<thead>';
                        $body .= '<tr>';
                        $body .= '<td align="left" valign="top" style="color:#000000;padding:7px 8px;border:1px solid #cdcdcd;" bgcolor="#dddddd"><strong style="font-size: 14px;text-transform:uppercase;color:#121212;">Наименование</strong></td>';
                        $body .= '<td align="left" valign="top" style="color:#000000;padding:7px 8px;border:1px solid #cdcdcd;" bgcolor="#dddddd"><strong style="font-size: 14px;text-transform:uppercase;color:#121212;">Кол-во</strong></td>';
                        $body .= '<td align="left" valign="top" style="color:#000000;padding:7px 8px;border:1px solid #cdcdcd;" bgcolor="#dddddd"><strong style="font-size: 14px;text-transform:uppercase;color:#121212;">Стоимость</strong></td>';
                        $body .= '<td align="left" valign="top" style="color:#000000;padding:7px 8px;border:1px solid #cdcdcd;" bgcolor="#dddddd"><strong style="font-size: 14px;text-transform:uppercase;color:#121212;">Итого</strong></td>';
                        $body .= '</tr>';
                        $body .= '</thead>';

                        # Tbody
                        #
                        $body .= '<tbody>';

                        $totalCount = 0;
                        $totalAmount = 0;

                        foreach($value as $id => $count)
                        {
                            if ($id < 0) {
                                $product = $this->desire;
                            } else {
                                $product = Q("SELECT `name`, `price`, `weight`, `description` FROM `#__shop_catalog` WHERE `id`=?i LIMIT 1", [ $id ])->row();
                            }

                            $amount = $count * $product['price'];

                            $totalCount += $count;
                            $totalAmount += $amount;

                            $price = str_replace(' ', '&nbsp;', to_money($product['price']));
                            $amount = str_replace(' ', '&nbsp;', to_money($amount));

                            $body .= '<tr>';
                            $body .= '<td align="left" valign="top" style="color:#000000;padding:7px 8px;border:1px solid #cdcdcd;">';
                            $body .= '<p style="color:#222222;font-size:16px;line-height:18px;margin-top:0;margin-bottom:10px;">'.$product['name'].'</p>';
                            $body .= '<p style="color:#777777;font-size:14px;line-height:16px;margin-top:0;">'.$product['weight'].'</p>';
                            $body .= '<p style="color:#777777;font-size:14px;line-height:16px;margin-top:0;">'.$product['description'].'</p>';
                            $body .= '</td>';
                            $body .= '<td align="center" valign="middle" style="color:#000000;padding:7px 8px;border:1px solid #cdcdcd;">';
                            $body .= '<p style="color:#555555;font-size:16px;line-height:18px;margin-top:0;margin-bottom:5px;">'.$count.'</p>';
                            $body .= '</td>';
                            $body .= '<td align="center" valign="middle" style="color:#000000;padding:7px 8px;border:1px solid #cdcdcd;">';
                            $body .= '<p style="color:#222222;font-size:16px;line-height:18px;margin-top:0;margin-bottom:5px;">'.$price.' руб.</p>';
                            $body .= '</td>';
                            $body .= '<td align="center" valign="middle" style="color:#000000;padding:7px 8px;border:1px solid #cdcdcd;">';
                            $body .= '<p style="color:#222222;font-size:16px;line-height:18px;margin-top:0;margin-bottom:5px;">'.$amount.' руб.</p>';
                            $body .= '</td>';
                            $body .= '</tr>';
                        }

                        $body .= '</tbody>';

                        $totalAmount = str_replace(' ', '&nbsp;', to_money($totalAmount));

                        # Tfoot
                        #
                        $body .= '<tfoot>';
                        $body .= '<tr>';
                        $body .= '<td align="right" valign="middle" style="color:#000000;padding:7px 8px;border:1px solid #cdcdcd;">';
                        $body .= '<p style="color:#222222;font-size:16px;line-height:18px;margin-top:0;margin-bottom:0px;">Итого:</p>';
                        $body .= '</td>';
                        $body .= '<td align="right" valign="middle" style="color:#000000;padding:7px 8px;border:1px solid #cdcdcd;">';
                        $body .= '<p style="color:#222222;font-size:16px;line-height:18px;margin-top:0;margin-bottom:0px;">'.$totalCount.'</p>';
                        $body .= '</td>';
                        $body .= '<td colspan="2" align="right" valign="middle" style="color:#000000;padding:7px 8px;border:1px solid #cdcdcd;">';
                        $body .= '<p style="color:#222222;font-size:16px;line-height:18px;margin-top:0;margin-bottom:0px;"><strong>'.$totalAmount.' руб.</strong></p>';
                        $body .= '</td>';
                        $body .= '</tr>';
                        $body .= '</tfoot>';

                        $body .= '</table>';
                    }
                    else
                    {
                        $body .= '<p style="color:#222222;font-size:16px;line-height:24px;margin-top:0;margin-bottom:10px;"><span style="color:#777777;">' . $fields[$name]['title'] . ':</span> '. stripslashes($value).'</p>';
                    }
                }
            }

            $body .= '<p>--------------------</p>';
            $body .= '<p style="color:#222222;font-size:16px;line-height:18px;">Дата отправки: '. date( 'd.m.Y H:i:s' ) .'</p>';
            $body .= '<p style="text-align: center;"><a href="https://delivery.eat-and-trip.ru/Unsubscribe" style="font-weight:400;font-size:11px;color:grey;">Unsubscribe</a></p>';

            $emails = getfl('emails');

            // Create the Transport
            $transport = (new \Swift_SmtpTransport('smtp.yandex.ru', 465, 'ssl'))
                ->setUsername('delivery@eat-and-trip.ru')
                ->setPassword('VhTQxApsS9')
            ;

            // Create the Mailer using your created Transport
            $mailer = new \Swift_Mailer($transport);

            // Create a message
            $message = (new \Swift_Message($subject))
                ->setFrom(['delivery@eat-and-trip.ru' => 'Доставка «EAT&TRIP»'])
                ->setTo($emails)
                ->setBody($body, 'text/html')
            ;

            $sended = $mailer->send($message);
        }
    }

    private function _getAddress($data = [])
    {
        $address = '';

        $_address = [];

        if ($data['street'])
        {
            $_address[] = 'ул. ' . $data['street'];
        }

        if ($data['house'])
        {
            $_address[] = 'д. ' . $data['house'];
        }

        if ($data['entrance'])
        {
            $_address[] = 'подъезд ' . $data['entrance'];
        }

        if ($data['apartment'])
        {
            $_address[] = 'кв. ' . $data['apartment'];
        }

        if (!empty($_address))
        {
            $address = implode(', ', $_address);
        }

        return $address;
    }

    private function _getCustomer($data = [])
    {
        $name       = $data['name'];
        $email      = $data['email'];
        $phone      = Tools::phone($data['phone']);

        $user = [
            'name'    =>  $name,
            'email'   =>  $email,
            'phone'   =>  $phone
        ];

        $user_id = Q("SELECT `id` FROM `#__shop_customer` WHERE `phone` LIKE ?s OR `email` LIKE ?s LIMIT 1", [ $phone, $email ])->row('id');

        if (empty($user_id))
        {
            $_user = [
                's:name'    =>  $name,
                'i:phone'   =>  $phone,
                's:email'   =>  $email,
                'i:status'  =>  1,
                'i:active'  =>  1,
                'i:created' =>  time()
            ];

            $user_id = O('__shop_customer')->create($_user);
        }
        else
        {
            Q("UPDATE `#__shop_customer` SET `name`=?s, `phone`=?i, `email`=?s, `updated`=?i WHERE `id`=?i LIMIT 1", [ $name, $phone, $email, time(), $user_id ]);
        }

        $user['id'] = $user_id;

        return $user;
    }

    private function _getOrder($data = [], $number = '', $user = [], $address = '')
    {
        $cart = [];

        $order = [];

        $amount = 0;

        if (!empty($data['count']))
        {
            $file = new Files;

            foreach ($data['count'] as $c_id => $c_count)
            {
                if ($c_id < 0) {
                    $product = $this->desire;
                }
                else
                {
                    $cache = 'module.cart.product.'.$c_id;

                    if (!($product = $this->compiled($cache)))
                    {
                        $product = Q("SELECT `id`, `name`, `price`, `weight`, `photo`, `description`, `discount` FROM `#__shop_catalog` WHERE `id`=?i LIMIT 1", [
                            $c_id
                        ])->row();

                        $this->cache->setCache($cache, $product);
                    }

                    $product['image'] = $file->getFilesByGroupCount($product['photo'], [ 'cp' ], [ 'id', 'title', 'file', 'ord' ], 1, false);
                }

                $product['link'] = '';

                $total = $c_count * $product['price'];

                $product['total'] = $total;

                $cart[$c_id] = [
                    'item'  => $product,
                    'count' => $c_count,
                    'time'  => time(),
                    'date'  => Dates(time(), 'ru'),
                ];

                $amount += $total;
            }
        }

        # Order
        #
        $order['s:number']      = $number;
        $order['i:user']        = $user['id'];

        $order['s:name']        = $user['name'];
        $order['s:phone']       = $user['phone'];
        $order['s:email']       = $user['email'];

        $order['s:payment']     = $data['payment'];
        $order['i:discount']    = 0;
        $order['f:cost']        = $amount;

        $order['s:comment']     = $address;
        $order['i:delivery']    = 0;

        $order['s:purchase']    = json_encode($cart);

        $order['i:uid']         = 0;
        $order['i:gid']         = 0;
        $order['i:visible']     = 1;
        $order['i:date']        = time();
        $order['i:created']     = time();

        $id = Q("SELECT `id` FROM `#__shop_orders` WHERE `number` LIKE ?s LIMIT 1", [ $number ])->row('id');

        if ($id)
        {
            O('__shop_orders:number LIKE', $number)->update($order);
        }
        else {
            $id = O('__shop_orders')->create($order);
        }

        $this->active = [
            'id'        => $id,
            'amount'    => $amount,
            'number'    => $number
        ];

        $this->_saveActive();

        return $this->active;
    }

    private function _clearActive()
    {
        $this->order = [];

        unset($_SESSION['cart']);
        unset($_SESSION[$this->session]);
    }

    private function _saveActive()
    {
        $_SESSION[$this->session]['active'] = $this->active;
        $_SESSION[$this->session]['order']['data'] = $this->active;
    }

    private function _addOrder($data = [])
    {
        $last_id = Q("SELECT MAX(`id`) AS `max` FROM `#__shop_orders` ORDER BY `id` DESC LIMIT 1")->row('max');

        $last_id += 1000;

        $number = sprintf('%08d', $last_id+1);

        $_SESSION['number'] = $number;

        setcookie("order_" . $number, md5($number), time() + 3600 * 24 * 365);

        # User
        #
        $user = $this->_getCustomer($data);

        # Address
        #
        $address = $this->_getAddress($data);

        # Order
        #
        $order = $this->_getOrder($data, $number, $user, $address);

        return $order;
    }

    private function _checkOrder($order = [], $data = [])
    {
        $user = $this->_getCustomer($data);

        $address = $this->_getAddress($data);

        $orderData = $this->_getOrder($data, $order['number'], $user, $address);

        return $orderData;
    }

    public function orderMethod()
    {
        $data = [];

        if (!empty($_SESSION[$this->session]))
        {
            $s = $_SESSION[$this->session];

            if (!empty($s['checkout']['data']))
            {
                $data = array_merge($data, $s['checkout']['data']);
            }

            if (!empty($s['delivery']['data']))
            {
                $data = array_merge($data, $s['delivery']['data']);
            }

            if (!empty($s['payment']['data']))
            {
                $data = array_merge($data, $s['payment']['data']);
            }
        }

        if (empty($this->active))
        {
            $this->_addOrder($data);
        }
        else
        {
            $this->_checkOrder($this->active, $data);
        }
    }

    public function deliveryMethod()
    {
        $this->current = 2;
        $data = [];
        $errors = [];

        if (!empty($_SESSION[$this->session]['delivery']['data']))
        {
            $data = $_SESSION[$this->session]['delivery']['data'];
        }

        if (!empty($_SESSION[$this->session]['delivery']['errors']))
        {
            $errors = $_SESSION[$this->session]['delivery']['errors'];
        }

        return [
            'data'          =>  $data,
            'errors'        =>  $errors,
            'steps'         =>  $this->steps,
            'current'       =>  $this->current,
            'template'      =>  'delivery'
        ];
    }

    public function checkoutMethod()
    {
        $data = [];
        $items = [];
        $errors = [];

        if (!empty($_SESSION[$this->session]['checkout']['data']))
        {
            $data = $_SESSION[$this->session]['checkout']['data'];
        }

        if (!empty($_SESSION[$this->session]['checkout']['errors']))
        {
            $errors = $_SESSION[$this->session]['checkout']['errors'];
        }

        if (!empty($_SESSION['cart']['items']))
        {
            $file = new Files();
            $items = $_SESSION['cart']['items'];

            foreach ($items as &$item)
            {
                $id = $item['id'];

                if ($id < 0) {
                    $product = $this->desire;
                }
                else
                {
                    $cache = 'module.cart.product.'.$id;

                    if (!($product = $this->compiled($cache)))
                    {
                        $product = Q("SELECT `id`, `name`, `price`, `weight`, `photo`, `description`, `discount` FROM `#__shop_catalog` WHERE `id`=?i LIMIT 1", [
                            $id
                        ])->row();

                        $this->cache->setCache($cache, $product);
                    }
                }

                if (!empty($product))
                {
                    $item['name'] = $product['name'];
                    $item['weight'] = $product['weight'];
                    $item['discount'] = $product['discount'];
                    $item['description'] = $product['description'];
                    $item['total'] = $product['price'] * $item['count'];

                    $item['increase'] = 1;

                    if ($id < 0)
                    {
                        $item['increase'] = 10;
                    }

                    if (!empty($product['photo']))
                    {
                        if ($id > 0)
                        {
                            $photo = $file->getFilesByGroupCount($product['photo'], [ 'cp' ], [ 'file' ], true);
                            $preview = isset($photo['file']) ? $photo['file'] : '';
                        }
                        else
                        {
                            $preview = $product['photo'];
                        }

                        $item['photo'] = $preview;
                    }
                }
            }
        }

        return [
            'data'          =>  $data,
            'errors'        =>  $errors,
            'items'         =>  $items,
            'steps'         =>  $this->steps,
            'current'       =>  $this->current,
            'template'      =>  'checkout'
        ];
    }

    public function getSettings($name = '')
    {
        $response = [];

        $list = Q("SELECT `variable`, `value` FROM `#__shop_settings` WHERE `class` LIKE ?s ORDER BY `ord`", [
            $name
        ])->all();

        if (!empty($list))
        {
            foreach ($list as $item)
            {
                $response[$item['value']] = $item['variable'];
            }
        }

        return $response;
    }

    public function paymentMethod()
    {
        $this->current = 3;

        $payment = $this->getSettings('payment');
        $amount = $_SESSION['cart']['amount'];

        return [
            'amount'        =>  $amount,
            'payment'       =>  $payment,
            'steps'         =>  $this->steps,
            'current'       =>  $this->current,
            'template'      =>  'payment'
        ];
    }

    public function confirmMethod()
    {
        $items = [];

        $this->current = 4;

        if (!empty($_SESSION['cart']['items']))
        {
            $items = $_SESSION['cart']['items'];

            foreach ($items as &$item)
            {
                $id = $item['id'];

                if ($id < 0) {
                    $product = $this->desire;
                }
                else {
                    $cache = 'module.cart.product.'.$id;

                    if (!($product = $this->compiled($cache)))
                    {
                        $product = Q("SELECT `id`, `name`, `price`, `weight`, `photo`, `description`, `discount` FROM `#__shop_catalog` WHERE `id`=?i LIMIT 1", [
                            $id
                        ])->row();

                        $this->cache->setCache($cache, $product);
                    }
                }

                if (!empty($product))
                {
                    $item['name'] = $product['name'];
                    $item['weight'] = $product['weight'];
                    $item['discount'] = $product['discount'];
                    $item['description'] = $product['description'];
                    $item['total'] = $product['price'] * $item['count'];
                }
            }
        }

        return [
            'items'         =>  $items,
            'steps'         =>  $this->steps,
            'current'       =>  $this->current,
            'template'      =>  'confirm'
        ];
    }

    public function completeMethod()
    {
        $order = [];
        $status = '';

        if (isset($this->arguments[1]) && in_array($this->arguments[1], ['status', 'success', 'failure']))
        {
            $status = $this->arguments[1];
            $status_payment = $this->getSettings('status_payment');

            if (empty($this->arguments[2]))
            {
                if (empty($this->order['order']))
                {
                    redirect('/cart');
                }

                $order = Q("SELECT `id`, `number`, `order_id` FROM `#__shop_orders` WHERE `id`=?i LIMIT 1", [
                    $this->order['order']['id']
                ])->row();

                $result = $this->payment->getStatus($order['order_id']);

                $orderStatus = $result['orderStatus'];

                Q("UPDATE `#__shop_orders` SET `payment_json`=?s, `status_payment`=?i WHERE `id`=?i LIMIT 1", [
                    json_encode($result), $orderStatus, $order['id']
                ]);

                $hash = md5($order['order_id']);

                $pay_status = '';

                if (!empty($status_payment[$orderStatus]))
                {
                    $pay_status = $status_payment[$orderStatus];
                }

                $this->_complete($pay_status);

                $this->_clearActive();

                exit(__('/cart/complete/status/' . $hash));

                redirect('/cart/complete/status/' . $hash);
            }
            else
            {
                $payment = $this->getSettings('payment');

                $hash = $this->arguments[2];

                $order = Q("SELECT `id`, `date`, `name`, `number`, `email`, `payment`, `order_id`, `cost`, `status_payment` FROM `#__shop_orders` WHERE md5(`order_id`) LIKE ?s LIMIT 1", [
                    $hash
                ])->row();

                if (!empty($order))
                {
                    $order['status'] = '';
                    $order['payment_type'] = '';

                    if (isset($order['payment']))
                    {
                        $order['payment_type'] = $order['payment'];
                    }

                    if (isset($order['status_payment']) && !empty($status_payment[$order['status_payment']]))
                    {
                        $order['status'] = $status_payment[$order['status_payment']];
                    }

                    if (isset($order['payment']) && !empty($payment[$order['payment']]))
                    {
                        $order['payment'] = $payment[$order['payment']];
                    }

                    if ((isset($order['status_payment']) && $order['status_payment'] == 2) || (isset($order['payment_type']) && $order['payment_type'] !== 'online_card'))
                    {
                        $template = 'success';
                    }
                    else {
                        $template = 'failure';
                    }
                }
                else
                {
                    $template = 'not_exist';
                }
            }
        }
        else
        {
            $template = 'complete';

            if (isset($this->order['payment']['payment']) && $this->order['payment']['payment'] == 'online_card')
            {
                $order_id = Q("SELECT `order_id` FROM `#__shop_orders` WHERE `number` LIKE ?s LIMIT 1", [
                    $this->order['order']['number']
                ])->row('order_id');

                if ($order_id)
                {
                    $this->_clearActive();

                    redirect('/cart/complete/status/' . md5($order_id));
                }

                # Проведение оплаты
                $this->payment->create($this->order['order']['number'], $this->order['order']['amount']);
            }
            elseif (!empty($this->order))
            {
                $number = $this->order['order']['number'];

                $temp = md5($number);

                $order_id = sprintf(
                    '%s-%s-%s-%s-%s',
                    substr($temp, 0, 8),
                    substr($temp, 4, 4),
                    substr($temp, 2, 4),
                    substr($temp, 8, 4),
                    substr($temp, 0, 12)
                );

                Q("UPDATE `#__shop_orders` SET `order_id`=?s WHERE `number` LIKE ?s LIMIT 1", [
                    $order_id, $number
                ]);

                $hash = md5($order_id);

                $this->_complete();

                $this->_clearActive();

                redirect('/cart/complete/status/' . $hash);
            }
            else
            {
                redirect('/cart');
            }
        }

        return [
            'order'     => $order,
            'template'  => $template
        ];
    }
}
