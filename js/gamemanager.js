//SCRIPT TO MANAGE DIFFERENT STATES//
import * as scene_setup from "../js/scene_setup.js";
import * as debug from "../js/debug.js";
import * as ui from "../js/ui.js";
import * as loader from "../js/loader.js";
import * as movement from "../js/movement.js";
import * as cycle from "../js/cycle.js";
import * as functions from "../js/functions.js";

//Var declarations
let THREE = scene_setup.THREE;
const clock = new THREE.Clock();
//let canMutate = true;
const modelsList = loader.modelsList;
let moveable = false;
//All audio
let bgAudio = functions.bgAudio;
let LinneAudio = functions.LinneAudio;
let IdaAudio = functions.IdaAudio;
let RolfeAudio = functions.RolfeAudio;
let LejoAudio = functions.LejoAudio;
let KalieAudio = functions.KalieAudio;
var audioMuted = false;

//document.body.appendChild(debug.stats.dom);

document.getElementById("help").addEventListener("click", function(){
	movement.camera.position.x = 0;
	movement.camera.position.y = movement.DISTANCE_GROUND;
    movement.camera.position.z = 0;
});

document.getElementById("audio").addEventListener("click", function(){
	if(audioMuted){
		audioMuted = false;
		this.querySelector("img").src = "../images/audio_on.png";

		bgAudio.muted = false;
		LinneAudio.muted = false;
		IdaAudio.muted = false;
		RolfeAudio.muted = false;
		LejoAudio.muted = false;
		KalieAudio.muted = false;
	}
	else{
		audioMuted = true;
		this.querySelector("img").src = "../images/audio_off.png";

		bgAudio.muted = true;
		LinneAudio.muted = true;
		IdaAudio.muted = true;
		RolfeAudio.muted = true;
		LejoAudio.muted = true;
		KalieAudio.muted = true;
	}
});



window.addEventListener('load', function(){
	//Render the scene
	RenderLoop();
	
	//Zoom out the camera. When the camera is back at the ground the player doesn't have the initial look around lag
	movement.camera.position.y = 100;
	movement.camera.lookAt(0,0,0);

	//Check if loader is true
	let interval = setInterval(function(){
		//Loader is true
		if (loader.loaded) {
			//Clear the interval
			clearInterval(interval);
			//Zoom the camera back in
			movement.camera.rotation.x = 0;
			movement.camera.rotation.y = 0;
			movement.camera.rotation.z = 0;

			movement.camera.position.y = movement.DISTANCE_GROUND;
			//Enable btn
			document.getElementById("btn").style.opacity = 1;
			document.getElementById("loading").style.opacity = 0;
			document.getElementById("btn").addEventListener("click", function(){
				//Delete div, Start blink animation, start DayNight cycle on click of the btn
				document.getElementById("front_page").remove();
				//Start the app by making it look like the player blinks
				functions.Blinking("start");
				//Start the bg audio
				bgAudio.loop = true;
				bgAudio.play();

				//Get the NPC animations, if they have one, and start playing them
				modelsList.forEach(modelInList =>{
					if(modelInList.clip){
						modelInList.action.play();
					}
				})

				setTimeout(function() {
					document.getElementById("help").style.opacity = 1;
					//Player can now look around
					moveable = true;
					cycle.Cycle();
				}, 3000);
			});
		}
	}, 30);
	
}, true);

//Every second trigger CursorChanger
setInterval(function(){
	//canMutate = true;
	CursorChanger();
}, 1000);

//When mouse moves execute CursorChanger
window.addEventListener("mousemove", function(){
	if (debug.debug_mode){
		return;
	}
	else{
		if(!functions.festival){
			CursorChanger();
		}
		else{
			document.body.style.cursor = "default";
			return;
		}
	}
})

//Cursor style depending on what object is being hovered over
function CursorChanger(){
	//console.log("camera rot", movement.camera.rotation);
	scene_setup.raycaster.setFromCamera(scene_setup.mouse, scene_setup.camera);    
	const hitObjects = scene_setup.raycaster.intersectObjects(modelsList);

	//Save the first (closest) object that the player is looking at
	const currentObject = hitObjects[0];

	//Currentobject is not undefined
	if(currentObject){
		//Find the object group
		currentObject.object.traverseAncestors(function (child) {
			if(child.type == "Group"){
				switch(child.property){
					case "interactable":
                        document.body.style.cursor = "url('../images/cursor_questionmark_small.png'), auto";
                        break;
					case "quest":
						document.body.style.cursor = "url('../images/cursor_questionmark_small.png'), auto";
						break;
					case "npc":
						document.body.style.cursor = "url('../images/cursor_talk_small.png'), auto";
						break;
					case "ground":
						document.body.style.cursor = "url('../images/cursor_move_small.png'), auto";
						break;
					default:
						document.body.style.cursor = "url('../images/cursor_disabled_small.png'), auto";
				}
			}
			return;
		});
	}
	//Currentobject is undefined 
	else{
		document.body.style.cursor = "url('../images/cursor_disabled_small.png'), auto";
		return;
	}
}

function RenderLoop() {
	const delta = 0.75 * clock.getDelta();
    //if(!debug.debug_mode || !functions.festival){
		//movement.fpcontrols.update(delta); //To be able to look around
	//} 
	//Update the animations
	modelsList.forEach(modelInList =>{
		if(modelInList.mixer){
			modelInList.mixer.update(delta);
		}
	})

	//Update the animations
	functions.festivalList.forEach(modelInList =>{
		if(modelInList.mixer){
			modelInList.mixer.update(delta);
		}
	})
	debug.stats.update();
	requestAnimationFrame(RenderLoop);
	scene_setup.Render();
	movement.LookAround();
}

export{
	audioMuted, moveable
}