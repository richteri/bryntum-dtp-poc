<?php

namespace Bryntum\Gantt;

function autoload($class)
{
    $file = dirname(__FILE__).'/'.str_replace('\\', '/', $class).'.php';
    if (file_exists($file)) {
        //echo "\n".$file;
        require_once $file;
    }
}

spl_autoload_register('Bryntum\Gantt\autoload');

define('BRYNTUM_GANTT_AUTOLOAD_SET', true);
