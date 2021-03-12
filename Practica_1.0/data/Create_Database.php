<?php

	$GLOBALS["USERS_FILE_ROUTE"] = "data/users.json";
	$GLOBALS["USERS_THEME_FILE_ROUTE"] = "data/usersThemes.json";
	$GLOBALS["THEME_FILE_ROUTE"] = "data/themes.json";
	$GLOBALS["ARTIST_FILE_ROUTE"] = "data/artist.json";

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

		if (isset($_REQUEST['create'])) {

			$artistsData = json_decode(file_get_contents($GLOBALS["ARTIST_FILE_ROUTE"], true));
			$themesData = json_decode(file_get_contents($GLOBALS["THEME_FILE_ROUTE"], true));
			$usersData = json_decode(file_get_contents($GLOBALS["USERS_FILE_ROUTE"], true));
			$usersThemeData = json_decode(file_get_contents($GLOBALS["USERS_THEME_FILE_ROUTE"], true));

			$dropDatabase = $connection->prepare("DROP DATABASE IF EXISTS " . $GLOBALS["PDO_DATABASE"]);
			$dropDatabase->execute();

			$createDatabase = $connection->prepare("CREATE DATABASE " . $GLOBALS["PDO_DATABASE"]);
			$createDatabase->execute();

			$selectDB = $connection->prepare("USE " . $GLOBALS["PDO_DATABASE"]);
			$selectDB->execute();

			$createTable = $connection->prepare("
				CREATE TABLE " . $GLOBALS["PDO_ARTISTS_TABLE"] . "(
					id VARCHAR(10) NOT NULL,
					name VARCHAR(30) NOT NULL,
					surname VARCHAR(30) NOT NULL,
					themeList VARCHAR(30) NOT NULL,
					views INT DEFAULT 0,
					PRIMARY KEY(id)
				)");
			$createTable->execute();

			$createTable = $connection->prepare("
				CREATE TABLE " . $GLOBALS["PDO_THEMES_TABLE"] . "(
					id VARCHAR(10) NOT NULL,
					idArtist VARCHAR(10),
					name VARCHAR(30) NOT NULL,
					flag VARCHAR(10) NOT NULL,
					views INT DEFAULT 0,
					favs INT DEFAULT 0,
					PRIMARY KEY(id),
					FOREIGN KEY (idArtist) REFERENCES " . $GLOBALS["PDO_ARTISTS_TABLE"] . " (id) ON UPDATE CASCADE
			)");
			$createTable->execute();

			$createTable = $connection->prepare("
				CREATE TABLE " . $GLOBALS["PDO_USERS_TABLE"] . "(
					userName VARCHAR(20) NOT NULL,
					password VARCHAR(32),
					email VARCHAR(30) NOT NULL,
					admin INT(1) NOT NULL,
					PRIMARY KEY(userName)
			)");
			$createTable->execute();

			foreach ($artistsData as $artistData) {

				$rowData = array();

				foreach ($artistData as $value => $artistSingleData) {

					$rowData[$value] = $artistSingleData;

				}

				$newRow = $connection->prepare("
					INSERT INTO " . $GLOBALS["PDO_ARTISTS_TABLE"] . "
					VALUES('" . $rowData['id'] . "','" . $rowData['name'] . "','" . $rowData['surname'] . "','" . $rowData['themeList'] . "', 0)
					");
				$newRow->execute();

			}

			foreach ($themesData as $idArtist => $themeData) {
				
				$rowData = array();

				foreach ($themeData as $themeDataPosition) {
					
					foreach ($themeDataPosition as $value => $themeSingleData) {
					
						$rowData[$value] = $themeSingleData;

					}

					$newRow = $connection->prepare("
						INSERT INTO " . $GLOBALS["PDO_THEMES_TABLE"] . "
						VALUES('" . htmlspecialchars($rowData['id'], ENT_QUOTES, 'UTF-8') . "','" . htmlspecialchars($idArtist, ENT_QUOTES, 'UTF-8') . "','" . htmlspecialchars($rowData['name'], ENT_QUOTES, 'UTF-8') . "','" . htmlspecialchars($rowData['flag'], ENT_QUOTES, 'UTF-8') . "', 0, 0)
						");
					$newRow->execute();

				}

			}

			foreach ($usersData as $userData) {

				$rowData = array();

				foreach ($userData as $value => $userDataPosition) {
					
					foreach ($userDataPosition as $value => $userSingleData) {
					
						$rowData[$value] = $userSingleData;

					}

					$newRow = $connection->prepare("
						INSERT INTO " . $GLOBALS["PDO_USERS_TABLE"] . "
						VALUES('" . htmlspecialchars($rowData['name'], ENT_QUOTES, 'UTF-8') . "','" . htmlspecialchars($rowData['password'], ENT_QUOTES, 'UTF-8') . "','" . htmlspecialchars($rowData['email'], ENT_QUOTES, 'UTF-8') . "','" . htmlspecialchars($rowData['admin'], ENT_QUOTES, 'UTF-8') . "')
						");
					$newRow->execute();

				}

			}

			foreach ($usersThemeData as $userName => $userThemeData) {

				$rowData = array();
				
				$createTable = $connection->prepare("
					CREATE TABLE `" . htmlspecialchars($userName, ENT_QUOTES, 'UTF-8') . "`(
						position INT,
						idList VARCHAR(10) NOT NULL,
						idTheme VARCHAR(10) NOT NULL,
						FOREIGN KEY (idList) REFERENCES " . $GLOBALS["PDO_ARTISTS_TABLE"] . " (id) ON DELETE CASCADE ON UPDATE CASCADE,
						FOREIGN KEY (idTheme) REFERENCES " . $GLOBALS["PDO_THEMES_TABLE"] . " (id) ON DELETE CASCADE ON UPDATE CASCADE,
						PRIMARY KEY(position)
					)");
				$createTable->execute();

				$count = 1;

				foreach ($userThemeData as $value => $userThemeDataPosition) {
					
					foreach ($userThemeDataPosition as $value => $userThemeSingleData) {
					
						$rowData[$value] = $userThemeSingleData;

					}

					$newRow = $connection->prepare("
						INSERT INTO `" . $userName . "`
						VALUES(" . $count . ",'" . htmlspecialchars($rowData['listId'], ENT_QUOTES, 'UTF-8') . "','" . htmlspecialchars($rowData['themeId'], ENT_QUOTES, 'UTF-8') . "')
						");
					$newRow->execute();

					$count = $count + 1;

				}

			}

		}

		if (isset($_REQUEST['save'])){

			$selectDB = $connection->prepare("USE " . $GLOBALS["PDO_DATABASE"]);
			$selectDB->execute();

			$usersDataQuery = $connection->prepare("SELECT * FROM " . $GLOBALS["PDO_USERS_TABLE"]);
			$usersDataQuery->execute();
			$usersData = $usersDataQuery->fetchAll(PDO::FETCH_ASSOC);

			$usersDataArray = array();

			foreach ($usersData as $userData) {
				
				$usersDataArray['User'][] = array('name' => $userData['userName'], 'password' => $userData['password'], 'email' => $userData['email'], 'admin' => $userData['admin']);

			}

			file_put_contents($GLOBALS["USERS_FILE_ROUTE"], json_encode($usersDataArray, JSON_PRETTY_PRINT));

			$artistsDataQuery = $connection->prepare("SELECT * FROM " . $GLOBALS["PDO_ARTISTS_TABLE"]);
			$artistsDataQuery->execute();
			$artistsData = $artistsDataQuery->fetchAll(PDO::FETCH_ASSOC);

			$artistsDataArray = array();

			foreach ($artistsData as $artistData) {
				
				$artistsDataArray[] = array('id' => $artistData['id'], 'name' => $artistData['name'], 'surname' => $artistData['surname'], 'themeList' => $artistData['themeList']);

			}

			file_put_contents($GLOBALS["ARTIST_FILE_ROUTE"], json_encode($artistsDataArray, JSON_PRETTY_PRINT));

			$themesDataQuery = $connection->prepare("SELECT * FROM " . $GLOBALS["PDO_THEMES_TABLE"]);
			$themesDataQuery->execute();
			$themesData = $themesDataQuery->fetchAll(PDO::FETCH_ASSOC);

			$themesDataArray = array();

			foreach ($themesData as $themeData) {
				
				$themesDataArray[$themeData['idArtist']][] = array('id' => $themeData['id'], 'name' => $themeData['name'], 'flag' => $themeData['flag']);

			}

			file_put_contents($GLOBALS["THEME_FILE_ROUTE"], json_encode($themesDataArray, JSON_PRETTY_PRINT));

		}

	} catch (Exception $e) {echo "ERR_CONEX: " . $e->getMessage();}

?>