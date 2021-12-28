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
let canMutate = true;
const modelsList = loader.modelsList;

document.body.appendChild(debug.stats.dom);

window.addEventListener('load', function(){
	//Render the scene
	RenderLoop();
	
	//Zoom out the camera. When the camera is back at the ground the player doesn't have the initial look around lag
	movement.camera.position.y = 120;
	movement.camera.lookAt(0,0,0);

	//Check if loader is true
	let interval = setInterval(function(){
		//Loader is true
		if (loader.loaded) {
			//Clear the interval
			clearInterval(interval);
			//Zoom the camera back in
			movement.camera.position.y = movement.DISTANCE_GROUND;
			//Enable btn
			document.getElementById("btn").style.opacity = 1;
			document.getElementById("loading").style.opacity = 0;
			document.getElementById("btn").addEventListener("click", function(){
				//Delete div, Start blink animation, start DayNight cycle on click of the btn
				document.getElementById("front_page").remove();
				//Start the app by making it look like the player blinks
				functions.Blinking("start");

				//Get the NPC animations, if they have one, and start playing them
				modelsList.forEach(modelInList =>{
					if(modelInList.clip){
						modelInList.action.play();
					}
				})

				setTimeout(function() {
					cycle.Cycle();
				}, 3000);
			});
		}
	}, 30);
	
}, true);

setInterval(function(){
	canMutate = true;
}, 30);

//When mouse moves execute CursorChanger
window.addEventListener("mousemove", function(){
	// Prevent going ham
	if (!canMutate || debug.debug_mode){
		return;
	}
	else{
		CursorChanger();
	}
})

//Cursor style depending on what object is being hovered over
function CursorChanger(){
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
                        document.body.style.cursor = "url('../images/cursor_questionmark.png'), auto";
                        break;
					case "quest":
						document.body.style.cursor = "url('../images/cursor_questionmark.png'), auto";
						break;
					case "npc":
						document.body.style.cursor = "url('../images/cursor_talk.png'), auto";
						break;
					case "ground":
						document.body.style.cursor = "url('../images/cursor_move.png'), auto";
						break;
					default:
						document.body.style.cursor = "url('../images/cursor_disabled.png'), auto";
				}
			}
			return;
		});
	}
	//Currentobject is undefined 
	else{
		document.body.style.cursor = "url('../images/cursor_disabled.png'), auto";
		return;
	}
}
function RenderLoop() {
	const delta = 0.75 * clock.getDelta();
    if(!debug.debug_mode){
		movement.fpcontrols.update(delta); //To be able to look around
	} 
	modelsList.forEach(modelInList =>{
		if(modelInList.mixer){
			modelInList.mixer.update(delta);
		}
	})
	debug.stats.update();
	requestAnimationFrame(RenderLoop);
	scene_setup.Render();
	movement.fpcontrols.handleResize();
}
