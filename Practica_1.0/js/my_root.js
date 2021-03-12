var rootsEye;
var rootsTalk;
var rootsBooring;
var rootsAngry;
var rootTalkTime = 0;
var specialEye = "";
var rootsMouth = "";
var rootsAngryLevel = 0;

function rootsNotification(title = "", contents = ""){

	if ($("#rootsNotificationContainer")[0]) {

		clearInterval(rootsEye);
		clearInterval(rootsTalk);
		clearInterval(rootsBooring);
		clearInterval(rootsAngry);

		$("#rootsNotificationContainer").remove();
		$("#blackScreenOverMenu").remove();

		$(window).off("scroll");
		$(document.body).off(acceptRootMessage);

	}
	else{

		setTimeout(function(){(showMenu == true) ? menuOn() : "" ;}, 500);

		$(window).on("scroll", function(){window.scrollTo(window.scrollY,window.scrollX)});

		rootTalkTime = 0;

		$blackScreen = $("<div></div>").attr({"id":"blackScreenOverMenu"}).prependTo(document.body).on("click", function(){rootsNotification()});

		$rootsNotificationContainer = $("<div></div>").attr({"id":"rootsNotificationContainer"}).addClass(darkMode[lightOn]).insertAfter($blackScreen);

		$rootContentContainer = $("<div></div>").attr({"id":"rootContentContainer"}).addClass(darkMode[lightOn]).prependTo($rootsNotificationContainer);
		$rootDataContainer = $("<div></div>").attr({"id":"rootDataContainer"}).prependTo($rootContentContainer);
		$rootContainer = $("<div></div>").attr({"id":"rootContainer"}).addClass("adminPictureHalo").on("click",rootsClick).appendTo($rootDataContainer);
		$rootsFace = $("<img>").attr({"id":"rootBase", "src":"../media/image/root/root_base.png"}).appendTo($rootContainer);
		$rootsEye = $("<img>").attr({"id":"rootEye", "src":"../media/image/root/root_open_eye.png"}).appendTo($rootContainer);
		$rootsName = $("<p></p>").attr({"id":"rootsName"}).append("root").appendTo($rootDataContainer);
		$textContent = $("<div></div>").attr({"id":"rootTextContent"}).appendTo($rootContentContainer);

		var objectGroup = false;
		var objectGroupList = false;

		contents.forEach(content =>{

			if (typeof content == "string") {

				objectGroup = false;
				objectGroupList = false;

				$("<p></p>").append(content).appendTo($rootContentContainer);

				rootTalkTime = rootTalkTime + content.length/25;

			}

			if (typeof content == "object") {

				if (content[0].tagName == "IMG") {

					(objectGroup == false) ? ($container = $("<div></div>").append("<div></div>").addClass("rootsElementsGroup").appendTo($rootContentContainer), objectGroup = true) : "";

					(objectGroup == true) ? $(content).appendTo($($container).children()) : $(content).appendTo($rootContentContainer);

				}else{

					content.forEach(listElement =>{

						(objectGroupList == false) ? ($container = $("<div></div>").append("<div></div>").addClass("rootsElementsList").appendTo($rootContentContainer), objectGroupList = true) : "";

						(objectGroupList == true) ? ($($container).children().append($("<div></div>").append(listElement[0]).append($("<span></span>").text(listElement[1])))) : $(listElement).appendTo($rootContentContainer);

						rootTalkTime = rootTalkTime + listElement[1].length/25;

					});

				}

			}

			

		});

		$rootButtonContainer = $("<div></div>").attr({"id":"rootButtonContainer"}).addClass(darkMode[lightOn]).appendTo($rootsNotificationContainer);
		$rootExitButton = $("<input>").attr({"id":"rootExitButton", "value":"Aceptar", "type":"button"}).on("click", function(){localStorage.setItem(userName + title, 1); rootsNotification()}).appendTo($rootButtonContainer);
		$(document.body).on("keyup", acceptRootMessage);
		
		callRoot(1)

	}

}

function acceptRootMessage (event){

	(event.keyCode == 13) ? $($rootExitButton).click() : "";

}

function callRoot(talk = 0){

	var rotate = Math.floor(Math.random() * 10);

	rootsEye = setInterval(rootsEyeAnimation, 5000);
	rootsBooring = setTimeout(rootsBooringAnimation, 15000);

	if (rotate > 5) {

		var openMouth = (rotate >= 7) ? 1 : 0 ;

		rootTalkTime = 0;

		rootsRotateAnimation(openMouth);

	}
	else{

		rootsTalk = setInterval(rootsTalkAnimation, 350);

	}

}

