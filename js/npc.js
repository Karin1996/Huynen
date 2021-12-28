import {THREE, camera, scene } from "./scene_setup";
import {AnimationController} from "./functions";

let objectToMutate;
let originalX;
let originalY;
let originalZ;

function RotateNPC(object){
	//Get the children's name. If the name isnt box, add it to the variable. Also save the original XYZ rotation
	object.children.forEach(element => {
		if(element.name.toLowerCase() !== "box"){
			objectToMutate = element;
			originalX = element.rotation.x;
			originalY = element.rotation.y;
			originalZ = element.rotation.z;
		}
	});
	objectToMutate.lookAt(camera.position.x, objectToMutate.position.y, camera.position.z);

	if(object.action){
		AnimationController(object, "Talking");
	}
	
}

function ResetRotationNPC(object){
	objectToMutate.rotation.set(originalX, originalY, originalZ);

	if(object.action){
		AnimationController(object, "Idle");
	}

}



export{
	RotateNPC,
	ResetRotationNPC
}