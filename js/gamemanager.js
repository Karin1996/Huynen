//SCRIPT TO MANAGE DIFFERENT STATES//
import * as scene_setup from "../js/scene_setup.js";
import * as debug from "../js/debug.js";
import * as loader from "../js/loader.js";
import * as movement from "../js/movement.js";

//Var declarations
const clock = new scene_setup.THREE.Clock();

function RenderLoop() {
    if(!debug.debug_mode){movement.fpcontrols.update(clock.getDelta());} //To be able to look around
	requestAnimationFrame(RenderLoop);
	scene_setup.Render();
}
RenderLoop();
