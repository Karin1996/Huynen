//SCRIPT TO MANAGE DIFFERENT STATES//
import * as scene_setup from "../js/scene_setup.js";
import * as debug from "../js/debug.js";
import * as ui from "../js/ui copy.js";
import * as loader from "../js/loader.js";
import * as movement from "../js/movement.js";

let THREE = scene_setup.THREE;

//Var declarations
const clock = new THREE.Clock();
let canMutate = true;
const modelsList = loader.modelsList;


setInterval(function(){
	canMutate = true;
}, 50);

//When mouse moves execute CursorChanger
window.addEventListener("mousemove", function(event){
	event.preventDefault();

	// Prevent going ham
	if (!canMutate){return};
	CursorChanger();
})

//Cursor style depending on what object is being hovered over
function CursorChanger(){
	debug.raycaster.setFromCamera(debug.mouse, debug.camera);    
	const hitObjects = debug.raycaster.intersectObjects(modelsList);

	//Save the first (closest) object that the player is looking at
	let currentObject = hitObjects[0];
	if(currentObject){
		//Check if there is an object that the player is looking at
		if(currentObject.object.parent.property == "interactable"){
			document.body.style.cursor = "url('../images/info.png'), auto";
		}
		else{
			document.body.style.cursor = "url('../images/walk.png'), auto";
		}
	}
	else{
		document.body.style.cursor = "url('../images/walk.png'), auto";
	}
}

function RenderLoop() {
    if(!debug.debug_mode){
		movement.fpcontrols.update(clock.getDelta()); //To be able to look around
	} 
	debug.stats.update();
	requestAnimationFrame(RenderLoop);
	scene_setup.Render();

}
RenderLoop();

