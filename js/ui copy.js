import {THREE, scene, camera, raycaster, mouse} from "./debug";
import {modelsList} from "./loader";

//SCRIPT TO MAKE AND MUTATE ALL THE UI ELEMENTS

//On click execute CheckUI
window.addEventListener("click", CheckUI);

function CheckUI(){
    raycaster.setFromCamera(mouse, camera);    
    const hitObjects = raycaster.intersectObjects(modelsList);

    //Save the current object
    let currentObject = hitObjects[0];
    if(currentObject){
		//Check if there is an object that the player is looking at
		if(currentObject.object.parent.property == "interactable"){
			MakeInteractionUI(currentObject.object.parent);
		}
		else{
			return;
		}
	}
    else{
		return;
	}
}

//Make the UI with the correct information
function MakeInteractionUI(object){
    //Get the information ID that has the model ID and display the information
    console.log(object);
}
