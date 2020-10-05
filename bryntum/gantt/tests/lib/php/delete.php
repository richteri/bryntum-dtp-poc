<?php
session_start();
if (!isset($_SESSION["data"])) die(json_encode(array("success" => false, "msg" => "data")));
if (!isset($_GET["id"]) && !isset($_POST["id"])) die(json_encode(array("success" => false, "msg" => "id")));

if ($_SESSION["data"]) {
    $id = isset($_POST["id"]) ? $_POST["id"] : $_GET["id"];
    $ids = explode(",", $id);
    $idx = 0;
    for ($i=0; $i<count($_SESSION["data"]); $i++) {
        $record = $_SESSION["data"][$i];
        if (in_array($record["id"], $ids)) {
            array_splice($_SESSION["data"], $i, 1);
            $i--;
        };
    }
    echo json_encode(array("success" => true));
}
