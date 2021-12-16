import { camera, scene } from "./scene_setup";

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
}

function ResetRotationNPC(){
	objectToMutate.rotation.set(originalX, originalY, originalZ);
}

export{
	RotateNPC,
	ResetRotationNPC
}