<?php

declare(strict_types=1);

namespace Fastest\Core\Modules;

final class feedbackModule extends \Fastest\Core\Modules\Module
{
    protected $session = 'feedback';

    protected $required = [
        'name',
        'email',
        'message'
    ];

    public function router()
    {
        if (isset($this->arguments[0]))
        {
            return $this->errorPage;
        }

        return $this->formMethod();
    }

    public function formMethod()
    {
        $fields = [];
        $errors = [];

        if (count($_POST))
        {
            $data = $_POST;
            $fields = $data;

            unset($_SESSION[$this->session]);

            $_SESSION[$this->session]['fields'] = $fields;

            foreach ($this->required as $name)
            {
                if (empty($data[$name]))
                {
                    $errors[$name] = true;
                }
            }

            if (!$this->checkCSRF($data))
            {
                return $this->errorPage;
            }

            $name       = __post('name');
            $theme      = __post('theme');
            $phone      = __post('phone');
            $email      = __post('email');
            $message    = __post('message');

            $_backuri   = base64_decode(__post('_backuri'));

            if (strstr($_backuri, '?'))
            {
                $_backuri = current(explode('?', $_backuri));
            }

            if ((in_array('email', $this->required) && !$email) || !is_email($email)) {
                $errors['email'] = true;
            }

            $_SESSION[$this->session]['errors'] = $errors;

            if (!empty($_SESSION[$this->session]['errors']))
            {
                redirect($_backuri . '#feedback');
            }

            O('_mdd_feedback')->create([
                's:name'        =>  $name,
                's:theme'       =>  $theme,
                's:phone'       =>  $phone,
                's:email'       =>  $email,
                's:message'     =>  $message,
                'e:created'     =>  time(),
                'i:visible'     =>  1
            ]);

            $this->sendMessage($data, $_backuri);
        }

        if (!empty($_SESSION[$this->session]['fields']))
        {
            $fields = $_SESSION[$this->session]['fields'];
        }

        if (!empty($_SESSION[$this->session]['errors']))
        {
            $errors = $_SESSION[$this->session]['errors'];
        }

        return [
            'fields'    =>  $fields,
            'errors'    =>  $errors,
            'template'  =>  'feedback'
        ];
    }

    public function sendMessage($data = [], $_backuri = '')
    {
        if (!empty($data))
        {
            # Отправка письма
            $domen = str_replace([ 'http://', 'www.', 'www' ], '', $_SERVER['SERVER_NAME']);

            $subject = "Новое сообщение на сайте";

            $body  = '';
            $body .= '<p>Здравствуйте,</p>';
            $body .= '<p>Новое сообщение, на сайте ' . $domen . '</p>';
            $body .= '<p>--------------------</p>';

            if (!empty($data['theme']))
            {
                $body .= '<p>Тема сообщения: <strong>'. $data['theme'] .'</strong></p>';
            }

            if (!empty($data['name']))
            {
                $body .= '<p>Контактное лицо: <strong>'. $data['name'] .'</strong></p>';
            }

            if (!empty($data['email']))
            {
                $body .= '<p>E-mail: <strong>'. $data['email'] .'</strong></p>';
            }

            if (!empty($data['phone']))
            {
                $body .= '<p>Телефон: <strong>'. $data['phone'] .'</strong></p>';
            }

            if (!empty($data['message']))
            {
                $body .= '<p>Текст письма: <strong>'. $data['message'] .'</strong></p>';
            }

            $body .= '<p>--------------------</p>';
            $body .= '<p>Дата отправки: '. date('d.m.Y H:i:s') .'</p>';

            $emails = getfl('emails');

            // Create the Transport
            $transport = (new \Swift_SmtpTransport(SEND_MAILER_SERVER, SEND_MAILER_PORT, SEND_MAILER_PROTO))
                ->setUsername(SEND_MAILER_EMAIL)
                ->setPassword(SEND_MAILER_PASSWORD)
            ;

            // Create the Mailer using your created Transport
            $mailer = new \Swift_Mailer($transport);

            // Create a message
            $message = (new \Swift_Message($subject))
                ->setFrom([SEND_MAILER_EMAIL => SEND_MAILER_NAME])
                ->setTo($emails)
                ->setBody($body, 'text/html')
            ;

            // Send the message
            if ($mailer->send($message))
            {
                unset($_SESSION[$this->session]);

                redirect($_backuri . '?act=success#feedback');
            }
            else
            {
                redirect($_backuri . '?act=failed#feedback');
            }
        }
    }
}
