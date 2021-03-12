var correctUser = false;
var correctEmail = false;
var correctPassword = false;
var correctRepassword = false;
var checkTerms = false;
var passwordEye = [["password1I", 0, "eyePsI"],["password2I", 0, "eyePsII"]];

function switchScreen(type) {

	var hideBox = sign_up_box;
	var showBox = log_in_box;
	var formReset = sing_up_form;

	if (type > 0) {

		hideBox = log_in_box;
		showBox = sign_up_box;
		formReset = log_in_form;

	}
	
	hideBox.style.display = "none";

	showBox.style.display = "block";

	formReset.reset();

}

function displayInfo(value) {

	var passwordInfo = document.getElementById("passwordMinInfo");

	if (value > 0) {

		passwordInfo.style.display = "block";

	}
	else{

		passwordInfo.style.display = "none";

	}
	
}

function validateMail(){

	var myMail = document.getElementById('emailI').value;
	var emailI = document.getElementById("emailI");
	          
	if((myMail.indexOf("@") > -1) && (myMail.indexOf(".") > -1) && myMail.length>5 && (myMail.indexOf("@") != 0) && (myMail.indexOf(".") != myMail.indexOf("@")+1)){

		emailI.style.color = "green";

		correctEmail = true;

	}
	else{

	    emailI.style.color = "red";

	    correctEmail = false;

	}

	enableButtonSignUp();

}

function validatePassword(){

		var password1I = document.getElementById("password1I");
		var password2I = document.getElementById("password2I");

		var myPassword = password1I.value;
	    var myRepassword = password2I.value;

		var numberIn=0;
		var mayusIn=0;
		var minusIn=0;
		var signIn=0;

	    for (var i = 0; i < myPassword.length; i++) {

	        var myPasswordChar= myPassword.charCodeAt(i);

	        if(myPasswordChar>47 && myPasswordChar<58){

	            numberIn=numberIn+1;

	        }
	        if(myPasswordChar>64 && myPasswordChar<91){

	          	mayusIn=mayusIn+1;

	        }
	        if(myPasswordChar>96 && myPasswordChar<123){

	          	minusIn=minusIn+1;

	        }
	        if(myPasswordChar==44 || myPasswordChar==46){

	          	signIn=signIn+1;

	        }
	    }

	    if(numberIn>=1 && mayusIn>=1 && minusIn>=1 && signIn>=1 && (myPassword.length>=8 && myPassword.length<=16)){
	     	 	
	     	password1I.style.color = "green";

	     	correctPassword = true;

	    }
	    else{
	     	 	
	     	password1I.style.color = "red";

	     	correctPassword = false;

	    }

	    if(myRepassword!=undefined && myPassword!=myRepassword){

	     	password2I.style.color = "red";

	    }
	    else if(myRepassword!=undefined && myPassword==myRepassword){

	     	password2I.style.color = "green";

	    }

	    enableButtonSignUp();
	     	 
}

function validateRepassword(){

	var password2I = document.getElementById('password2I');

	var myPassword = document.getElementById('password1I').value;

	var myRepassword = password2I.value;

	if(correctPassword==true && myPassword===myRepassword){

		password2I.style.color = "green";

		correctRepassword = true;
	     	 
	}
	else{

	    password2I.style.color = "red";

	    correctRepassword = false;

	}	

	enableButtonSignUp();		
}

function showPassword(value){

	var passwordId = document.getElementById(passwordEye[value][0]);
	var eyeImage = document.getElementById(passwordEye[value][2]);

	var passType;
	var passPlaceholder;
	var eyeState;

	if (passwordEye[value][1] == 0) {

		passType = "text";

		passPlaceholder = "12345678Aa.";

		eyeState = "eyeActive";

		passwordEye[value][1] = 1;

	}
	else{

		passType = "password";

		passPlaceholder = "***********";

		passwordEye[value][1] = 0;

		eyeState = "eye";

	}

	passwordId.type = passType;

	passwordId.placeholder = passPlaceholder;

	eyeImage.src = "../media/image/" + eyeState + ".png";

}

function enableButtonSignUp(){

	var submitButton = document.getElementById("submit_button");

	var userName = document.getElementById('userI').value;


	if(userName!=undefined && userName!=null && userName.length!=0){

	    correctUser = true;

	}
	else{

		correctUser = false;

	}

	if(document.getElementById('termsCheck').checked){

		checkTerms = true;

	}
	else{

		checkTerms = false;

	}

	if(correctUser==true && correctEmail==true && correctPassword==true && correctRepassword==true && checkTerms==true){

		submitButton.disabled = false;

		submitButton.style.cursor= "pointer";

	}
	else{

		submitButton.disabled = true;

		submitButton.style.cursor= "default";

	}	

}

function enableButtonLogIn(){

	var submit_button = document.getElementById("submit_buttonLog");


	var userName = document.getElementById('userILog').value;
	var userPassword = document.getElementById('passwordILog').value;

	if(userName!=undefined && userName!=null && userName.length!=0 && userPassword!=undefined && userPassword!=null && userPassword.length!=0){

		submit_button.disabled = false;

		submit_button.style.cursor= "pointer";

	}
	else{

		submit_button.disabled = true;

		submit_button.style.cursor= "default";

	}

}

function logIn(){

	var userName = document.getElementById("userILog").value;
	var password = document.getElementById("passwordILog").value;

	var formData = new FormData();

	formData.append("userName", userName);
	formData.append("dataName", "password");
	formData.append("dataValue", password);
	formData.append("searchUserData", 0);

	$.ajax({

    type: "POST",

    url: '../php/functions.php',

    processData: false, 

	contentType: false,

    data: formData,

    success: function (data) {

	    	var data = JSON.parse(data);

	    	if (data["userExists"] == 1) {

	    		if (data["dataEquals"] == 1) {

					window.location.href = "../php/functions.php?logIn=1&userName=" + userName + "&password=" + password;

				}
				else{

					displayNotification("Contraseña incorrecta");

				}

	    	}
	    	else{

	    		displayNotification("Usuario incorrecto");

	    	}
                  
        }

	});
	
}

function signUp(){

	var userName = document.getElementById("userI").value;
	var password = document.getElementById("password1I").value;
	var email = document.getElementById("emailI").value;

	var formData = new FormData();

	formData.append("userName", document.getElementById("userI").value);
	formData.append("dataName", "email");
	formData.append("dataValue", document.getElementById("emailI").value);
	formData.append("searchUserData", 0);

	$.ajax({

    type: "POST",

    url: '../php/functions.php',

    processData: false, 

	contentType: false,

    data: formData,

    success: function (value) {

    	var data = JSON.parse(value);

	    	if (data["userExists"] == 0) {

	    		if (data["dataCoincidence"] == 0) {

	    			$.post(
	    				"../php/functions.php", 
	    				{signUp:1, userName: userName, password: password, email: email},
	    				function(){window.location.href = "../php/functions.php?logIn=1&userName=" + userName + "&password=" + password});

				}
				else{

					displayNotification("Contraseña incorrecta");

				}

	    	}
	    	else{

	    		displayNotification("Ya existe un usuario asociado al correo electrónico");

	    	}
                  
        }

	});

}