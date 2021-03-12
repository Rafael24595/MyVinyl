//RECURSOS => Linea 12
//FUNCIONES DE CARGA => Linea 75
//FUNCIONES DE ELEMENTOS EN PANTALLA => Linea 172
//FUNCIONES DE ADMINISTRACION => Linea 629
//FUNCIONES DEL MENU => Linea 1397
//FUNCIONES DE TRATAMIENTO DE DATOS EN SERVIDOR => Linea 1593
//FUNCIONES DE TRATAMIENTO DE DATOS => Linea 2168
//FUNCIONES DE SESION  => Linea 2444

////////////
//RECURSOS//
////////////

	var SERVER_ROUTE = "../php/functions.php";

	var SELECT_PLAYLIST_THEME = -2;
	var STOP_PLAYLIST_THEME = -1;
	var STOP_PLAYLIST_THEME_FROM_VINYL = -3;
	var RANDOM_PLAYLIST_THEME = -4;
	var PAUSE_PLAYLIST_THEME = -5;

	var AUTO_PLAYLIST_MODE = 1;
	var REPLAY_PLAYLIST_MODE = 2;
	var RANDOM_PLAYLIST_MODE = 3;
	var NEXT_PLAYLIST_MODE = 4;
	var PREV_PLAYLIST_MODE = 5;
	var SET_DEFAULT_USER_CONFIG = -1;

	var ACCS_MOVE_LEFT_KEY = 100;
	var ACCS_MOVE_RIGHT_KEY = 102;
	var ACCS_MOVE_UP_KEY = 104;
	var ACCS_MOVE_DOWN_KEY = 98;
	var ACCS_ACCEPT_KEY = 13;
	var ACCS_BACK_KEY = 8;
	var ACCS_ENABLE_KEY = 79;
	var ACCS_MENU_KEY = 77;
	var ACCS_LIGHT_KEY = 76;
	var ACCS_FAV_KEY = 70;
	var ACCS_ESC_KEY = 27;
	var ACCS_CLOSE_KEY = 67;

	var ACCS_PLAY_KEY = 87;
	var ACCS_PREV_KEY = 81;
	var ACCS_NEXT_KEY = 69;
	var ACCS_RANDOM_KEY = 65;
	var ACCS_AUTO_KEY = 83;
	var ACCS_REPEAT_KEY = 68;

	var valueBarDefault = "10px";
	var valueBackgDefault = "60px";
	var valueBarActive = "5px";
	var valueBackgActive = "45px";

	var showMenu = false;
	var lightOn = true;
	var darkLoad = false;
	var darkMode = {"true":"", "false":"dark"};

	var userName;
	var isAdmin;
	var showArtistValue = "";

	var showConfirmationWindowTheme = 0;
	var showConfirmationWindowArtist = 0;

	var artistList = new ArtistList();
	var artistFilterList = new ArtistList();

	var repassword = 0;
	var repasswordValue = 0;

	var keepMouse;
	var mousePositionY = 0;
	var offsetY = 0;
	var mouseDownElement = "";
	var autoScrollEvent;

	var playListThemeAuto = 0;
	var playListThemeRepeat = 0;
	var playListThemeRandom = 0;
	var playList = [];

	var accesibilityKeys = false;
	var lastContainerElement = null;

	function getThemeManagerValues(themeData = ""){

		if (themeData != "") {

			return [

			   [{"tag": "input", "type": "text", "id": "newId", "name": "newId","valueDefault": themeData.id, "labelText": "Id"},
				{"tag": "input", "type": "text", "id": "newName", "name": "newName", "valueDefault": themeData.name, "labelText": "Nombre"},
				{"tag": "input", "type": "text", "id": "newFlag", "name": "newFlag", "valueDefault": themeData.flag, "labelText": "Bandera"},
				{"tag": "input", "type": "file", "id": "newLyricsFile", "name": "newLyricsFile", "valueDefault": themeData.lyricsId, "labelText": "Letra"},
				{"tag": "input", "type": "file", "id": "newLyricsTranslateFile", "name": "newLyricsTranslateFile", "valueDefault": themeData.lyricsTranslateId, "labelText": "Letra traducida"},
				{"tag": "input", "type": "file", "id": "newPicture", "name": "newPicture", "valueDefault": "", "labelText": "Carátula"},
				{"tag": "input", "type": "file", "id": "newTheme", "name": "newTheme", "valueDefault": "", "labelText": "Tema"}],

			   [{"text": "Modificar", "function": modifyTheme},
				{"text": "Cancelar", "function": displayThemeData}]

			];

		}
		else{

			return [

			   [{"tag": "input", "type": "text", "id": "artistId", "name": "artistId", "labelText": "Id Artista"},
				{"tag": "input", "type": "text", "id": "newId", "name": "newId","labelText": "Id"},
				{"tag": "input", "type": "text", "id": "newName", "name": "newName", "labelText": "Nombre"},
				{"tag": "input", "type": "text", "id": "newFlag", "name": "newFlag", "labelText": "Bandera"},
				{"tag": "input", "type": "file", "id": "newLyricsFile", "name": "newLyricsFile", "labelText": "Letra"},
				{"tag": "input", "type": "file", "id": "newLyricsTranslateFile", "name": "newLyricsTranslateFile", "labelText": "Letra traducida"},
				{"tag": "input", "type": "file", "id": "newPicture", "name": "newPicture", "labelText": "Carátula"},
				{"tag": "input", "type": "file", "id": "newTheme", "name": "newTheme", "valueDefault": "", "labelText": "Tema"}],

			   [{"text": "Nuevo", "function": newTheme},
				{"text": "Cancelar", "function": displayThemeData}]

			];

		}

	}

//////////////////////
//FUNCIONES DE CARGA//
//////////////////////

	window.onload=function () {

		sessionOn();
		
		loadArtist();

		showArtist(artistList.artists);

		(localStorage.getItem(userName + "KeyControl") == 1) ? enableAccesibilityKeys() : "" ;

		$(document.body).on("keypress", accesibilityKeysActivation);
		$(document.body).on("keyup",lightModeKey);

	}

	function loadArtist(){

		artistList = new ArtistList();

		$.ajax({

			type: "GET",

			url: SERVER_ROUTE,

			async: false,

			data: {getArtistData: ""},

			success: function(data){

				var artistsData = JSON.parse(data);

				if (artistsData != null) {

					Object.keys(artistsData).forEach(artist =>{

						artistList.newArtist(artistsData[artist].id, artistsData[artist].name, artistsData[artist].surname, artistsData[artist].descriptionId, artistsData[artist].themeList);

					});

				}

				updateArtistMenu(userName);

			}

		});

	}

	//Carga de lista de favoritos

	function loadUserThemeList(userName){

		var userArtist;

		$.ajax({

			type: "GET",

			url: SERVER_ROUTE,

			async: false,

			data: {getUserThemeListData: userName},

			success: function(data){

				var userThemeList = "";

				if (data != "") {

					userThemeList = JSON.parse(data);

				}

				artistList.newArtist(userName, userName, "", "", userThemeList);

			}

		});

	}

//////////////////////////////
//FUNCIONES DE ACCESIBILIDAD//
//////////////////////////////

function accesibilityKeysActivation(){

	(event.shiftKey && event.keyCode == ACCS_ENABLE_KEY) ? enableAccesibilityKeys() : "" ;

}

function enableAccesibilityKeys(active = null, events = null, classes = null){

		var eventsToModify = (events == null) ? [{"function":menuOnKey,"type":"keyup"},{"function":sessionOffKey,"type":"keypress"},{"function":middleContainersMoveKey,"type":"keyup"},{"function":mediaControlKey,"type":"keyup"}] : events ;
		var classesToModify = (classes == null) ? ["selectContainer","selectContainerElement"] : classes ;
		var enable = ((active != null && active == false )|| accesibilityKeys == false) ? false : true;	
		var message = (active == null && events == null) ? (enable == false) ? "Control por teclado habilitado" : "Control por teclado deshabilitado" : null ;

		eventsToModify.forEach(eventToModify=>{

			if (enable == false) {

				$(document.body).off(eventToModify.type, eventToModify.function).on(eventToModify.type, eventToModify.function);

			}
			else{

				$(document.body).off(eventToModify.type, eventToModify.function);

			}

		});

		if (enable == true) {

			classesToModify.forEach(classToModify=>{

				$("." + classToModify).removeClass(classToModify);

			});

			$(".selectRow").removeClass("selectRow");
			$(".clicked").removeClass("clicked");
			$(".selectOption").removeClass("selectOption");

			$(window).off("keyup", accesibilityMenuOption);

		}
		else{

			if ($("li ul li.rows.cursor.active").length > 0) {

				$("li").has("ul li.rows.cursor.active").addClass("selectOption clicked")

			}

			(showMenu == true) ? $(window).on("keyup", accesibilityMenuOption) : "" ; 

		}

		if (message != null) {

			accesibilityKeys = !enable;

			displayNotification(message);

			localStorage.setItem(userName + "KeyControl", (enable == true) ? 0 : 1);

		}

	}

	function menuOnKey(){

		(event.keyCode == ACCS_MENU_KEY) ? menuOn() : "" ;

	}

	function lightModeKey(){

		(event.keyCode == ACCS_LIGHT_KEY) ? lightMode() : "" ;

	}

	function sessionOffKey(){

		(event.shiftKey && event.keyCode == ACCS_CLOSE_KEY) ? sessionOff() : "" ;

	}

	function ESCMenu(){

		(event.keyCode == ACCS_ESC_KEY) ? menuOn() : "" ;

	}

	function accesibilityMenuOption(event){

		var direction = (event.keyCode == ACCS_MOVE_UP_KEY) ? 1 : (event.keyCode == ACCS_MOVE_DOWN_KEY) ? -1 : (event.keyCode == ACCS_ACCEPT_KEY) ? 0 : null ;

		if (direction != null) {

			var allOptions = $("#menu ul li.menuOpt");
			var selectOption = $("#menu ul li.menuOpt.selectOption");
			var clickedElement = $("#menu ul li.menuOpt.clicked");
			var allSelectOptionOptions = $("#menu ul li.menuOpt.selectOption ul li.rows");
			var selectSelectOptionOptions = $("#menu ul li.menuOpt.selectOption ul li.rows.selectRow");
			
			var element = (clickedElement.length == 0 || selectSelectOptionOptions.length == 0) ? selectOption : selectSelectOptionOptions;
			var elementsClass = (clickedElement.length == 0) ? ".menuOpt" : ".rows";
			var elementClass = (direction == 0) ? "" : (clickedElement.length == 0) ? "selectOption" : "selectRow";
			var clickTrigger = (clickedElement.length == 0 || selectSelectOptionOptions.length == 0) ? $(element).find("span.bigOption") : $(element);
			clickTrigger = ($(element).hasClass("menuSelectorArrow") == true) ? $(element).children(0) : $(clickTrigger);

			if (direction != 0 && (selectOption.length == 0 || clickedElement.length != 0 && selectSelectOptionOptions.length == 0)) {

				if (selectOption.length == 0) {

					(direction == 1) ? $(allOptions[allOptions.length - 1]).addClass("selectOption") : $(allOptions[0]).addClass("selectOption");

				}
				else{

					(direction == 1) ? $(allSelectOptionOptions[allSelectOptionOptions.length - 1]).addClass("selectRow") : $(allSelectOptionOptions[0]).addClass("selectRow");

				}

			}
			else{

				$(element).removeClass(elementClass);

				if (direction == 1) {

					$(element).prev(elementsClass).addClass(elementClass);	

				}

				if (direction == 0) {

					if (clickedElement.length == 0) {

						$(element).addClass("clicked");

					}
					else{

						$(element).removeClass("clicked");

					}

					$(clickTrigger).click();

				}

				if (direction == -1) {console.log(element);

					$(element).next(elementsClass).addClass(elementClass);

				}

			}

		}

	}

	function middleContainersMoveKey(event){

		var direction = (event.keyCode == ACCS_MOVE_UP_KEY) ? 1 : (event.keyCode == ACCS_MOVE_DOWN_KEY) ? -1 : (event.keyCode == ACCS_MOVE_LEFT_KEY) ? 2 : (event.keyCode == ACCS_MOVE_RIGHT_KEY) ? -2 : (event.keyCode == ACCS_ACCEPT_KEY) ? 0 : (event.keyCode == ACCS_BACK_KEY) ? 9 : (event.keyCode == ACCS_FAV_KEY) ? 8 : null ;

		if (direction != null) {

			var allOptions = $("#middle > div:visible");
			var selectOption = $("#middle > div.selectContainer");

			if (selectOption.length == 0) {

				(direction == 2) ? $(allOptions[allOptions.length - 1]).addClass("selectContainer") : $(allOptions[0]).addClass("selectContainer");

			}
			else{

				if (direction == -2 || direction == 2) {

					$(selectOption).removeClass("selectContainer");
					lastContainerElement = null;
					$(".selectContainerElement").removeClass("selectContainerElement");

					if (direction == 2) {

						$(selectOption).prev().not(":hidden").addClass("selectContainer");	

					}

					if (direction == -2) {

						$(selectOption).next().not(":hidden").addClass("selectContainer");

					}

				}
				else{

					middleContainerElementsMoveKey($(selectOption).attr("id"), direction);

				}

			}

		}

	}

	function middleContainerElementsMoveKey(container, direction){

		var leftElements = [$("#left img#flag")[0], $("#left iframe#lyrics")[0]];
		var centreElements = []; $("#centre img.editPencil").each(function(){centreElements.push($(this)[0])});
		var rightElements = [$("#right img#vinylSmall")[0], $("#right div#buttonsNavigation button")[0], $("#right div#buttonsNavigation button")[1], $("#right div.theme:eq(0) img")[0], $("#right div.theme:eq(1) img")[0], $("#right div.theme:eq(2) img")[0]];

		var allOptions = (container == "left") ? leftElements : (container == "centre") ? centreElements : (container == "right") ? rightElements : "" ;
		var selectOption = $("#" + container + " .selectContainerElement");

		if (selectOption.length == 0) {

			(lastContainerElement != null) ? $(lastContainerElement).addClass("selectContainerElement") : (direction == 1) ? $(allOptions[allOptions.length - 1]).addClass("selectContainerElement") : $(allOptions[0]).addClass("selectContainerElement");

		}
		else{

			$(selectOption[0]).removeClass("selectContainerElement");

			if (direction == 1) {

				$(allOptions[allOptions.indexOf(selectOption[0]) - 1]).addClass("selectContainerElement");		

			}

			if (direction == 0) {

				$(selectOption).click();		

			}

			if (direction == 9 || direction == 8 && allOptions.indexOf(selectOption[0]) > 2) {

				if (direction == 9 ){

					$(selectOption).next().click();

				}

				if (direction == 8 ){
				
					$(selectOption).next().next().next().click();
				}		

			}

			if (direction == -1) {

				$(allOptions[allOptions.indexOf(selectOption[0]) + 1]).addClass("selectContainerElement");	

			}

			lastContainerElement = ($(selectOption).prop("tagName") != "BUTTON") ? selectOption[0] : null ;

		}

	}

	function mediaControlKey(event){

		if ("@" + $("#artistName").text() == userName) {

			(event.keyCode == ACCS_PLAY_KEY) ? $("#playButton").click() : (event.keyCode == ACCS_PREV_KEY) ? $("#prevButton").click() : (event.keyCode == ACCS_NEXT_KEY) ? $("#nextButton").click() : (event.keyCode == ACCS_RANDOM_KEY) ? $("#randomButton").click() : (event.keyCode == ACCS_AUTO_KEY) ? $("#autoButton").click() : (event.keyCode == ACCS_REPEAT_KEY) ? $("#replayButton").click() : "";

		}

	}

