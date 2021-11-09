const Interactable_VS = `
//varying vec3 v_normal;

void main(){
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position , 1.0);
    //v_Normal = normal;
}
`;

const Interactable_FS = `
uniform vec3 color;
//varying vec3 v_normal;

void main(){
    //gl_fragColor = vec4(v_normal, 1.0);
    gl_FragColor = vec4(color, 1.0);
}
`;

export {
    Interactable_VS,
    Interactable_FS
}


// o.material = new THREE.ShaderMaterial({
                            //     uniforms:{
                            //         color: {value: new THREE.Vector3(1, 1, 0)}
                            //     },
                            //     vertexShader: shaders.Interactable_VS,
                            //     fragmentShader: shaders.Interactable_FS,
                            // });