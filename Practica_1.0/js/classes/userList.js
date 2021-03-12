class User{

	constructor(userName, email, password, picture){

		this.userName = userName;
		this.email = email;
		this.password = password;
		this.picture = picture || "noProfilePicture.png";
		
	}
	toString(){

		return "Nombre de usuario: " + this.userName + " - Correo electronico: " + this.email + " - Contraseña: " + this.password;

	}

}

class UserList{

	constructor(users){

		this.users = users || [];
		
	}

	newUser(userName, email, password, picture = "sinFoto.png", tipo = 0){

		if (tipo == 0) {

			this.users.push(new User(userName, email, password, picture));

		}

		if (tipo == 1) {

			this.users.unshift(new User(userName, email, password, picture));

		}


	}

}