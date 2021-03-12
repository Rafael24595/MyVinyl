<?php

	$GLOBALS["USERS_FILE_ROUTE"] = "../data/users.json";
	$GLOBALS["USERS_THEME_FILE_ROUTE"] = "../data/usersThemes.json";
	$GLOBALS["THEME_FILE_ROUTE"] = "../data/themes.json";
	$GLOBALS["ARTIST_FILE_ROUTE"] = "../data/artist.json";

	$GLOBALS["PDO_SERVER"] = "mysql:host=localhost";
	$GLOBALS["PDO_USER"] = "root";
	$GLOBALS["PDO_PASSWORD"] = "";
	$GLOBALS["PDO_DATABASE"] = "my_vinyl";
	$GLOBALS["PDO_USERS_TABLE"] = "users";
	$GLOBALS["PDO_ARTISTS_TABLE"] = "artists";
	$GLOBALS["PDO_THEMES_TABLE"] = "themes";

	try {
		
		$connection = new PDO($GLOBALS["PDO_SERVER"], $GLOBALS["PDO_USER"], $GLOBALS["PDO_PASSWORD"]);
		$connection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
		$connection->setAttribute(PDO::MYSQL_ATTR_INIT_COMMAND, "SET NAME'utf8'");

	} catch (Exception $e) {echo "ERR_CONEX: " . $e->getMessage();}

?>