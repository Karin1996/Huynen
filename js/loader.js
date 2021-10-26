//SCRIPT TO LOAD AND MUTATE ALL THE 3D MODELS
//Get json files
let models = require("../local_db/model.json");

import {
    scene,
    THREE,
} from "./debug";
//import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader';
import { DRACOLoader } from "three/examples/jsm/loaders/dracoloader";


//Var declarations
//const loader = new GLTFLoader();
const loader = new DRACOLoader();
loader.setDecoderPath("three/examples/js/libs/draco/");
loader.preload();

//Loop over the model json file and get all the static models
models.forEach(element => {
    //If the object is static add it to the scene
    //if(element.static === true){
    loader.load(element.src, function (gltf){
        const model = gltf.scene;
        model.position.set(element.x_pos, element.y_pos, element.z_pos);
        model.rotation.set(element.x_rot*(Math.PI/180), element.y_rot*(Math.PI/180), element.z_rot*(Math.PI/180));
        model.scale.set(element.x_scale, element.y_scale, element.z_scale);
        model.name = element.name;
        model.model_id = element.model_id;
        //Get the mesh from the object
        model.traverse((o) => {
            if(o.isMesh){
                if(o.name == "GroundPlane"){
                    o.receiveShadow = true;
                    o.castShadow = false;
                }
                else{
                    o.receiveShadow = true;
                    o.castShadow = true;
                }
                //If the element needs to be doublesided
                if(element.doublesided){
                    o.material = new THREE.MeshToonMaterial({map: o.material.map, side: THREE.DoubleSide});
                }
                //Element doesn't need to be doublesided or is not a plane
                else{
                    o.material = new THREE.MeshToonMaterial({map: o.material.map, side: THREE.FrontSide});
                    //Make a bounding box for the collision detection around the object. Will later generate matrix
                    //o.geometry.computeBoundingBox();
                    //const box = new THREE.BoxHelper(model, 0xffff00 );
                    //scene.add(box);
                }
            }
        });
        scene.add(model);
    });
});



