function displayNotification(text = " "){

	var body = document.getElementsByTagName("body")[0];
	var notificationCountainer = document.createElement("div");
	var notificationText = document.createElement("p");
	var deleteWindow = document.getElementById("notificationWindow");

	if (deleteWindow) {

		deleteWindow.remove();

	}

	notificationCountainer.id= "notificationWindow";
	notificationText.appendChild(document.createTextNode("Alerta: \"" + text + "\""));

	if(typeof lightOn != 'undefined' && lightOn == false){

		notificationCountainer.classList.add("dark");

	}

	body.appendChild(notificationCountainer);
	notificationCountainer.appendChild(notificationText);

	setTimeout(function(){
  		notificationCountainer.classList.add("active");
	}, 1);	

	setTimeout(function(){
  		notificationCountainer.classList.remove("active");
	}, 4500);	

	setTimeout(function(){
  		notificationCountainer.remove();
	}, 5000);	

}