var _arrShapes = [];
var _scene, _renderer, _mesh, _camera, _width, _height, _controls;


window.onload = function () {
    var width = window.innerWidth;
    var height = window.innerHeight / 2;
    this._width = width;
    this._height = height;

    var canvas = document.getElementById('canvas');

    canvas.setAttribute('width', width);
    canvas.setAttribute('height', height);

    var renderer = new THREE.WebGLRenderer({canvas: canvas});
    renderer.setClearColor(0xffffff);

    var scene = new THREE.Scene();

    var camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 5000);
    camera.position.set(0, 0, 1000);

    var light = new THREE.AmbientLight(0xffffff);
    scene.add(light);


    controls = new THREE.OrbitControls(camera, renderer.domElement);
    //controls.addEventListener( 'change', render ); // call this only in static scenes (i.e., if there is no animation loop)
    controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
    controls.dampingFactor = 0.25;
    controls.screenSpacePanning = false;
    controls.minDistance = 100;
    controls.maxDistance = 500
    controls.maxPolarAngle = Math.PI / 2;

    this._scene = scene;
    this._renderer = renderer;
    this._camera = camera;
    this._controls = controls;
}

function create() {
    var scale = +document.getElementById('scale').value;
    var e = document.getElementById('shape');
    var shapeNum = +e.options[e.selectedIndex].value;

    var hex = Math.floor(Math.random() * 0xffffff);

    switch (shapeNum) {
        case 1:
            var shape = new THREE.BoxBufferGeometry(scale * 50, scale * 50, scale * 50);
            var shapeName = 'cube';
            break;
        case 2:
            var shape = new THREE.ConeBufferGeometry(scale * 20, scale * 50, 6);
            var shapeName = 'pyramid';
            break;
        case 3:
            var shape = new THREE.SphereBufferGeometry(scale * 25, 6, 6);
            var shapeName = 'sphere';
            break;
    }

    var materialSphere = new THREE.MeshBasicMaterial({color: hex, wireframe: true});
    var mesh = new THREE.Mesh(shape, materialSphere);

    mesh.position.set(Math.floor(this._width * (0.5 - Math.random())), Math.floor(this._height * (0.5 - Math.random())), 0);
    mesh.name = hex.toString();
    //mesh.rotation.set( Math.random(), Math.random(), Math.random() ).multiplyScalar( 2 * Math.PI );
    this._mesh = mesh;
    this._scene.add(this._mesh);
    loop();
    animate();

    this._arrShapes.push({'color': hex, 'shape': shapeName, 'uuid': mesh.uuid, 'name': mesh.name})
    addNewItemToList(this._arrShapes[this._arrShapes.length - 1]);
}

function loop() {
    this._mesh.rotation.y += Math.PI / 500;
    render();
    requestAnimationFrame(function () {
        loop();
    })
}

function animate() {
    requestAnimationFrame(animate);
    this._controls.update(); // only required if controls.enableDamping = true, or if controls.autoRotate = true
    render();
}

function render() {
    this._renderer.render(this._scene, this._camera);
}

function addNewItemToList(item) {
    $('#info').append('<li id="' + item.name + '">' +
        '<span>' + item.shape + ', uuid = ' + item.uuid + '</span>' +
        '<span class="danger" onClick="removeListElement(' + item.name + ')">&#10007</span></li>');
}

function removeListElement(shapeName) {
    var selectedObject = this._scene.getObjectByName(shapeName.toString());
    this._scene.remove(selectedObject);
    render();

    var element = document.getElementById(shapeName), searchedItem;
    element.parentNode.removeChild(element);
    for (const element of this._arrShapes) {
        if (element.name == shapeName) searchedItem = element;
    }
    this._arrShapes.splice(this._arrShapes.indexOf(searchedItem), 1);
};