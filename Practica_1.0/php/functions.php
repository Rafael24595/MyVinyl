<?php

//INDEX PAGE => Linea 23
//FUNCTIONS INDEX => Linea 78
//PAGE PAGE => Linea 343
//FUNCTIONS PAGE => Linea 419

	require "connectDatabase.php";

	$GLOBALS["LOG_IN"] = 0;
	$GLOBALS["SIGN_UP"] = 1;

	$GLOBALS["VALID_USER_PASSWORD"] = 1;
	$GLOBALS["INVALID_USER"] = 0;
	$GLOBALS["INVALID_PASSWORD"] = -1;

	$GLOBALS["VALID_EMAIL"] = 1;
	$GLOBALS["INVALID_EMAIL"] = -1;

	function clearData($data){

		$cleanData = htmlspecialchars(trim(strip_tags($data)), ENT_QUOTES, "UTF-8");

		return $cleanData;

	}

	try {
		
		$selectDB = $connection->prepare("USE " . $GLOBALS["PDO_DATABASE"]);
		$selectDB->execute();

	} catch (Exception $e) {echo "ERR_SELECT_DB: " . $e->getMessage();}

//////////////
//INDEX PAGE//
//////////////

	if(isset($_REQUEST['logIn'])){

		$userName = clearData($_REQUEST['userName']);
		$password = md5(clearData($_REQUEST['password']));

		sessionOn($userName, $password);

	}

	if(isset($_POST['signUp'])){

		$userName = clearData($_POST['userName']);
		$password = md5(clearData($_POST['password']));
		$email = clearData($_POST['email']);

		signUp($userName, $password, $email);

	}

	if(isset($_POST['logInPetition'])){

		$elements = clearData($_POST['logInPetition']);
		$valide = searchUser($elements[0], $elements[1], $elements[2], $elements[3]);

		echo $valide;

	}

	if (isset($_GET['valideSession'])) {
		
		session_start();

		if (isset($_SESSION['activeUser'])) {
			
			echo $_SESSION['activeUser'];

		}
		else{

			echo "";

		}

	}

	if(isset($_POST['searchUserData'])){

		$user = clearData($_POST['userName']);
		$dataName = clearData($_POST['dataName']);
		$dataValue = clearData($_POST['dataValue']);

		searchUserData($user, $dataName, $dataValue);

	}

	if(isset($_POST['starStateUpdate'])){

		$userName = clearData($_POST['userName']);
		$listId = clearData($_POST['listId']);
		$themeId = clearData($_POST['themeId']);
		$type = clearData($_POST['starStateUpdate']);

		updateUserThemeList($userName, $listId, $themeId, $type);

	}

	if(isset($_POST['reorderUserList'])){

		$userName = clearData($_POST['userName']);
		$newOrder = $_POST['reorderUserList'];

		reorderUserList($userName, $newOrder);

	}

	if(isset($_GET['getUserThemeListData'])){

		$userName = clearData($_GET['getUserThemeListData']);

		getUserThemeList($userName);

	}

	if(isset($_POST['modifyUserData'])){

		$userName = clearData($_POST['user']);
		$attribute = clearData($_POST['attribute']);

		updateUserData($userName, $attribute);

	}

