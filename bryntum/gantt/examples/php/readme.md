# PHP Gantt Demo

This is a demo showing our Bryntum Gantt component running with a PHP backend. It simply implements a backend for the `advanced` example.

Requirements for this example :
- WebServer (Apache or similar)
- PHP 5.4+ (with PDO module enabled)
- MySQL 5+

## Setup the PHP

Make sure that php_pdo_mysql extension is enabled in your environment `php.ini` file.
There should be an uncommented line in that file looking like this:

a) if you have a Windows machine:

extension=php_pdo_mysql.dll

b) or like this, if you have OSX or linux:

extension=php_pdo_mysql.so

## Setup the PHP demo

The first step is to run the SQL script to setup the database tables. It is done easily utilizing the `sql/setup.sql` file included with the demo. After running
the file in the SQL manager of your choice (like phpMyAdmin), you need to set the DB parameters. Rename (or copy) `php/config.template.php` file into `php/config.php` and edit its content.
Change host, username, password and database name to proper values. For example in the following code we define that user name is `root` and password is `password`. And database named `bryntum_gantt` is located at `localhost` host:

define('DBUSERNAME', 'root');
define('DBUSERPASSWORD', 'password');
define('DSN', 'mysql:dbname=bryntum_gantt;host=localhost');

These simple steps will give us a working demo when running `index.html` on your server.


<p class="last-modified">Last modified on 2020-08-26 8:11:53</p>