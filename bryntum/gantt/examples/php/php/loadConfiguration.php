<?php

// Attention the code is added for testing purposes only
// v - please get rid of this before using it on production
$allowExternalConfigs = true;
// ^ - please get rid of this before using it on production

$config = \Bryntum\Util\ConfigFile::getConfigFile('config.php', __DIR__, $allowExternalConfigs);

if ($config) {
    require $config;
} else {
    die(json_encode([
                        'success' => false,
                        'msg'     => 'Configuration file "php/config.php" was not found. Copy "php/config.template.php" to "php/config.php" and edit DB settings within file.'
                    ]
    ));
}
