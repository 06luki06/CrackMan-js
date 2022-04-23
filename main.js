function init(){
    let scene = new THREE.Scene();

    let camera = generatePerspectiveCamera();
    scene.add(camera);

    let renderer = generateRenderer();

    let floor = generateFloor();
    scene.add(floor);

    scene.background = generateSkybox();

    let controls = new THREE.OrbitControls(camera, renderer.domElement);

    update(renderer, scene, camera, controls);

    return scene;
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
    camera.position.z = -10;

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
    let plane = new THREE.Mesh(
        new THREE.PlaneBufferGeometry(100, 100),
        new THREE.MeshBasicMaterial({
            color: 'rgb(100, 100, 100)'
        }));

    plane.rotation.x = - Math.PI / 2;
    plane.receiveShadow = true;
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

function update(renderer, scene, camera, controls){
    renderer.render(scene, camera);
    controls.update();

    requestAnimationFrame(function () {
        update(renderer, scene, camera, controls);
    });
}

init();