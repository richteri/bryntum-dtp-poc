<?php
session_start();
if (!$_SESSION["data"]) die(json_encode(array("success" => false, "msg" => "sessiondata")));
if (!$_POST["data"] && !$_GET["data"]) die(json_encode(array("success" => false, "msg" => "postget")));

if ($_SESSION["data"]) {
    $mods = json_decode(isset($_POST["data"]) ? $_POST["data"] : $_GET["data"], true);
    $changed = array();

    foreach ($mods as $mod) {
        $key = array_search($mod["id"], array_column($_SESSION["data"], "id"));
        $record = $_SESSION["data"][$key];
        if (isset($record)) {
            foreach($mod as $field => $value) {
                $record[$field] = $value;
            }
            $changed[] = $record;
            $_SESSION["data"][$key] = $record;
        }
    }

    echo json_encode(array("success" => true, "data" => $changed));
}
