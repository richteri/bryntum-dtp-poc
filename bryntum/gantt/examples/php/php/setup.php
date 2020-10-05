<?php


// Attention the code is added for testing purposes only
// v - please get rid of this before using it on production
$allowExternalConfigs = true;
// ^ - please get rid of this before using it on production

$createDatabase = @$_REQUEST['createDatabase'];

if ($createDatabase) {
    require __DIR__ .'/autoloader.php';

    if ($createDatabase == 'random') {
        $baseConfigFile = \Bryntum\Util\ConfigFile::getConfigFile('config.php', __DIR__, $allowExternalConfigs);

        $dbname = \Bryntum\Util\MySql::createRandomDatabase($baseConfigFile);

        $configFile = \Bryntum\Util\ConfigFile::generateDatabaseConfigFile($dbname, $baseConfigFile, __DIR__."/$dbname.php");

        require $configFile;

    } else {
        require __DIR__ .'/loadConfiguration.php';
        \Bryntum\Util\MySql::createDatabase();
    }
}

// initialize application
include 'init.php';

// read the database connection parameters
list($dbname, $host) = \Bryntum\Util\MySql::getDSNParts(DSN, ['dbname', 'host']);

if (!$dbname) throw new Exception('Could not get database from the DSN string.');
if (!$host) throw new Exception('Could not get host from the DSN string.');

// Create the database and insert data
\Bryntum\Util\MySql::executeScript(dirname(__DIR__) .'/sql/setup.sql');

if ($configFile) {
    echo "CONFIG FILE=$configFile";
}
