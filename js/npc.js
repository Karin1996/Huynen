import {THREE, camera, scene } from "./scene_setup";
import {AnimationController, AudioController} from "./functions";

let objectToMutate;
let originalX;
let originalY;
let originalZ;

function RotateNPC(object){
	//Get the children's name. If the name isnt box, add it to the variable. Also save the original XYZ rotation
	/*object.children.forEach(element => {
		if(element.name.toLowerCase() !== "box"){
			objectToMutate = element;
			originalX = element.rotation.x;
			originalY = element.rotation.y;
			originalZ = element.rotation.z;
		}
	});*/

	//Get object called pivot and rotate the object around that point towards camera

	objectToMutate = object;
	originalX = object.rotation.x;
	originalY = object.rotation.y;
	originalZ = object.rotation.z;

	console.log("object",object);

	objectToMutate.lookAt(camera.position.x, objectToMutate.position.y, camera.position.z);

	if(object.action){
		AnimationController(object, "Talking");
	}

	if(object.audio){
		AudioController(object, true);
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