<?php

//Main settings
//define("SERVER_ROOT", "/work/Eduweb/logmarket/logmarket.web-hawer/services"); //The root of the server, used for includes, purpose is to shorten the path string

//Site settings
define("DEBUGE_MODE", false); //Set to false if you dont want everyone to see debug information

// MySQL details
define('SQLHOST', 'localhost'); //The MySQL host ip/fqdn
define('SQLLOGIN', 'allforone_user');//The MySQL login
define('SQLPASS', 'Jani123'); //The MySQL password
define('SQLDB', 'allforone_db'); //The MySQL database to use
define('SQLPORT', 3306); //The MySQL port to connect on
define('SQLSOCK', '/var/run/mysqld/mysql.sock');