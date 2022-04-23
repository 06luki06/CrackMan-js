const loader = new THREE.GLTFLoader();
const clock = new THREE.Clock;
const keyboard = new THREEx.KeyboardState();

//TODO: create movement for Crackman
//TODO: create CoinSpawner
//TODO: create GhostSpawner
//TODO: create stat.gui / dat.gui

function init(){
    let scene = new THREE.Scene();

    let camera = generatePerspectiveCamera();
    scene.add(camera);

    const helper = new THREE.CameraHelper( camera );
    scene.add( helper );

    let light = generateLight('rgb(255, 255, 255)', 1.2);
    scene.add(light);

    let renderer = generateRenderer();

    let floor = generateFloor();
    scene.add(floor);

    scene.background = generateSkybox();
    console.log(scene);

    let crackman = null;
    generateGLTFModel(scene, "crackman", crackman, 0.004,0, -0.2, 0 );


    let controls = new THREE.OrbitControls(camera, renderer.domElement);

    update(renderer, scene, camera, controls);

    return scene;
}

function generateLight(color, intensity){
    let light = new THREE.DirectionalLight(color, intensity);
    light.castShadow = true;
    light.penumbra = 0.5;

    light.position.x = 15;
    light.position.y = 10;
    light.position.z = -10;

    light.shadow.mapSize.width = 2048;
    light.shadow.mapSize.height = 2048;
    light.shadow.bias = 0.001;
    return light;
}

function generatePerspectiveCamera(){
    let camera = new THREE.PerspectiveCamera(
        45, //fov
        window.innerWidth / window.innerHeight, //aspect ratio
        1, //near clipping plane
        1000 //far clipping plane
    );

    camera.position.x = 0;
    camera.position.y = 2;
    camera.position.z = 0;

    //TODO: set camera behind Pacman
    camera.name = "camera";

    return camera;
}

function generateRenderer(){
    let renderer = new THREE.WebGLRenderer();
    renderer.shadowMapEnabled = true; //shadows on
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor('rgb(60, 60, 60)'); //background-color
    document.getElementById("content").appendChild(renderer.domElement);

    return renderer;
}

function generateFloor(){
    const texture = new THREE.TextureLoader().load( "/img/floor.jpg" );
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set( 10, 10);

    let floor = new THREE.PlaneBufferGeometry(100, 100);
    let material = new THREE.MeshBasicMaterial();
    material.map = texture;

    let plane = new THREE.Mesh(floor, material);

    plane.position.y = -1;
    plane.rotation.x = - Math.PI / 2;
    plane.receiveShadow = true;
    plane.name = "floor";
    return plane;
}

function generateSkybox(){
    let filenames = ['ft', 'bk', 'up', 'dn', 'rt', 'lf']; //first all x, then y, then z
    return new THREE.CubeTextureLoader().load(filenames.map(
        function(filename){
            return '/img/skybox/divine_' + filename + ".jpg";
        }
    ));
}

function generateGLTFModel(scene, filename, object, size, x, y, z){
    let path = "/models/" + filename + "/scene.gltf";

    loader.load(path, function(gltf) {
        object = gltf;
        object.scene.name = filename;
        object.scene.scale.set(size, size, size);
        object.scene.position.x = x;
        object.scene.position.y = y;
        object.scene.position.z = z;
        scene.add(object.scene);
    });
}

function useKeyboard(obj, camera){
    let step = 10 * clock.getDelta();

    if(keyboard.pressed("A")){
        obj.rotation.y = Math.PI / 2;
        obj.translateX(-step);
        //camera.translateX(step);
    }

    if(keyboard.pressed("D")){
        obj.rotation.y = Math.PI / 2 * -1;
        obj.translateX(-step);
        //camera.translateX(-step);
    }

    if(keyboard.pressed("W")){
        obj.rotation.y = 0;
        obj.translateX(-step);
        //camera.translateZ(step);
    }

    if(keyboard.pressed("S")){
        obj.rotation.y = Math.PI;
        obj.translateX(-step);
        //camera.position.z -= step;
        //camera.lookAt(obj.position);
    }

}

function update(renderer, scene, camera, controls){
    renderer.render(scene, camera);
    controls.update();
    controls.maxPolarAngle = (Math.PI / 2);

    let crackman = scene.getObjectByName("crackman");
    let cam = scene.getObjectByName("camera");
    console.log(scene);
    console.log(scene.children[4].position); //why is CrackMan undefined????????
    console.log(cam.position);
    useKeyboard(crackman, camera);

    //camera.lookAt(crackman.scene.position.x, crackman.position.y, crackman.position.z);


    requestAnimationFrame(function () {
        update(renderer, scene, camera, controls);
    });
}

init();