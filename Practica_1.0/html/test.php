	<?php
		include "../php/functions.php";

		session_start();

		error_reporting(0);
	?>

	<!DOCTYPE html>
	<!DOCTYPE html>
	<html>
	<head>
		<meta charset="UTF8">
 		<link rel="stylesheet" href="../css/index.css">
		<title>Formulario</title>
		<link rel="icon" href="../media/image/logoPrincipal.png">
	</head>
	<body> 
		<form action="../php/functions.php" method="post">
			 <input type="submit" name="test" value="submit">	
		</form>
		<script>
			
			var value = <?php echo searchUser(0, "User01", "0101", "x") ?> 

			alert(value);

		</script>
	</body>
	</html>