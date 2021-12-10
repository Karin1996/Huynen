//SCRIPT TO MANAGE DIFFERENT STATES//
import * as scene_setup from "../js/scene_setup.js";
import * as debug from "../js/debug.js";
import * as ui from "../js/ui.js";
import * as loader from "../js/loader.js";
import * as movement from "../js/movement.js";
import * as cycle from "../js/cycle.js";

//Var declarations
let THREE = scene_setup.THREE;
const clock = new THREE.Clock();
let canMutate = true;
const modelsList = loader.modelsList;

document.body.appendChild(debug.stats.dom);

//FIX LOADING TO PROMISE
//Show loading page until everything has been loaded in in the background
window.addEventListener('load', function(){
	document.querySelector("#loading").style.opacity = 0;
	setTimeout(function(){;
		RenderLoop();
		document.querySelector("#loading").remove();
		cycle.Cycle();	
	}, 500);
}, true);

setInterval(function(){
	canMutate = true;
}, 30);

//When mouse moves execute CursorChanger
window.addEventListener("mousemove", function(){
	// Prevent going ham
	if (!canMutate || debug.debug_mode){return};
	CursorChanger();
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
			//console.log(child)
			if(child.type == "Group"){
				switch(child.property){
					case "interactable":
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
    if(!debug.debug_mode){
		movement.fpcontrols.update(clock.getDelta()); //To be able to look around
	} 
	debug.stats.update();
	requestAnimationFrame(RenderLoop);
	scene_setup.Render();
	movement.fpcontrols.handleResize();
}
