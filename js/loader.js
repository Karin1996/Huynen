//SCRIPT TO LOAD AND MUTATE ALL THE 3D MODELS
//Get json files
let models = require("../local_db/model.json");
//let shaders = require("../js/shaders.js");
import {
    scene,
    THREE,
} from "./scene_setup";
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader';
import {DRACOLoader} from "three/examples/jsm/loaders/dracoloader";


//Var declarations
const loader = new GLTFLoader();
//const MAXHEIGHT = 3;
let modelsList = [];
let skyboxes = [];
let loaded = false;
//const loader = new DRACOLoader();
//loader.setDecoderPath("three/examples/js/libs/draco");
//loader.setDecoderPath('https://www.gstatic.com/draco/v1/decoders/');
//loader.preload();

//Loop over the model json file and get all the static models
models.forEach(element => {
    //If the object is static add it to the scene
    loader.load(element.src, function (gltf){
        const model = gltf.scene;
        model.position.set(element.x_pos, element.y_pos, element.z_pos);
        model.rotation.set(element.x_rot*(Math.PI/180), element.y_rot*(Math.PI/180), element.z_rot*(Math.PI/180));
        model.scale.set(element.x_scale, element.y_scale, element.z_scale);
        model.name = element.name;
        model.model_id = element.model_id;
        model.originalRotation = model.rotation.clone();
        //model.maxHeight = MAXHEIGHT;
        model.property = element.property;
        //If the model has a information id > 0 it means the object has information. Save the id for later uses in
        if(element.information_id > 0){
            model.information_id = element.information_id;
        }
        if(element.dialogue_id > 0){
            model.dialogue_id = element.dialogue_id;
        } 
        if(element.quest_id > 0){
            model.quest_id = element.quest_id;
        } 
        //Get the mesh from the object
        model.traverse((o) => {
            if(o.isMesh){
                o.material = new THREE.MeshToonMaterial({map: o.material.map, side: THREE.DoubleSide, morphTargets: true});
                o.receiveShadow = true;
                o.castShadow = true;
                //Check the extra properties for certain values that determine how it will be displayed
                switch(model.property){
                    case "ground":
                        o.material.side = THREE.FrontSide;
                        o.castShadow = false;
                        break;

                    case "skybox":
                        o.material = new THREE.MeshBasicMaterial({map: o.material.map});
                        o.receiveShadow = false;
                        o.castShadow = false;
                        o.material.transparent = true;
                        if(model.name.toLowerCase() == "skybox1"){
                            o.material.opacity = 1;
                        }
                        else if(model.name.toLowerCase() == "skybox2"){
                            o.material.opacity = 0;
                        }
                        skyboxes.push(o);
                    break;

                    case "transparent":
                        o.material.transparent = true;
                        o.material.opacity = 0.8;
                        o.receiveShadow = false;
                        o.castShadow = false;
                        break;

                    case "interactable":
                        if(o.name.toLowerCase().includes("outline")){
                            o.material = new THREE.MeshBasicMaterial({color: 0x034a35, visible:true});
                            o.receiveShadow = false;
                            o.castShadow = false;
                        }
                        if(o.name.toLowerCase().includes("box")){
                            o.material = new THREE.MeshBasicMaterial();
                            o.fog = false;
                            o.visible = false;
                            o.receiveShadow = false;
                            o.castShadow = false;
                        }
                        break;
                    case "npc":
                        model.mixer = new THREE.AnimationMixer(model);
                        model.clips = gltf.animations;
                        model.clip = THREE.AnimationClip.findByName(model.clips, "Idle");
                        model.action = model.mixer.clipAction(model.clip);     

                        model.audio = new Audio(element.audio);

                        if(o.name.toLowerCase().includes("box")){
                            o.material = new THREE.MeshBasicMaterial();
                            o.fog = false;
                            o.visible = false;
                            o.receiveShadow = false;
                            o.castShadow = false;
                        }
                        break;
                    case "questInactive":
                        model.mixer = new THREE.AnimationMixer(model);
                        model.clips = gltf.animations;
                        model.clip = THREE.AnimationClip.findByName(model.clips, "Idle");
                        model.action = model.mixer.clipAction(model.clip);     

                        model.audio = new Audio(element.audio);

                        o.frustumCulled = false;
                        
                        if(o.name.toLowerCase().includes("outline")){
                            o.material = new THREE.MeshBasicMaterial({color: 0xe32d00, visible:false});
                            o.receiveShadow = false;
                            o.castShadow = false;
                        }
                        if(o.name.toLowerCase().includes("box")){
                            o.material = new THREE.MeshBasicMaterial();
                            o.fog = false;
                            o.visible = false;
                            o.receiveShadow = false;
                            o.castShadow = false;
                        }
                        break;
                    
                    case "fire":
                            model.mixer = new THREE.AnimationMixer(model);
                            model.clips = gltf.animations;
                            model.clip = THREE.AnimationClip.findByName(model.clips, "Idle");
                            model.action = model.mixer.clipAction(model.clip);   
                            
                            o.receiveShadow = false;
                            o.castShadow = false;
                            o.material.transparent = true;
                            o.material.opacity = 0.5;
                            
                            break;
                    case "animal":
                        model.mixer = new THREE.AnimationMixer(model);
                        model.clips = gltf.animations;

                        //Get a random clip to play
                        for(let i=0; i < model.clips.length; i++){
                            let clipToPlay = model.clips[Math.floor(Math.random() * model.clips.length)]
                            model.clip = THREE.AnimationClip.findByName(model.clips, clipToPlay.name);
                        }
                        model.action = model.mixer.clipAction(model.clip);     
                        break;

                    case "static":
                        //Change Grass and Reed shadow properties
                        if(o.name.toLowerCase().includes("grass") || o.name.toLowerCase().includes("reed")){ 
                            o.receiveShadow = false;
                            o.castShadow = false;
                        }
                        if(o.name.toLowerCase().includes("box")){
                            o.material = new THREE.MeshBasicMaterial();
                            o.fog = false;
                            o.visible = false;
                            o.receiveShadow = false;
                            o.castShadow = false;
                        }
                        break;
                }
            }
        });
        modelsList.push(model);
        scene.add(model);
       
        if(modelsList.length >= models.length - 2){
            loaded = true;
        }
    });
}); 


export{
    skyboxes,
    modelsList,
    loaded
}


