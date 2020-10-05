This is a demo showing how to import data from an MS Project ".mpp" file into the Bryntum Gantt component.

Required software
=================

Requirements for this example :
- PHP 5+
- Apache Maven 2 (http://maven.apache.org/)
- JDK 7+ (OpenJDK 7+ can be used as well)

Required libraries licensing
============================

Please read the required libraries licensing carefully:
- org.json - (http://www.json.org/license.html)
- MPXJ - (http://mpxj.sourceforge.net/, "Licensing" chapter)

Building the example
====================

To build the example proceed to its folder/msprojectreader and run this command:

	mvn package

Maven will retrieve all the required dependencies (main dependency is MPXJ project, see details here: http://mpxj.sourceforge.net/).
After the command completion there will be created a new "target" folder where you can find `bryntum-msproject-reader-x.y.z.jar` file.
The built JAR-file includes all the required libraries.


Configuring folders
===================

You can relocate built `bryntum-msproject-reader-XXX.jar` file if you need. After doing this you need to edit the `php/load.php` script.
In its header you can find lines like these:

	$dir      = dirname(__FILE__);
	$jar_path = $dir .'/../msprojectreader/target/bryntum-msproject-reader-5.1.13.jar';
	$tmp_dir  = $dir .'/tmp/';

The `$jar_path` variable specifies the built JAR file location so you can change its value to the proper one.

The `$tmp_dir` variable keeps another path that can be changed. It defines the temporary folder where an uploaded MPP file is saved.
You also need to make sure that the server user has privileges for both reading/creating files on this path.

Uploaded file size limitation
=============================

PHP has a couple of settings that restrict the max allowed size of uploaded files. Please make sure to set reasonable values:
http://docs.php.net/manual/en/ini.core.php#ini.upload-max-filesize
http://docs.php.net/manual/en/ini.core.php#ini.post-max-size