function rootsBooringAnimation(){

	if ($("#rootsNotificationContainer")[0]) {

		var action = Math.floor(Math.random() * 13); console.log("booring: " + action)

		if (action == 0 || action == 1) {

			rootsRotateAnimation(action);

		}

		if (action == 2 || action == 3) {

			rootTalkTime = 5;

			rootsTalk = setInterval(rootsTalkAnimation, 350);

		}

		if (action == 4 || action == 5) {

			rootsTurnAnimation();

		}

		if (action == 6 || action == 7) {

			rootsMidTurnAnimation();

		}

		if (action == 8 || action == 9 || action == 10) {

			rootsOpenMouthAnimation();

		}

		if (action == 11 || action == 12) {

			rootsBooring = setTimeout(rootsBooringAnimation, 15000);

		}

	}
	else{

		clearInterval(rootsEye);
		clearInterval(rootsTalk);
		clearInterval(rootsBooring);
		clearInterval(rootsAngry);

	}

}

function rootsEyeAnimation(){

	$("#rootEye").attr({"src":"../media/image/root/root_closed_eye" + specialEye + ".png"});

	setTimeout(function(){$("#rootEye").attr({"src":"../media/image/root/root_open_eye" + specialEye + ".png"})}, 450);

}

function rootsTalkAnimation(){

	$("#rootBase").attr({"src":"../media/image/root/root_talk.png"});

	setTimeout(function(){$("#rootBase").attr({"src":"../media/image/root/root_base.png"})}, 175);

	rootTalkTime--;

	if (rootTalkTime < 0) {

		clearInterval(rootsTalk);

		clearTimeout(rootsBooring)

		rootsBooring = setTimeout(rootsBooringAnimation, 15000);

	}

}

