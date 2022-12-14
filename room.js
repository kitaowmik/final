import * as THREE from './build/three.module.js';
import { GLTFLoader } from './src/GLTFLoader.js';
import { OrbitControls } from './src/OrbitControls.js';
import { AfterimagePass } from './src/AfterimagePass.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, innerWidth/innerHeight, 1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true } );

let clock = new THREE.Clock();

renderer.setSize(innerWidth,innerHeight);
renderer.setPixelRatio(devicePixelRatio);
document.body.appendChild(renderer.domElement);

camera.position.set(5,10,18);

const light = new THREE.DirectionalLight( 0xFFFFFF, 2);
light.castShadow = true;
light.shadow.camera.far = 20;
light.shadow.mapSize.set(1024,1024);
light.shadow.normalBias = 0.05;
light.position.set( 6, 10, 15);
scene.add(light);

const controls = new OrbitControls (camera, renderer.domElement);
controls.minDistance = 1;
controls.maxDistance = 8;
controls.target.set(5,10,18);
controls.update();

scene.background = new THREE.Color( 0xaaccff );
scene.fog = new THREE.FogExp2( 0xcfe2f3, 0.03 );

let ambient = new THREE.AmbientLight(0xefba7e);
scene.add(ambient);

let geometry = new THREE.PlaneGeometry( 20000, 20000, 125, 125);
geometry.rotateX( - Math.PI / 2 );

const position = geometry.attributes.position;
position.usage = THREE.DynamicDrawUsage;

for ( let i = 0; i < position.count; i ++ ) {

    const y = 35 * Math.sin( i / 2 );
    position.setY( i, y );

}

const texture = new THREE.TextureLoader().load( './assets/waterill.png' );
				texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
				texture.repeat.set( 5, 5 );

				let material = new THREE.MeshBasicMaterial( { color: 0x0044ff, map: texture } );

				let mesh = new THREE.Mesh( geometry, material );
				scene.add( mesh );


let room = new THREE.Object3D();
const loaderOne = new GLTFLoader().load(
    "./assets/room.glb",
    function(gltf) {
    room = gltf.scene;
    room.position.set(5,5,5);
    room.rotation.set(0.2, 0, 0); 
    room.scale.set(0.5, 0.5, 0.5);
    room.castShadow = true;
    room.receiveShadow = true;
    scene.add(room);
    },
    undefined,
    function(error) {
    console.error(error);
    }
);



function render() {

    const delta = clock.getDelta();
    const time = clock.getElapsedTime() * 10;

    const position = geometry.attributes.position;

    for ( let i = 0; i < position.count/2; i ++ ) {

        const y = 35 * Math.sin( i / 2 + ( time + i ) / 50 );
        position.setY( i, y );

    }

    //room.position.x = Math.sin( time * 0.06 ) * 9;
    room.position.y = Math.sin( time * 0.024 ) * 2 + 6;
    room.position.z = Math.sin( time * 0.008 ) * 5;

    position.needsUpdate = true;

    controls.update( delta );
    renderer.render( scene, camera );

}

function animate() {

    requestAnimationFrame(animate);
    render();
    
   
}

animate();