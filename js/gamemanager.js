import {
    scene,
    camera,
    renderer,
    Render,
    THREE,
    OrbitControls
} from "../js/scene_setup";

import {
    player
} from "../js/player";

let debug_mode = true;

if(debug_mode){
    camera.position.z = 5;
    camera.position.y = 5;
    camera.lookAt(0,0,0);
    let gridHelper = new THREE.GridHelper(10,10);
    const axesHelper = new THREE.AxesHelper( 5 );
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.update();
    scene.add(gridHelper, axesHelper);
}

function RenderLoop() {
	requestAnimationFrame(RenderLoop);
	// required if controls.enableDamping or controls.autoRotate are set to true
	
	Render();
}
RenderLoop();

console.log("player:", player);