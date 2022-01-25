//SCRIPT TO MAKE AND MUTATE ALL THE UI ELEMENTS
let information = require("../local_db/information.json");
let dialogue = require("../local_db/dialogue.json");
let festivalList = require("../local_db/festivalList.json");
import {camera, raycaster, mouse, scene} from "./scene_setup";
import {modelsList} from "./loader";
import {SPEED} from "./movement";
import {RotateNPC, ResetRotationNPC} from "./npc"
import {AnimationController, animationDone, AudioController} from "./functions";

let uiVisible = false;
//On click execute CheckUI
window.addEventListener("click", CheckUI, true);
let quests = [];

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
				//console.log(festivalList);
				if(child.property == "interactable" && !uiVisible){
					MakeUI("interaction", child);
				}
				else if(child.property == "npc" && !uiVisible){
					MakeUI("dialogue", child); 
				}
				else if(child.property == "quest"){
					FinishQuest(child);
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
		LOOK_SPEED = SPEED.NONE;
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

					object.traverse((o) => {
						if(o.isMesh){
							setInterval(function(){
								//Disable the outline
								if(o.name.toLowerCase().includes("outline")){
									o.material.visible = false;
								}
							})	
						}
					});

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
					let status = correctObject.status;
					switch(status){
						//Quest hasn't been shown yet
						case "inactive":
							npcDialogue.innerHTML = correctObject.questStartDialogue;
							npcText2.innerHTML = "nee";
							npcText.innerHTML = "ok";
							npcBtn2.style.visibility = "visible";
							break;
						//Player accepted quest
						case "active":
							npcDialogue.innerHTML = correctObject.questDuringDialogue;
							npcText.innerHTML = "ok";
							npcBtn2.style.visibility = "hidden";
							break;
						//Player has handed in the quest at the NPC
						case "done":
							npcDialogue.innerHTML = correctObject.questFinishedDialogue;
							npcText.innerHTML = "ok";
							npcBtn2.style.visibility = "hidden";
							break;
						//Player denied the quest request
						case "denied":
							npcDialogue.innerHTML = correctObject.dialogue;
							npcText.innerHTML = "ok";
							npcBtn2.style.visibility = "hidden";
							break;
					}
				}
				else{
					npcDialogue.innerHTML = correctObject.dialogue;
					npcText.innerHTML = "ok";
					npcBtn2.style.visibility = "hidden";
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
			uiVisible = false;
			return;
		}

		document.body.appendChild(ui);

		setTimeout(function(){
			//Show UI with fade in
			ui.style.opacity = 1;

			//Add eventlistener to the buttons so player can exit ui
			let btns = document.getElementsByClassName("ui_btn");
			if(btns.length > 0){
				for(let i = 0; i < btns.length; i++){
					btns[i].addEventListener("click", function(){
						//DeleteUI(btns[i].parentElement);
						if(type == "dialogue"){
							UpdateQuest(object, btns[i]);
							ResetRotationNPC(object);
						}
						DeleteUI();
					});
				}
			}
			else{
				DeleteUI();
			}
					

		}, 100);

	}
	//ui is visible
	else{
		DeleteUI();
		ResetRotationNPC(object);
	}
}

function DeleteUI(){	
	if(typeof(document.getElementsByClassName("ui") != "undefined")){
		for(let i = 0; i < document.getElementsByClassName("ui").length; i++){
			document.getElementsByClassName("ui")[i].style.opacity = 0;
			setTimeout(function(){
				//Delete UI from the DOM
				document.getElementsByClassName("ui")[i].remove();
			}, 1000);
		}
		uiVisible = false;
		LOOK_SPEED = SPEED.NORMAL;
	}
	else{
		return;
	}
}

function UpdateQuest(object, btn){
	if(!btn){return;}
	let correctObject;

	//Find the correct object in the JSON file
	dialogue.forEach(obj => {
		if(obj.dialogue_id == object.dialogue_id){
			if(obj.quest_id){
				correctObject = obj;

				//What button has been pressed, and what does this do for the quest status
				switch(btn.innerText.toLowerCase()){
					case "ok":
						if(correctObject.status == "inactive"){
							//Player acccepted the quest, add to quest UI and change status
							correctObject.status = "active";
							quests.push(correctObject);
							UpdateQuestUI();
							
							//Change correct model property to quest
							modelsList.forEach(model => {
								if(model.quest_id == correctObject.quest_id){
									model.property = "quest"
									scene.remove(model);
								
									model.traverse((o) => {
										if(o.isMesh){
											//Show the outlines
											if(o.name.toLowerCase().includes("outline")){
												o.material.visible = true;
											}
										}
									});
									scene.add(model);
								}
							});
						}
						if(correctObject.status == "done"){
							var remove = quests.map(quest => quest.quest_id).indexOf(correctObject.quest_id);
							~remove && quests.splice(remove, 1)
							
							UpdateQuestUI();

							festivalList.forEach(item => {
								if(item.quest_id == correctObject.quest_id){
									item.property = "show";
								}
								else{
									return;
								}
							})
							correctObject.questFinishedDialogue = correctObject.dialogue;
						}
						break;
					case "nee":
						if(correctObject.status == "inactive"){
							correctObject.status = "denied"
						}
						break;
				}
			}
			else{
				return;
			}
		}
		else{
			return;
		}
	});

}

function UpdateQuestUI(){
	let questUI = document.getElementById("quest_ui");
	questUI.innerHTML = '';
	
	if(quests.length > 0){	
		questUI.style.visibility = "visible";
		quests.forEach(quest => {
			//Create element and fill with the correct information
			let title = document.createElement('h1');
			title.innerHTML = quest.questTitle;

			let description = document.createElement('p');
			description.innerHTML = quest.questDescription;
			description.setAttribute("data", quest.quest_id);

			questUI.appendChild(title);
			questUI.appendChild(description);
		});
	}
	else{
		questUI.style.visibility = "hidden";
	}
}

function FinishQuest(object){
	//If the animation is playing, lower the lookaround speed
	LOOK_SPEED = SPEED.SLOW;
	
	//Play the animation
	if(object.action){
		AnimationController(object, "Moving", false);
	}

	if(object.audio){
		AudioController(object, true, false);
	}

	//Change correct model property to static
	modelsList.forEach(model => {
		if(model.quest_id == object.quest_id){
			model.property = "static"
			scene.remove(model);
		
			model.traverse((o) => {
				if(o.isMesh){
					setInterval(function(){
						//Disable the outline
						if(o.name.toLowerCase().includes("outline")){
							o.material.visible = false;
						}
					})	
				}
			});
			scene.add(model);
		}
	});

	//Check if the animation is done
	let interval = setInterval(function(){

		//When the animation is done
		if (animationDone || !object.action) {
			LOOK_SPEED = SPEED.NORMAL;

			//Update the quest data
			quests.forEach(quest => {
				if(quest.quest_id == object.quest_id){
					quest.questDescription = "Ga naar "+ quest.name;
		
					for(let i = 0; i < document.getElementById("quest_ui").getElementsByTagName("p").length; i++){
						if(document.getElementById("quest_ui").getElementsByTagName("p")[i].getAttribute('data') == quest.quest_id){
							document.getElementById("quest_ui").getElementsByTagName("p")[i].innerHTML = quest.questDescription;
						}
					}
				
					quest.status = "done";					
				}
			});
            clearInterval(interval);
        }

	}, 50)
}

export{
	uiVisible
}