//////////////////////////////////////
//FUNCIONES DE ELEMENTOS EN PANTALLA//
//////////////////////////////////////

	function updateArtistMenu(userName, position = 0, openMenu = 0){

		var artistMenu = document.getElementById("artistMenu");
		var hiddenNameTime = 250;

		if (artistMenu.hasChildNodes()) {

			artistMenu.innerHTML = "";

		}

		loadUserThemeList(userName);

		var artistsId = Array.from(artistList.artists.keys());
		var length = (position + 5 > artistsId.length) ? artistList.artists.size : position + 5;
		var i = 0;

		/*for (var i = position; i < length; i++) {

			artist = artistList.artists.get(artistsId[i]);

			if (artist.themeList.length > 0) {	/*Si un artista no tiene temas no se ve reflejado en el menu*//*

				var newRow = document.createElement("li");

				newRow.className = "rows";
				newRow.rowFrom = "artist";
				newRow.artistId = artist.id;
				newRow.addEventListener("click", function(){openSub(); showArtistValue = this.artistId; setTimeout(function(){showArtist(artistList.artists, showArtistValue);}, 500);});

				if (artist.id == userName) {

					newRow.id = "userListRow";

					newRow.appendChild(document.createTextNode("Mi lista: " + clearUserName(userName)));

					artistMenu.insertAdjacentElement('afterbegin', newRow);

				}
				else{

					newRow.classList.add("hiddenName");

					newRow.appendChild(document.createTextNode("-" + artist.name + " " + artist.subname));

					artistMenu.appendChild(newRow);

					setTimeout(function(){newRow.classList.remove("hiddenName")}, hiddenNameTime);

					hiddenNameTime = hiddenNameTime + 1000;

				}

			}

		}*/

		artistList.artists.forEach(artist =>{

			if (i >= position && i < length || artist.name == userName) {

				if (artist.themeList.length > 0) {	/*Si un artista no tiene temas no se ve reflejado en el menu*/

					var newRow = document.createElement("li");

					newRow.className = "rows";
					newRow.classList.add("cursor");
					newRow.rowFrom = "artist";
					newRow.artistId = artist.id;
					newRow.addEventListener("click", function(){menuOn(); showArtistValue = this.artistId; setTimeout(function(){showArtist(artistList.artists, showArtistValue);}, 500);});
					(openMenu == 1) ? newRow.classList.add("active") : "" ;

					if (artist.id == userName) {

						newRow.id = "userListRow";

						newRow.appendChild(document.createTextNode("Mi lista: " + clearUserName(userName)));

						artistMenu.insertAdjacentElement('afterbegin', newRow);

					}
					else{

						newRow.classList.add("hiddenName");

						newRow.appendChild(document.createTextNode("-" + artist.name + " " + artist.subname));

						artistMenu.appendChild(newRow);

						setTimeout(function(){newRow.classList.remove("hiddenName")}, hiddenNameTime);

						hiddenNameTime = hiddenNameTime + 250;

					}

				}

			}

			i++;

		});

		var selector = document.createElement("li");
		var arrowLeftContainer = document.createElement("li");
		var arrowLeftIcon = document.createElement("img");
		var arrowRightContainer = document.createElement("li");
		var arrowRightIcon = document.createElement("img");

		arrowLeftContainer.className = "menuSelectorArrow";
		arrowRightContainer.className = "menuSelectorArrow";
		arrowLeftIcon.src = "../media/image/arrowLeft.png";
		arrowRightIcon.src = "../media/image/arrowRight.png";
		if(position - 5 >= 0){arrowLeftIcon.addEventListener("click", function(){updateArtistMenu(userName, position - 5, 1)}); arrowLeftIcon.classList.add("cursor")}
		if(length < artistList.artists.size){arrowRightIcon.addEventListener("click", function(){updateArtistMenu(userName, length, 1)}); arrowRightIcon.classList.add("cursor")}
		arrowLeftContainer.classList.add("rows");
		arrowLeftContainer.rowFrom = "artist";
		arrowRightContainer.classList.add("rows");
		arrowRightContainer.rowFrom = "artist";
		(openMenu == 1) ? [arrowLeftContainer.classList.add("active"), arrowRightContainer.classList.add("active"),] : "" ;

		arrowLeftContainer.appendChild(arrowLeftIcon);
		arrowRightContainer.appendChild(arrowRightIcon);
		artistMenu.appendChild(arrowLeftContainer);
		artistMenu.appendChild(arrowRightContainer);

	}

	function showArtist(list = -1, artistId = localStorage.getItem(userName + "LastTheme"), positionValue = parseInt(localStorage.getItem(userName + "LastThemePosition")), sameArtist = 0){

		showArtistValue = "";

		var data = (list == -1) ? $(event.target.parentElement).data("themeData") : "";

		var artistId = (list != -1) ? artistId : data.themeListId;
		var artist = (list != -1) ? list.get(artistId) : artistList.artists.get(artistId);
		var totalThemes = (artist) ? artist.themeList.length : 0;
		var position = (positionValue && positionValue < totalThemes) ? positionValue : (positionValue && positionValue > 2) ? positionValue - 3 : 0;

		var backPrintRatio = backPrintRatioCalculator(position);
		var nextPrintRatio = nextPrintRatioCalculator(totalThemes, position);

		if (!artist || totalThemes < 1 && artist.id != userName) {

			if (artist) {

				displayNotification("No se puede acceder al artista seleccionado");

			}

			artist = list.get("m_x");

			totalThemes = artist.themeList.length;
			backPrintRatio = backPrintRatioCalculator(position);
			nextPrintRatio = nextPrintRatioCalculator(totalThemes, position);

		}

		if (userName != undefined) {

			localStorage.setItem(userName + "LastTheme", artistId);
			localStorage.setItem(userName + "LastThemePosition", position);

		}

		if (totalThemes > 0 || artist.id == userName) {

			//Panel izquierdo//

				if (sameArtist == 0) {

					generateLeftContainer(artist, position);

			//Panel central

					generateCenterContainer(artist);
					
				}

			//Panel derecho

			generateRightContainer(artistId, artist, position, backPrintRatio, nextPrintRatio, totalThemes);

			var lyricsBox = document.getElementById("lyrics");
			var descBox = document.getElementById("description");
			var themes = document.getElementById("themes");

			if (darkLoad || lightOn == false) {

				(lyricsBox) ? lyricsBox.classList.add("dark") : "";
				(descBox) ? descBox.classList.add("dark") : "";
				(themes) ? themes.classList.add("dark") : "";

				darkLoad = false;

			}

		}
		else{

			displayNotification("Error en la carga del artista por defecto, seleccione otro desde el menu");

		}	

	}

	function generateLeftContainer(artist, position){

		var darkMode = {"true":"", "false":"dark"};

		var leftBox = document.getElementById("left");
		var lyricsBox = document.createElement("div");
		var flag = document.createElement("img");
		var deleteLyricsBox = document.getElementById("lyrics");
		var deleteFlag = document.getElementById("flag");

		if (deleteLyricsBox) {

			deleteLyricsBox.remove();
			(deleteFlag) ? document.getElementById("flag").remove() : "" ;

		}

		if (artist.themeList[position]) {

			lyricsBox = document.createElement("iframe");

			lyricsBox.src = "lyrics/" + artist.themeList[position].lyricsId + ".html";
			flag.id = "flag";
			(lightOn == false) ? flag.classList.add(darkMode[lightOn]) : "";
			flag.src = "../media/image/flags/" + artist.themeList[position].flag + ".png";
			flag.themeData = artist.themeList[position];
			flag.addEventListener("click", switchTraducction);

			leftBox.appendChild(flag);

		}

		lyricsBox.id = "lyrics";
		
		leftBox.appendChild(lyricsBox);

	}

	function generateCenterContainer(artist){

		var centerBox = document.getElementById("centre");
		var deleteDescBox = document.getElementById("description");
		var artistName = document.createElement("h2");

		if (deleteDescBox) {

			centerBox.innerHTML = "";

		}

		artistName.id = "artistName";
		artistName.appendChild(document.createTextNode((artist.name == userName) ? clearUserName(artist.name) : artist.name + " " + artist.subname));
		
		(artist.id != userName) ? updateStadistics("artist", "views", artist.id) : "";

		centerBox.appendChild(artistName);

		if (artist.name == userName) {

			showUserData();

		}
		else{

			var descBox = document.createElement("iframe");

			descBox.src = "description/" + artist.descriptionId + ".html";
			descBox.id = "description";

			centerBox.appendChild(descBox);

		}

		if (localStorage.getItem(userName + "WelcomeMessage") != 1 && userName != undefined && $("#rootsNotificationContainer").length == 0) {

			rootsNotification("WelcomeMessage", [
				"Hola <b>" + clearUserName(userName) + "</b> creo que no nos conocemos, o quizás es que alguien se ha comido las <i>'cookies'</i>; como sea, mi nombre es <b>root</b> y voy a ser tu asistente mientras estés por está pagina.",
				"Te voy a hacer un breve resumen de como funcina, que nunca está de más algo de información.",
				"El menú es una herramienta esencial para poder moverte por la página. Si pinchas en el siguiente icono este se desplegará. En él podras encontrar diferentes opciones para poder moverte por ella. ",
				$("<img>").attr({"src":"../media/image/logo.png"}).addClass("fakeControlButton"),
				$("<img>").attr({"src":"../media/image/light.png"}).addClass("fakeControlButton"),
				"-Reproducción:",
				[
				[$("<img>").attr({"src":"../media/image/covers/m_x-1.png"}).addClass("fakeControlButton"), "-Al pinchar en las carátulas se reproduce música."],
				[$("<img>").attr({"src":"../media/image/s-vinyl.png"}).addClass("fakeControlButton"), "-Los vinilos pausan(pequeño) y reinician(grande) el tema."],
				[$("<img>").attr({"src":"../media/image/fav.png"}).addClass("fakeControlButton"), "-La estrella de favoritos agrega el tema a tu lista de reproducción."],
				[$("<img>").attr({"src":"../media/image/flagPreview.png"}).addClass("fakeControlButton"), "-Haciendo click en la bandera podras ver la traduccion de la letra."],
				],

				"-Si lo que quieres es cerrar la sesión haz click en tu foto de perfil o en el nombre de usuario, que se encuentra debajo.",
				$("<img>").attr({"src":"../media/image/users/defaultProfile.png"}).addClass("fakeProfileData"),
			]);

		}

	}

	function generateRightContainer(artistId, artist, position, backPrintRatio, nextPrintRatio, totalThemes){

		var darkMode = {"true":"", "false":"dark"};

		var rightBox = document.getElementById("right");
		var themes = document.createElement("div");
		var cdSmall = document.createElement("img");
		var buttonsContainer = document.createElement("div");
		var backButton = document.createElement("button");
		var nextButton = document.createElement("button");
		var themesBox = document.createElement("div");
		var managerButton = document.createElement("button");
		var deleteThemesBox = document.getElementById("themes");

		if (deleteThemesBox) {

			deleteThemesBox.remove();

		}

		backButton.disabled = (position == backPrintRatio) ? true : false;
		backButton.style.cursor = (position == backPrintRatio) ? "default" : "pointer";
		nextButton.disabled =  (totalThemes == nextPrintRatio) ? true : false;
		nextButton.style.cursor =  (totalThemes == nextPrintRatio) ? "default" : "pointer";

		themes.id = "themes";
		cdSmall.id = "vinylSmall";
		(lightOn == false) ? cdSmall.classList.add(darkMode[lightOn]) : "";
		cdSmall.src = "../media/image/s-vinyl.png";
		themesBox.id = "themesBox";
		buttonsContainer.id = "buttonsNavigation";
		backButton.addEventListener("click", function(){showArtist(artistList.artists, this.artistId, this.backPrintRatio, 1)});
		backButton.appendChild(document.createTextNode("<=")); 
		backButton.backPrintRatio = backPrintRatio;
		backButton.artistId = artistId;
		nextButton.addEventListener("click", function(){showArtist(artistList.artists, this.artistId, this.nextPrintRatio, 1)}); 
		nextButton.appendChild(document.createTextNode("=>")); 
		nextButton.nextPrintRatio = nextPrintRatio;
		nextButton.artistId = artistId;
		managerButton.appendChild(document.createTextNode("Administrar temas")); 
		managerButton.id = "managerButton";
		managerButton.addEventListener("click", displayManagerWindow);

		rightBox.appendChild(themes);

		if (position >= 0) {

			themes.appendChild(cdSmall);
			themesBox.appendChild(buttonsContainer);
			buttonsContainer.appendChild(backButton);
			buttonsContainer.appendChild(nextButton);

		}

		themes.appendChild(themesBox);

		var themePosition = 0; /*'themePosition' indica la posicion en pantalla mientras que 'i' indica la posicion en lista*/

		for (var i = position; i < position + 3; i++) {

			var themeContainer = document.createElement("div");
			var theme = document.createElement("div");

			theme.className = "theme " + darkMode[lightOn];
			theme.position = themePosition;

			themesBox.appendChild(themeContainer);
			themeContainer.appendChild(theme);

			if (i < nextPrintRatio) {

				var blister = document.createElement("img");
				var cd = document.createElement("img");
				var name = document.createElement("p");
				var star = document.createElement("img");
				
				
				blister.className = "blister";
				blister.src = "../media/image/covers/" + artist.themeList[i].id + ".png";
				blister.themeData = artist.themeList[i];
				blister.addEventListener("click", playMusic);
				blister.addEventListener("mouseover", function(){displayNameState(1)});
				blister.addEventListener("mouseout", function(){displayNameState(0)});
				cd.src = "../media/image/m-vinyl.png";
				cd.className = "vinyl";
				cd.addEventListener("click", stopMusic);
				name.className = "themeName";
				name.appendChild(document.createTextNode(artist.themeList[i].name));
				name.addEventListener("mouseover", function(){displayNameState(1)});
				name.addEventListener("mouseout", function(){displayNameState(0)});
				star.className = "star";
				star.src = "../media/image/fav.png";
				star.addEventListener("click", starState);

				theme.appendChild(blister);
				theme.appendChild(cd);
				theme.appendChild(name);
				theme.appendChild(star);

			}

			themePosition++;

			if (artist.id == userName) {

				(star) ? star.src = "../media/image/favActive.png" : "";

			}
			else{

				starState(star, 1);	/*Comprueba el estado del boton de favoritos para el usuario*/

			}

		}

		if (isAdmin == 1) {

			themesBox.appendChild(managerButton);	/*El boton que permite entrar a la interfaz de edicion solo aparece si el usuario tiene privilegios de administrador*/

		}

	}

	function showUserData(){

		var darkMode = {"true":"", "false":"dark"};
		var darkModeButton = {"true":"", "false":"Dark"};

		var dataContainers = {"userDataContainerII":[{"id":"passwordPreview", "type":"text", "attribute":"password", "description":"Contraseña: ", "value": "***********"},
													 {"id":"emailPreview", "type":"text", "attribute":"email", "description":"Correo electrónico: ", "value": searchUserData(clearUserName(userName), "email")}],
							  "userDataContainerIII":showPlayList	 
													};

		$userDataContainer = $("<div></div>").appendTo("#centre").attr("id", "description");
		$editPencil = $("<img>").attr("src", "../media/image/pencil" + darkModeButton[lightOn] + ".png").addClass("editPencil").on("click", modifyUserData);

		$profileImage = $("<img>").attr({"src": "../media/image/users/" + searchUserData(clearUserName(userName), "avatar") + ".png", "id":"userProfileImagePreview", "attribute":"avatar"}).addClass(darkMode[lightOn]);
		$profileImageContainer = $("<div></div>").append($profileImage).append($editPencil.clone(true).addClass("editPencilImage"));
		$userNameTitle = $("<p></p>").append("<b>Nombre de usuario: </b>").addClass("titlePreviewName");
		$userName = $("<p></p>").append(clearUserName(userName)).addClass("dataPreviewName").attr({"id":"userNamePreview"}).data({"attribute":"userName"});
		$userNameContainer = $("<div></div>").addClass("packageContainer").addClass(darkMode[lightOn]).append($userNameTitle).append($userName).append($editPencil.clone(true).addClass("editPencilText"));
		$packageContainer = $("<div></div>").appendTo($userDataContainer).append($profileImageContainer).append($userNameContainer);

		$dataContainerI = $("<div></div>").appendTo($userDataContainer).append($packageContainer).attr("id", "userDataContainerI");

		for (var container in dataContainers){

			if (Array.isArray(dataContainers[container])) {

				$packageContainer = $("<div></div>").appendTo($userDataContainer);
				$dataContainer = $("<div></div>").appendTo($userDataContainer).append($packageContainer).attr("id", container);

				dataContainers[container].forEach(element =>{

					$elementTitle = $("<p></p>").append("<b>" + element.description + "</b>").addClass("titlePreview");
					$elementData = $("<p></p>").append(element.value).addClass("dataPreview").attr({"id":element.id}).data({"attribute":element.attribute});
					$elementContainer = $("<div></div>").addClass("packageContainer").addClass(darkMode[lightOn]).append($elementTitle).append($elementData).append($editPencil.clone(true).addClass("editPencilText"));

					$packageContainer.append($elementContainer);

				});

			}
			else{

				$dataContainer = $("<div></div>").appendTo($userDataContainer).attr("id", container);

				dataContainers[container](artistList.artists.get(userName));

			}

		}

	}

	function showPlayList(playList){

		var darkMode = {"true":"", "false":"dark"};
		var darkModeButton = {"true":"", "false":"Dark"};

		var position = 1;

		$packageContainer = $("<div></div>").appendTo("#userDataContainerIII");

		$trashCanContainer = $("<div></div>").addClass("trashCanContainer");
		$trashCanButton = $("<img>").attr({"src":"../media/image/trashCanCap" + darkModeButton[lightOn] + ".png"}).addClass("trashCanCap").appendTo($trashCanContainer);
		$trashCanButton = $("<img>").attr({"src":"../media/image/trashCanBody" + darkModeButton[lightOn] + ".png"}).addClass("trashCanBody").appendTo($trashCanContainer);

		$titleContainer = $("<div></div>").appendTo($packageContainer).attr({"id":"titleContainer"});
		$listTitle = $("<p></p>").append("Lista de reproduccion de <i>" + clearUserName(playList["name"]) + "</i>:").attr({"id":"playListTitle"}).appendTo($titleContainer);

		$controlsContainerPrimary = $("<div></div>").appendTo($packageContainer).attr({"id":"controlsContainerPrimary"}).addClass(darkMode[lightOn]);
		$playButton = $("<img>").attr({"src":"../media/image/play" + darkModeButton[lightOn] + ".png", "id":"playButton"}).addClass("controlButton").appendTo($controlsContainerPrimary).on("click", function(){clickedControlButtonAnimation($playButton); playPlayList(PAUSE_PLAYLIST_THEME)});
		$stopButton = $("<img>").attr({"src":"../media/image/stop" + darkModeButton[lightOn] + ".png", "id":"stopButton"}).addClass("controlButton").appendTo($controlsContainerPrimary).on("click", function(){clickedControlButtonAnimation($stopButton); playPlayList(STOP_PLAYLIST_THEME)});
		$prevButton = $("<img>").attr({"src":"../media/image/prev" + darkModeButton[lightOn] + ".png", "id":"prevButton"}).addClass("controlButton").appendTo($controlsContainerPrimary).on("click", function(){clickedControlButtonAnimation($prevButton); playMode(PREV_PLAYLIST_MODE)});
		$nextButton = $("<img>").attr({"src":"../media/image/next" + darkModeButton[lightOn] + ".png", "id":"nextButton"}).addClass("controlButton").appendTo($controlsContainerPrimary).on("click", function(){clickedControlButtonAnimation($nextButton); playMode(NEXT_PLAYLIST_MODE)});

		$themesContainer = $("<div></div>").appendTo($packageContainer).attr({"id":"themesContainer"}).addClass(darkMode[lightOn]);

		for(theme in playList["themeList"]){

			var themeData = playList["themeList"][theme];

			$themeContainer = $("<div></div>").appendTo($themesContainer).addClass("themeContainer " + darkMode[lightOn]).attr({"id":position + "-CP"}).on("mousedown", function(){mouseDownElementAction()}).on("mousemove", function(){pointerElementAction()}).on("mouseup", function(){clearTimeout(keepMouse)});
			$themePosition = $("<span></span>").append(position).addClass("themePosition");
			$authorName = $("<span></span>").append(themeData["authorName"] + " " + themeData["authorSurame"]).addClass("authorName").on("click", function(){showArtist()});
			$dash = $("<span></span>").append(" - ").addClass("dashTheme");
			$themeTitle = $("<span></span>").append(themeData["name"]).addClass("themeTitle").on("click", function(){playPlayList(SELECT_PLAYLIST_THEME)});
			$dataPackage = $("<p></p>").append($themePosition).append(". ").append($themeTitle).append($dash).append($authorName).data("themeData",themeData).appendTo($themeContainer);
			$themeContainer.append($trashCanContainer.clone(true).on("click", function(){playListState()}));

			position = position + 1;

		}

		$controlsContainerSecondary = $("<div></div>").appendTo($packageContainer).attr({"id":"controlsContainerSecondary"}).addClass(darkMode[lightOn]);
		$randomButton = $("<img>").attr({"src":"../media/image/random.png", "id":"randomButton"}).addClass("controlButton").appendTo($controlsContainerSecondary).on("click", function(){playMode(RANDOM_PLAYLIST_MODE)});
		$autoButton = $("<img>").attr({"src":"../media/image/auto.png", "id":"autoButton"}).addClass("controlButton").appendTo($controlsContainerSecondary).on("click", function(){playMode(AUTO_PLAYLIST_MODE)});
		$replayButton = $("<img>").attr({"src":"../media/image/replay.png", "id":"replayButton"}).addClass("controlButton").appendTo($controlsContainerSecondary).on("click", function(){playMode(REPLAY_PLAYLIST_MODE)});

		playMode(SET_DEFAULT_USER_CONFIG);
		cursorControlButtons();

		if (localStorage.getItem(userName + "PanelInstructions") != 1 && userName != undefined && $("#rootsNotificationContainer").length == 0) {

			rootsNotification("PanelInstructions", [
				"¡Hey! <b>" + clearUserName(userName) + "</b> ¡Hay nuevo contenido en la página! Fijate ahí abajo, tenemos un nuevo reproductor. Te voy a eseñar como se usa:",
				"-Tienes los botónes clásicos de cualquier reproductor: Reproducir y pausar, detener, atrás y adelante.",
				$("<img>").attr({"src":"../media/image/play" + darkModeButton[lightOn] + ".png"}).addClass("fakeControlButton"),
				$("<img>").attr({"src":"../media/image/stop" + darkModeButton[lightOn] + ".png"}).addClass("fakeControlButton"),
				$("<img>").attr({"src":"../media/image/prev" + darkModeButton[lightOn] + ".png"}).addClass("fakeControlButton"),
				$("<img>").attr({"src":"../media/image/next" + darkModeButton[lightOn] + ".png"}).addClass("fakeControlButton"),
				"-Estos otros afectarán a la manera en la que se reproducen los temas que tengas en la lista.",
				[
				[$("<img>").attr({"src":"../media/image/random" + darkModeButton[lightOn] + ".png"}).addClass("fakeControlButton"), "Cuando este botón esté seleccionado la lista se reproducirá aleatoriamente."],
				[$("<img>").attr({"src":"../media/image/auto" + darkModeButton[lightOn] + ".png"}).addClass("fakeControlButton"), "Este te permitirá escuchar todos los temas automáticamente."],
				[$("<img>").attr({"src":"../media/image/replay" + darkModeButton[lightOn] + ".png"}).addClass("fakeControlButton"), "Si lo que deseas es reproducir un tema en bucle, selecciona este botón."]
				],
				"-Debes saber también que si mantienes pulsado el click izquierdo en cualquiera de los temas que tengas en la lista podrás cambiar el orden en el que se va a reproducir arrastrándolo hasta la posición que quieras."
			]);

		}

	}

	function playMode(type){

		var darkModeButton = {"true":"", "false":"Dark"};

		if (type == AUTO_PLAYLIST_MODE || type == SET_DEFAULT_USER_CONFIG) {

			var defaultValue = (localStorage.getItem(userName + "AutoPlayList") != null) ? localStorage.getItem(userName + "AutoPlayList") : 0;

			if(type != SET_DEFAULT_USER_CONFIG && playListThemeAuto == 0 || type == SET_DEFAULT_USER_CONFIG && defaultValue == 1){

				playListThemeAuto = 1;
				playListThemeRepeat = 0;
				$("#autoButton").attr({"src":"../media/image/auto" + darkModeButton[lightOn] + "Active.png"});
				$("#replayButton").attr({"src":"../media/image/replay" + darkModeButton[lightOn] + ".png"});

				localStorage.setItem(userName + "RepeatPlayList", playListThemeRepeat);

			}
			else{

				playListThemeAuto = 0;
				$("#autoButton").attr({"src":"../media/image/auto" + darkModeButton[lightOn] + ".png"});

			}

			localStorage.setItem(userName + "AutoPlayList", playListThemeAuto);

		}

		if (type == REPLAY_PLAYLIST_MODE || type == SET_DEFAULT_USER_CONFIG) {

			var defaultValue = (localStorage.getItem(userName + "RepeatPlayList") != null) ? localStorage.getItem(userName + "RepeatPlayList") : 0;

			if(type != SET_DEFAULT_USER_CONFIG && playListThemeRepeat == 0 || type == SET_DEFAULT_USER_CONFIG && defaultValue == 1){

				playListThemeRepeat = 1;
				playListThemeAuto = 0;
				$("#replayButton").attr({"src":"../media/image/replay" + darkModeButton[lightOn] + "Active.png"});
				$("#autoButton").attr({"src":"../media/image/auto" + darkModeButton[lightOn] + ".png"});

				localStorage.setItem(userName + "AutoPlayList", playListThemeAuto);

			}
			else{

				playListThemeRepeat = 0;
				$("#replayButton").attr({"src":"../media/image/replay" + darkModeButton[lightOn] + ".png"});

			}

			localStorage.setItem(userName + "RepeatPlayList", playListThemeRepeat);

		}

		if (type == RANDOM_PLAYLIST_MODE || type == SET_DEFAULT_USER_CONFIG) {

			var defaultValue = (localStorage.getItem(userName + "RandomPlayList") != null) ? localStorage.getItem(userName + "RandomPlayList") : 0;

			playList = [];

			if(type != SET_DEFAULT_USER_CONFIG && playListThemeRandom == 0 || type == SET_DEFAULT_USER_CONFIG && defaultValue == 1){

				playListThemeRandom = 1;
				$("#randomButton").attr({"src":"../media/image/random" + darkModeButton[lightOn] + "Active.png"});

			}
			else{

				playListThemeRandom = 0;
				$("#randomButton").attr({"src":"../media/image/random" + darkModeButton[lightOn] + ".png"})

			}

			localStorage.setItem(userName + "RandomPlayList", playListThemeRandom);

		}

		if (type == NEXT_PLAYLIST_MODE || type == PREV_PLAYLIST_MODE) {

			if ($(".playingThemePlaylist")[0]) {

				var actualThemePosition = playList.indexOf(Number($(".playingThemePlaylist")[0].id.split("-")[0]) - 1);
				var nextThemePosition = (type == NEXT_PLAYLIST_MODE) ? actualThemePosition + 1 : actualThemePosition - 1;
				nextThemePosition = (playListThemeAuto == 1) ? nextThemePosition : STOP_PLAYLIST_THEME;

				playPlayList(nextThemePosition);

			}

		}

	}

	function playPlayList(position = 0, themeSelected = 0){

		var darkModeButton = {"true":"", "false":"Dark"};
		var playButtonImage = $("#playButton").attr("src"); 

		if ($(".themeContainer").length > 0) {

			if (position > STOP_PLAYLIST_THEME) {

				if (playList[0] == undefined) {

					(playListThemeRandom == 1 && themeSelected == 0) ? position = Math.floor(Math.random() * $(".themeContainer").length) : position ;

					generatePlayList(position);
					position = playList[playList.length - 1];

				}

				if (position < playList.length -1){

					var data = $(".themeContainer p").eq(playList[position]).data("themeData");
					var activeVinyl = ($(".vinyl.out").parent()[0]) ? $(".vinyl.out").parent()[0].position : -1;
					var playType = 0;

					if (playListThemeAuto == 0 && playListThemeRepeat == 0) {

						playType = -(playList[position] + 1);

					}
					else if (playListThemeRepeat == 0){

						playType = 1;

					}

					(playButtonImage.split("/").pop().split(".")[0] == "play" + darkModeButton[lightOn]) ? $("#playButton").attr({"src":"../media/image/pause" + darkModeButton[lightOn] + ".png"}) : "";
					(activeVinyl != -1) ? stopMusic(event, activeVinyl) : "";

					$("div.playingThemePlaylist").removeClass("playingThemePlaylist");
					$("#playingTheme").remove();
					$element = $(".themeContainer").eq(playList[position]).addClass("playingThemePlaylist");
					$audio = $("<audio>").attr({"id":"playingTheme", "src":"../media/audio/themes/" + data.id + ".mp3"}).addClass("playListTheme").on("ended",{theme:playList[position] + playType}, function(event){playPlayList(event.data.theme)}).appendTo(".themeContainer:eq('" + (playList[position]) + "')")[0].play();
					
					var inertia = ($("#themesContainer").scrollTop() + $element.position().top > $("#themesContainer").scrollTop()) ? 5 : -5;
					inertia = (Math.abs($element.position().top) < 200) ? 0 : (Math.abs($element.position().top) < 500) ? inertia : (Math.abs($element.position().top) < 600) ? inertia * 2 : inertia * 4 ;

					$("#themesContainer").stop(true);
					$("#themesContainer").animate({scrollTop: ($("#themesContainer").scrollTop() + $element.position().top + inertia + 1)}, 1250, "swing", function(){$("#themesContainer").animate({scrollTop: ($("#themesContainer").scrollTop() + $element.position().top + 1)}, 500)});

					updateStadistics("themes", "views", data.id);

				}
				else{

					playPlayList(STOP_PLAYLIST_THEME);

				}

			}
			else if (position == STOP_PLAYLIST_THEME && $(".playListTheme")[0] || position == STOP_PLAYLIST_THEME_FROM_VINYL) {

				playList = [];
				$("#playingTheme").remove();
				$("div.playingThemePlaylist").removeClass("playingThemePlaylist");
				$("#playButton").attr({"src":"../media/image/play" + darkModeButton[lightOn] + ".png"});

			}
			else if (position == SELECT_PLAYLIST_THEME) {

				playList = [];
				$("#playingTheme").remove();
				$("div.playingThemePlaylist").removeClass("playingThemePlaylist");
				playPlayList(event.target.parentElement.parentElement.id.split("-")[0] - 1, SELECT_PLAYLIST_THEME);

			}
			else if(position == PAUSE_PLAYLIST_THEME){

				if ($(".playingThemePlaylist")[0]) {

					var actualTheme = document.getElementById("playingTheme");

					if (actualTheme.paused) {

						actualTheme.play();
						$("#playButton").attr({"src":"../media/image/pause" + darkModeButton[lightOn] + ".png"});

					}
					else{

						actualTheme.pause();
						$("#playButton").attr({"src":"../media/image/play" + darkModeButton[lightOn] + ".png"});

					}

				}
				else{

					$("#playButton").attr({"src":"../media/image/pause" + darkModeButton[lightOn] + ".png"});
					playPlayList(0);

				}

			}

			cursorControlButtons();

		}
		else if (position != STOP_PLAYLIST_THEME) {

			displayNotification("Tu lista de favoritos está vacía");

		}

	}

	function cursorControlButtons(){

		var mode;

		if ($(".themeContainer").length < 1) {

			$("#playButton").css({"cursor":"default"});

		}

		if (playList[0] != undefined){

			mode = "pointer";

		}
		else{

			mode = "default";

		}

		$("#stopButton").css({"cursor":mode});
		$("#prevButton").css({"cursor":mode});
		$("#nextButton").css({"cursor":mode});

	}

	function clickedControlButtonAnimation(button){

		if (button.css("cursor") != "default") {

			var brightnessUpgradeValue = -2;
			var brightnessValue = (lightOn) ? 250 : 165;

			var upgradeBrightness = setInterval(function(){ 

				button.css("filter", "brightness(" + brightnessValue + "%)");

				brightnessValue = brightnessValue + brightnessUpgradeValue;

				(brightnessValue < 100 + brightnessUpgradeValue * -1) ? [clearInterval(upgradeBrightness), button.css("filter", "")] : "";

			}, 10);

		}

	}

	function mouseDownElementAction(){

		if (mouseDownElement == "" && !$(".playingThemePlaylist")[0] && event.target.parentElement.className != "trashCanContainer" && event.target.className != "trashCanContainer") {

			var elementEvent = (event.target.classList[0] == "themeContainer" && event.target.tagName == "DIV") ? event.target : (event.target.tagName == "DIV" || event.target.tagName == "P") ? event.target.parentElement : event.target.parentElement.parentElement;

			keepMouse = setTimeout(function(){

				document.getSelection().removeAllRanges();
				$(document.body).on("mouseup", function(){leaveElementAction()});
				$(document.body).on("mousemove", function(){placeElementAction()});
				$(elementEvent).addClass("selected");

				mouseDownElement = $(elementEvent).attr("id");

			}, 500);

		}

	}

	function leaveElementAction(){

		if (mouseDownElement != "" && !$(".playingThemePlaylist")[0]) {

			var elementEvent = $("div.selected")[0];

			elementEvent.style.position = "relative";			
			elementEvent.style.top  = "";
			elementEvent.style.zIndex = 1;

			$(document.body).off("mouseup").off("mousemove");
			$(elementEvent).removeClass("selected").insertBefore("#positionGuide");
			$("#positionGuide").remove();
			$("div.themeContainer").css({"cursor":"grab"});

			mousePositionY = 0;
			offsetY = 0;
			mouseDownElement = "";
			(autoScrollEvent) ? clearInterval(autoScrollEvent) : "";

			reorderList(elementEvent);

		}

	}

	function pointerElementAction(){

		var elementEvent = (event.target.classList[0] == "themeContainer" && event.target.tagName == "DIV") ? event.target : (event.target.tagName == "DIV" || event.target.tagName == "P") ? event.target.parentElement : event.target.parentElement.parentElement;
		var containerName = $(elementEvent).attr("id");

		if ($(".playingThemePlaylist")[0]) {

			$("div.themeContainer").css({"cursor":"default"});

		}
		else if (mouseDownElement != containerName){

			$("div.themeContainer").css({"cursor":"grab"});

		}
		else{

			$("div.themeContainer").css({"cursor":"grabbing"});

		}

	}

	function placeElementAction(myEvent = event){

		var elementEvent = $("div.selected")[0];
		var parentContainer = elementEvent.parentElement;
		var containerName = $(elementEvent).attr("id");

		myEvent.stopPropagation();
		myEvent.preventDefault();

	    if (mouseDownElement == containerName && !$(".playingThemePlaylist")[0]) {

	    	if (elementEvent.classList[0] == "themeContainer") {

	    		elementEvent.style.position = "absolute";
	    		elementEvent.style.zIndex = 10;
		        mousePositionY = myEvent.pageY;
		        offsetY = (mousePositionY - $(parentContainer).offset().top) + $(parentContainer).scrollTop();

				var positionInContainer = getElementPositionPercentage(myEvent, parentContainer);
				var minHeight = elementEvent.offsetHeight / 3.25;
				var maxHeight = parentContainer.scrollHeight - elementEvent.offsetHeight / 4.25;
				
				if (positionInContainer > 0 && positionInContainer < 0.1) {

					(autoScrollEvent) ? clearTimeout(autoScrollEvent) : "";
					autoScrollEvent = setTimeout(function(){placeElementAction(myEvent)}, 1);
					parentContainer.scrollBy(0, -3);
					
				}else if (positionInContainer > 0.9 && positionInContainer < 1) {

					(autoScrollEvent) ? clearTimeout(autoScrollEvent) : "";
					autoScrollEvent = setTimeout(function(){placeElementAction(myEvent)}, 1);
					parentContainer.scrollBy(0, 2);

				}
				else{

					(autoScrollEvent) ? clearTimeout(autoScrollEvent) : "";

				}

				if (positionInContainer > 0 && positionInContainer < 1 && offsetY > minHeight && offsetY < maxHeight) {

					elementEvent.style.top  = (offsetY - 50) + 'px';

				}

				var elements = $(".themeContainer").not(".selected");
				var actualValue = offsetY - elementEvent.offsetHeight;
				var i = 0;

				$positionGuide = $("<div></div>").attr({"id":"positionGuide"});

				while(i < elements.length){

					var previousElementPosition = (!elements[i-1]) ? elements[i] : (elements[i-1].id != containerName) ? elements[i-1] : (!elements[i-2]) ? elements[i] : elements[i-2];
					var actualElementPosition = elements[i];
					var nextElementPosition = (!elements[i+1]) ? elements[i] : (elements[i+1].id != containerName) ? elements[i+1] : (!elements[i+2]) ? elements[i] : elements[i+2];

					if (previousElementPosition.offsetTop == actualElementPosition.offsetTop && actualValue <= actualElementPosition.offsetTop) {
						
						$("#positionGuide").remove();
						$($positionGuide).insertBefore(actualElementPosition);

					}
					else if (previousElementPosition.offsetTop != actualElementPosition.offsetTop && actualValue >= previousElementPosition.offsetTop && offsetY - 50 < actualElementPosition.offsetTop) {
						
						$("#positionGuide").remove();
						$($positionGuide).insertBefore(actualElementPosition);

					}
					else if (actualElementPosition.offsetTop == nextElementPosition.offsetTop && actualValue >= actualElementPosition.offsetTop) {
						
						$("#positionGuide").remove();
						$($positionGuide).insertAfter(actualElementPosition);

					}

					i++;

				}

	    	}
	    	
	    }

	}

	function getElementPositionPercentage(myEvent = event, element){

		return (myEvent.clientY - element.getBoundingClientRect().top) / element.offsetHeight;

	}

	function reorderList(elementEvent){

		var colorChange = {true:["rgb(70, 130, 180)", "rgb(126, 170, 205)"], false:["rgb(57, 96, 96)", "rgb(86, 143, 143)"]};
		var oldListOrder = artistList.artists.get(userName).themeList;
		var newListOrder = [];
		var newListOrderSummary = [];
		var changed = false;
		var elementChanged = 0;

		for (var i = 0; i < $(".themeContainer").length; i++) {

			var data = $(".themeContainer p").eq(i).data("themeData");
			newListOrder.push(data);
			newListOrderSummary.push({"listId":data.themeListId, "themeId":data.id});
			
			$(".themeContainer").eq(i).attr({"id": + (i + 1) + "-CP"});
			$(".themeContainer p span.themePosition").eq(i).text((i + 1));

			changed = (data == oldListOrder[i] && changed == false) ? false : true ;

		}

		if (changed) {

			$(elementEvent).css({backgroundColor:colorChange[lightOn][1]});

			$(elementEvent).animate({backgroundColor: colorChange[lightOn][0]}, 400, function(){$(elementEvent).css({backgroundColor:""})});

			artistList.artists.get(userName).themeList = newListOrder;

			$.post(SERVER_ROUTE, {userName:userName, reorderUserList:newListOrderSummary}, function(data){console.log(data)});

		}

	}

	function modifyUserData(event){

		var elementParent = event.target.parentElement;
		var element = event.target.previousSibling;
		var attribute = $(element).data('attribute');

		if (element.tagName != "IMG") {

			var elementValue = (attribute == "password") ? "" :element.textContent;
			var oldValue = element.textContent;

			$elementValueEdit = $("<input>").attr({"type":"text", "value": elementValue}).addClass("elementValueEdit").on("focusout", function(){setUserDataModifications(attribute, oldValue)}).on("keyup", function(event){ (event.keyCode == 13) ? setUserDataModifications(attribute, oldValue) : "" ;});
			$(element).remove();

			$($elementValueEdit).insertBefore(event.target);
			$elementValueEdit.focus();

		}
		else{

			$elementValueEdit = $("<input>").attr({"type":"file", "hidden": true}).on("change", function(){setUserDataModifications(attribute)});
			$elementValueEdit.trigger('click');

		}

	}

	function playMusic(event){

		var position = event.target.parentElement.position;
		var lyrics = document.getElementById("lyrics");
		var flag = document.getElementById("flag");
		var blisterCurrent = document.getElementsByClassName("blister")[position];
		var cdCurrent = document.getElementsByClassName("vinyl")[position];
		var cdoutSound = document.getElementById("cdout");
		var cdSmall = document.getElementById("vinylSmall");
		var previousLyrics = currentFileName(lyrics.src);

		//Modificar datos previos

			if (previousLyrics != event.target.themeData.id) {		/*Si la identidad del tema anterior coincide con el actual evita la carga*/

				lyrics.src = "lyrics/" + event.target.themeData.lyricsId + ".html"; 

			}

			stopMusic(event);
			flag.themeData = event.target.themeData;
			flag.src = "../media/image/flags/" + flag.themeData.flag + ".png";
			($(".playingThemePlaylist")[0]) ? playPlayList(-3) : "" ;

		//Animacion CDs

			cdCurrent.classList.add("out");
			cdSmall.classList.add("rotate");
			cdSmall.classList.add("active");
			cdSmall.activeState = 0;
			cdSmall.addEventListener("click", musicState);
			cdoutSound.cloneNode(true).play();

		//Crear etiqueta de audio y reproduccion

			var audio = document.createElement("audio");

			audio.id = "playingTheme";
			audio.src = "../media/audio/themes/" + event.target.themeData.id + ".mp3";
			audio.addEventListener("ended", stopMusic);
			audio.isEnded = true;

			blisterCurrent.parentElement.appendChild(audio);
			blisterCurrent.removeEventListener("click", playMusic); 	/*Evita que se reproduca la misma canción más de una vez al mismo tiempo*/
			blisterCurrent.classList.add("active");
			audio.play();

			updateStadistics("themes", "views", event.target.themeData.id);

	}

	function stopMusic(event, activeVinyl = -1){

		var position = (activeVinyl == -1) ? event.target.parentElement.position : activeVinyl;
		var blisters = document.querySelectorAll(".blister");
		var cds = document.querySelectorAll(".vinyl");
		var playingTheme = document.getElementById("playingTheme");
		var dingSound = document.getElementById("ding");
		var cdoutSound = document.getElementById("cdout");
		var cd = document.getElementsByClassName("vinyl")[position];
		var cdSmall = document.getElementById("vinylSmall");

		cd.classList.remove("out");
		cdoutSound.cloneNode(true).play();

		if (event.target.isEnded) {

			dingSound.cloneNode(true).play(); 
			cdSmall.classList.remove("active");

		}

		if (playingTheme || activeVinyl != -1) {

			blisters.forEach(singleBlister => {		/*Devuelve la capacidad a todos los discos de reproducir música*/

				singleBlister.removeEventListener("click", playMusic);
				singleBlister.addEventListener("click", playMusic);
				singleBlister.classList.remove("active");

			});

			cds.forEach(singleCd => {

				singleCd.classList.remove("out");

			});

			cdSmall.classList.remove("rotate");
			(activeVinyl == -1) ? playingTheme.remove() : "";

		}

	}

	function musicState(){		/*Controla la rotacion del disco pequeño*/

		var playingTheme = document.getElementById("playingTheme");
		var cdSmall = document.getElementById("vinylSmall");

		if (playingTheme) {

			if (cdSmall.activeState == 0) {

				cdSmall.classList.remove("rotate");
				cdSmall.activeState = 1;
				playingTheme.pause();

			}
			else if (cdSmall.activeState == 1) {

				cdSmall.classList.add("rotate");
				cdSmall.activeState = 0;
				playingTheme.play();

			}

		}

	}

	function displayNameState(state){	/*Controla el estado de la etiqueta con el nombre que tiene cada portada*/

		if(state == 1){

			document.getElementsByClassName("themeName")[event.target.parentElement.position].classList.add("active");

		}
		else if(state == 0){

			document.getElementsByClassName("themeName")[event.target.parentElement.position].classList.remove("active");

		}	

	}

	function switchTraducction(event){

		var lyricsCurrent = document.getElementById("lyrics");
		var popSound = document.getElementById("pop");
		var flagCurrent = document.getElementById("flag");
		var flagPrevious = currentFileName(flagCurrent.src);

		if (lyricsCurrent) {

			var lyrics;
			var flag;

			if (flagPrevious != "spn") {

				//Traduccion al castellano

				flag = "spn";
				lyrics = event.target.themeData.lyricsTranslateId;

			}
			else{

				//Traduccion al idioma original

				flag = event.target.themeData.flag;
				lyrics = event.target.themeData.lyricsId;

			}

			flagCurrent.src = "../media/image/flags/" + flag + ".png";
			lyricsCurrent.src = "../html/lyrics/" + lyrics + ".html";

			popSound.cloneNode(true).play();

		}

	}

	function starState(event, type = 0){

		if (type == 0) {

			event = event.target;
		}

		var themeListId = document.getElementsByClassName("blister")[event.parentElement.position].themeData.themeListId;
		var themeId = document.getElementsByClassName("blister")[event.parentElement.position].themeData.id;
		var starMode = event.src.split("/")[event.src.split("/").length - 1];

		(starMode == "fav.png" && type == 0) ? updateStadistics("themes", "favs", themeId) : "";

		for (var i = type; i < 2; i++) { /*Primera vuelta para midificar el estado en el archivo Json y la segunda para aplicar el cambio en el icono*/

			var formData = new FormData();

			formData.append("userName", userName);
			formData.append("listId", themeListId);
			formData.append("themeId", themeId);
			formData.append("starStateUpdate", i);
			
			$.ajax({

			type: "POST",

			url: SERVER_ROUTE,

			processData: false, 

			contentType: false,

			async: false,

			data: formData,

			success: function(data){

				if (i == 1) {

					if (data == 0) {

						event.src = "../media/image/fav.png";

					}

					if (data == 1) {

						event.src = "../media/image/favActive.png";

					}

				}

			}

		});

		}

		updateArtistMenu(userName);

	}

	function playListState(){

		var data = (event.target.tagName == "IMG") ? $(event.target.parentElement.previousSibling).data("themeData"): $(event.target.previousSibling).data("themeData");

		var formData = new FormData();

		formData.append("userName", userName);
		formData.append("listId", data.themeListId);
		formData.append("themeId", data.id);
		formData.append("starStateUpdate", 0);console.log(userName + " " + data.themeListId + " " + data.id);
		
		$.ajax({

			type: "POST",

			url: SERVER_ROUTE,

			processData: false, 

			contentType: false,

			async: false,

			data: formData,

			success: function(data){
				
				loadUserThemeList(userName);
				showArtist(artistList.artists);

			}

		});

	}

