	<?php

		error_reporting(0);

		session_start();
		
	?>

	<!DOCTYPE html>
	<html>
	<head>
		<meta charset="UTF8">
		<link rel="stylesheet" href="../css/notification.css">
 		<link rel="stylesheet" href="../css/page.css"/>
		<title>MyVinyl</title>
		<link rel="icon" href="../media/image/s-vinyl.png">
	</head>
	<body>
		<div id="menu">
			<ul class="styleNone">
				<li class="menuOpt"><span class="bigOption" onclick="openSub('user')">Perfil</span>
					<ul>
					</ul>
				</li>
				<li class="menuOpt"><span class="bigOption"  onclick="openSub()">Noticias</span>
					<ul>
					</ul>
				</li>
				<li class="menuOpt"><span class="bigOption"  onclick="openSub('artist')">Artistas</span>
					<ul id="artistMenu">
					</ul>
				</li>
			</ul>
		</div>
		<div id="header">
			<div id="menuButtonBackg" onclick="menuOn()" onmouseover="buttonAnimation(0)" onmouseleave="buttonAnimation(1)">
				<div id="menuButtonBars">
					<p class="bar"></p>
					<p class="bar"></p>
					<p class="bar"></p>
				</div>
			</div>
			<div id="userInformationContainer">
				<img src="../media/image/users/defaultProfile.png" id="userProfileImage">
				<p id="userName">user</p>
			</div>
		</div>
		<div id="middle">
			<div id="left">
				<div class="titles">
					<p>Letra</p>
				</div>
			</div>
			<div id="centre">
			</div>
			<div id="right">
				<div class="titles">
					<p>Canciones</p>
				</div>
			</div>
		</div>
		<div id="footer"></div>
		<img src="../media/image/light.png" id="bulb" onclick="lightMode()">
		<audio id="switch"><source src="../media/audio/switch.wav" type="audio/mpeg"></audio>
		<audio id="cdout"><source src="../media/audio/cdout.mp3" type="audio/mpeg"></audio>
		<audio id="ding"><source src="../media/audio/ding.wav" type="audio/mpeg"></audio>
		<audio id="pop"><source src="../media/audio/pop.mp3" type="audio/mpeg"></audio>
		<div id="blackScreen" onclick="menuOn()"></div>
		<script src="../js/libs/jQueryv3.5.1.js"></script>
		<script src="../js/libs/JQuery-ui_1.12.1.js"></script>
		<script src="../js/libs/crypto-js_4.0.0_core_min.js"></script>
		<script src="../js/libs/crypto-js_4.0.0_md5.js"></script>
		<script src="../js/notification.js"></script>
		<script src="../js/classes/artistList.js"></script>
		<script src="../js/my_root.js"></script>	
		<script src="../js/page.js"></script>
	</body>
	</html>