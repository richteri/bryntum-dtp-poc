<?php
// initialize application
include 'init.php';

$sql = file_get_contents(dirname(__DIR__) . '/sql/setup.sql');

// get "data" region
$sql = Bryntum\Util\ScriptEditor::getTextRegion($sql, 'data') or die('Cannot find data region');

// get "options" region
$optionsSql = Bryntum\Util\ScriptEditor::getTextRegion($sql, 'options') or die('Cannot find options region');

// remove all insertions
$sql = Bryntum\Util\ScriptEditor::replaceTextRegion($sql, 'insertions');

// execute database reset script plus options insertion
$app->db->exec("$sql\n$optionsSql");
