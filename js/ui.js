import { Vector3 } from "three";
import {THREE, scene, camera, raycaster, mouse} from "./debug";
import {playable} from "./movement";

//SCRIPT TO MAKE AND MUTATE ALL THE UI ELEMENTS
//let makeVisible = false;

window.addEventListener("mousemove", Interact);

let visible = false;
let ui = null;

function Interact(){
    //If playable is true, the player is not moving at the moment, cast a ray
    if(playable){
        raycaster.setFromCamera(mouse, camera);    
        const hitObjects = raycaster.intersectObjects(scene.children, true);

        // Obtain the distances
        let distances = [];
        hitObjects.forEach(element => {
            distances.push([element.distance, element]);
        });
        distances = distances.sort();

        // Skip if there are no objects
        if (distances.length < 1) {
            if (visible) {
                visible = false;
                scene.remove(ui);
            }
            return;
        }

        // Obtain the closest element
        let element = distances[0][1];

        if(element.object.parent.name !== "ground"){
            //Get the distance from the camera to the intersected object
            let distance = camera.position.distanceTo(element.object.parent.getWorldPosition(new THREE.Vector3()));
            //If the player is close enough show UI to indicate that the object has information
            if(distance < 10){
                const rootPos = element.object.parent.position;
                console.log(distance);
                //console.log("distance:", distance, "name:", element.object.parent.name);
                if (!visible) {
                    MakeIndicationUI(rootPos);
                    visible = true;
                }
            }
        }
        else {
            if (visible) {
                visible = false;
                scene.remove(ui);
            }
        }
    }
}

function MakeIndicationUI(rootPos){
    //Only execute making the UI once when the function is called
    console.log("makeVisible");

    //Get Texture
    const indicationImg = new THREE.TextureLoader().load("../images/object_questionmark.png");
    //Make the spitematerial
    const uiMaterial = new THREE.SpriteMaterial({
        map: indicationImg
    })

    //Make the sprite and set the sprite positions
    ui = new THREE.Sprite(uiMaterial);
    ui.position.y = 1.5;
    ui.position.x = rootPos.x;
    ui.position.z = rootPos.z;
    scene.add(ui);
}

//Create dialogue div
/*dialogue = document.createElement('div');
dialogue.setAttribute("id", "dialogue");
document.body.appendChild(dialogue);
//Fill dialogue div with correct information
if(document.getElementById("dialogue")){
    let dialogue = document.getElementById("dialogue");
    
    //Create person name element and fill with the correct information
    dialoguePerson = document.createElement('h1');
    dialoguePerson.innerHTML = "Bewoner 1";
    dialoguePerson.setAttribute("id", "dialoguePerson");

    //Create dialogue description element and fill with the correct information
    dialogueDescription = document.createElement('p');
    dialogueDescription.innerHTML = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec vel ex luctus, tincidunt mi non, tincidunt mi. Aenean porttitor nisl vulputate eros viverra, aliquam scelerisque augue vestibulum. Phasellus velit dolor, cursus quis tincidunt in, venenatis quis justo. Proin gravida orci est, sit amet suscipit est gravida eget. Curabitur consequat semper mattis. Morbi pellentesque dolor sit amet nibh dapibus, et accumsan ipsum ornare. Cras tristique, turpis a efficitur congue, velit arcu pellentesque diam, vitae aliquet lectus tellus sit amet augue. ";
    dialogueDescription.setAttribute("id", "dialogueDescription");
    
    dialogue.appendChild(dialoguePerson);
    dialogue.appendChild(dialogueDescription);
}*/

export{
    Interact
};