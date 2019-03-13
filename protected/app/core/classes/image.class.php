<?php

declare(strict_types=1);

namespace Fastest\Core;

class Image
{
  private $image = null;

  public function __construct()
  {
    // Создать пустое изображение и добавить текст
    $this->image = imagecreatetruecolor(120, 20);
    $text_color = imagecolorallocate($this->image, 233, 14, 91);

    imagestring($this->image, 1, 5, 5,  'WebP with PHP', $text_color);
  }

  public function webp($name = '')
  {
    // Сохранить изображение
    imagewebp($this->image, $name.'.webp');
    $this->free();
  }

  public function png() {}

  public function jpg() {}

  public function gif() {}

  public function free() {
    // Освободить память
    imagedestroy($this->image);
  }
}
