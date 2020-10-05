<?php
session_start();
if (!$_SESSION["data"] || isset($_GET["reset"])) {
    $_SESSION["data"] = array(
        array("id" => 1, "name" => "Johan",   "country" => "Sweden"),
        array("id" => 2, "name" => "Mats",   "country" => "Sweden"),
        array("id" => 3, "name" => "Arcady",     "country" => "Russia"),
        array("id" => 4, "name" => "Max",     "country" => "Russia"),
        array("id" => 5, "name" => "Max", "country" => "Russia"),
        array("id" => 6, "name" => "Pavel", "country" => "Ukraine"),
        array("id" => 7, "name" => "Terence", "country" => "Netherlands")
    );
}

echo json_encode($_SESSION["data"]);