var loadSvg = require('load-svg');
var parsePath = require('extract-svg-path').parse;

var THREE = require('three');
var Complex = require('three-simplicial-complex')(THREE);

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
var renderer = new THREE.WebGLRenderer();

camera.position.z = 500;
camera.position.x = 400;
camera.position.y = -400;

renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement);

// document.addEventListener('mousedown', function(event) {
//   console.log(event);
//   console.log(this);
// });

document.mousedown = function(event) {
  console.log(event);
}


loadSvg('svg/face.svg', function (err, svg) {
  if (err) throw err

  var polygons = svg.querySelectorAll('polygon');

  for (var i = 0 ; i < polygons.length ; i++) {
    var poly = polygons[i];
    var numbers = poly.getAttribute('points')
                  .split(' ')
                  .map(function(e){
                    return parseFloat(e);
                  });
    var color = poly.getAttribute('fill');
    var geo = new THREE.Geometry();

    while(numbers.length != 0) {
      geo.vertices.push(new THREE.Vector3(numbers.shift(), -numbers.shift(), 0));
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
  }
});

function render() {
  requestAnimationFrame( render );
  renderer.render( scene, camera );
}

render();