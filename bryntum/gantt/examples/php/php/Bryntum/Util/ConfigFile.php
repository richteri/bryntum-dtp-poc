<?php

namespace Bryntum\Util;

class ConfigFile
{
    public static function parseConfigFile($configFile)
    {
        $text = file_get_contents($configFile);

        if ($text === false) {
            throw new \Exception('Cannot get configuration file content');
        }

        $result = [];

        if (preg_match_all("/define\(\s*['\"]([^'\"]+)['\"]\s*,\s*['\"]([^'\"]+)['\"]\s*\)\s*;/", $text, $matches)) {
            $consts = $matches[1];
            $values = $matches[2];
            for ($i = 0; $i < sizeof($consts); $i++) {
                $result[$consts[$i]] = $values[$i];
            }
        }

        return $result;
    }

    public static function getConfigFile($defaultConfig = null, $forceDir = null, $allowExternalConfigs = false)
    {
        $configs = [];

        if ($defaultConfig) {
            $configs[] = $forceDir ? $forceDir .'/'. basename($defaultConfig) : $defaultConfig;
        }

        if ($allowExternalConfigs) {
            $config = @$argv[1] ? @$argv[1] : @$_REQUEST['config'];
            if ($config) {
                array_unshift($configs, $forceDir ? $forceDir .'/'. basename($config) : $config);
            }
        }

        $result = '';

        foreach ($configs as $config) {
            if (file_exists($config)) {
                $result = $config;
                break;
            }
        }

        return $result;
    }

    public static function generateDatabaseConfigFile($dbname, $templateFileName, $configFile)
    {
        echo "Copying $templateFileName to $configFile";
        if (!copy($templateFileName, $configFile)) {
            throw new \Exception("Cannot copy configuration file $templateFileName to $configFile");
        }

        $text = file_get_contents($configFile);

        if ($text === false) {
            throw new \Exception('Cannot get configuration file content');
        }

        $text = preg_replace("/dbname=(.+?)(;|\$)/", "dbname=$dbname$2", $text);

        if (file_put_contents($configFile, $text) === false) {
            throw new \Exception('Cannot write configuration file');
        }

        return $configFile;
    }
}
