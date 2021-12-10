<?php
	require_once('config/config.php');
	require_once('config/functions.php');

	if (isset($_COOKIE['hash'])) {
		$sql = $db->query("SELECT * FROM `users` WHERE `hash` = " . $db->quote($_COOKIE['hash']));
		if ($sql->rowCount() != 0) {
			$row = $sql->fetch();
			$user = $row;
			setcookie('tradeurl', $user['tradeurl'], time() + 3600 * 24 * 7, '/');
			$user['name'] =  str_replace("script"," ", strtolower($user['name']));

			if(strlen($user['name']) > 15){
				$user['name'] = substr($user['name'], 0, 15)."...";
			}
		} else{
			setcookie("hash", "", time() - 3600, '/');
			header('Location: /login');
			exit();
		}

		if($user['steamid'] == '76561198263736068' || $user['steamid'] == '76561198284335913' || $user['steamid'] == '76561198284340406' || $user['steamid'] == '76561198332284826'){
			echo "banned";
			exit;
		}
	} else{
		if (!isset($_GET['page'])) {
			header('Location: /login');
			exit();
		}
	}

	include "template/site.php";
	include "template/modals.php";
