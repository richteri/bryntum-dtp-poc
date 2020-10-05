<?php

/*
!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
!!! ATTENTION: This file removes the database and is used for testing purposes only.
!!! Please remove the file if you plan to use the demo code on production.
!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
*/

require dirname(__FILE__) .'/autoloader.php';
require dirname(__FILE__) .'/loadConfiguration.php';

\Bryntum\Util\MySql::dropDatabase();
