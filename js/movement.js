//SCRIPT TO MOVE THE PLAYER//
import {
    camera,
    THREE,
    mouse,
    raycaster,
} from "../js/scene_setup";
import {uiVisible} from "./ui";
import {modelsList} from "./loader";
import {festival} from "./functions";
import {moveable} from "./gamemanager";

const DISTANCE_GROUND = 1.52;
const STEP = 0.06;
const SPEED = {NORMAL: 0.005, SLOW: 0.001, NONE: 0};
//let LOOK_SPEED = {SPEED: SPEED.NORMAL};
LOOK_SPEED = SPEED.NORMAL;

document.body.addEventListener("mouseenter", function(){
    LOOK_SPEED = !uiVisible ? SPEED.NORMAL : SPEED.NONE;
});

//Player's mouse is not in the window
document.body.addEventListener("mouseleave", function(){
    LOOK_SPEED = SPEED.NONE;
});

[document.getElementById("help"), document.getElementById("audio")].forEach(element => {
    element.addEventListener("mouseenter", function(){
        LOOK_SPEED = SPEED.NONE;
    });
    element.addEventListener("mouseleave", function(){
       LOOK_SPEED = SPEED.NORMAL;
    });
});

//Mouse moving execute lookaround
document.body.addEventListener("mousemove", function(e){

    //If the bool moveable is true you can look around, moveable is imported from gamemanager
    if(moveable){
        //Get the mouse positions. Make middle of screen 0,0
        mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
        mouse.y = (e.clientY / window.innerHeight) * 2 - 1;
        LookAround();
   }
})

//Clamp the input x in the interval [a, b] 
function Clamp(x, a, b) {
    return Math.max(a, Math.min(x, b));
}

function LookAround(){
    //Change the order, otherwise the camera tilts when looking left right and up down
    camera.rotation.order = "YXZ";

    //If the cursor is in the predetermined 'deadzone' do not move
    if ((mouse.x > -0.1 && mouse.x < 0.1 && mouse.y > -0.2 && mouse.y < 0.2)) return;

    //You want the camera to be able to rotate 360 degrees.
    camera.rotation.y += (-mouse.x) * Math.PI * LOOK_SPEED;
    camera.rotation.x += (-mouse.y) * Math.PI * LOOK_SPEED;

    //Clamp the rotation in [-pi/3, pi/3]
    camera.rotation.x = Clamp(camera.rotation.x, -Math.PI/3, Math.PI/3);
}

document.addEventListener("mousedown", function(e){        
    if(!festival){
        raycaster.setFromCamera(mouse, camera);    
        const hitObjects = raycaster.intersectObjects(modelsList);
        
        //Save the first (closest) object that the player is looking at
        if(hitObjects.length > 0){
            let currentObject = hitObjects[0];

            mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
            mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;


            if(currentObject.object.parent.property == "ground" ){
                if(!uiVisible){
                    MovePlayer(currentObject);
                }
            }
        }
    }
    else{
        return;
    }
}, true);

function MovePlayer(location){
    const a_pos = camera.position;
    const distance = location.distance;
    const b_pos = new THREE.Vector3(location.point.x, location.point.y + DISTANCE_GROUND, location.point.z);

    AnimatePosition(a_pos, b_pos, distance, camera);
}

function AnimatePosition(a, b, distance, camera, percentage=0){
    if (percentage >= 0.2) {
        LOOK_SPEED = SPEED.NORMAL;
        return;
    }
    LOOK_SPEED = SPEED.NONE;
    //Determine the amount of steps
    let steps = Math.round(distance / STEP);
    let percentage_step = 1 / steps;

    setTimeout(function(){
        camera.position.lerpVectors(a, b, percentage);
        AnimatePosition(a, b, distance, camera, percentage + percentage_step);
    }, 30);
}

export{
    camera, moveable, DISTANCE_GROUND, LookAround, SPEED 
};