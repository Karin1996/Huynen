import {THREE, camera, scene } from "./scene_setup";
import {AnimationController, AudioController} from "./functions";

let objectToMutate;
let originalX;
let originalY;
let originalZ;

function RotateNPC(object){
	objectToMutate = object;
	originalX = object.rotation.x;
	originalY = object.rotation.y;
	originalZ = object.rotation.z;

	objectToMutate.lookAt(camera.position.x, objectToMutate.position.y, camera.position.z);

	if(object.action){
		AnimationController(object, "Talking", false);
	}

	if(object.audio){
		AudioController(object, true, false);
	}
	
}

function ResetRotationNPC(object){
	objectToMutate.rotation.set(originalX, originalY, originalZ);

	if(object.action){
		AnimationController(object, "Idle");
	}

	if(object.audio){
		AudioController(object, false);
	}

}



export{
	RotateNPC,
	ResetRotationNPC
}