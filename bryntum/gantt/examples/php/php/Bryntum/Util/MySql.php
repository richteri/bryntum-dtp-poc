<?php

namespace Bryntum\Util;

class MySql
{
    public static function databaseExists($dbname, $host = '', $configFile = '')
    {
        if (defined('DSN')) {
            $dsn  = DSN;
            $user = DBUSERNAME;
            $pwd  = DBUSERPASSWORD;

        } elseif ($configFile) {
            $consts = ConfigFile::parseConfigFile($configFile);

            $dsn  = $consts['DSN'];
            $user = $consts['DBUSERNAME'];
            $pwd  = $consts['DBUSERPASSWORD'];
        }

        if (!$host) {
            list($host) = self::getDSNParts($dsn, ['host']);
        }

        system("mysql -v --host=$host --user=$user --password='$pwd' --database $dbname -e 'exit'", $retval);

        return !$retval;
    }

    public static function createRandomDatabase($configFile = '', $dbPrefix = 'db_')
    {
        $dbCreated = false;

        if (defined('DSN')) {
            $dsn = DSN;

        } elseif ($configFile) {
            $consts = ConfigFile::parseConfigFile($configFile);
            $dsn = $consts['DSN'];
        }

        list($host) = self::getDSNParts($dsn, ['host']);

        while (!$dbCreated) {
            $dbname = uniqid($dbPrefix);

            if (!self::databaseExists($dbname, $host, $configFile)) {
                self::createDatabase($dbname, $host, $configFile);

                $dbCreated = true;
            }
        }

        return $dbname;
    }

    public static function createDatabase($dbname, $host, $configFile = '')
    {
        if (defined('DSN')) {
            $dsn  = DSN;
            $user = DBUSERNAME;
            $pwd  = DBUSERPASSWORD;

        } elseif ($configFile) {
            $consts = ConfigFile::parseConfigFile($configFile);
            $dsn  = $consts['DSN'];
            $user = $consts['DBUSERNAME'];
            $pwd  = $consts['DBUSERPASSWORD'];
        }

        if (!$dbname || !$host) {
            list($_dbname, $_host) = self::getDSNParts($dsn, ['dbname', 'host']);

            if (!$dbname) {
                $dbname = $_dbname;
            }

            if (!$host) {
                $host = $_host;
            }
        }

        system("mysql -v --host=$host --user=$user --password='$pwd' -e 'create database $dbname'", $retval);

        if ($retval) {
            throw new \Exception("Database creation has failed ($dbname).");
        }
    }

    public static function dropDatabase()
    {
        // read the database connection parameters
        list($dbname, $host) = self::getDSNParts(DSN, ['dbname', 'host']);

        $user = DBUSERNAME;
        $pwd = DBUSERPASSWORD;

        system("mysql -v --host=$host --user=$user --password='$pwd' -e 'drop database $dbname'", $retval);

        if ($retval) {
            throw new Exception('Database removal has failed.');
        }
    }

    public static function getDSNParts($dsn, $names)
    {
        $parts = [];
        foreach ($names as $name) {
            preg_match("/$name=(.+?)(;|\$)/", $dsn, $matches);
            $parts[] = @$matches[1];
        }
        return $parts;
    }

    public static function executeScript($script)
    {
        global $host, $dbname;

        $user    = DBUSERNAME;
        $pwd     = DBUSERPASSWORD;
        $command = "mysql -v --host=$host --user=$user --password='$pwd' --database=$dbname < '$script'";

        echo "Executing sql/$script:<pre>";

        system($command, $retval);

        if ($retval) {
            throw new \Exception('Script execution has failed.');
        }
    }

}
