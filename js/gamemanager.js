//SCRIPT TO MANAGE DIFFERENT STATES//
import * as scene_setup from "../js/scene_setup.js";
import * as debug from "../js/debug.js";
import * as ui from "../js/ui.js";
import * as loader from "../js/loader.js";
import * as movement from "../js/movement.js";

//Var declarations
let THREE = scene_setup.THREE;
const clock = new THREE.Clock();
let canMutate = true;
const modelsList = loader.modelsList;


setInterval(function(){
	canMutate = true;
}, 50);

//When mouse moves execute CursorChanger
window.addEventListener("mousemove", function(){
	// Prevent going ham
	if (!canMutate){return};
	CursorChanger();
}, true)

//Cursor style depending on what object is being hovered over
function CursorChanger(){
	scene_setup.raycaster.setFromCamera(scene_setup.mouse, scene_setup.camera);    
	const hitObjects = scene_setup.raycaster.intersectObjects(modelsList);

	//Save the first (closest) object that the player is looking at
	let currentObject = hitObjects[0];

	//Check the type of the object that the player is looking at
	if(currentObject){
		if(currentObject.object.parent.property == "interactable"){
			scene_setup.raycaster.far = 10;
			document.body.style.cursor = "url('../images/cursor_questionmark.png'), auto";
		}
		else if(currentObject.object.parent.parent.property == "npc"){
			scene_setup.raycaster.far = 10;
			document.body.style.cursor = "url('../images/cursor_talk.png'), auto";
		}
		else if(currentObject.object.parent.property == "ground"){
			scene_setup.raycaster.far = 50;
			document.body.style.cursor = "url('../images/cursor_move.png'), auto";
		}
		else{
			scene_setup.raycaster.far = 10;
			document.body.style.cursor = "url('../images/cursor_disabled.png'), auto";
		}
	}
	else{
		document.body.style.cursor = "url('../images/cursor_disabled.png'), auto";
	}
}

function RenderLoop() {
    if(!debug.debug_mode){
		movement.fpcontrols.update(clock.getDelta()); //To be able to look around
	} 
	debug.stats.update();
	requestAnimationFrame(RenderLoop);
	scene_setup.Render();
	movement.fpcontrols.handleResize();
}
RenderLoop();