///////////////////////////////
//FUNCIONES DE ADMINISTRACION//
///////////////////////////////

	/*Cajon principal*/

	function displayManagerWindow(){

		var buttonValues = [ 
			{"name": "Nuevo" ,"function": displayThemeData, "type": "newButton"},
			{"name": "Modificar" ,"function": displayThemeData, "type": "modifyButton"},
			{"name": "Eliminar" ,"function": deleteProcess, "type": "deleteButton"},
			{"name": "Cancelar" ,"function": displayManagerWindow, "type": "cancelButton"}
		];

		var list = artistList.artists;

		var body = document.getElementsByTagName("body")[0];
		var centre = document.getElementById("centre");
		var managerWindow = document.createElement("div");
		var filterContainer = document.createElement("div");
		var filterButton = document.createElement("button");
		var statsButton = document.createElement("button");
		var filterInput = document.createElement("input");
		var buttonsContainer = document.createElement("div");
		var blackScreen = document.createElement("div");
		var deleteWindow = document.getElementById("managerWindow");

		if (deleteWindow) {

			deleteWindow.remove();
			document.getElementById("blackScreenOverMenu").remove();

		}
		else{

			filterContainer.id = "filterContainer";
			filterButton.appendChild(document.createTextNode("Filtrar"));
			filterButton.addEventListener("click", filterArtist);
			filterInput.id = "filterInput";
			statsButton.id = "statsButton"
			statsButton.appendChild(document.createTextNode("Estadísticas"));
			statsButton.addEventListener("click", displayStatsWindow);
			managerWindow.id = "managerWindow";
			buttonsContainer.className = "buttonsContainer";
			blackScreen.id = "blackScreenOverMenu";
			blackScreen.addEventListener("click", displayManagerWindow);

			body.appendChild(blackScreen);
			centre.appendChild(managerWindow);
			managerWindow.appendChild(filterContainer);
			filterContainer.appendChild(filterButton);
			filterContainer.appendChild(filterInput);
			filterContainer.appendChild(filterButton);
			filterContainer.appendChild(statsButton);
			managerWindow.appendChild(buttonsContainer);

			buttonValues.forEach(button =>{console.log("in")

				var newButton = document.createElement("button");

				newButton.appendChild(document.createTextNode(button.name));
				newButton.className = "managerButtons";
				newButton.addEventListener("click", button.function);
				newButton.buttonType = button.type;
				newButton.fromButton = "theme";

				buttonsContainer.appendChild(newButton);

			});

			if(lightOn == false){

				managerWindow.classList.add("dark");
				filterContainer.classList.add("dark");
				buttonsContainer.classList.add("dark");

			}

			filterArtist();

			}

	}

	function displayStatsWindow(){
		
		removeAllEventListeners("blackScreenOverMenu");

		var blackScreen = document.getElementById("blackScreenOverMenu");
		var deleteWindow = document.getElementById("managerDataWindow");
		var titles = ["Artistas más visitados", "Temas más reproducidos", "Temas más agregados a favoritos"];
		var type = ["Visitas", "Reproducciones", "Favoritos"];
		var colorClass = ["gold", "silver", "bronze"];
		var attribute = ["views", "views", "favs"];
		var cont = 0;

		if (deleteWindow) {

				deleteWindow.remove();
				blackScreen.remove();
				displayManagerWindow();

		}
		else{

			blackScreen.addEventListener("click", displayStatsWindow);

			document.getElementById("managerWindow").remove();

			var centre = document.getElementById("centre");
			var artistDataWindow = document.createElement("div");
			var titleContainer = document.createElement("div");
			var dataContainer = document.createElement("div");
			var buttonsContainer = document.createElement("div");
			var containerTitle = document.createElement("h3");
			var exitButton = document.createElement("button");

			artistDataWindow.id = "managerDataWindow";
			titleContainer.id = "filterContainer";
			dataContainer.id = "dataStadistics";
			buttonsContainer.className = "buttonsContainer";
			containerTitle.appendChild(document.createTextNode("Estadísticas"));
			exitButton.className = "managerButtons";
			exitButton.appendChild(document.createTextNode("Salir"));
			exitButton.addEventListener("click", displayStatsWindow);

			$.getJSON(SERVER_ROUTE, {getStats:1}, function(data){

				console.log(data);

				data.forEach(elementGroup=>{

					var title = document.createElement("h4");
					var range = 1;

					title.appendChild(document.createTextNode(titles[cont]));
					title.classList.add("titleStats");

					dataContainer.appendChild(title);

					elementGroup.forEach(element=>{

						var data = document.createElement("p");
						var position = document.createElement("span")

						position.classList.add(colorClass[range - 1]);
						position.appendChild(document.createTextNode(range + "º"));
						data.appendChild(position);

						if (cont == 0) {

							data.appendChild(document.createTextNode(" => Id: " + element.id + " | Nombre: " + element.name + " | Apellidos: " + element.surname + " | " + type[cont] + ": " + element[attribute[cont]]));

						}
						else{

							data.appendChild(document.createTextNode(" => Id: " + element.id + " | Título: " + element.name + " | " + type[cont] + ": " + element[attribute[cont]]));

						}
						
						data.classList.add("statsInfo");

						dataContainer.appendChild(data);

						range ++;

					});

					cont ++;

					if(lightOn == false){

						title.classList.add("dark");

					}

				});

			});

			centre.appendChild(artistDataWindow);
			artistDataWindow.appendChild(titleContainer);
			artistDataWindow.appendChild(dataContainer);
			artistDataWindow.appendChild(buttonsContainer);
			titleContainer.appendChild(containerTitle);
			buttonsContainer.appendChild(exitButton);


			if(lightOn == false){

				artistDataWindow.classList.add("dark");
				filterContainer.classList.add("dark");
				dataContainer.classList.add("dark");
				buttonsContainer.classList.add("dark");

			}

		}

	}

	function displayShowcase(list){

		var managerWindow = document.getElementById("managerWindow");
		var showcase = document.createElement("div");
		var deleteWindow = document.getElementById("themeShowcase");

		if (deleteWindow) {

			deleteWindow.remove();

		}

		showcase.id = "themeShowcase";

		managerWindow.insertBefore(showcase, managerWindow.childNodes[1]);

		list.forEach(artist =>{

			if (artist.name != userName) {

				var name = document.createElement("p");

				name.appendChild(document.createTextNode(artist.name + " " + artist.subname));
				name.artistData = artist;
				name.artistData.themeListId = themeListId(artist.id);
				name.addEventListener("click", displayArtistData);

				showcase.appendChild(name);

				artist.themeList.forEach(theme =>{

					var blisterContainer = document.createElement("div");
					var smallBlister = document.createElement("img");

					smallBlister.className = "smallBlisters";
					smallBlister.src = "../media/image/covers/" + theme.id + ".png"; 
					
					showcase.appendChild(blisterContainer);
					blisterContainer.appendChild(smallBlister);

					if (artist.id != "newArtist") {

						var radioButton = document.createElement("input");

						smallBlister.addEventListener("click", radioCheck);
						radioButton.type = "radio";
						radioButton.className = "radioManager";
						radioButton.name = "radioManager";
						radioButton.artistData = artist;
						radioButton.themeData = theme;

						blisterContainer.appendChild(radioButton);

					}
					else{

						smallBlister.addEventListener("click", displayArtistData);
						smallBlister.artistData = name.artistData;

					}

				});

			}

		});

		if(lightOn == false){

			showcase.classList.add("dark");

		}

	}

	/*Carga del cajón secundario con información de los artistas*/

	function displayArtistData(event){

		removeAllEventListeners("blackScreenOverMenu");

		var blackScreen = document.getElementById("blackScreenOverMenu");
		var deleteWindow = document.getElementById("managerDataWindow");

		if (deleteWindow) {

				deleteWindow.remove();
				blackScreen.remove();
				displayManagerWindow();

		}
		else{

			blackScreen.addEventListener("click", displayArtistData);

			var artistData = event.target.artistData;

			elementsValue = [ 
					{"tag": "input", "type": "text", "id": "newId", "name": "newId","valueDefault": artistData.id, "labelText": "Id"},
					{"tag": "input", "type": "text", "id": "newName", "name": "newName", "valueDefault": artistData.name, "labelText": "Nombre"},
					{"tag": "input", "type": "text", "id": "newSurname", "name": "newSurname", "valueDefault": artistData.subname, "labelText": "Apellidos"},
					{"tag": "input", "type": "text", "id": "newThemeList", "name": "newThemeList", "valueDefault": artistData.themeListId, "labelText": "Id lista de Temas"},
					{"tag": "input", "type": "file", "id": "newDescription", "name": "newDescription", "valueDefault": artistData.descriptionId, "labelText": "Descripcion"},
				];

			buttonValues = [
					{"text": (event.target.artistData.id == "newArtist") ? "Nuevo" : "Modificar", "function": (event.target.artistData.id == "newArtist") ? newArtist : modifyArtist},
					{"text": "Eliminar", "function": deleteProcess},
					{"text": "Cancelar", "function": displayArtistData}
				];

			document.getElementById("managerWindow").remove();

			var centre = document.getElementById("centre");
			var artistDataWindow = document.createElement("div");
			var dataContainer = document.createElement("div");
			var buttonsContainer = document.createElement("div");

			artistDataWindow.id = "managerDataWindow";
			dataContainer.id = "dataShowcase";
			buttonsContainer.className = "buttonsContainer";

			elementsValue.forEach(element =>{

				var fileElementsContainer = document.createElement("div");
				var newElement = document.createElement(element.tag);
				var newElementLabel = document.createElement("label");

				newElement.value = (element.type == "text" && event.target.artistData.id != "newArtist") ? element.valueDefault : ""
				newElement.valueId = (element.type == "file" && event.target.artistData.id != "newArtist") ? element.valueDefault : undefined;

				newElement.type = element.type;
				newElement.id = element.id;
				newElement.name = element.name;
				newElementLabel.appendChild(document.createTextNode(element.labelText + ":"));
				newElementLabel.htmlFor = element.labelText;

				dataContainer.appendChild(fileElementsContainer);
				fileElementsContainer.appendChild(newElementLabel);

				if (element.id == "newId" || element.id == "newThemeList") {

					newElement.oldId = artistData.id;

					var idUsedContainer = document.createElement("div");

					idUsedContainer.className = "idUsedContainer";

					if (element.id == "newId") {

						idUsedContainer.id = "idArtistUsedContainer";

					}

					if (element.id == "newThemeList") {

						idUsedContainer.id = "idThemeUsedContainer";

					}

					fileElementsContainer.appendChild(idUsedContainer);

				}

				fileElementsContainer.appendChild(newElement);

			});

			buttonValues.forEach(button =>{

				var newButton = document.createElement("button");

				newButton.className = "managerButtons";
				newButton.appendChild(document.createTextNode(button.text));
				newButton.addEventListener("click", button.function);
				newButton.fromButton = "artist";

				buttonsContainer.appendChild(newButton);

			});

			centre.appendChild(artistDataWindow);
			artistDataWindow.appendChild(dataContainer);
			artistDataWindow.appendChild(buttonsContainer);

			if(lightOn == false){

				artistDataWindow.classList.add("dark");
				dataContainer.classList.add("dark");
				buttonsContainer.classList.add("dark");

			}

			updateUsedIdsList();
			updateThemeListIdsList();

		}

	}

	/*Carga del cajón secundario con información de los temas*/

	function displayThemeData(event){

		var blackScreen = document.getElementById("blackScreenOverMenu");
		var position = searchCheckedRadio();
		var deleteWindow = document.getElementById("managerDataWindow");

		if (deleteWindow) {

			deleteWindow.remove();
			blackScreen.remove();
			displayManagerWindow();

		}
		else{

			var buttonType = event.target.buttonType;

			if (position != -1 || buttonType == "newButton") {

				removeAllEventListeners("blackScreenOverMenu");

				blackScreen = document.getElementById("blackScreenOverMenu");
				blackScreen.addEventListener("click", displayThemeData);

				var radioManager = document.getElementsByClassName("radioManager")[position];
				var artistData = (radioManager) ? radioManager.artistData : "";
				var themeData = (radioManager) ? radioManager.themeData : "";

				var elementsValue = getThemeManagerValues(themeData)[0];
				var buttonValues = getThemeManagerValues(themeData)[1];

				document.getElementById("managerWindow").remove();

				var centre = document.getElementById("centre");
				var themeDataWindow = document.createElement("div");
				var dataContainer = document.createElement("div");
				var buttonsContainer = document.createElement("div");

				themeDataWindow.id = "managerDataWindow";
				dataContainer.id = "dataShowcase";
				buttonsContainer.className = "buttonsContainer";

				//Creación de campos "input"

					elementsValue.forEach(element =>{

						var fileElementsContainer = document.createElement("div");
						var newElement = document.createElement(element.tag);
						var newElementLabel = document.createElement("label");

						newElement.type = element.type;
						newElement.id = element.id;
						newElement.name = element.name;
						newElementLabel.appendChild(document.createTextNode(element.labelText + ":"));
						newElementLabel.htmlFor = element.labelText;

						fileElementsContainer.appendChild(newElementLabel);

						//Condiciones especiales para los "input" de texto

						if (element.type == "text" && buttonType == "modifyButton") {

							newElement.value = element.valueDefault;

						}

						//Condiciones especiales para los "input" de archivo

						if (element.type == "file" && buttonType == "modifyButton") {

							newElement.valueId = element.valueDefault;

						}

						//Condiciones especiales para el campo "Id Artista"

						if (element.id == "artistId") {

							var artistName = document.createElement("p");

							newElement.addEventListener("keyup", setArtistName);
							newElement.addEventListener("keyup", updateUsedIdsList);
							artistName.id = "artistNameManager";
							artistName.appendChild(document.createTextNode("No disponible"));

							fileElementsContainer.appendChild(artistName);

							}

						//Condiciones especiales para el campo "Id"

						if(element.id == "newId"){

							newElement.artistId = artistData.id;
							newElement.oldId = themeData.id;

							var idUsedContainer = document.createElement("div");

							idUsedContainer.id = "idArtistUsedContainer";
							idUsedContainer.className = "idUsedContainer";

							fileElementsContainer.appendChild(idUsedContainer);

						}

						//Condiciones especiales para los campos que contengan imágenes

						if (element.id == "newFlag" || element.id == "newPicture") {
								
							var imagePreview = document.createElement("img");
							var imageRoute;
							var imageName;
							
							fileElementsContainer.appendChild(imagePreview);

							//Condiciones especiales para el campo "Bandera"

							if (element.id == "newFlag") {

								var newFlagFile = document.createElement("input");

								imagePreview.id = "flagManager";
								newElement.addEventListener("keyup", setFlag);
								newFlagFile.id = "newFlagFile";
								newFlagFile.type = "file";
								newFlagFile.addEventListener("change", setFlag);

								fileElementsContainer.appendChild(newFlagFile);

								imageRoute = "../media/image/flags/";
								imageName = (buttonType == "modifyButton") ? themeData.flag : "notFound";

							}

							//Condiciones especiales para el campo "Carátula"

							if (element.id == "newPicture" ) {

								imagePreview.className = "smallBlisters";
								imagePreview.id = "smallBlisterPreview";
								newElement.addEventListener("change", setCover);

								imageRoute = "../media/image/covers/";
								imageName = (buttonType == "modifyButton") ? themeData.id : "newCover";

							}

							imagePreview.src = imageRoute + imageName +".png";

						}

						fileElementsContainer.appendChild(newElement);
						dataContainer.appendChild(fileElementsContainer);

					});

					//Creación de botones

					buttonValues.forEach(button =>{

						var newButton = document.createElement("button");

						newButton.className = "managerButtons";
						newButton.appendChild(document.createTextNode(button.text));
						newButton.addEventListener("click", button.function);

						buttonsContainer.appendChild(newButton);

					});

				centre.appendChild(themeDataWindow);
				themeDataWindow.appendChild(dataContainer);
				themeDataWindow.appendChild(buttonsContainer);

				if(lightOn == false){

					themeDataWindow.classList.add("dark");
					dataContainer.classList.add("dark");
					buttonsContainer.classList.add("dark");

				}

				updateUsedIdsList();

			}
			else{

				displayNotification("Selecciona un tema");

			}

		}

	}

	function setFlag(event){

		var flagId = document.getElementById("newFlag")
		var flagDisplay = document.getElementById("flagManager");

		if (event.target.type == "text") {	/*Modificación al introducir un carácter en el campo bandera*/

			var route = "../media/image/flags/" + flagId.value + ".png";
	    
	    	var xhr = new XMLHttpRequest();
		    xhr.open('GET', route, false);
		   	xhr.send();
		     
		    if (xhr.status == "404") {
		      		
		       	flagDisplay.src = "../media/image/flags/notFound.png";

		    } 
		    else {

		        flagDisplay.src = route;

		    }

		}

		if (event.target.type == "file") {	/*Modificación al seleccionar un archivo en el campo bandera*/

			var reader = new FileReader();

			reader.onload = function(){

				if (reader.result.split(";")[0].split("/")[1] == "png") {	/*Si no es un archivo de imagen no se muestra la previsualización del mismo*/

					flagDisplay.src = reader.result;

				}
				else{

					flagDisplay.src = "../media/image/flags/notFound.png";

				}
				
			}

			reader.readAsDataURL(event.target.files[0]);

			flagId.removeEventListener("keyup", setFlag);
			flagId.value = "new_flag";

		}

	}

	function setCover(event){

		var previewBlisterDisplay = document.getElementById("smallBlisterPreview");

		var reader = new FileReader();

		reader.onload = function(){

			if (reader.result.split(";")[0].split("/")[1] == "png") {	/*Si no es un archivo de imagen no se muestra la previsualización del mismo*/

				previewBlisterDisplay.src = reader.result;

			}
			else{

				previewBlisterDisplay.src = "../media/image/covers/notFound.png";

			}
				 
		}

		reader.readAsDataURL(event.target.files[0]);

	}

	function radioCheck(event){

		event.target.nextSibling.checked = true;

	}

	function deleteProcess(){	/*Proceso de eliminado: Muestra la pantalla de confirmación y eliminación*/

		var eventTarget = event.target.fromButton;
		var position = searchCheckedRadio();

		if (position != -1 || eventTarget == "artist") {

			if ((showConfirmationWindowTheme == 0 && eventTarget == "theme") || (showConfirmationWindowArtist == 0 && eventTarget == "artist")) {	/*Comprueba si la casilla de "no volver a mostrar ha sido marcada"*/

				displayConfirmationWindow();

			}
			else{

				if (eventTarget == "theme") {

					deleteTheme();

				}

				if (eventTarget == "artist") {

					deleteArtist();

				}
			}

		}
		else{

			displayNotification("Selecciona un tema");

		}

	}

	function setArtistName(){	/*Comprobación de la existencia de un id de artista para luego mostrarlo en el Cajon Secundario para nuevos temas*/

		var artistId = document.getElementById("artistId");
		var themeId = document.getElementById("newId");
		var artistName = document.getElementById("artistNameManager");

		if (artistId != "") {

			var artistExist = searchArtistId(artistId.value);

			themeId.artistId = artistId.value;

			artistName.textContent = artistExist[0];

			artistId.exist = artistExist[1];

		}

	}

	function updateUsedIdsList(){	/*Muestra todos los ids de artistas en uso*/

		var artistId = document.getElementById("newId");

		if (artistId) {

			var idList =[];

			if (event.target.tagName.toLowerCase() == "button" || event.target.tagName.toLowerCase() == "input") {

				idList = currentThemeIds(artistId.artistId);

			}

			if (event.target.tagName.toLowerCase() == "p" || event.target.tagName.toLowerCase() == "img") {

				idList = currentArtistIds();

			}

			var idUsedContainer = document.getElementById("idArtistUsedContainer");

			idUsedContainer.innerHTML = "";

			idList.forEach(id =>{

				if (id != "[" + userName + "]") {

					var idUsed = document.createElement("p");

					idUsed.appendChild(document.createTextNode(id));

					idUsedContainer.appendChild(idUsed);

				}

			});

		}

	}

	function updateThemeListIdsList(){	/*Muestra todos los ids de temas en uso independientemente de su asociación con algún usuario*/

		var newThemeList = document.getElementById("newThemeList");

		if (newThemeList) {

			newThemeList = currentThemeListsIds();

			var idUsedContainer = document.getElementById("idThemeUsedContainer");

			idUsedContainer.innerHTML = "";

			newThemeList.forEach(id =>{

				var idUsed = document.createElement("p");

				idUsed.appendChild(document.createTextNode(id));

				idUsedContainer.appendChild(idUsed);

			});

		}

	}

	function removeAllEventListeners(id){

		var oldElement = document.getElementById(id);
		var newElement = oldElement.cloneNode(true);

		oldElement.parentNode.replaceChild(newElement, oldElement);
		
	}

