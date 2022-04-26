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
    camera.rotation.x = 90;

    addHelpers(scene, camera);

    let light = generateLight('rgb(255, 255, 255)', 1.2);
    scene.add(light);

    let renderer = generateRenderer();

    let floor = generateFloor();
    scene.add(floor);

    scene.background = generateSkybox();

    let crackman = new THREE.Object3D();
    generateGLTFModel(scene, "crackman", crackman, 0.004, 0, -0.2, 0, true);

    let controls = addOrbitControls(camera, renderer);
    update(renderer, scene, camera, controls);

    console.log(scene);
    return scene;
}

function addHelpers(scene, camera){
    const axesHelper = new THREE.AxesHelper(20);
    scene.add(axesHelper);

    const helper = new THREE.CameraHelper(camera);
    scene.add( helper );
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

function addOrbitControls(camera, renderer){
    let controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.minDistance = 10;
    controls.maxDistance= 50;
    return controls;
}

function generateFloor(){
    const texture = new THREE.TextureLoader().load( "./img/floor.jpg" );
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
            return './img/skybox/divine_' + filename + ".jpg";
        }
    ));
}

function generateGLTFModel(scene, filename, object, size, x, y, z, castShadow){
    let path = "/models/" + filename + "/scene.gltf";

    loader.load(path, function(model) {
        object = model.scene;
        object.name = "crackman";
        object.scale.set(size, size, size);
        object.position.x = x;
        object.position.y = y;
        object.position.z = z;
        object.castShadow = true;

        scene.add(object);
    });
}

function useKeyboard(obj, camera, scene){
    let step = 10 * clock.getDelta();
    let obje = scene.getObjectByName("crackman");

    if(keyboard.pressed("A")){
        obj.rotation.y = Math.PI / 2;
        obj.translateX(-step);
        camera.lookAt(obje.position);
    }

    if(keyboard.pressed("D")){
        obj.rotation.y = Math.PI / 2 * -1;
        obj.translateX(-step);
        camera.lookAt(obje.position);
    }

    if(keyboard.pressed("W")){
        obj.rotation.y = 0;
        obj.translateX(-step);
        camera.lookAt(obje.position);
    }

    if(keyboard.pressed("S")){
        obj.rotation.y = Math.PI;
        obj.translateX(-step);
        camera.lookAt(obje.position);
    }

    /*if (!keyboard.pressed("S")){
        camera.lookAt(obje.position);
    }*/


}

function update(renderer, scene, camera, controls){
    renderer.render(scene, camera);
    controls.update();
    controls.maxPolarAngle = (Math.PI / 2);

    let crackman = scene.getObjectByName("crackman");
    useKeyboard(crackman, camera, scene);


    requestAnimationFrame(function () {
        update(renderer, scene, camera, controls);
    });
}

init();