//SCRIPT TO MAKE AND MUTATE ALL THE UI ELEMENTS
let information = require("../local_db/information.json");
let dialogue = require("../local_db/dialogue.json");
import {camera, raycaster, mouse} from "./scene_setup";
import {modelsList} from "./loader";
import {DisplayRay} from "./debug";
import {fpcontrols, LOOK_SPEED} from "./movement";
import {RotateNPC, ResetRotationNPC} from "./npc"

let uiVisible = false;
//On click execute CheckUI
window.addEventListener("click", CheckUI, true);

function CheckUI(){
	raycaster.setFromCamera(mouse, camera);    
	const hitObjects = raycaster.intersectObjects(modelsList);

	//Save the first (closest) object that the player is looking at
	const currentObject = hitObjects[0];

	//Currentobject is not undefined
	if(currentObject){
		//Find the object group
		currentObject.object.traverseAncestors(function (child) {
			if(child.type === "Group"){
				if(child.property == "interactable" && !uiVisible){
					MakeUI("interaction", child);
				}
				else if(child.property == "npc" && !uiVisible){
					MakeUI("dialogue", child); 
				}
			}
			else{
				return;
			}
		});
	}
	//Currentobject is undefined 
	else{
		return;
	}
}

//Make the UI with the correct information
function MakeUI(type, object){	
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
			//Execute rotate NPC. Function in npc.js
			RotateNPC(object);
			//Get the correct dialogue ID and extract the name and dialogue
			let dialogue_id = object.dialogue_id;
			let is_quest;
			let quest_id;
			let correctObject;
			//let correctDialogue;
	
			//Find the correct object in the JSON file
			dialogue.forEach(log => {
				if(log.dialogue_id == dialogue_id){
					correctObject = log;
					if(log.quest_id){
						is_quest = true;
						quest_id = log.quest_id;
					}
					else{
						is_quest = false;
					}
				}
			});

			//If the object exists
			if(correctObject){
				ui.setAttribute("class", "ui");
				ui.setAttribute("id", "dialogue");

				//Create name element and fill with the correct information
				let npcName = document.createElement('h1');
				npcName.innerHTML = correctObject.name;

				//Create dialogue element and fill with the correct information depending on if it is a quest or nor
				let npcDialogue = document.createElement('p');
				npcDialogue.setAttribute("class", "ui_p");

				//Create no button element, only add to ui div when necessarily
				let npcBtn2 = document.createElement('div');
				let npcText2 = document.createElement('p');
				npcBtn2.setAttribute("class", "ui_btn");
				npcText2.setAttribute("class", "p_btn");

				//Create ok button element
				let npcBtn = document.createElement('div');
				let npcText = document.createElement('p');
				npcBtn.setAttribute("class", "ui_btn");
				npcText.setAttribute("class", "p_btn");
				

				//If it is a NPC with a quest
				if(is_quest){
					console.log("isquest");
					//TODO: Quest UI add the left side of the screen
					//TODO: add quest property to correct model when quest is accepted
					//TODO: Show animation when add quest item
					//TODO: Hand in quest
					let status = correctObject.status;
					switch(status){
						//Quest hasn't been shown yet
						case "inactive":
							npcDialogue.innerHTML = correctObject.questStartDialogue;
							npcText2.innerHTML = "nee";
							npcText.innerHTML = "ok";

							npcBtn2.style.visibility = "visible";
							console.log("unaccepted quest dialogue");
							break;
						//Player accepted quest
						case "active":
							npcDialogue.innerHTML = correctObject.questDuringDialogue;
							npcText.innerHTML = "ok";
							npcBtn2.style.visibility = "hidden";
							console.log("during quest dialogue");
							break;
						//Player has handed in the quest at the NPC
						case "done":
							npcDialogue.innerHTML = correctObject.dialogue;
							npcText.innerHTML = "ok";
							npcBtn2.style.visibility = "hidden";
							console.log("normal Dialogue, done or denied");
							break;
						//Player denied the quest request
						case "denied":
							npcDialogue.innerHTML = correctObject.dialogue;
							npcText.innerHTML = "ok";
							npcBtn2.style.visibility = "hidden";
							console.log("normal Dialogue, done or denied");
							break;
					}
				}
				else{
					npcDialogue.innerHTML = correctObject.dialogue;
					npcText.innerHTML = "ok";
					npcBtn2.style.visibility = "hidden";
					console.log("not is quest");
				}

				ui.appendChild(npcName);
				ui.appendChild(npcDialogue);
				ui.appendChild(npcBtn);
				ui.appendChild(npcBtn2);
				npcBtn2.appendChild(npcText2);
				npcBtn.appendChild(npcText);
			}
			else{
				uiVisible = false;
				return;	
			}

		}	
		else{
			console.log("not interaction UI", uiVisible);
			uiVisible = false;
			return;
		}

		document.body.appendChild(ui);

		setTimeout(function(){
			//Show UI with fade in
			ui.style.opacity = 1;

			//Add eventlistener to the buttons so player can exit ui
			let btns = document.getElementsByClassName("ui_btn");
			for(let i = 0; i < btns.length; i++){
				btns[i].addEventListener("click", function(){
					DeleteUI(btns[i].parentElement);
					UpdateQuest(object, btns[i]);
					ResetRotationNPC();
				});
			}	

		}, 100);
	}
	//ui is visible
	else{
		DeleteUI();
		ResetRotationNPC();
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

function UpdateQuest(object, btn){
	let correctObject;
	let is_quest;
	let quest_id;
	console.log("object and button", object, btn);
	console.log("updating quest ui");

	//Find the correct object in the JSON file
	dialogue.forEach(log => {
		if(log.dialogue_id == dialogue_id){
			correctObject = log;
			if(log.quest_id){
				is_quest = true;
				quest_id = log.quest_id;
			}
			else{
				is_quest = false;
			}
		}
	});


	/*
	<div id="quest_ui">
        <h1>Quest Title</h1>
        <p>Quest description. Lorem ipsum dolor sit, amet consectetur adipisicing elit. Modi tempora deserunt facilis.</p>

        <h1>Quest Title</h1>
        <p>Quest description. Lorem ipsum dolor sit, amet consectetur adipisicing elit. Modi tempora deserunt facilis.</p>

        <h1>Quest Title</h1>
        <p>Quest description. Lorem ipsum dolor sit, amet consectetur adipisicing elit. Modi tempora deserunt facilis.</p>
    </div>
	*/


}

export{
	uiVisible
}