//////////////////
//NOTIFICACIONES//
//////////////////

	function displayConfirmationWindow(){

		var body = document.getElementsByTagName("body")[0];
		var blackScreen = document.getElementById("blackScreenOverMenu");
		var confirmationWindow = document.createElement("div");
		var textContainer = document.createElement("div");
		var text = document.createElement("p");
		var buttonsContainer = document.createElement("div");
		var checkboxContainer = document.createElement("div");
		var checkboxLabel = document.createElement("label");
		var checkbox = document.createElement("input");
		var deleteWindow = document.getElementById("confirmationWindow");
		var deleteAlertWindow = document.getElementById("notificationWindow");

		if (deleteAlertWindow) {

			deleteAlertWindow.remove();

		}

		if (deleteWindow) {

			deleteWindow.remove();
			(blackScreen) ? blackScreen.style.zIndex = 7 : "";
			blackScreen.removeEventListener("click", displayConfirmationWindow);

		}
		else{

			blackScreen.addEventListener("click", displayConfirmationWindow);

			var buttonValues = [];
			var fromText = "";
			var extraText = "";

			if (event.target.fromButton == "theme") {

				buttonValues = [
					{"text": "Eliminar", "function": deleteTheme},
					{"text": "Cancelar", "function": displayConfirmationWindow},
				];

				fromText = "tema"

			}

			if (event.target.fromButton == "artist") {

				buttonValues = [
					{"text": "Eliminar", "function": deleteArtist},
					{"text": "Cancelar", "function": displayConfirmationWindow},
				];

				fromText = "artista"
				extraText = " Se elimnará también la lista de reproduccion indicada";

			}

			blackScreen.style.zIndex = 8;
			confirmationWindow.id = "confirmationWindow";
			text.appendChild(document.createTextNode("¿Estás seguro de que quieres eliminar a este " + fromText + "?" + extraText +"."));
			checkboxLabel.for = "checkbox";
			checkbox.id = "checkboxConfirmation";
			checkbox.type = "checkbox";
			checkbox.name = "checkbox";
			checkboxLabel.appendChild(document.createTextNode("No volver a mostrar este cuadro"));

			if(lightOn == false){

				confirmationWindow.classList.add("dark");

			}

			buttonValues.forEach(buttonValue =>{

					var button = document.createElement("button");
					button.className = "managerButtons";
					button.appendChild(document.createTextNode(buttonValue.text));
					button.addEventListener("click", buttonValue.function);
					buttonsContainer.appendChild(button);

				});

			body.appendChild(confirmationWindow);
			confirmationWindow.appendChild(textContainer);
			textContainer.appendChild(text);
			confirmationWindow.appendChild(buttonsContainer);
			confirmationWindow.appendChild(checkboxContainer);
			checkboxContainer.appendChild(checkboxLabel);
			checkboxContainer.appendChild(checkbox);

			setTimeout(function(){
		  		confirmationWindow.classList.add("active");
			}, 1);	


		}

	}