function rootsClick(){

	if (rootTalkTime <= 0 && $("#rootBase").attr("src").split("/").pop().split(".")[0] == "root_base") {

		clearTimeout(rootsBooring);

		var imageElement = (event.target.tagName == "IMG") ? event.target : (event.target.firstElementChild.tagName == "IMG") ? event.target.firstElementChild : event.target.firstElementChild.firstElementChild;
		var directionValueX = event.clientX - (event.target.getBoundingClientRect().left + event.target.offsetWidth/2);
		var directionValueY = event.clientY - (event.target.getBoundingClientRect().top + event.target.offsetHeight/2);
		var direction = (directionValueX < -imageElement.offsetWidth/5) ? "left" : (directionValueX > imageElement.offsetWidth/5) ? "right" : "centre";
		var mode = Math.floor(Math.random() * 20) + rootsAngryLevel;

		if (Math.abs(directionValueX) < (imageElement.offsetWidth/2 - 8) && Math.abs(directionValueY) < (imageElement.offsetHeight/2 - 7)) {

			clearInterval(rootsAngry);
			rootsAngryLevel = (rootsAngryLevel < 20) ? rootsAngryLevel + 1 : rootsAngryLevel;
			rootsAngry = setInterval(function(){(rootsAngryLevel < 1) ? clearInterval(rootsAngry) : (rootsAngryLevel = rootsAngryLevel - 1)}, 10000);

			if (rootsAngryLevel > 10 && mode > 20) {

				rootsTurnAnimation(rootsAngryLevel * 1000)

			}else if (mode < 10 || directionValueY < -imageElement.offsetHeight/6) {

				setTimeout(function(){$("#rootBase").attr({"src":"../media/image/root/root_open_mouth_III.png"}); $("#rootEye").attr({"src":"../media/image/root/root_closed_eye_mouth_III.png"}); specialEye = "_mouth_III";

					setTimeout(function(){$("#rootBase").attr({"src":"../media/image/root/root_base.png"}); $("#rootEye").attr({"src":"../media/image/root/root_open_eye.png"}); specialEye = "";

						rootsBooring = setTimeout(rootsBooringAnimation, 15000);

					}, 125);

				}, 125);

			}
			else{

				if (direction == "centre") {

					setTimeout(function(){$("#rootBase").attr({"src":"../media/image/root/root_talk.png"}); $("#rootEye").attr({"src":"../media/image/root/root_open_eye.png"});

						setTimeout(function(){$("#rootBase").attr({"src":"../media/image/root/root_open_mouth_I.png"}); $("#rootEye").attr({"src":"../media/image/root/root_closed_eye_mouth_I.png"}); specialEye = "_mouth_I";

							setTimeout(function(){$("#rootBase").attr({"src":"../media/image/root/root_open_mouth_II.png"}); $("#rootEye").attr({"src":"../media/image/root/root_closed_eye_mouth_II.png"}); specialEye = "_mouth_II";

								setTimeout(function(){$("#rootBase").attr({"src":"../media/image/root/root_open_mouth_I.png"}); $("#rootEye").attr({"src":"../media/image/root/root_closed_eye_mouth_I.png"}); specialEye = "_mouth_I";

									setTimeout(function(){$("#rootBase").attr({"src":"../media/image/root/root_talk.png"}); $("#rootEye").attr({"src":"../media/image/root/root_open_eye.png"}); specialEye = "";

										setTimeout(function(){$("#rootBase").attr({"src":"../media/image/root/root_base.png"}); $("#rootEye").attr({"src":"../media/image/root/root_open_eye.png"});

											clearTimeout(rootsBooring)

											rootsBooring = setTimeout(rootsBooringAnimation, 15000);

										}, 100);

									}, 100);
												
								}, 100);					

							}, 100);

						}, 100);

					}, 100);

				}
				else{

					setTimeout(function(){$("#rootBase").attr({"src":"../media/image/root/root_" + direction + "_I.png"}); $("#rootEye").attr({"src":"../media/image/root/root_closed_eye_" + direction + ".png"}); specialEye = "_" + direction;

						setTimeout(function(){$("#rootBase").attr({"src":"../media/image/root/root_talk_" + direction + ".png"}); $("#rootEye").attr({"src":"../media/image/root/root_open_eye_" + direction + "_talk.png"}); specialEye = "_" + direction + "_talk";

							setTimeout(function(){$("#rootBase").attr({"src":"../media/image/root/root_open_mouth_I_" + direction + ".png"}); $("#rootEye").attr({"src":"../media/image/root/root_closed_eye_mouth_I_" + direction + ".png"}); specialEye = "_mouth_I_" + direction;

								setTimeout(function(){$("#rootBase").attr({"src":"../media/image/root/root_open_mouth_II_" + direction + ".png"}); $("#rootEye").attr({"src":"../media/image/root/root_closed_eye_mouth_II_" + direction + ".png"}); specialEye = "_mouth_II_" + direction;

									setTimeout(function(){$("#rootBase").attr({"src":"../media/image/root/root_open_mouth_I_" + direction + ".png"}); $("#rootEye").attr({"src":"../media/image/root/root_closed_eye_mouth_I_" + direction + ".png"}); specialEye = "_mouth_I_" + direction;

										setTimeout(function(){$("#rootBase").attr({"src":"../media/image/root/root_talk_" + direction + ".png"}); $("#rootEye").attr({"src":"../media/image/root/root_open_eye_" + direction + "_talk.png"}); specialEye = "_" + direction + "_talk";

											setTimeout(function(){$("#rootBase").attr({"src":"../media/image/root/root_" + direction + "_I.png"}); $("#rootEye").attr({"src":"../media/image/root/root_closed_eye_" + direction + ".png"}); specialEye = "_" + direction;

												setTimeout(function(){$("#rootBase").attr({"src":"../media/image/root/root_base.png"}); $("#rootEye").attr({"src":"../media/image/root/root_open_eye.png"}); specialEye = "";

													clearTimeout(rootsBooring)

													rootsBooring = setTimeout(rootsBooringAnimation, 15000);

												}, 100);

											}, 100);

										}, 100);
													
									}, 100);					

								}, 100);

							}, 100);

						}, 100);

					}, 100);

				}

			}

		}

	}

}

