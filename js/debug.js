//SCRIPT FOR DEBUGGING
import {
    scene,
    camera,
    renderer,
    THREE,
    Render,
    raycaster, 
    mouse
} from "../js/scene_setup";
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';
import {TransformControls} from 'three/examples/jsm/controls/TransformControls';
import Stats from 'three/examples/jsm/libs/stats.module';


//Var declarations
const controls = new TransformControls(camera, renderer.domElement);
const stats = Stats();
let selectedObject;
let debug_mode = false;


window.addEventListener('keydown', function(e) {
    if (e.key == "Enter") {
        Orbit();
        DisplayRay(raycaster.far);
        document.body.style.cursor = "auto";
        debug_mode = !debug_mode;
	}
});


function Orbit(){
    document.body.appendChild(stats.dom);

    const orbitControls = new OrbitControls(camera, renderer.domElement);
    orbitControls.position = camera.position;
    Render();

    let gridHelper = new THREE.GridHelper(10,10);
    const axesHelper = new THREE.AxesHelper( 5 );
    scene.add(gridHelper, axesHelper);
    
    //When pressing G, R or S change the transform controls mode
    window.addEventListener('keydown', function (event) {
        switch (event.code) {
            case 'KeyG':
                controls.setMode('translate');
                break;
            case 'KeyR':
                controls.setMode('rotate');
                break;
            case 'KeyS':
                controls.setMode('scale');
                break;
        }
    });

    // When clicking disable orbitControls. You cant move object easily otherwise
    controls.addEventListener('mouseDown', function () {
       orbitControls.enabled = false;
    });
    controls.addEventListener('mouseUp', function () {
        orbitControls.enabled = true;
    });

    //When a click event is triggered get mouse location
    window.addEventListener("click", function(e){
        mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
        //Execute SelectModel
        SelectModel();
    });
    scene.add(controls);
}

if (debug_mode) {
    Orbit();
}

//Select the model that is clicked (has a raycast hit)
function SelectModel(){
    raycaster.setFromCamera(mouse, camera);
    const hitObjects = raycaster.intersectObjects(scene.children, true);
    
    hitObjects.forEach(element => {
        //Only if the hit object is a mesh attach the transform controls
        if(element.object.type == "Mesh" && element.object.parent.name !== "ground"){
            controls.attach(element.object.parent);
            console.log("pos:", element.object.position); //To see the pos, rot and scale of object
            selectedObject = element.object.parent;
        }
    });
}

function DisplayRay(length = 10) {
    const direction = camera.getWorldDirection(new THREE.Vector3());
    raycaster.setFromCamera(mouse, camera)
    const origin = raycaster.ray.origin;
    const hex = 0xffff00;
    const arrowHelper = new THREE.ArrowHelper( direction, origin, length, hex );
    scene.add(arrowHelper);
}

export{
    debug_mode,
    stats,
    DisplayRay
};