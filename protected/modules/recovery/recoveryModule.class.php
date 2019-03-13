<?php

declare(strict_types=1);

namespace Fastest\Core\Modules;

final class recoveryModule extends \Fastest\Core\Modules\Module
{
    public function router()
    {
        if (isset($this->arguments[0])) {
            return $this->errorPage;
        }

        return $this->formMethod();
    }

    public function formMethod()
    {
        return array(
            'template'  =>  'form'
        );
    }
}
