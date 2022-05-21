//TODO: create barriers for end of the end
//TODO: create CoinSpawner
//TODO: create GhostSpawner
//TODO: create stat.gui / dat.gui

// standard global variables
let container, scene, camera, renderer, controls, stats;
let keyboard = new THREEx.KeyboardState();
let clock = new THREE.Clock();
const loader = new THREE.GLTFLoader();
const x_left = -480;
const x_right = 480;
const z_front = -460;
const z_back = 470;
let posX = 0;
let posZ = 0;
let score = 0;
let coinAmount = 0;
let coinLight;
// custom global variables
let cube;
let crackman;
let coin;

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

    //Border
    let borderTop = generateBorderX(x_left - x_right,  z_front - 30);
    scene.add(borderTop);
    let borderBack = generateBorderX(x_left - x_right - 35, z_back + 25);
    scene.add(borderBack);
    let borderRight = generateBorderZ(z_front - z_back, x_right + 30);
    scene.add(borderRight);
    let borderLeft = generateBorderZ(z_front - z_back, x_left - 30);
    scene.add(borderLeft);
    // SKYBOX/FOG
    scene.background = generateSkybox();

    // Crackman
    crackman = generateCrackMan();
    scene.add( crackman );


    generateCoin();
    //const helper = new THREE.CameraHelper( light.shadow.camera );
    //crackman.add( helper );

}

function update(){
    requestAnimationFrame(update);
    render();
    move();
}

function move(){
    let delta = clock.getDelta(); // seconds
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
    generateHit(posX, posZ, crackman.position.x, crackman.position.z);
    checkIfValidArea();
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
    let light = new THREE.DirectionalLight(0xbbbbbb, 10);
    light.position.set(40,100,30);
    light.castShadow = true;
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

function generateBorderX(difference, z){
    let borderTexture = new THREE.ImageUtils.loadTexture( 'img/floor.jpg' );
    borderTexture.wrapS = borderTexture.wrapT = THREE.RepeatWrapping;
    borderTexture.repeat.set(10, 10);

    const geometry = new THREE.BoxGeometry( difference - 50, 400, 25 );
    const material = new THREE.MeshBasicMaterial( {map:borderTexture, side:THREE.DoubleSide} );
    let border = new THREE.Mesh( geometry, material );
    border.position.x = 0;
    border.position.y = -190;
    border.position.z = z;
    return(border);
}

function generateBorderZ(difference, x){
        let borderTexture = new THREE.ImageUtils.loadTexture( 'img/floor.jpg' );
        borderTexture.wrapS = borderTexture.wrapT = THREE.RepeatWrapping;
        borderTexture.repeat.set(10, 10);

        const geometry = new THREE.BoxGeometry( 25, 400, difference -75 );
        const material = new THREE.MeshBasicMaterial( {map:borderTexture, side:THREE.DoubleSide} );
        let border = new THREE.Mesh( geometry, material );
        border.position.x = x;
        border.position.y = -190;
        border.position.z = 0;
        return(border);
}

function checkIfValidArea(){
    if(crackman.position.x < x_left){
        crackman.position.x = x_left;
    }

    if(crackman.position.x > x_right){
        crackman.position.x = x_right;
    }

    if(crackman.position.z < z_front){
        crackman.position.z = z_front;
    }

    if(crackman.position.z > z_back){
        crackman.position.z = z_back;
    }
}

function generateCrackMan(){
    const geometry = new THREE.SphereGeometry( 15, 32, 16 );
    const material = new THREE.MeshBasicMaterial( { color: 0x8b8000 } );
    crackman = new THREE.Mesh( geometry, material );
    crackman.position.set(0, 15, 0);
    crackman.castShadow = true;

    return crackman;
}

function generateCoin(){
    if(coinAmount === 0){
        loader.load(
            // resource URL
            'models/doge_coin/scene.gltf',
            // called when the resource is loaded
            function ( gltf ) {
                coin = gltf.scene;
                //random pos
                posX = generateRandom(x_left, x_right);
                posZ = generateRandom(z_front, z_back);
                coin.position.set(posX, 15, posZ);
                coin.scale.set(0.1,0.1,0.1);
                coin.castShadow = true;
                coinAmount = 1;
                coinLight = generateCoinLight();
                coin.add(coinLight);
                scene.add(coin);
            },
            // called while loading is progressing
            function ( xhr ) {
                console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
            },
            // called when loading has errors
            function ( error ) {
                console.log( 'An error happened' );
            }
        );
    }
}

function generateCoinLight(){
    let light = new THREE.PointLight(0xFFFFFF, 1, 100);
    light.position.set(0, 100, -50);
    light.castShadow = true;
    return light;
}

function generateRandom(min, max){
    let difference = max - min;
    let rand = Math.random();
    rand = Math.floor( rand * difference);
    rand += min;
    return rand;
}

function generateHit(coinposx, coinposz, crackposx, crackposz){
    if(coinAmount === 1 && (crackposx >= coinposx - 15 && crackposx <= coinposx + 15) && (crackposz >= coinposz - 10 && crackposz <= coinposz + 10)){
        scene.remove(coin);
        coinAmount = 0;
        score++;
        console.log(score);
        generateCoin();
    }
}