///////////////////
//FUNCTIONS INDEX//
///////////////////

	function sessionOn($userName, $password){

		global $connection;

		try {
			
			$validUser = $connection->prepare("SELECT * FROM " . $GLOBALS["PDO_USERS_TABLE"] . " WHERE (userName = :userName) AND (password = :password)");
			$validUser->execute([":userName" => $userName, ":password" => $password]);

		}catch (Exception $e) {echo "ERR_QUERY: " . $e->getMessage();}

		$connection = null;

		if ($validUser->rowCount() > 0) {
			
			session_start();

			$_SESSION["activeUser"] = "@" . $userName;

			header("Location:../html/page.php");

		}
		else{echo "string";

			header("Location:../html/index.php");

		}

	}

	function signUp($userName, $password, $email){

		global $connection;

		$admin = 0;

		try {
			
			$newUser = $connection->prepare("INSERT INTO " . $GLOBALS["PDO_USERS_TABLE"] . " VALUES (:user, :password, :email, :admin)");
			$newUser->execute([":user" => $userName, ":password" => $password, ":email" => $email, ":admin" => $admin]);

		}catch (Exception $e) {echo "ERR_QUERY: " . $e->getMessage();}

		$connection = null;

		header("Location:../html/page.php");

	}

	function searchUserData($user, $dataName, $dataValue){

		global $connection;

		$avatar = ($dataName == "avatar") ? true : false ;
		$dataName = ($dataName == "avatar") ? "userName" : $dataName;
		$dataValue = ($dataName == "password") ? md5($dataValue) : $dataValue;

		$data = array('userExists' => 0, 'dataEquals' => 0, 'dataValue' => "", 'dataCoincidence' => 0);

		try {
			
			$userDataQuery = $connection->prepare("SELECT * FROM " . $GLOBALS["PDO_USERS_TABLE"] . " WHERE(userName = :user)");
			$userDataQuery->execute([":user" => $user]);

			$dataValueExists = $connection->prepare("SELECT * FROM " . $GLOBALS["PDO_USERS_TABLE"] . " WHERE($dataName = :dataValue)");
			$dataValueExists->execute([":dataValue" => $dataValue]);

			$userData = $userDataQuery->fetch(PDO::FETCH_ASSOC);

			if ($dataValueExists->rowCount() > 0) {
				
				$data['dataCoincidence'] = 1;

			}

			if ($userDataQuery->rowCount() > 0 && array_key_exists($dataName, $userData)) {
				
				$data['userExists'] = 1;
				$data['dataValue'] = $userData[$dataName];

				if ($avatar == true && !file_exists("../media/image/users/" . $userData[$dataName] . ".png")) {
					
					$data['dataValue'] = "defaultProfile";

				}

				if ($userData[$dataName] == $dataValue) {
					
					$data['dataEquals'] = 1;

				}

			}

		}catch (Exception $e) {echo "ERR_QUERY: " . $e->getMessage();}

		$connection = null;

		echo json_encode($data);

	}

	function updateUserThemeList($userName, $listId, $themeId, $type){

		global $connection;

		try {
			
			$userTableExists = $connection->prepare("SHOW TABLES LIKE :userName");
			$userTableExists->execute([":userName" => $userName]);

			$inList = 0;

			if ($userTableExists->rowCount() < 1) {

				if ($type == 0) {
					
					$createTable = $connection->prepare("
						CREATE TABLE `" . $userName . "`(
							position INT,
							idList VARCHAR(10) NOT NULL,
							idTheme VARCHAR(10) NOT NULL,
							FOREIGN KEY (idList) REFERENCES " . $GLOBALS["PDO_ARTISTS_TABLE"] . " (id) ON DELETE CASCADE ON UPDATE CASCADE,
							FOREIGN KEY (idTheme) REFERENCES " . $GLOBALS["PDO_THEMES_TABLE"] . " (id) ON DELETE CASCADE ON UPDATE CASCADE,
							PRIMARY KEY(position)
						)");
					$createTable->execute();

					$userTableExists = $connection->prepare("SHOW TABLES LIKE :userName");
					$userTableExists->execute([":userName" => $userName]);

				}

			}

			if ($userTableExists->rowCount() > 0) {
				
				$tableLength = $connection->prepare("SELECT * FROM `" . $userName . "`");
				$tableLength->execute();

				$themeInTable = $connection->prepare("SELECT * FROM `" . $userName . "` WHERE(idList = :idList) AND (idTheme = :idTheme)");
				$themeInTable->execute([":idList" => $listId, ":idTheme" => $themeId]);

				if ($themeInTable->rowCount() > 0) {

					$inList = 1;
					
					if ($type == 0) {

						$position = $themeInTable->fetch(PDO::FETCH_ASSOC)['position'];

						$deleteTheme = $connection->prepare("DELETE FROM `" . $userName . "` WHERE(idList = :idList) AND (idTheme = :idTheme)");
						$deleteTheme->execute([":idList" => $listId, ":idTheme" => $themeId]);

						$fillPosition = $connection->prepare("UPDATE `" . $userName . "` set position = position - 1 WHERE(position > " . $position . ")");
						$fillPosition->execute();

						if ($tableLength->rowCount() == 1) {

							$dropTable = $connection->prepare("DROP TABLE `" . $userName  . "`");
							$dropTable->execute();

						}

					}

				}
				else if ($type == 0){

					$newTheme = $connection->prepare("INSERT INTO `" . $userName . "` VALUES(:position,:idList,:idTheme)");
					$newTheme->execute([":position" => $tableLength->rowCount() + 1, ":idList" => $listId, ":idTheme" => $themeId]);

				}

			}

		}catch (Exception $e) {echo "ERR_QUERY: " . $e->getMessage();}

		$connection = null;

		if ($type == 1) {
			
			echo $inList;

		}

	}

	function reorderUserList($userName, $newOrder){

		global $connection;

		try {
			
			$clearTable = $connection->prepare("DELETE FROM `" . $userName . "`");
			$clearTable->execute();

			$position = 1;

			foreach ($newOrder as $element) {
				
				$newData = $connection->prepare("INSERT INTO `" . $userName . "` VALUES(" . $position . ", '" . clearData($element['listId']) . "', '" . clearData($element['themeId']) . "')");
				$newData->execute();

				$position = $position + 1;

			}

		}catch (Exception $e) {echo "ERR_QUERY: " . $e->getMessage();}

	}

	function getUserThemeList($userName){

		global $connection;

		try {
			
			$userThemeExist = $connection->prepare("SHOW TABLES LIKE '" . $userName . "'");
			$userThemeExist->execute();

			$userThemeListData = array();

			if ($userThemeExist->rowCount() > 0) {
				
				$userThemeList = $connection->prepare("SELECT * FROM `" . $userName . "`");
				$userThemeList->execute();

				if ($userThemeList->rowCount() > 0) {

					$themesInformation = $userThemeList->fetchAll(PDO::FETCH_ASSOC);

					foreach ($themesInformation as $themeInformation) {

						$themeData = $connection->prepare("SELECT * FROM " . $GLOBALS["PDO_THEMES_TABLE"] . " WHERE(id = :idTheme) AND (idArtist = :idArtist)");
						$themeData->execute([":idTheme" => $themeInformation['idTheme'], ":idArtist" => $themeInformation['idList']]);

						if ($themeData->rowCount() > 0) {

							$themeData = $themeData->fetch(PDO::FETCH_ASSOC);
							
							$artistData = $connection->prepare("SELECT * FROM " . $GLOBALS["PDO_ARTISTS_TABLE"] . " WHERE(id = :idArtist)");
							$artistData->execute([":idArtist" => $themeData['idArtist']]);

							if ($artistData->rowCount() > 0) {

								$artistData = $artistData->fetch(PDO::FETCH_ASSOC);
							
								$userThemeListData[] = array('id' => $themeData['id'], 'name' => $themeData['name'], 'flag' => $themeData['flag'], 'lyricsId' => $themeData['id'], 'lyricsTranslateId' => "sp-" . $themeData['id'], 'themeListId' => $themeData['idArtist'], 'authorName' => $artistData['name'], 'authorSurame' => $artistData['surname']);

							}

						}
						else{

							$deleteTheme = $connection->prepare("DELETE FROM `" . $userName . "` WHERE(id = :idTheme) AND (idArtist = :idArtist)");
							$deleteTheme->execute([":idTheme" => $themeInformation['idTheme'], ":idArtist" => $themeInformation['idList']]);

						}

					}

				}

			}

			echo json_encode($userThemeListData);

		}catch (Exception $e) {echo "ERR_QUERY: " . $e->getMessage();}

		$connection = null;

	}

	function updateUserData($userName, $attribute){

		global $connection;

		$value;

		try {
			
			if ($attribute != "avatar") {

				global $value;
				
				$value = clearData($_POST['value']);
				$value = ($attribute == 'password') ? md5($value) : $value;

				if ($attribute == "userName") {

					session_start();

					$_SESSION["activeUser"] = "@" . $value;

					$userThemeList = $connection->prepare("SELECT * FROM `" . "@" . $userName . "`");
					$userThemeList->execute();

					if (file_exists("../media/image/users/" . $userName . ".png")) {
						
						rename("../media/image/users/" . $userName . ".png", "../media/image/users/" . $value . ".png");

					}

					if ($userThemeList->rowCount() > 0) {

						$updateUserThemes = $connection->prepare("RENAME TABLE `" . "@" . $userName . "` to `@" . $value . "`");
						$updateUserThemes->execute();

					}

				}

				$updateData = $connection->prepare("UPDATE " . $GLOBALS["PDO_USERS_TABLE"] . " SET " . $attribute . " = :value WHERE(userName = '" . $userName . "')");
				$updateData->execute([":value" => $value]);

			}
			else{

				global $value;

				$value = $userName;

				if (isset($_FILES['value']['tmp_name'])) {
								
					move_uploaded_file($_FILES['value']['tmp_name'], '../media/image/users/' . $value . ".png");

				}	

			}

		}catch (Exception $e) {echo "ERR_QUERY: " . $e->getMessage();}

	}

/////////////
//PAGE PAGE//
/////////////

	if(isset($_POST['sessionOff'])){

		sessionOff();

	}

	if(isset($_GET['getArtistData'])){

		getArtistData();

	}

	if(isset($_POST['deleteArtist'])){

		$artistId = clearData($_POST['deleteArtist']['artistId']);
		$themeId = clearData($_POST['deleteArtist']['themeId']);

		deleteArtist($artistId, $themeId);

	}

	if(isset($_POST['setArtistData'])){

		$type = clearData($_POST['setArtistData']);
		$idOld = clearData($_POST['idOld']);
		$id = clearData($_POST['id']);
		$name = clearData($_POST['name']);
		$surname = clearData($_POST['surname']);
		$descriptionId = clearData($_POST['descriptionId']);
		$themeListId = clearData($_POST['themeListId']);

		setArtistData($type, $idOld, $id, $name, $surname, $descriptionId, $themeListId);

	}

	if(isset($_POST['deleteTheme'])){

		$listId = clearData($_POST['deleteTheme']['listId']);
		$themeId = clearData($_POST['deleteTheme']['themeId']);

		deleteTheme($listId, $themeId);

	}

	if(isset($_POST['setThemeData'])){

		$type = clearData($_POST['setThemeData']);
		$artistId = clearData($_POST['artistId']);
		$idOld = clearData($_POST['idOld']);
		$id = clearData($_POST['id']);
		$name = clearData($_POST['name']);
		$flag = clearData($_POST['flag']);
		$lyricsId = clearData($_POST['lyricsId']);
		$lyricsTranslateId = clearData($_POST['lyricsTranslateId']);

		setThemeData($type, $artistId, $idOld, $id, $name, $flag, $lyricsId, $lyricsTranslateId);

	}

	if(isset($_GET['themeListsId'])){

		themeListsId();

	}

	if(isset($_POST['themeListExist'])){

		$themeListId = clearData($_POST['themeListExist']);

		searchThemeList($themeListId);

	}

	if(isset($_POST['themeListId'])){

		$artistId = clearData($_POST['themeListId']);

		searchThemeListId($artistId);

	}

	if(isset($_POST['updateStadistics'])){

		$table = ($_POST['mode'] == "artist") ? $GLOBALS["PDO_ARTISTS_TABLE"] : $GLOBALS["PDO_THEMES_TABLE"];
		$attrId = clearData($_POST['attrId']);
		$id = clearData($_POST['id']);

		updateStadistics($table, $attrId, $id);

	}

	if(isset($_GET['getStats'])){

		getStats();

	}

//////////////////
//FUNCTIONS PAGE//
//////////////////

	function sessionOff(){

		session_start();

		session_destroy();

		header("Location:../html/index.php");

	}

	function getArtistData(){

		global $connection;

		$artistsDataQuery = $connection->prepare("SELECT * FROM " . $GLOBALS["PDO_ARTISTS_TABLE"]);
		$artistsDataQuery->execute();
		$artistsData = array();

		$artistsDataQuery = $artistsDataQuery->fetchAll(PDO::FETCH_ASSOC);

		foreach ($artistsDataQuery as $artistData) {
			
			$themesDataQuery = $connection->prepare("SELECT * FROM " . $GLOBALS["PDO_THEMES_TABLE"] . " WHERE(idArtist = '" . $artistData['id'] . "')");
			$themesDataQuery->execute();
			$themesData = array();

			$themesDataQuery = $themesDataQuery->fetchAll(PDO::FETCH_ASSOC);

			foreach ($themesDataQuery as $themeData) {
				
				$themesData[] = array('id' => $themeData['id'], 'name' => $themeData['name'], 'flag' => $themeData['flag'], 'lyricsId' => $themeData['id'], 'lyricsTranslateId' => 'sp-' . $themeData['id'], 'themeListId' => $themeData['idArtist']);

			}

			$artistsData[] = array('id' => $artistData['id'], 'name' => $artistData['name'], 'surname' => $artistData['surname'], 'descriptionId' => $artistData['id'], 'themeList' => $themesData);

		}

		echo(json_encode($artistsData));

	}

	function deleteArtist($artistId, $themeId, $updateTable = 1){

		global $connection;

		$deleteFiles = array(
			array('route' => '../html/description/', 'fileName' => '', 'extension' => '.html')
		);

		try {
			
			$artistsDataQuery = $connection->prepare("SELECT * FROM " . $GLOBALS["PDO_ARTISTS_TABLE"] . " WHERE(id = '" . $artistId . "')");
			$artistsDataQuery->execute();
			$artistsData = $artistsDataQuery->fetch(PDO::FETCH_ASSOC);

			$themesDataQuery = $connection->prepare("SELECT * FROM " . $GLOBALS["PDO_THEMES_TABLE"] . " WHERE(idArtist = '" . $artistId . "')");
			$themesDataQuery->execute();

			$themesDataQuery = $themesDataQuery->fetchAll(PDO::FETCH_ASSOC);

			foreach ($deleteFiles as $file) {

				$file = $file["route"] . $file["fileName"] . $artistsData['id'] . $file["extension"];

				if (file_exists($file)) {
					
					unlink($file);

				}

			}

			if ($updateTable == 1) {
				
				foreach ($themesDataQuery as $themesData) {
				
					deleteTheme($themesData['idArtist'], $themesData['id']);

				}

				$deleteArtist = $connection->prepare("DELETE FROM " . $GLOBALS["PDO_ARTISTS_TABLE"] . " WHERE(id = '" . $artistId . "')");
				$deleteArtist->execute();

			}

		}catch (Exception $e) {echo "ERR_QUERY: " . $e->getMessage();}

	}

	function setArtistData($type, $idOld, $id, $name, $surname, $descriptionId, $themeListId){

		global $connection;

		$deleteFiles = array(
			array('condition' => $descriptionId, 'route' => '../html/description/', 'fileName' => 'descriptionId', 'extension' => '.html')
		);

		$updateFiles = array(
			array('requestName' => 'descriptionFile', 'route' => '../html/description/', 'fileName' => $id, 'extension' => '.html')
		);

		try {
			
			if ($type == 0) {

				$themeListId = ($themeListId == $idOld) ? $id : $themeListId;
				
				$updateData = $connection->prepare("UPDATE " . $GLOBALS["PDO_ARTISTS_TABLE"]. " SET id = :id, name = :name, surname = :surname, themeList = :themeList WHERE(id = '" . $idOld . "')");
				$updateData->execute([":id" => $id, ":name" => $name, ":surname" => $surname, ":themeList" => $themeListId]);

			}

			if ($type == 1) {
				
				$newData = $connection->prepare("INSERT INTO " . $GLOBALS["PDO_ARTISTS_TABLE"]. " VALUES(:id, :name, :surname, :themeList)");
				$newData->execute([":id" => $id, ":name" => $name, ":surname" => $surname, ":themeList" => $themeListId]);

			}

		}catch (Exception $e) {echo "ERR_QUERY: " . $e->getMessage();}

		foreach ($updateFiles as $file) {

			$fileOldName = $file['route'] . $idOld . $file['extension'];
			$fileNewName = $file['route'] . $file['fileName'] . $file['extension'];

			if (isset($_FILES[$file['requestName']]['tmp_name'])) {
							
				move_uploaded_file($_FILES[$file['requestName']]['tmp_name'], $file['route'] . $file['fileName'] . $file['extension']);

			}
			else if(!isset($_FILES[$file['requestName']]['tmp_name']) && file_exists($fileOldName)) {
					    
				rename($fileOldName, $fileNewName);

			}

		}

	}

	function deleteTheme($listId, $themeId, $updateTable = 1){

		global $connection;

		$deleteFiles = array(
			array('route' => '../html/lyrics/', 'fileName' => '', 'extension' => '.html'), 
			array('route' => '../html/lyrics/', 'fileName' => 'sp-', 'extension' => '.html'),
			array('route' => '../media/image/covers/', 'fileName' => '', 'extension' => '.png'),
			array('route' => '../media/audio/themes/', 'fileName' => '', 'extension' => '.mp3')
		);

		try {
			
			$themesDataQuery = $connection->prepare("SELECT * FROM " . $GLOBALS["PDO_THEMES_TABLE"] . " WHERE(id = :themeId) AND (idArtist = :listId)");
			$themesDataQuery->execute([":themeId" => $themeId, ":listId" => $listId]);

			$themesData = $themesDataQuery->fetch(PDO::FETCH_ASSOC);

			if ($updateTable == 1) {
				
				$deleteTheme = $connection->prepare("DELETE FROM " . $GLOBALS["PDO_THEMES_TABLE"] . " WHERE(id = :themeId) AND (idArtist = :listId)");
				$deleteTheme->execute([":themeId" => $themeId, ":listId" => $listId]);

			}

			foreach ($deleteFiles as $file) { /*Elimina todos los archivos relacionados con un tema*/

				$file = $file["route"] . $file["fileName"] . $themesData['id'] . $file["extension"];

				if (file_exists($file)) {
					
					unlink($file);

				}

			}

		}catch (Exception $e) {echo "ERR_QUERY: " . $e->getMessage();}

	}

	function setThemeData($type, $artistId, $idOld, $id, $name, $flag){

		global $connection;

		$updateFiles = array(
			array('requestName' => 'flagFile', 'route' => '../media/image/flags/', 'fileName' => $flag, 'extension' => '.png'),
			array('requestName' => 'lyricsFile', 'route' => '../html/lyrics/', 'fileName' => $id, 'extension' => '.html'),
			array('requestName' => 'lyricsTranslateFile', 'route' => '../html/lyrics/sp-', 'fileName' => $id, 'extension' => '.html'),
			array('requestName' => 'pictureFile', 'route' => '../media/image/covers/', 'fileName' => $id, 'extension' => '.png'),
			array('requestName' => 'audioFile', 'route' => '../media/audio/themes/', 'fileName' => $id, 'extension' => '.mp3')
		);

		try {
			
			if ($type == 0) {

				$updateData = $connection->prepare("UPDATE " . $GLOBALS["PDO_THEMES_TABLE"] . " SET id = :id, idArtist = :idArtist, name = :name, flag = :flag WHERE(id = '" . $idOld . "')");
				$updateData->execute([":id" => $id, ":idArtist" => $artistId, ":name" => $name, ":flag" => $flag]);

			}

			if ($type == 1) {	/*Para añadir un nuevo tema*/
			
				$newData = $connection->prepare("INSERT INTO "  . $GLOBALS["PDO_THEMES_TABLE"] . " 
												 VALUES (:id, :idArtist, :name, :flag)");
				$newData->execute([":id" => $id, ":idArtist" => $artistId, ":name" => $name, ":flag" => $flag]);

			}

		}catch (Exception $e) {echo "ERR_QUERY: " . $e->getMessage();}

		foreach ($updateFiles as $file) {

			$fileOldName = $file['route'] . $idOld . $file['extension'];
			$fileNewName = $file['route'] . $file['fileName'] . $file['extension'];

			if (isset($_FILES[$file['requestName']]['tmp_name'])) {
							
				move_uploaded_file($_FILES[$file['requestName']]['tmp_name'], $file['route'] . $file['fileName'] . $file['extension']);

			}
			else if(!isset($_FILES[$file['requestName']]['tmp_name']) && file_exists($fileOldName)) {
					    
				rename($fileOldName, $fileNewName);

			}

		}

	}

	function themeListsId(){

		global $connection;

		try {
			
			$listIdsQuery = $connection->prepare("SELECT DISTINCTROW idArtist FROM " . $GLOBALS["PDO_THEMES_TABLE"]);
			$listIdsQuery->execute();
			$listIdsQuery = $listIdsQuery->fetchAll(PDO::FETCH_ASSOC);

			$listIds = array();

			foreach ($listIdsQuery as $listId) {
				
				$listIds[] = $listId['idArtist'];

			}

			echo(json_encode($listIds));

		}catch (Exception $e) {echo "ERR_QUERY: " . $e->getMessage();}

	}

	function searchThemeList($themeListId){

		global $connection;

		try {
			
			$themeListId = $connection->prepare("SELECT * FROM "  . $GLOBALS["PDO_THEMES_TABLE"] . " WHERE(idArtist = :themeListId)");
			$themeListId->execute([":themeListId" => $themeListId]);

			if ($themeListId->rowCount() > 0){

				echo "1";

			}
			else{

				echo "0";

			}

		}catch (Exception $e) {echo "ERR_QUERY: " . $e->getMessage();}

	}

	function searchThemeListId($artistId){

		global $connection;

		try {
			
			$themeListIdQuery = $connection->prepare("SELECT * FROM "  . $GLOBALS["PDO_ARTISTS_TABLE"] . " WHERE(id = :artistId)");
			$themeListIdQuery->execute([":artistId" => $artistId]);
		
			$themeListId = "";

			if ($themeListIdQuery->rowCount() > 0){

				$themeListId = $themeListIdQuery->fetch(PDO::FETCH_ASSOC)["themeList"];
			}

			echo $themeListId;

		}catch (Exception $e) {echo "ERR_QUERY: " . $e->getMessage();}

		$connection = null;

	}

	function updateStadistics($table, $attrId, $id){

		global $connection;

		try {
			
			$updateData = $connection->prepare("UPDATE " . $table . " SET " . $attrId . " = " . $attrId . " + 1 WHERE(id = '" . $id . "')");
			$updateData->execute();

		} catch (Exception $e) {echo "ERR_QUERY: " . $e->getMessage();}

		$connection = null;

	}

	function getStats(){

		global $connection;

		$statsData = array();

		try {
			
			$artistViews = $connection->prepare("SELECT * FROM "  . $GLOBALS["PDO_ARTISTS_TABLE"] . " ORDER BY views DESC LIMIT 3");
			$artistViews->execute();

			$statsData[] = $artistViews->fetchAll(PDO::FETCH_ASSOC);

			$themeViews = $connection->prepare("SELECT * FROM "  . $GLOBALS["PDO_THEMES_TABLE"] . " ORDER BY views DESC LIMIT 3");
			$themeViews->execute();

			$statsData[] = $themeViews->fetchAll(PDO::FETCH_ASSOC);

			$themeFavs = $connection->prepare("SELECT * FROM "  . $GLOBALS["PDO_THEMES_TABLE"] . " ORDER BY favs DESC LIMIT 3");
			$themeFavs->execute();

			$statsData[] = $themeFavs->fetchAll(PDO::FETCH_ASSOC);

		} catch (Exception $e) {echo "ERR_QUERY: " . $e->getMessage();}

		$connection = null;

		print_r(json_encode($statsData));

	}

?>