//////////////////////
//FUNCIONES DEL MENU// *Funcionales pero mayormente desfasadas, previas a la selección del proyecto.
//////////////////////

	function buttonAnimation(exit){

		var valueBar;
		var valueBackg;

		if (showMenu == false) {

			if (exit == 0) {

				valueBar = "8px";
				valueBackg = "56px";

			}
			else{

				valueBar = valueBarDefault;
				valueBackg = valueBackgDefault;

			}

		}
		else{

			if (exit == 0) {

				valueBar = "7px";
				valueBackg = "49px";

			}
			else{

				valueBar = valueBarActive;
				valueBackg = valueBackgActive;

			}

		}

		barDecor(valueBar);

		document.getElementById("menuButtonBackg").style.height = valueBackg;

	}

	function menuOn(){

		var valueBar;
		var valueBackg;
		var valueScreen;
		var modeScreen;
		var valueMenu;
		var valueEvent;
		var bulbDisplay;
		var bulbDelay;

		var blackScreen = document.getElementById("blackScreen");
		var menu = document.getElementById("menu");
		var bulb = document.getElementById("bulb");

		$(".selectOption").removeClass("selectOption clicked");

		if (showMenu==false) {

			window.scrollTo(0,0);

			valueEvent = "auto";

			valueBar = "5px";

			valueBackg = "45px";

			valueScreen ="3";

			modeScreen = "1";

			valueMenu ="100px";

			bulbDisplay = "1";

			bulbDelay = "0.5s";
			
			showMenu = true;

			$(window).on("scroll", function(){window.scrollTo(0,0)});
			$(window).on("keyup", ESCMenu);
			
			if (accesibilityKeys == true) {

				enableAccesibilityKeys(true, [{"function":middleContainersMoveKey,"type":"keyup"}], ["selectContainer","selectContainerElement"]);

				$(window).on("keyup", accesibilityMenuOption);

			}

		}
		else{

			valueEvent = "none";

			valueBar = "10px";

			valueBackg = "60px";

			valueScreen ="-1";

			modeScreen = "0";

			valueMenu ="-30%";

			bulbDisplay = "0";

			bulbDelay = "0s";

			showMenu = false;

			$(window).off("scroll");
			$(window).off("keyup", ESCMenu);

			if (accesibilityKeys == true) {

				enableAccesibilityKeys(false);

				$(window).off("keyup", accesibilityMenuOption);

			}

		}

		barDecor(valueBar);

		for (var i = 0; i < 3; i++) {

			document.getElementsByClassName("menuOpt")[i].style.pointerEvents = valueEvent;

		}

		document.getElementById("menuButtonBackg").style.height = valueBackg;

		blackScreen.style.zIndex  = valueScreen;

		blackScreen.style.opacity = modeScreen;

		menu.style.top = valueMenu;

		menu.style.opacity = modeScreen;

		bulb.style.transitionDelay = bulbDelay;

		bulb.style.opacity = bulbDisplay;

		bulb.style.pointerEvents = valueEvent;

		openSub();

	}

	function barDecor(valueBar){

		for (var i = 0; i < 3; i++) {

			document.getElementsByClassName("bar")[i].style.marginBottom = valueBar;

		}

	}

	function openSub(rowFrom = ""){

		var rows = document.querySelectorAll(".rows");

		(event.target.tagName == "SPAN") ? (event.target.parentElement.classList.contains("selectOption")) ? [event.target.parentElement.classList.remove("selectOption"), event.target.parentElement.classList.remove("clicked"), $(".selectRow").removeClass("selectRow")] : [event.target.parentElement.classList.add("selectOption"), event.target.parentElement.classList.add("clicked")] : "";

		($(".selectOption").length > 1) ? $(".selectOption:eq(0)").removeClass("selectOption") : "" ;

		rows.forEach(row =>{

			if (row.rowFrom == rowFrom && !row.classList.contains("active")) {

				row.classList.add("active");

			}
			else{

				row.classList.remove("active");

			}

		});

		if (rowFrom == "user") {

			showArtist(artistList.artists, userName);
			menuOn();

		}

	}

	function lightMode(type = 0){

		var playOn = document.getElementById("switch"); 
		var bulb = document.getElementById("bulb");
		var body = document.body;
		var elementsId = ["header", "footer", "lyrics", "description", "controlsContainerPrimary", "controlsContainerPrimary", "controlsContainerSecondary", "themesContainer", "themes", "userProfileImagePreview", "flag", "vinylSmall", "rootsNotificationContainer", "rootContentContainer", "rootButtonContainer", "notificationWindow"]
		var elementsClass = ["themeContainer", "packageContainer", "theme"]
		var iconsData = [{"id":"bulb", "src1":"../media/image/light", "src2":".png"},{"id":"playButton", "src1":"../media/image/play", "src2":".png"},{"id":"stopButton", "src1":"../media/image/stop", "src2":".png"},{"id":"prevButton", "src1":"../media/image/prev", "src2":".png"},{"id":"nextButton", "src1":"../media/image/next", "src2":".png"},{"class":"editPencil", "src1":"../media/image/pencil", "src2":".png"},{"class":"trashCanCap", "src1":"../media/image/trashCanCap", "src2":".png"},{"class":"trashCanBody", "src1":"../media/image/trashCanBody", "src2":".png"}];
		
		if (type == 0) {

			playOn.cloneNode(true).play();

		}
		else{

			lightOn = JSON.parse(localStorage.getItem(userName + "DarkTheme"));

		}

		elementsId.forEach(elementId =>{

			var element = document.getElementById(elementId);

			if (element) {

				(lightOn == true) ? element.classList.add("dark") : element.classList.remove("dark");

			}

		});

		elementsClass.forEach(elementClass =>{

			var elements = document.getElementsByClassName(elementClass);
				
			(lightOn == true) ? $(elements).addClass("dark") : $(elements).removeClass("dark");

		});

		iconsData.forEach(iconData =>{

			var icon = document.getElementById(iconData.id);

				if (icon && iconData.id) {

					(lightOn == true) ? icon.src = iconData.src1 + "Dark" + iconData.src2 : icon.src = iconData.src1 + iconData.src2;

				}

				if (iconData.class) {

					(lightOn == true) ? $("img." + iconData.class).attr({"src":iconData.src1 + "Dark" + iconData.src2}) : $("img." + iconData.class).attr({"src":iconData.src1 + iconData.src2});

				}


		});

		if (lightOn == true) {

			body.classList.add("dark");

			lightOn = false;

		}
		else{	

			body.classList.remove("dark");	

			lightOn = true;

		}

		playMode(SET_DEFAULT_USER_CONFIG);

		localStorage.setItem(userName + "DarkTheme", !lightOn);

	}

