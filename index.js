var loadSvg = require('load-svg');
var parsePath = require('extract-svg-path').parse;
var svgMesh3d = require('svg-mesh-3d');

var THREE = require('three');
var Complex = require('three-simplicial-complex')(THREE);

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
var renderer = new THREE.WebGLRenderer();

camera.position.z = 900;
camera.position.x = 100;
camera.position.y = 500;

renderer.setSize( window.innerWidth, window.innerHeight );

document.body.appendChild( renderer.domElement );

function drawTriangle() {
  // 412.3,160 461,154.7 459,166.2
  var triangleGeometry = new THREE.Geometry();
  triangleGeometry.vertices.push(new THREE.Vector3(412.3, 160, 0));
  triangleGeometry.vertices.push(new THREE.Vector3(461, 154.7, 0));
  triangleGeometry.vertices.push(new THREE.Vector3(459, 166.2, 0));
  triangleGeometry.faces.push(new THREE.Face3(0, 2, 1));

  var triangleMesh = new THREE.Mesh(triangleGeometry, new THREE.MeshBasicMaterial({
    transparent: true,
    opacity: 1,
    side: THREE.DoubleSide,
    color: 0xffffff
  }));
  triangleMesh.position.set(0, 0.0, 0);
  scene.add(triangleMesh);
}


function createScene(mesh) {

  // drawTriangle(scene);
  // var mesh = new THREE.Mesh(complex, new THREE.MeshBasicMaterial({
  //   // wireframe: true,
  //   transparent: true,
  //   side:THREE.DoubleSide,
  //   opacity: 1,
  //   color: Math.floor(Math.random()*0xffffff)
  // }));
}
/*

get the SVG as an XML document
*/


loadSvg('svg/face2.svg', function (err, svg) {
  if (err) throw err


  var polygons = svg.querySelectorAll('polygon');
  for(var i =0;i< polygons.length;i++){
    var poly = polygons[i];
    var numbers = poly.getAttribute('points')
                  .split(' ')
                  .map(function(e){
                    return parseFloat(e);
                  });
    var color = new THREE.Color(poly.getAttribute('fill'));

    console.log(numbers);

    var geo = new THREE.Geometry();

      while(numbers.length != 0) {
        geo.vertices.push(new THREE.Vector3(numbers.shift(), numbers.shift(), 0));
      }
      geo.faces.push(new THREE.Face3(0, 2, 1));

    var mesh = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({
      transparent: true,
      // wireframe: true,
      opacity: 1,
      side:THREE.DoubleSide,
      color: color
    }));

    mesh.position.set(0, 0, 0);
    scene.add(mesh);

    drawTriangle();
  }
});

function render() {
  requestAnimationFrame( render );
  renderer.render( scene, camera );
}

render();