<?php 
	function curl($url) {
		$ch = curl_init();

		curl_setopt($ch, CURLOPT_HEADER, 0);
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
		curl_setopt($ch, CURLOPT_URL, $url);
		curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 0);
		curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, 0);
		curl_setopt($ch, CURLOPT_COOKIEFILE, 'cookies.txt');
		curl_setopt($ch, CURLOPT_COOKIEJAR, 'cookies.txt');
		curl_setopt($ch, CURLOPT_FOLLOWLOCATION, 1); 

		$data = curl_exec($ch);
		curl_close($ch);

		return $data;
	}

	function extract_token($url) {
	    parse_str(parse_url($url, PHP_URL_QUERY), $queryString);
	    return isset($queryString['token']) ? $queryString['token'] : false;
	}

	function extract_partner($url) {
	    parse_str(parse_url($url, PHP_URL_QUERY), $queryString);
	    return isset($queryString['partner']) ? $queryString['partner'] : false;
	}
?>