/////////////////////////////////////////////////
//FUNCIONES DE TRATAMIENTO DE DATOS EN SERVIDOR//
/////////////////////////////////////////////////

	function updateStadistics(mode, attrId, id){

		$.post(SERVER_ROUTE, {updateStadistics:1, mode:mode, attrId:attrId, id:id}, function(data){console.log(data)});

	}

	function deleteArtist(){

		var checkboxConfirmation = document.getElementById("checkboxConfirmation");
		var artistId = document.getElementById("newId").value;
		var themeId = document.getElementById("newThemeList").value;

		if (checkboxConfirmation && checkboxConfirmation.checked) { /*Comprueba el valor de la casilla "No volver a mostrar" y si está marcada modifica no volverá a mostrar la ventana de confirmación funcions igual para deleteTheme()*/

			showConfirmationWindowArtist = 1;

		}

		if (artistId != "m_x") {

			$.ajax({

				type: "POST",

				url: SERVER_ROUTE,

				data: {deleteArtist: {"artistId": artistId, "themeId": themeId}},

				success: function(data){

					var deleteWindow = document.getElementById("confirmationWindow");

					displayNotification("Artista eliminado");

					if (deleteWindow) {

						displayConfirmationWindow();

					}

					displayArtistData();

					displayManagerWindow();

					loadArtist();

					showArtist(artistList.artists);

					displayManagerWindow();

				}

			});

		}
		else{

			displayNotification("El artista por defecto no puede ser eliminado");

		}

	}

	function modifyArtist(){

		var oldId = document.getElementById("newId").oldId;
		var newId = document.getElementById("newId").value;
		var newName = fixName(document.getElementById("newName").value);
		var newSurname = fixName(document.getElementById("newSurname").value);
		var newDescriptionId = document.getElementById("newDescription").valueId;
		var newThemeList = document.getElementById("newThemeList").value;

		var files = [
			{"id": "newDescription", "idPHP": "descriptionFile", "extension": "html"}
		];

		var position = searchArtistId(newId)[1];
		var themeListExist = existThemeListId(newThemeList);

		var invalidFileExtension = 0;

		if (newId != oldId) {

			newDescriptionId = newId;

		}

		if ((position == 1 && oldId != newId && oldId != "m_x") || newId == oldId) {

			if (themeListExist == 1) {

				if (newId != "" && newName != "" && newThemeList != "") {

					var formData = new FormData();

					formData.append("idOld", oldId);
					formData.append("id", newId);
					formData.append("name", newName);
					formData.append("surname", newSurname);
					formData.append("descriptionId", newDescriptionId);
					formData.append("themeListId", newThemeList);

					files.forEach(file =>{	/*Evalua el estado de los imput de archivo, de haber algo en su interior y coincidir con la extensión adecuada se subirá al servidor funciona igual para newArtist() modifyTheme() y newTheme()*/

						var newFile = document.getElementById(file.id);

						if (newFile != null && newFile.value != "") {

							if (currentFileExtension(newFile.value) == file.extension) {

								formData.append(file.idPHP, newFile.files[0]);

							}
							else{

								invalidFileExtension++;

							}

						}

					});

					formData.append("setArtistData", 0);

					if (invalidFileExtension == 0) {

						displayNotification("hecho");

						$.ajax({

							type: "POST",

							url: SERVER_ROUTE,

							processData: false, 

							contentType: false,

							data: formData,

							success: function(data){

								loadArtist();

								showArtist(artistList.artists);

								displayThemeData();

							}

						});

					}
					else{

						displayNotification("Extensión de archivo no válida solo se aceptarán archivos 'html' para descripciones y letras, imágenes con formarto 'png' para banderas y portadas y audios con extensión 'mp3'.");


					}

				}
				else{

					displayNotification("Los campos no pueden quedar vacios");

				}

			}
			else{

				displayNotification("La lista de temas no existe");

			}

		}
		else{

			if (oldId != newId && oldId == "m_x") {

				displayNotification("El id del artista por defecto no puede ser modificado");

			}
			else{

				displayNotification("El identificador indicado ya está en uso");

			}

		}

	}

	function newArtist(){

		var newId = document.getElementById("newId").value;
		var newName = fixName(document.getElementById("newName").value);
		var newSurname = fixName(document.getElementById("newSurname").value);
		var newDescriptionId = document.getElementById("newDescription").valueId;
		var newThemeList = document.getElementById("newThemeList").value;

		var files = [
			{"id": "newDescription", "idPHP": "descriptionFile", "extension": "html"}
		];

		var position = searchArtistId(newId)[1];
		var invalidFileExtension = 0;

		if (position == 1) {

			if (newId != "" && newName != "") {

				if (newDescriptionId == "" || newDescriptionId == undefined) {

					newDescriptionId = newId;

				}

				if (newThemeList == "" || newThemeList == undefined) {

					newThemeList = newId;

				}

				var formData = new FormData();

				formData.append("id", newId);
				formData.append("name", newName);
				formData.append("surname", newSurname);
				formData.append("descriptionId", newDescriptionId);
				formData.append("themeListId", newThemeList);

				files.forEach(file =>{

					var newFile = document.getElementById(file.id);

					if (newFile != null && newFile.value != "") {

						if (currentFileExtension(newFile.value) == file.extension) {

							formData.append(file.idPHP, newFile.files[0]);

						}
						else{

							invalidFileExtension++;

						}

					}

				});

				formData.append("setArtistData", 1);

				if (invalidFileExtension == 0) {

					$.ajax({

						type: "POST",

						url: SERVER_ROUTE,

						processData: false, 

						contentType: false,

						data: formData,

						success: function(data){

							loadArtist();

							showArtist(artistList.artists);

							displayThemeData();

						}

					});

				}
				else{

					displayNotification("Extensión de archivo no válida solo se aceptarán archivos 'html' para descripciones y letras, imágenes con formarto 'png' para banderas y portadas y audios con extensión 'mp3'.");

				}

			}
			else{

				displayNotification("Los campos no pueden quedar vacios");

			}

		}
		else{

			displayNotification("El identificador indicado ya está en uso");

		}

	}

	function deleteTheme(){

		var checkboxConfirmation = document.getElementById("checkboxConfirmation");
		var position = searchCheckedRadio();
		var radioButton = document.getElementsByClassName("radioManager")[position];
		var listId = themeListId(radioButton.artistData.id);
		var themeId = radioButton.themeData.id;

		if (checkboxConfirmation && checkboxConfirmation.checked) {

			showConfirmationWindowTheme = 1;

		}

		if (!(radioButton.artistData.id == "m_x" && radioButton.artistData.themeList.length < 2)) {

			$.ajax({

				type: "POST",

				url: SERVER_ROUTE,

				data: {deleteTheme: {"listId": listId,"themeId": themeId}},

				success: function(data){

					var deleteWindow = document.getElementById("confirmationWindow");

					displayNotification("Tema eliminado");

					if (deleteWindow) {

						displayConfirmationWindow();

					}

					displayManagerWindow();

					loadArtist();

					showArtist(artistList.artists);

					displayManagerWindow();

				}

			});

		}
		else{

			displayNotification("El artista por defecto debe tener al menos un tema");

		}

	}

	function modifyTheme(){

		var artistId = document.getElementById("newId").artistId;
		var oldId = document.getElementById("newId").oldId;
		var newId = document.getElementById("newId").value;
		var newName = fixName(document.getElementById("newName").value);
		var newFlagId = document.getElementById("newFlag").value;
		var newLyricsId = document.getElementById("newLyricsFile").valueId;
		var newLyricsTranslateId = document.getElementById("newLyricsTranslateFile").valueId;

		var files = [
			{"id": "newFlagFile", "idPHP": "flagFile", "extension": "png"},
			{"id": "newLyricsFile", "idPHP": "lyricsFile", "extension": "html"},
			{"id": "newLyricsTranslateFile", "idPHP": "lyricsTranslateFile", "extension": "html"},
			{"id": "newPicture", "idPHP": "pictureFile", "extension": "png"},
			{"id": "newTheme", "idPHP": "audioFile", "extension": "mp3"}
		];

		var invalidFileExtension = 0;

		if (newId != oldId) {

			newLyricsId = newId;

			newLyricsTranslateId = newId;

		}

		var position = searchThemeId(artistId, newId);

		if (position == -1 || newId == oldId) {

			if (newId != "" && newName != "" && newFlag != "") {

				var formData = new FormData();

				formData.append("artistId", artistId);
				formData.append("idOld", oldId);
				formData.append("id", newId);
				formData.append("name", newName);
				formData.append("flag", newFlagId);
				formData.append("lyricsId", newLyricsId);
				formData.append("lyricsTranslateId", newLyricsTranslateId);

				files.forEach(file =>{

					var newFile = document.getElementById(file.id);

					if (newFile != null && newFile.value != "") {

						if (currentFileExtension(newFile.value) == file.extension) {

							formData.append(file.idPHP, newFile.files[0]);

						}
						else{

							invalidFileExtension++;

						}
						
					}

				});

				formData.append("setThemeData", 0);

				if (invalidFileExtension == 0) {

					$.ajax({

						type: "POST",

						url: SERVER_ROUTE,

						processData: false, 

						contentType: false,

						data: formData,

						success: function(data){

							loadArtist();

							showArtist(artistList.artists);

							displayThemeData();

						}

					});

				}
				else{

					displayNotification("Extensión de archivo no válida solo se aceptarán archivos 'html' para descripciones y letras, imágenes con formarto 'png' para banderas y portadas y audios con extensión 'mp3'.");

				}

			}
			else{

				displayNotification("Los campos no pueden quedar vacios");

			}

		}
		else{

			displayNotification("El identificador indicado ya está en uso");

		}

	}

	function newTheme(){

		var artistId = document.getElementById("artistId").value;
		var artistIdExist = document.getElementById("artistId").exist;
		var newId = document.getElementById("newId").value;
		var newName = fixName(document.getElementById("newName").value);
		var newFlagId = document.getElementById("newFlag").value;
		var newLyricsId = document.getElementById("newLyricsFile").valueId;
		var newLyricsTranslateId = document.getElementById("newLyricsTranslateFile").valueId;

		var files = [
			{"id": "newFlagFile", "idPHP": "flagFile", "extension": "png"},
			{"id": "newLyricsFile", "idPHP": "lyricsFile", "extension": "html"},
			{"id": "newLyricsTranslateFile", "idPHP": "lyricsTranslateFile", "extension": "html"},
			{"id": "newPicture", "idPHP": "pictureFile", "extension": "png"},
			{"id": "newTheme", "idPHP": "audioFile", "extension": "mp3"}
		];

		var invalidFileExtension = 0;

		if (artistIdExist == 0 && newId != "" && newName != "" && newFlag != "") {

			var position = searchThemeId(artistId, newId);

			if (position == -1) {

				if (newLyricsId == "" || newLyricsId == undefined) {

					newLyricsId = newId;

				}

				if (newLyricsTranslateId == "" || newLyricsTranslateId == undefined) {

					newLyricsTranslateId = newId;

				}

				var formData = new FormData();

				formData.append("artistId", artistId);
				formData.append("id", newId);
				formData.append("name", newName);
				formData.append("flag", newFlagId);
				formData.append("lyricsId", newLyricsId);
				formData.append("lyricsTranslateId", newLyricsTranslateId);

				files.forEach(file =>{

					var newFile = document.getElementById(file.id);

					if (newFile != null && newFile.value != "") {

						if (currentFileExtension(newFile.value) == file.extension) {

							formData.append(file.idPHP, newFile.files[0]);

						}
						else{

							invalidFileExtension++;

						}

					}

				});

				formData.append("setThemeData", 1);

				if (invalidFileExtension == 0) {

					$.ajax({

						type: "POST",

						url: SERVER_ROUTE,

						processData: false, 

						contentType: false,

						data: formData,

						success: function(data){

							loadArtist();

							showArtist(artistList.artists);

							displayThemeData();

						}

					});

				}
				else{

					displayNotification("Extensión de archivo no válida solo se aceptarán archivos 'html' para descripciones y letras, imágenes con formarto 'png' para banderas y portadas y audios con extensión 'mp3'.");

				}

			}
			else{

				displayNotification("El identificador indicado ya está en uso");

			}

		}
		else{

			displayNotification("Los campos no pueden quedar vacios");

		}

	}

	function setUserDataModifications(attribute, oldValue = ""){

		var darkModeButton = {"true":"", "false":"Dark"};
		var newValue = "";
		var isName = false;
		var userExist = false;
		var send = false;
		
		var formData = new FormData();
		formData.append("modifyUserData", 0);
		formData.append("user", clearUserName(userName));
		formData.append("attribute", attribute);

		if (attribute == "avatar") {

			var file = event.target.files[0];

			if (currentFileExtension(event.target.value) == "png") {

				formData.append("value", event.target.files[0]);
				send = true;

			}
			else {

				displayNotification("Extensión de archivo no válida solo se aceptarán archivos de imagen con formarto 'png'.");

			}

		}
		else if (attribute == "password") {

			newValue = event.target.value;

			if (validatePassword(event.target.value) == 1) {
				
				if (repassword == 0) {

					displayNotification("Introduzca nuevamente la contraseña.");
					repassword = 1;
					repasswordValue = newValue;
					$(event.target).val("").focus();

				}
				else{

					if(newValue == repasswordValue){

						displayNotification("La contraseña ha sido cambiada satisfactoriamente.");
 
						formData.append("value", newValue);

						repassword = 0;
						repasswordValue = 0;
						newValue = oldValue;

						send = true;

					}
					else{

						repassword = 0;
						repasswordValue = 0;
						newValue = oldValue;

						displayNotification("Las contraseñas no coinciden.");

					}

				}

			}
			else{

				repassword = 0;
				repasswordValue = 0;
				newValue = oldValue;

				if (event.target.value.length > 0) {

					displayNotification("Contraseña no válida, recuerda que debe tener una longitud de al menos cuatro carácteres y menos que dieciseís, una letra minúscula, una mayuscula, un número y un signo de puntuación.");

				}

			}

		}
		else{

			isName =  (attribute == "userName") ? true : false;
			newValue = event.target.value;
			userExist =  (isName == true && searchUserData(newValue, "userName") != "") ? true : false;

			if (oldValue != newValue) {

				if (isName == false || isName == true && userExist == false) {

					formData.append("value", newValue);

					send = true;

				}
				else if (isName == true && userExist == true) {

					newValue = oldValue;
					displayNotification("El nombre de usuario ya está en uso");

				}

			}

		}

		if (send == true) {

			$.ajax({

				type: "POST",

				url: SERVER_ROUTE,

				async: false,

				processData: false, 

				contentType: false,

				data: formData,

				success: function(data){

					console.log(data);

				}

			});

			if (attribute == "avatar") {

				setUserValues();
				showArtist(artistList.artists);

			}

			if (isName == true && userExist == false) {

				userName = "@" + newValue;
				var LastThemeValue = localStorage.getItem("@" + oldValue + "LastTheme");
				var LastTheme = (LastThemeValue == "@" + oldValue) ? userName : oldValue;
				var LastThemePosition = localStorage.getItem("@" + oldValue + "LastThemePosition");
				var darkMode = localStorage.getItem("@" + oldValue + "DarkTheme");

				loadUserThemeList(userName);
				artistList.artists.delete("@" + oldValue);
				localStorage.setItem(userName + "LastTheme", LastTheme);
				localStorage.removeItem("@" + oldValue + "LastTheme");
				localStorage.setItem(userName + "LastThemePosition", LastThemePosition);
				localStorage.removeItem("@" + oldValue + "LastThemePosition");
				localStorage.setItem(userName + "DarkTheme", darkMode);
				localStorage.removeItem("@" + oldValue + "DarkTheme");
				localStorage.setItem(userName + "AutoPlayList", playListThemeAuto);
				localStorage.removeItem("@" + oldValue + "AutoPlayList");
				localStorage.setItem(userName + "RepeatPlayList", playListThemeRepeat);
				localStorage.removeItem("@" + oldValue + "RepeatPlayList");
				localStorage.setItem(userName + "RandomPlayList", playListThemeRepeat);
				localStorage.removeItem("@" + oldValue + "RandomPlayList");

				localStorage.setItem(userName + "PanelInstructions", localStorage.getItem(userName + "PanelInstructions"));
				localStorage.removeItem("@" + oldValue + "PanelInstructions");
				localStorage.setItem(userName + "WelcomeMessage", localStorage.getItem(userName + "WelcomeMessage"));
				localStorage.removeItem("@" + oldValue + "WelcomeMessage");

				setUserValues();
				showArtist(artistList.artists);
				updateArtistMenu(userName);

			}

		}

		if (attribute != "avatar" && repassword != 1){

			var dataClass = (attribute == "userName") ? "dataPreviewName" : "dataPreview" ;

			$elementData = $("<p></p>").append(newValue).addClass(dataClass).data({"attribute":attribute}).insertBefore(event.target);
			$(event.target).remove();

		}

	}