function rootsOpenMouthAnimation(bites = 0){

	if (rootTalkTime <= 0) {

		var callBack = (bites < 3) ? Math.floor(Math.random() * 10) : -1;
		var standOpen = (Math.floor(Math.random() * 10) > 5) ? [Math.floor(Math.random() * 375) + 125, 55 ]: [125, 125];

		setTimeout(function(){$("#rootBase").attr({"src":"../media/image/root/root_talk.png"}); 

			setTimeout(function(){$("#rootBase").attr({"src":"../media/image/root/root_open_mouth_I.png"}); $("#rootEye").attr({"src":"../media/image/root/root_open_eye_mouth_I.png"}); specialEye = "_mouth_I";

				if (true) {

					setTimeout(function(){$("#rootBase").attr({"src":"../media/image/root/root_open_mouth_II.png"}); $("#rootEye").attr({"src":"../media/image/root/root_open_eye_mouth_II.png"}); specialEye = "_mouth_I";

						setTimeout(function(){$("#rootBase").attr({"src":"../media/image/root/root_open_mouth_I.png"}); $("#rootEye").attr({"src":"../media/image/root/root_open_eye_mouth_I.png"}); specialEye = "_mouth_I";

							setTimeout(function(){$("#rootBase").attr({"src":"../media/image/root/root_talk.png"}); $("#rootEye").attr({"src":"../media/image/root/root_open_eye.png"}); specialEye = "";

								setTimeout(function(){$("#rootBase").attr({"src":"../media/image/root/root_base.png"});

									clearTimeout(rootsBooring);

									rootsBooring = setTimeout(rootsBooringAnimation, 15000);

									if (callBack > 5) {

										setTimeout(function(){rootsOpenMouthAnimation(bites + 1);}, 125);

									}

								}, standOpen[1]);

							}, standOpen[1]);

						}, standOpen[0]);

					}, 125);

				}
				else{

					setTimeout(function(){$("#rootBase").attr({"src":"../media/image/root/root_talk.png"}); $("#rootEye").attr({"src":"../media/image/root/root_open_eye.png"}); specialEye = "";

						setTimeout(function(){$("#rootBase").attr({"src":"../media/image/root/root_base.png"});

							clearTimeout(rootsBooring)

							rootsBooring = setTimeout(rootsBooringAnimation, 15000);

							if (callBack > 5) {

								setTimeout(function(){rootsOpenMouthAnimation(bites + 1);}, 125);

							}

						}, 125);

					}, 125);

				}

			}, 125);

		}, 125);

	}
	else{

		clearTimeout(rootsBooring)

		rootsBooring = setTimeout(rootsBooringAnimation, 15000);

	}

}

function rootsMidTurnAnimation(turn = "", levelTurn = "", standTurn = ""){

	if (rootTalkTime <= 0) {

		var callBack = (turn == "") ? Math.floor(Math.random() * 10) : -1;
		turn = (turn == "") ? (Math.floor(Math.random() * 10) > 5) ? "left" : "right" : turn;
		levelTurn = (levelTurn == "") ? Math.floor(Math.random() * 10) : levelTurn;
		standTurn = (standTurn == "") ? Math.floor(Math.random() * 3875) + 125 : standTurn;

		setTimeout(function(){$("#rootBase").attr({"src":"../media/image/root/root_" + turn + "_I.png"}); $("#rootEye").attr({"src":"../media/image/root/root_open_eye_" + turn + ".png"}); specialEye = "_" + turn;

				if(levelTurn > 5){

					setTimeout(function(){$("#rootBase").attr({"src":"../media/image/root/root_" + turn + "_II.png"}); $("#rootEye").attr({"src":"../media/image/root/root_open_eye_transparent.png"}); specialEye = "_transparent";

						setTimeout(function(){$("#rootBase").attr({"src":"../media/image/root/root_" + turn + "_I.png"}); $("#rootEye").attr({"src":"../media/image/root/root_open_eye_" + turn + ".png"}); specialEye = "_" + turn;

							setTimeout(function(){$("#rootBase").attr({"src":"../media/image/root/root_base.png"}); $("#rootEye").attr({"src":"../media/image/root/root_open_eye.png"}); specialEye = ""; rootsRotate = "";

								clearTimeout(rootsBooring)

								rootsBooring = setTimeout(rootsBooringAnimation, 15000);

								if (callBack > 5) {

									turn = (turn == "left") ? "right" : "left";

									rootsMidTurnAnimation(turn, levelTurn, standTurn);

								}

							}, 125);

						}, standTurn);

					}, 125);

				}
				else{

					setTimeout(function(){$("#rootBase").attr({"src":"../media/image/root/root_base.png"}); $("#rootEye").attr({"src":"../media/image/root/root_open_eye.png"}); specialEye = ""; rootsRotate = "";

						clearTimeout(rootsBooring)

						rootsBooring = setTimeout(rootsBooringAnimation, 15000);

						if (callBack > 5) {

							turn = (turn == "left") ? "right" : "left";

							rootsMidTurnAnimation(turn, levelTurn, standTurn);

						}

					}, standTurn);

				}

		}, 125);

	}
	else{

		clearTimeout(rootsBooring)

		rootsBooring = setTimeout(rootsBooringAnimation, 15000);

	}

}

