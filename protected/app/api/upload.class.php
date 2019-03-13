<?php

declare(strict_types=1);

namespace Fastest\Core\Api;

final class Upload extends \Fastest\Core\Api\Api
{
    private $upload_dir = '/upload_dir/';

    public function __construct()
    {
        parent::__construct();
    }

    private function normalize($file = [])
    {
        $result = new \StdClass;

        if (!empty($file['name']))
        {
            $result->name = is_array($file['name']) ? array_shift($file['name']) : $file['name'];
        }

        if (!empty($file['type']))
        {
            $result->type = is_array($file['type']) ? array_shift($file['type']) : $file['type'];
        }

        if (!empty($file['tmp_name']))
        {
            $result->tmp_name = is_array($file['tmp_name']) ? array_shift($file['tmp_name']) : $file['tmp_name'];
        }

        if (!empty($file['error']))
        {
            $result->error = is_array($file['error']) ? array_shift($file['error']) : $file['error'];
        }
        if (!empty($file['size']))
        {
            $result->size = is_array($file['size']) ? array_shift($file['size']) : $file['size'];
        }

        return $result;
    }

    private function createDir($name = '')
    {
        $created = substr(md5($name), 0, 2);

        $dir = PATH_ROOT . $this->upload_dir;

        if (!is_dir($dir.$created))
        {
            if (!is_dir($dir))
            {
                mkdir($dir);
                chmod($dir, 0777);
            }

            mkdir($dir.$created);
            chmod($dir.$created, 0777);
        }

        return $this->upload_dir . $created;
    }

    private function getFile($name = '')
    {
        $extension = pathinfo($name, PATHINFO_EXTENSION);

        $dir = $this->createDir($name);

        $name = sprintf(
            '%s_%s_%s',
            substr(md5($name), 0, 4),
            substr(md5(date('YmdHis')), 0, 4),
            substr(md5(uniqid().time()), 0, 6)
        );

        return sprintf('%s/%s.%s', $dir, $name, $extension);
    }

    public function file()
    {
        $response = [];

        if (!empty($_FILES['file']))
        {
            $normalized = $this->normalize($_FILES['file']);

            if (!in_array(strtolower($normalized->type), ['text/php', 'text/javascript']))
            {
                $file = $this->getFile($normalized->name);

                if (move_uploaded_file($normalized->tmp_name, PATH_ROOT . $file))
                {
                    $response = [
                        'file' => [
                            'url'   => $file,
                            'name'  => $normalized->name
                        ]
                    ];
                }
            }
        }

        return $this->response($response, 201, true);
    }

    public function image()
    {
        $response = [];

        if (!empty($_FILES['file']))
        {
            $normalized = $this->normalize($_FILES['file']);
            $types = ['image/png', 'image/jpg', 'image/gif', 'image/jpeg', 'image/pjpeg'];

            if (in_array(strtolower($normalized->type), $types))
            {
                $file = $this->getFile($normalized->name);

                if (move_uploaded_file($normalized->tmp_name, PATH_ROOT . $file))
                {
                    $response = [
                        'file' => [
                            'url' => $file
                        ]
                    ];
                }
            }
        }

        return $this->response($response, 201, true);
    }

    public function clipboard()
    {
        $response = [];

        if (!empty($_POST['contentType']))
        {
            $contentType = $_POST['contentType'];
            $data = base64_decode($_POST['data']);

            $file = $this->getFile('jpg');

            $file_name = PATH_ROOT . $file;

            $response = [
                'file' => [
                    'url' => $file,
                    'name'  => $normalized->name
                ]
            ];

            file_put_contents($file_name, $data);
        }

        return $this->response($response, 201, true);
    }
}