/////////////////////////////////////
//FUNCIONES DE TRATAMIENTO DE DATOS//
/////////////////////////////////////

	function clearUserName(userName){ /*El tratamiento de usuarios se hace con @[Ususario] para evitar conflictos con los artistas y sus listas este método limpia la @ para cuando se vaya mostrar el nombre*/

		return userName.split("@")[1];

	}

	function backPrintRatioCalculator(position){	/*Calcula cuantas posiciones podemos retroceder en el panel de temas en base a la posición actual y la longitud de la lista*/

		var backPrintRatio = position - 3;

		if (backPrintRatio < 0) {

			backPrintRatio = 0;

		}

		return backPrintRatio

	}

	function nextPrintRatioCalculator(totalThemes, position){	/*Calcula cuantas posiciones podemos avanzar en el panel de temas en base a la posición actual y la longitud de la lista*/

		var printThemes = (((totalThemes / 3) - (position / 3)) * 3);

		if (printThemes > 3) {

			printThemes = 3;

		}

		printThemes = position + printThemes;

		if (printThemes > totalThemes) {

			printThemes = totalThemes;

		}

		return printThemes;

	}
	
	function filterArtist(){	/*Filtrado de la lista de artistas en el Cajon principal*/

		var filter = document.getElementById("filterInput").value;

		artistFilterList = new ArtistList();

		artistFilterList.artists.set("newArtist", new Artist("newArtist", "Nuevo", "", "", [{"id": "newArtist"}]));

		artistList.filterList(artistFilterList, filter);

		displayShowcase(artistFilterList.artists);

	}

	function fixName(text){	/*Arregla los nombres poniendo en mayúsculas el primer caracter y el resto en minúsculas, limpiando las @s y quitando espacios por delante y por detrás*/

		if (text.length > 0) {

			textArray = text.split(" ");

			text = "";

			for (var i = 0; i < textArray.length; i++) {
				
				text = text + textArray[i].substr(0, 1).toUpperCase() + textArray[i].substr(1).toLowerCase() + " ";

			}

		}

		text.replace("@", "");

		return text.trim();

	}

	function currentFileExtension(route){

		var fileCurrent = route.split("/");
		var fileCurrent = fileCurrent[fileCurrent.length - 1].split(".");

		return fileCurrent[1];

	}

	function currentFileName(route){

		var fileCurrent = route.split("/");
		var fileCurrent = fileCurrent[fileCurrent.length - 1].split(".");

		return fileCurrent[0];

	}

	function currentArtistIds(){	/*Devuelve todos los id relacionados a sus correspondientes artistas*/

		var list = Array.from(artistList.artists.keys());
		var idList = ["Ids en uso:"];

		list.forEach(key =>{

			idList.push("[" + key + "]");

		});

		return idList;

	}

	function currentThemeListsIds(){	/*Devuelve todos los ids de listas de temas disponibles, asociados a un artista o no*/

		var themeListsId = "";

		$.ajax({

			type: "GET",

			url: SERVER_ROUTE,

			async: false,

			data: {themeListsId: ""},

			success: function(data){

				themeListsId = JSON.parse(data);

			}

		});

		return themeListsId;

	}


	function currentThemeIds(artistId){	/*Devuelve los ids de los temas relacionados a la lista asociada el artista indicado*/

		var list = artistList.artists.get(artistId);
		var idList = ["Ids en uso:"];

		if (list) {

			list = list.themeList

			list.forEach(theme =>{

				idList.push("[" + theme.id + "]");

			});

		}

		return idList;

	}

	function searchCheckedRadio(){	/*Busca la posición del input marcado*/

		var radioButtons = document.querySelectorAll(".radioManager");

		var position = -1;

		do{

			position++;

		}while(position < radioButtons.length && radioButtons[position].checked == false);

		if (position == radioButtons.length) {

			return -1;

		}

		return position;

	}

	function searchArtistId(artistId){	/*Busca un artista por su id y de encontrarlo muestra su nombre y apellidos en el Cajon Secundario para nuevos temas*/

		var list = artistList.artists.get(artistId);

		if (list != undefined) {

			return [list.name + " " + list.subname, 0];

		}
		else{

			return ["No disponible", 1]

		}

	}

	function existThemeListId(themeList){	/*Comprueba la existencia de un id de lista*/

		var themeListExist = -1;

		$.ajax({

			type: "POST",

			url: SERVER_ROUTE,

			async: false,

			data: {themeListExist: themeList},

			success: function(data){

				themeListExist = data;

			}

		});

		return themeListExist;

	}

	function themeListId(artistId){		/*Devuelve el valor del id de lista relacionado al artista proporcionado*/

		var listId = "";

		$.ajax({

			type: "POST",

			url: SERVER_ROUTE,

			async: false,

			data: {themeListId: artistId},

			success: function(data){

				listId = data;

			}

		});

		return listId;

	}

	function searchThemeId(artistId, themeId){	/*Comprueba la existencia de un id de tema en la lista asociada a un artista*/

		var list = artistList.artists.get(artistId).themeList;
		var i = 0;
		var position = -1;

		list.forEach(theme =>{

			if (theme.id == themeId) {

				position = i;

			}

			i++;

		});

		return position;

	}

	function validatePassword(password){

		var length = (password.length > 0 && password.length < 17) ? 1 : 0;
		var numberIn = (password.match(/[1-9]/)) ? 1 : 0;
		var minusIn = (password.match(/[a-z]/)) ? 1 : 0;
		var mayusIn = (password.match(/[A-Z]/)) ? 1 : 0;
		var signIn = (password.match(/\.|\,/)) ? 1 : 0;

	    if (length != 0 && numberIn != 0 && minusIn != 0 && mayusIn != 0 && signIn != 0) {

	    	return 1;

	    }
	    else{

	    	return 0;

	    }
	     	 
	}

	function generatePlayList(positionStart){

		playList = [];

		if (playListThemeRandom == 0) {

			for (var i = 0; i < $(".themeContainer").length; i++) {
			
				playList.push(i);

			}

		}
		else{

			playList.push(positionStart);

			do{

				var position = 0;

				do{

					position = Math.floor(Math.random() * $(".themeContainer").length);

				}while(playList.indexOf(position) != -1 && position != 0)

				if (playList.indexOf(position) == -1) {

					playList.push(position);

				}

			}while(playList.length < $(".themeContainer").length)

		}

		playList.push(playList.indexOf(positionStart));

	}

