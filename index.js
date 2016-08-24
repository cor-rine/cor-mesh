var loadSvg = require('load-svg');
var parsePath = require('extract-svg-path').parse;
var svgMesh3d = require('svg-mesh-3d');

var THREE = require('three');
var Complex = require('three-simplicial-complex');



var createScene = function(mesh) {
  console.log(Complex);
  var complex = Complex(mesh);
  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

  complex.position.x = 2;
  scene.add(complex);

  var renderer = new THREE.WebGLRenderer();
  renderer.setSize( window.innerWidth, window.innerHeight );
  document.body.appendChild( renderer.domElement );
}

loadSvg('svg/peg-circle.svg', function (err, svg) {
  if (err) throw err

  var svgPath = parsePath(svg);
  var mesh = svgMesh3d(svgPath, {
    delaunay: false,
    scale: 4
  });

  createScene(mesh);
});