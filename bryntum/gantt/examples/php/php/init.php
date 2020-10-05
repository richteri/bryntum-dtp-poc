<?php

namespace Bryntum\Gantt;

// 4hrs
ini_set('session.gc_maxlifetime', 14400);

if (!session_id()) {
    session_start();
}

// setup demo classes autoload if not set yet
if (!defined('BRYNTUM_GANTT_AUTOLOAD_SET')) {
    require dirname(__FILE__) .'/autoloader.php';
}

// load configuration if it's not loaded yet
if (!defined('DSN')) {
    require dirname(__FILE__) .'/loadConfiguration.php';
}

$app = new Gantt(DSN, DBUSERNAME, DBUSERPASSWORD);
if (!$app) {
    die('{ success: false, error : "Database connecting error" }');
}

$afterinit = dirname(__FILE__) .'/after-init.php';

if (file_exists($afterinit)) {
    include $afterinit;
}
