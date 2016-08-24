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

  var mesh = new THREE.Mesh(complex, new THREE.MeshBasicMaterial({ 
    wireframe: true, 
    transparent: true,
    opacity: 1
  }));

  mesh.position.z = 3.5;

  camera.position.z = 5;

  scene.add(mesh);

  function render() {
    requestAnimationFrame( render );
    renderer.render( scene, camera );
  }

  render();
}

loadSvg('svg/peg-circle.svg', function (err, svg) {
  if (err) throw err

  var svgPath = parsePath(svg);
  var mesh = svgMesh3d(svgPath, {
    delaunay: false,
    scale: 4
  });

  console.log(mesh);

  createScene(mesh);
});