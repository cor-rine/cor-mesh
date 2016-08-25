var loadSvg = require('load-svg');
var parsePath = require('extract-svg-path').parse;
var svgMesh3d = require('svg-mesh-3d');

var THREE = require('three');
var Complex = require('three-simplicial-complex')(THREE);


function createScene(mesh) {
  var complex = Complex(mesh);
  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

  var renderer = new THREE.WebGLRenderer();
  renderer.setSize( window.innerWidth, window.innerHeight );
  document.body.appendChild( renderer.domElement );

  console.log(complex);

  // 412.3,160 461,154.7 459,166.2
  var triangleGeometry = new THREE.Geometry();
  triangleGeometry.vertices.push(new THREE.Vector3(412.3, 160, 0));
  triangleGeometry.vertices.push(new THREE.Vector3(461, 154.7, 0));
  triangleGeometry.vertices.push(new THREE.Vector3(459, 166.2, 0));
  triangleGeometry.faces.push(new THREE.Face3(0, 1, 2));

  var triangleMesh = new THREE.Mesh(triangleGeometry, new THREE.MeshBasicMaterial({
    wireframe: true,
    transparent: true,
    opacity: 1,
    color: 0x2a2a2c
  }));
  triangleMesh.position.set(0, 0.0, 0);
  scene.add(triangleMesh);

  var mesh = new THREE.Mesh(complex, new THREE.MeshBasicMaterial({
    wireframe: true,
    transparent: true,
    opacity: 1
  }));

  camera.position.z = 300;
  camera.position.x = 500;

  // scene.add(mesh);

  function render() {
    requestAnimationFrame( render );
    renderer.render( scene, camera );
  }

  render();
}

loadSvg('svg/face.svg', function (err, svg) {
  if (err) throw err

  var svgPath = parsePath(svg);
  var mesh = svgMesh3d(svgPath, {
    delaunay: false,
    scale: 4
  });

  console.log(mesh);

  createScene(mesh);
});