///////////////////////
//FUNCIONES DE SESION//
///////////////////////

	function setUserValues(){

		var userNameDisplay = document.getElementById("userName");
		var userProfileImage = document.getElementById("userProfileImage");
		isAdmin = searchUserData(clearUserName(userName), "admin");	/*Comprueba si el usuario que ha iniciado seción tiene privilegios de administrador*/

		userNameDisplay.addEventListener("click", sessionOff);
		userProfileImage.addEventListener("click", sessionOff);
		userProfileImage.src = "../media/image/users/" + searchUserData(clearUserName(userName), "avatar") + ".png";

		userProfileImage.className = (isAdmin == 1) ? "adminPictureHalo" : "userPictureHalo";

		userNameDisplay.innerHTML = clearUserName(userName);

		lightMode(1);

	}

	function searchUserData(userName, dataName, dataValue = ""){	/*Devuelva un valor asociado al usuario según el parametro que reciba*/

		var result;

		var formData = new FormData();

		formData.append("userName", userName);
		formData.append("dataName", dataName);
		formData.append("dataValue", dataValue);
		formData.append("searchUserData", 0);

		$.ajax({

			type: "POST",

			url: SERVER_ROUTE,

			processData: false, 

			contentType: false,

			async: false,

			data: formData,

			success: function(data){

				result = JSON.parse(data)["dataValue"];

			}

		});

		return result;

	}

	function sessionOn(value){

		var errorMessage = "Solo los usuarios registrados pueden visualizar la página";

		$.ajax({

			type:"GET", 

			url:SERVER_ROUTE, 

			data:{valideSession:1},

			async: false, 

			success(status){

				(status == "") ? disconectSession(errorMessage) : [userName = status, setUserValues()]

			}
		});
		
	}

	function sessionOff(){

		$.ajax({

	    type: "POST",

	    url: '../php/functions.php',

	    data: {sessionOff: ""},

	    success: function () {

	    			disconectSession("Sesion cerrada");
	                  
	            }

		});	

	}

	function disconectSession(text ,page = "index.php"){	/*Al cerrar sesion te devuelve a la página de acceso*/

		var blackScreen = document.createElement("div");

		$(window).on("scroll", function(){window.scrollTo(window.scrollY,window.scrollX)});

		$(document.body).off("keypress", accesibilityKeysActivation);

		blackScreen.id = "blackScreenOverMenu";

		document.getElementsByTagName("body")[0].appendChild(blackScreen);

		displayNotification(text);

		enableAccesibilityKeys(true);

		setTimeout(function(){
  			window.location.href = page;
		}, 4000);

	}