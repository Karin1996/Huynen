//SCRIPT TO MANAGE DIFFERENT STATES//
import * as scene_setup from "../js/scene_setup.js";
import * as debug from "../js/debug.js";
import * as ui from "../js/ui.js";
import * as loader from "../js/loader.js";
import * as movement from "../js/movement.js";

//const scene_setup = new URL('../js/scene_setup.js', import.meta.url);
//const debug = new URL('../js/debug.js', import.meta.url);
//const loader = new URL('../js/loader.js', import.meta.url);
//const movement = new URL('../js/movement.js', import.meta.url);

//Var declarations
const clock = new scene_setup.THREE.Clock();

function RenderLoop() {
    if(!debug.debug_mode){
		movement.fpcontrols.update(clock.getDelta()); //To be able to look around
	} 
	debug.stats.update();
	requestAnimationFrame(RenderLoop);
	scene_setup.Render();
}
RenderLoop();

