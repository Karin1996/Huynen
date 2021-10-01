//Get json files
let models = require("../local_db/model.json");

import {
    scene,
    camera,
    renderer,
    Render,
    THREE,
    OrbitControls,
    GLTFLoader,
    TransformControls
} from "../js/scene_setup";

import {
    player
} from "../js/player";

let debug_mode = true;

const orbitControls = new OrbitControls(camera, renderer.domElement);
const loader = new GLTFLoader();
const controls = new TransformControls(camera, renderer.domElement);
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

//debug mode
if(debug_mode){
    camera.position.z = 5;
    camera.position.y = 5;
    camera.lookAt(0,0,0);
    let gridHelper = new THREE.GridHelper(10,10);
    const axesHelper = new THREE.AxesHelper( 5 );
    orbitControls.update();
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
}
//Select the model that is clicked (has a raycast hit)
function SelectModel(){
    raycaster.setFromCamera(mouse, camera);
    const hitObjects = raycaster.intersectObjects(scene.children, true);
    
    hitObjects.forEach(element => {
        //Only if the hit object is a mesh attach the transform controls
        if(element.object.type == "Mesh"){
            console.log(element.object.parent);
            controls.attach(element.object.parent);
        }
    });
}

//Loop over the model json file
models.forEach(element => {
    //If the object is static add it to the scene
    if(element.static === true){
        loader.load(element.src, function (gltf){
            const model = gltf.scene;
            model.position.set(element.x_pos, element.y_pos, element.z_pos);
            controls.attach(gltf.scene);
            model.name = element.name;
            model.model_id = element.model_id;
            scene.add(controls, model);
        });
    }
    else{
        return;
    }
});

function RenderLoop() {
	requestAnimationFrame(RenderLoop);
	Render();
}
RenderLoop();
