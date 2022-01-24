//SCRIPT TO MOVE THE PLAYER TO CLICKED LOCATION//
import {
    camera,
    renderer,
    THREE,
    mouse,
    raycaster,
    scene
} from "../js/scene_setup";
import {uiVisible} from "./ui";
import {FirstPersonControls} from 'three/examples/jsm/controls/FirstPersonControls';
import {modelsList, loaded} from "./loader";
import {DisplayRay} from "./debug";
import {festival} from "./functions";
import {moveable} from "./gamemanager";
import {PointerLockControls} from 'three/examples/jsm/controls/PointerLockControls'

let target = new THREE.Vector2();
const DISTANCE_GROUND = 1.52;
//const controls = new PointerLockControls(camera, renderer.domElement)

document.body.addEventListener("mousemove", function(e){
    //If the bool moveable is true you can look around, moveable is imported from gamemanager
    if(moveable){
        mouse.x = -(e.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
        //controls.change();
        //Get the mouse positions and make it world space
        //const windowHalf = new THREE.Vector2( window.innerWidth / 2, window.innerHeight / 2 );
        //mouse.x = ( e.clientX - windowHalf.x );
	    //mouse.y = ( e.clientY - windowHalf.y );
    }
})

function LookAround(){
    camera.rotation.y = THREE.MathUtils.lerp(camera.rotation.y, (mouse.x * Math.PI) / 8, 0.1)
    camera.rotation.x = THREE.MathUtils.lerp(camera.rotation.x, (mouse.y * Math.PI) / 8, 0.1)
}
//function lookAround() {

    //target.x = (1 - mouse.x) * 0.002;
    //target.y = (1 - mouse.y) * 0.002;

    //camera.rotation.x += 0.05 * (target.x - camera.rotation.x);
    //camera.rotation.y += 0.05 * (target.y - camera.rotation.y);

    //requestAnimationFrame(lookAround);
    //renderer.render( scene, camera );
//}



/*
//Var declarations
const fpcontrols = new FirstPersonControls(camera, renderer.domElement);
fpcontrols.movementSpeed = 0;
fpcontrols.lookSpeed = 0.05;
fpcontrols.noFly = true;
const LOOK_SPEED = 0.12;

const STEP = 0.1;
const DISTANCE_GROUND = 1.52;
camera.position.x = 0;
camera.position.z = 0;
camera.position.y = DISTANCE_GROUND;


//Player's mouse is in the window and there is no ui visible
document.body.addEventListener("mouseenter", function(){
    if(!uiVisible){fpcontrols.lookSpeed = LOOK_SPEED;}
    else{fpcontrols.lookSpeed = 0;}
});
//Player's mouse is not in the window
document.body.addEventListener("mouseleave", function(){
    fpcontrols.lookSpeed = 0;
});

//Player's mouse is on the help btn
document.getElementById("help").addEventListener("mouseenter", function(){
    fpcontrols.lookSpeed = 0;
});
document.getElementById("help").addEventListener("mouseleave", function(){
    fpcontrols.lookSpeed = LOOK_SPEED;
});


//Enable looking after everything is loaded in
if(loaded){
    fpcontrols.lookSpeed = LOOK_SPEED;
}

//Get the clicked location (if festival has not started)
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
        fpcontrols.lookSpeed = LOOK_SPEED;
        //console.log(camera.position);
        return;
    }
    //Determine the amount of steps
    fpcontrols.lookSpeed = 0;
    let steps = Math.round(distance / STEP);
    let percentage_step = 1 / steps;

    setTimeout(function(){
        camera.position.lerpVectors(a, b, percentage);
        AnimatePosition(a, b, distance, camera, percentage + percentage_step);
    }, 30);
}

*/
export{
    /*fpcontrols, LOOK_SPEED, DISTANCE_GROUND, */camera, moveable, DISTANCE_GROUND, LookAround
};