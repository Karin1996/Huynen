//SCRIPT TO MAKE AND MUTATE ALL THE UI ELEMENTS
let information = require("../local_db/information.json");
let dialogue = require("../local_db/dialogue.json");
import {camera, raycaster, mouse} from "./scene_setup";
import {modelsList} from "./loader";
import {DisplayRay} from "./debug";
import {fpcontrols, LOOK_SPEED} from "./movement";

let uiVisible = false;
//On click execute CheckUI
window.addEventListener("click", CheckUI, true);

function CheckUI(){
    raycaster.setFromCamera(mouse, camera);    
    const hitObjects = raycaster.intersectObjects(modelsList);

    //Save the current object
	if(hitObjects.length > 0){
        let currentObject = hitObjects[0];
		//Check if there is an object that the player is looking at
		if(currentObject.object.parent.property == "interactable" && !uiVisible){
			MakeUI("interaction", currentObject.object.parent);
		}
		else if(currentObject.object.parent.parent.property == "npc" && !uiVisible){
			console.log("checkUI", "npc", currentObject.object.parent.parent);
			MakeUI("dialogue", currentObject.object.parent.parent); 
		}
    }
}

//Make the UI with the correct information
function MakeUI(type, object){
	console.log("type", type, "should be dialogue", ".........", "object", object);
	//If there is no visible ui make the ui
	if(!uiVisible){
		fpcontrols.lookSpeed = 0;
		uiVisible = true;
		//Create UI div
		let ui = document.createElement('div');
		
		if(type == "interaction"){
			//Get the correct information ID and extract the information
			let information_id = object.information_id;
			let correctInfo;
	
			information.forEach(info => {
				if(info.information_id == information_id){
					correctInfo = info;
				}
			});

			if(correctInfo){
				ui.setAttribute("class", "ui");
				ui.setAttribute("id", "interaction");

				//Create name element and fill with the correct information
				let interactionName = document.createElement('h1');
				interactionName.innerHTML = correctInfo.title;
				//interactionName.setAttribute("id", "interactionName");

				//Create interaction description element and fill with the correct information
				let interactionDescription = document.createElement('p');
				interactionDescription.setAttribute("class", "ui_p");
				interactionDescription.innerHTML = correctInfo.text;
				//interactionDescription.setAttribute("id", "interactionDescription");
				
				//Create ok button element
				let interactionBtn = document.createElement('div');
				let interactionText = document.createElement('p');
				interactionBtn.setAttribute("class", "ui_btn");
				//interactionBtn.setAttribute("id", "interaction_btn");
				interactionText.setAttribute("class", "p_btn");
				interactionText.innerHTML = "ok";

				ui.appendChild(interactionName);
				ui.appendChild(interactionDescription);
				ui.appendChild(interactionBtn);
				interactionBtn.appendChild(interactionText);
			}
			else{
				uiVisible = false;
				return;	
			}
		}	
		else if(type == "dialogue"){
			//Get the correct dialogue ID and extract the name and dialogue
			let dialogue_id = object.dialogue_id;
			let correctDialogue;
	
			dialogue.forEach(log => {
				if(log.dialogue_id == dialogue_id){
					correctDialogue = log;
				}
			});

			if(correctDialogue){
				ui.setAttribute("class", "ui");
				ui.setAttribute("id", "dialogue");

				//Create name element and fill with the correct information
				let npcName = document.createElement('h1');
				npcName.innerHTML = correctDialogue.name;
				//interactionName.setAttribute("id", "interactionName");

				//Create dialogue element and fill with the correct information
				let npcDialogue = document.createElement('p');
				npcDialogue.setAttribute("class", "ui_p");
				npcDialogue.innerHTML = correctDialogue.dialogue;
				
				//Create ok button element
				let npcBtn = document.createElement('div');
				let npcText = document.createElement('p');
				npcBtn.setAttribute("class", "ui_btn");
				//interactionBtn.setAttribute("id", "interaction_btn");
				npcText.setAttribute("class", "p_btn");
				npcText.innerHTML = "ok";

				ui.appendChild(npcName);
				ui.appendChild(npcDialogue);
				ui.appendChild(npcBtn);
				npcBtn.appendChild(npcText);
			}
			else{
				uiVisible = false;
				return;	
			}
		}	
		else{
			console.log("not interaction UI", uiVisible);
		}
		document.body.appendChild(ui);

		setTimeout(function(){
			//Show UI with fade in
			ui.style.opacity = 1;
		}, 100);

		//Add eventlistener to the buttons so player can exit ui
		let btns = document.getElementsByClassName("ui_btn");
		for(let i = 0; i < btns.length; i++){
			btns[i].addEventListener("click", function(){
				DeleteUI(btns[i].parentElement);
			});
		}	
	}
	//ui is visible
	else{
		DeleteUI();
	}
}

function DeleteUI(div){
	if(!div){document.querySelector("#sceneCanvas").remove();}

	uiVisible = false;
	div.style.opacity = 0;
	setTimeout(function(){
		//Delete UI from the DOM
		div.parentNode.removeChild(div);
	}, 1000);
	fpcontrols.lookSpeed = LOOK_SPEED;
}


export{
	uiVisible
}