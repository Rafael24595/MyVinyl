	<?php

		error_reporting(0);

		session_start();

	?>

	<!DOCTYPE html>
	<!DOCTYPE html>
	<html>
	<head>
		<meta charset="UTF8">
 		<link rel="stylesheet" href="../css/index.css">
 		<link rel="stylesheet" href="../css/notification.css">
		<title>MyVinyl</title>
		<link rel="icon" href="../media/image/s-vinyl.png">
	</head>
	<body>
		<div id="log_in_box">
			<form id="log_in_form" action="../php/functions.php" method="post">
				<h2 id="log_in_title">Acceso</h2>
				<p id="userP">Usuario:</p>
				<input type="text" id="userILog" name="user" placeholder="Usuario" pattern="[A-Za-záéíóúÁÉÍÓÚñÑ]{1,25}" autofocus="autofocus" onkeyup="enableButtonLogIn()">
				<br>
				<p id="password1P">Contraseña:</p>
				<input type="password" id="passwordILog" name="password" placeholder="***********" pattern="[A-Za-z0-9,.]{1,16}" onkeyup="enableButtonLogIn()">
				<br><br><br>
				<input id="submit_buttonLog" type="button" value="Enviar" disabled onclick="logIn()">
				<br><br><br>
				<p id="sign_up" onclick="switchScreen(1)">Registrarse</p>
			</form>
		</div>
		<div id="sign_up_box" hidden>
			<form id="sing_up_form" action="../php/functions.php" method="post">
				<h2 id="sign_up_title">Registro</h2>
				<p id="userP">Usuario:</p>
				<input type="text" id="userI" name="user" placeholder="Usuario" pattern="[A-Za-záéíóúÁÉÍÓÚñÑ]{1,25}" autofocus="autofocus" onkeyup="enableButtonSignUp()">
				<br>
				<p id="emailP">Correo electrónico:</p>
				<input type="email" id="emailI" name="email" placeholder="User0311@example.com" pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$" onblur="validateMail()" onkeyup="validateMail()">
				<br>
				<p id="passwordMinInfo" onmouseover="displayInfo(1)" onmouseleave="displayInfo(0)" hidden>Debe contener una mayúscula, una minúscula, un número, un signo de puntuación y ser mayor de ocho carácteres pero menor de dieciseís.</p>
				<p id="password1P"><span id="passwordMin" onmouseover="displayInfo(1)" onmouseleave="displayInfo(0)">*</span>Contraseña:</p>
				<input type="password" id="password1I" name="password" placeholder="***********" onblur="validatePassword()" onkeyup="validatePassword()">
				<img src="../media/image/eye.png" id="eyePsI" onclick="showPassword(0)">
				<img src="../media/image/eyeSw.png" id="eyePsISw">
				<p id="password2P">Repetir contraseña:</p>
				<input type="password" id="password2I" name="password" placeholder="***********" onblur="validateRepassword()" onkeyup="validateRepassword()">
				<img src="../media/image/eye.png" id="eyePsII" onclick="showPassword(1)">
				<img src="../media/image/eyeSw.png" id="eyePsIISw">
				<br><br>
				<div id="termsBox">
					<input type="checkbox" name="terms" value="terms" id="termsCheck" onclick="enableButtonSignUp()">	
					<p id="termsBoxP"> Estoy de acuerdo con los <span id="termsLink"><a href="termsConditions.html" target="blank"> terminos y condiciones</a></span></p>
				</div>			
				<br><br>
				<input id="submit_button" type="button" value="Enviar" disabled onclick="signUp()">
			</form>			
			<br><br><br>
			<p id="log_in" onclick="switchScreen(0)">Ya estoy registrado</p>
		</div>
		<script src="../js/libs/jQueryv3.5.1.js"></script>
		<script src="../js/libs/crypto-js_4.0.0_core_min.js"></script>
		<script src="../js/libs/crypto-js_4.0.0_md5.js"></script>
		<script src="../js/notification.js"></script>
		<script src="../js/index.js"></script>		
	</body>
	</html>