function rootsRotateAnimation(type = 0){

	var turn = (Math.floor(Math.random() * 10) > 5) ? ["left","right"] : ["right","left"];turn=["right","left"]

	if (rootTalkTime <= 0) {

		$("#rootBase").attr({"src":"../media/image/root/root_" + turn[0] + "_I.png"});

		$("#rootEye").attr({"src":"../media/image/root/root_open_eye_" + turn[0] + ".png"}); specialEye = "_" + turn[0];

		setTimeout(function(){$("#rootBase").attr({"src":"../media/image/root/root_" + turn[0] + "_II.png"}); $("#rootEye").attr({"src":"../media/image/root/root_open_eye_transparent.png"}); specialEye = "_transparent";

			setTimeout(function(){$("#rootBase").attr({"src":"../media/image/root/root_" + turn[0] + "_III.png"});

				setTimeout(function(){$("#rootBase").attr({"src":"../media/image/root/root_back.png"});

					setTimeout(function(){$("#rootBase").attr({"src":"../media/image/root/root_" + turn[1] + "_III.png"});

						setTimeout(function(){$("#rootBase").attr({"src":"../media/image/root/root_" + turn[1] + "_II.png"});

							setTimeout(function(){$("#rootBase").attr({"src":"../media/image/root/root_" + turn[1] + "_I.png"}); $("#rootEye").attr({"src":"../media/image/root/root_open_eye_" + turn[1] + ".png"}); specialEye = "_" + turn[1];

								setTimeout(function(){$("#rootBase").attr({"src":"../media/image/root/root_base.png"}); $("#rootEye").attr({"src":"../media/image/root/root_open_eye.png"}); specialEye = ""; rootsRotate = "";

									if (type == 1) {

										setTimeout(function(){$("#rootBase").attr({"src":"../media/image/root/root_talk.png"});

											setTimeout(function(){$("#rootBase").attr({"src":"../media/image/root/root_open_mouth_I.png"}); $("#rootEye").attr({"src":"../media/image/root/root_open_eye_mouth_I.png"}); rootsMouth = "_mouth_I";

												setTimeout(function(){$("#rootBase").attr({"src":"../media/image/root/root_talk.png"}); $("#rootEye").attr({"src":"../media/image/root/root_open_eye.png"}); rootsMouth = "";

													setTimeout(function(){$("#rootBase").attr({"src":"../media/image/root/root_base.png"});

														clearTimeout(rootsBooring)

														rootsBooring = setTimeout(rootsBooringAnimation, 15000);

													}, 125);

												}, 125);

											}, 125);

										}, 125);

									}
									else{

										clearTimeout(rootsBooring)

										rootsBooring = setTimeout(rootsBooringAnimation, 15000);

									}

								}, 125);

							}, 125);

						}, 125);

					}, 125);

				}, 125);

			}, 125);

		}, 125);

	}
	else{

		clearTimeout(rootsBooring)

		rootsBooring = setTimeout(rootsBooringAnimation, 15000);

	}

}

function rootsTurnAnimation(standBack = 0){

	if (rootTalkTime <= 0) {

		var turn = (Math.floor(Math.random() * 10) > 5) ? "left" : "right";
		var turnBack = (Math.floor(Math.random() * 10) > 5) ? "right" : "left";
		standBack = (standBack == 0) ? Math.floor(Math.random() * 3875) + 125 : standBack;

		$("#rootBase").attr({"src":"../media/image/root/root_" + turn + "_I.png"});

		$("#rootEye").attr({"src":"../media/image/root/root_open_eye_" + turn + ".png"}); specialEye = "_" + turn;

		setTimeout(function(){$("#rootBase").attr({"src":"../media/image/root/root_" + turn + "_II.png"}); $("#rootEye").attr({"src":"../media/image/root/root_open_eye_transparent.png"}); specialEye = "_transparent";

			setTimeout(function(){$("#rootBase").attr({"src":"../media/image/root/root_" + turn + "_III.png"});

				setTimeout(function(){$("#rootBase").attr({"src":"../media/image/root/root_back.png"});

					setTimeout(function(){$("#rootBase").attr({"src":"../media/image/root/root_" + turnBack + "_III.png"});

						setTimeout(function(){$("#rootBase").attr({"src":"../media/image/root/root_" + turnBack + "_II.png"});

							setTimeout(function(){$("#rootBase").attr({"src":"../media/image/root/root_" + turnBack + "_I.png"}); $("#rootEye").attr({"src":"../media/image/root/root_open_eye_" + turnBack + ".png"}); specialEye = "_" + turnBack;

								setTimeout(function(){$("#rootBase").attr({"src":"../media/image/root/root_base.png"}); $("#rootEye").attr({"src":"../media/image/root/root_open_eye.png"}); specialEye = ""; rootsRotate = ""

									clearTimeout(rootsBooring)

									rootsBooring = setTimeout(rootsBooringAnimation, 15000);

								}, 125);

							}, 125);

						}, 125);

					}, standBack);

				}, 125);

			}, 125);

		}, 125);

	}
	else{

		clearTimeout(rootsBooring)

		rootsBooring = setTimeout(rootsBooringAnimation, 15000);

	}

}