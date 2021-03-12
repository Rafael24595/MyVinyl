 Instrucciones generales de uso:   

   ///////////////////
   // BASE DE DATOS //
   ///////////////////

	-Para crear la base de datos, la cual va a contener la información de los usuarios, artistas y temas acceder a la siguiente URI:
	
		"http://localhost/Practica_1.0/data/Create_Database.php?create"

	-Para guardar los cambios realizados en la sesión en un documento de texto (el mismo que se usa para crear la base) acceder a la siguiente URI (Esto puede no funcionar correctamente, no se ha testeado en las últimas versiones):

		"http://localhost/Practica_1.0/data/Create_Database.php?save"


    ////////////
    // ACCESO //
    ////////////

	-Usuarios:

		Nombre: admin  | Contraseña: admin | Rango*: administrador
		Nombre: User01 | Contraseña: 0101  | Rango*: usuario
		Nombre: User02 | Contraseña: 0202  | Rango*: usuario
		Nombre: User03 | Contraseña: 0303  | Rango*: usuario

		*El rango establece los derechos para dar de alta, dar de baja o modificar los temas y artistas de la base de datos. Se puede acceder a esta función mendiante el boton "Administrar temas".


   //////////////
   //IMPORTANTE//
   //////////////

	-Se le ha dado mayor prioridad (por falta de tiempo) a la alta, baja y modificación de artistas y temas, si bien existe la posibilidad de dar de alta a nuevos usuarios esta función no está pulida del todo y puede dar errores	(falta testeado).

	-Debido al limitante por parte del aula virtual a la hora de subir el proyecto, este cuenta únicamente con el material audiovisual básico para su correcta visualización. El siguiente enlace contiene un archivo comprimido con el 	material restante (el cual se hace necesario para comprobar el correccto funcionamiento de diversas acciones dentro de la página): "https://drive.google.com/file/d/10xP4bpkfm1BxDISnRU2HOSMjEGP_RAFN/view?usp=sharing"

	-El control por teclado no está implementado en su totalidad, por lo que puede que no se pueda acceder a todas las funcionalidades presentes en la web a través de dicho método. Funcionalidades cubiertas:

		- R_Shift + O = Habilitar/deshabilitar control por teclado.
		- R_Shift + C = Cerrar sesión.
		- M = Abrir/cerrar menú.
		- L = Habilitar/deshabilitar tema oscuro.
		
		-8 = Mover el cursor arriba (Con Bloq Num activado).
		-4 = Mover el cursor a la izquierda (Con Bloq Num activado).
		-6 = Mover el cursor a la derecha (Con Bloq Num activado).
		-2 = Mover el cursor abajo (Con Bloq Num activado).
		-Intro = Aceptar.
		-Backspace = Cancelar.
 		-Esc = Cerrar menú.

		-W = Play/pause.
		-Q = Tema anterior.
		-E = Siguiente tema.
		-A = Reproducción aleatoria.
		-S = Reproducción Continuada.
		-D = Repetición en bucle.
