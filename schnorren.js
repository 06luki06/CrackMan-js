//TODO: create movement for Crackman - more or less done
//TODO: camera should follow player
//TODO: create barriers for end of the end
//TODO: create CoinSpawner
//TODO: create GhostSpawner
//TODO: create stat.gui / dat.gui

// standard global variables
let container, scene, camera, renderer, controls, stats;
let keyboard = new THREEx.KeyboardState();
let clock = new THREE.Clock();
// custom global variables
let cube;
let crackman;

generateSceen();
update();

// FUNCTIONS
function generateSceen(){
    // SCENE
    scene = new THREE.Scene();
    // CAMERA
    generateCamera();

    // RENDERER
    generateRenderer();

    // LIGHT
    let light = generateLight();
    scene.add(light);
    // FLOOR
    let floor = generateFloor();
    scene.add(floor);

    // SKYBOX/FOG
    scene.background = generateSkybox();

    // Crackman
    crackman = generateCrackMan();
    scene.add( crackman );

    //const helper = new THREE.CameraHelper( light.shadow.camera );
    //crackman.add( helper );

}

function update(){
    requestAnimationFrame(update);
    render();
    move();
}

function move(){
    let delta = clock.getDelta(); // secondsd
    let moveDistance = 200 * delta; // 200 pixels per second
    let rotateAngle = Math.PI / 2 * delta;   // pi/2 radians (90 degrees) per second

    // local transformations
    // move forwards/backwards/left/right
    if (keyboard.pressed("W")) {
        crackman.translateZ(-moveDistance);
    }
    if (keyboard.pressed("S")) {
        crackman.translateZ(moveDistance);
    }
    if (keyboard.pressed("Q")) {
        crackman.translateX(-moveDistance);
    }
    if (keyboard.pressed("E")) {
        crackman.translateX(moveDistance);
    }

    // rotate left/right
    if (keyboard.pressed("A")) {
        crackman.rotateOnAxis(new THREE.Vector3(0, 1, 0), rotateAngle);
    }
    if (keyboard.pressed("D")) {
        crackman.rotateOnAxis(new THREE.Vector3(0, 1, 0), -rotateAngle);
    }

    if (keyboard.pressed("Z")){
        crackman.position.set(0,25.1,0);
        crackman.rotation.set(0,0,0);
    }

    let relativeCameraOffset = new THREE.Vector3(0,50,200);
    let cameraOffset = relativeCameraOffset.applyMatrix4( crackman.matrixWorld );

    camera.position.x = cameraOffset.x;
    camera.position.y = cameraOffset.y;
    camera.position.z = cameraOffset.z;
    camera.lookAt( crackman.position );
}

function render() {
    renderer.render( scene, camera );
}

function generateSkybox(){
    let filenames = ['ft', 'bk', 'up', 'dn', 'rt', 'lf']; //first all x, then y, then z
    return new THREE.CubeTextureLoader().load(filenames.map(
        function(filename){
            return './img/skybox/divine_' + filename + ".jpg";
        }
    ));
}

function generateCamera(){
    camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.1, 20000);
    scene.add(camera);
    camera.position.set(0,150,400);
    camera.lookAt(scene.position);
}

function generateRenderer(){
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    container = document.getElementById('content');
    renderer.shadowMap.enabled = true;
    container.appendChild( renderer.domElement );
}

function generateLight(){
    let light = new THREE.PointLight(0xbbbbbb, 100);
    light.position.set(40,10,0);
    light.castShadow = true;
    light.shadow.mapSize.width = 512; // default
    light.shadow.mapSize.height = 512; // default
    light.shadow.camera.near = 0.5; // default
    light.shadow.camera.far = 500; // default
    return light;
}

function generateFloor(){
    let floorTexture = new THREE.ImageUtils.loadTexture( 'img/floor.jpg' );
    floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping;
    floorTexture.repeat.set( 10, 10 );
    let floorMaterial = new THREE.MeshBasicMaterial( { map: floorTexture, side: THREE.DoubleSide } );
    let floorGeometry = new THREE.PlaneGeometry(1000, 1000, 10, 10);
    let floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.position.y = -0.5;
    floor.rotation.x = Math.PI / 2;
    floor.receiveShadow = true;

    return floor;
}

function checkIfValidArea(){

}

function generateCrackMan(){
    const geometry = new THREE.SphereGeometry( 15, 32, 16 );
    const material = new THREE.MeshBasicMaterial( { color: 0x8b8000 } );
    crackman = new THREE.Mesh( geometry, material );
    crackman.position.set(0, 15, 0);
    crackman.castShadow = true;

    return crackman;
}