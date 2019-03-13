<?php

declare(strict_types=1);

namespace Fastest\Core\Modules;

final class authModule extends \Fastest\Core\Modules\Module
{
    public function router()
    {
        if (isset($this->arguments[0])) {
            return $this->errorPage;
        }

        if (count($_POST)) {
            return $this->postMethod();
        }

        return $this->formMethod();
    }

    public function postMethod()
    {
        if (strstr($_backuri, '?')) {
            $_backuri = current(explode('?', $_backuri));
        }

        $email        = __post('email');
        $password    = __post('password');

        if ($email && $password) {
            $user = Q("SELECT `id`, `address`, `city`, `email`, `phone`, `name`, `created` FROM `#_mdd_users` WHERE `email` LIKE ?s AND `password` LIKE ?s LIMIT 1", array(
                $email, md5($password)
            ))->row();

            if (!empty($user)) {
                $_SESSION['user'] = $user;
            }
        }

        redirect($_backuri);
    }

    public function formMethod()
    {
        return array(
            'template'        =>    'form'
        );
    }
}
