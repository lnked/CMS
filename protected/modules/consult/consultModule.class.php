<?php

declare(strict_types=1);

namespace Fastest\Core\Modules;

final class consultModule extends \Fastest\Core\Modules\Module
{
    public $moduleName = 'consult';

    public function router()
    {
        return $this->consultMethod();
    }

    public function consultMethod()
    {
        $data = [];
        $errors = [];

        if (!empty($_SESSION[$this->moduleName]['fields']))
        {
            $data = $_SESSION[$this->moduleName]['fields'];
        }

        if (!empty($_SESSION[$this->moduleName]['errors']))
        {
            $errors = $_SESSION[$this->moduleName]['errors'];
        }

        return [
            'data'  => $data,
            'errors'  => $errors,
            'template'  => 'index'
        ];
    }

    public function postMethod()
    {
        unset($_SESSION[$this->moduleName]);

        $empty = 'Заполните, пожалуйста, поле "%s"!';
        $empty_correct = 'Заполните, пожалуйста, корректно поле "%s"!';

        $fields = [
            'name'  => 'Фамилия и имя',
            'email' => 'Эл. почта',
            'phone' => 'Контактный телефон',
            'comment' => 'Комментарий'
        ];

        $_SESSION[$this->moduleName]['fields'] = $_POST;

        // -- // -- // -- // -- // -- // -- // -- // -- //

        $required = [
            'name', 'email', 'phone', 'access', 'g-recaptcha-response'
        ];

        foreach ($required as $v)
        {
            if (!isset($_POST[$v]) || empty($_POST[$v]))
            {
                if ($v !== 'access')
                {
                    $error_text = '';

                    if (isset($fields[$v]))
                    {
                        $error_text = sprintf($empty, $fields[$v]);
                    }
                }
                else {
                    $error_text = 'Вы должны дать согласие на обработку своих персональных данных и принять условия пользовательского соглашения.';
                }

                $_SESSION[$this->moduleName]['errors'][$v] = $error_text;
            }
        }

        if (!$this->checkCSRF($_POST))
        {
            return $this->errorPage;
        }

        if (!$this->checkRECAPTCHA($_POST, '6LftAEYUAAAAAMDp6SSB3MwATgQpQGZMAn6xpM9t'))
        {
            $_SESSION[$this->moduleName]['errors']['captcha'] = 'Поставьте галочку, подтвердите что вы не робот!';
        }

        $name       = __post('name');
        $phone      = __post('phone');
        $email      = __post('email');
        $comment    = __post('comment');
        $_backuri   = base64_decode(__post('_backuri'));

        if (strstr($_backuri, '?'))
        {
            $_backuri = current(explode('?', $_backuri));
        }

        if (!$email || !is_email($email))
        {
            $_SESSION[$this->moduleName]['errors']['email'] = sprintf($empty_correct, $fields['email']);
        }

        if (!empty($_SESSION[$this->moduleName]['errors']))
        {
            redirect($_backuri);
        }

        $sended = O('_mdd_consult')->create([
            's:name'        =>  $name,
            's:phone'       =>  $phone,
            's:email'       =>  $email,
            's:comment'     =>  $comment,
            's:ip'          =>  $_SERVER['REMOTE_ADDR'],
            'e:created'     =>  'NOW()',
            'i:visible'     =>  1
        ]);

        // # Отправка письма
        // $domen = str_replace(array('http://', 'www.', 'www') , '', $_SERVER['SERVER_NAME']);

        // $m  = '';
        // $m .= '<p>Здравствуйте,</p>';
        // $m .= '<p>Новое сообщение, на сайте ' . $domen . '</p>';
        // $m .= '<p>--------------------</p>';
        // $m .= '<p>ФИО: <strong>'. $name .'</strong></p>';
        // $m .= '<p>E-mail: <strong>'. $email .'</strong></p>';
        // $m .= '<p>Телефон: <strong>'. $phone .'</strong></p>';
        // $m .= '<p>Комментарий: <strong>'. $comment .'</strong></p>';
        // $m .= '<p>--------------------</p>';
        // $m .= '<p>Дата отправки: '. date('d.m.Y H:i:s') .'</p>';

        // $subject = "Новое сообщение на сайте";

        // $emails = getfl('emails');
        // $sended = sendMail($subject, $m, 'info@sk-zenit.ru', $emails, 'sD1VRF4J', 'smtp.timeweb.ru');

        if ($sended)
        {
            unset($_SESSION[$this->moduleName]);
            redirect($_backuri . '?act=success');
        }
        else
        {
            redirect($_backuri . '?act=fail');
        }
    }
}
