<?php
session_start();
if (!$_SESSION["data"]) die(json_encode(array("success" => false, "msg" => "sessiondata")));
if (!$_POST["data"] && !$_GET["data"]) die(json_encode(array("success" => false, "msg" => "postget")));

if ($_SESSION["data"]) {
    $mods = json_decode(isset($_POST["data"]) ? $_POST["data"] : $_GET["data"], true);
    $added = array();

    foreach ($mods as $mod) {
        $mod["id"] = count($_SESSION["data"]) + 2;
        $_SESSION["data"][] = $mod;
        $added[] = $mod;
    }

    echo json_encode(array("success" => true, "data" => $added));
}
