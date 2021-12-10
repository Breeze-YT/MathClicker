<?php
	ini_set('display_errors',0);
	ini_set('display_startup_errors',0);
	error_reporting(0);
	
	$request  = str_replace("", "", $_SERVER['REQUEST_URI']); 
	$params     = explode("/", $request); 

	$sitename = 'Csgoepoch.com - World is Ours!';
	$baseurl = "csgoepoch.com";

	$min = 500; // minimum deposit value
	$ip = '51.15.41.55'; //server ip
	$referal_summa = 250; //referal value

	$dbname = '##DATABASENAME##';
	$dbhost = '##HOSTNAME#';
	$dbuser = '##DATABASEUSER#';
	$dbpassword = '##DATABASEPASSWORD##';

	try {
		$db = new PDO('mysql:host='.$dbhost.';dbname='.$dbname, $dbuser, $dbpassword, array(PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8"));
	} catch (PDOException $e) {
		exit($e->getMessage());
	}
?>