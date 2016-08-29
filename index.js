var loadSvg = require('load-svg');
var parsePath = require('extract-svg-path').parse;
var THREE = require('three');
var Complex = require('three-simplicial-complex')(THREE);
var Tweenr = require('tweenr');
var CanvasLoop = require('canvas-loop');
var initializeDomEvents = require('threex-domevents')
var THREEx = {};

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
var renderer = new THREE.WebGLRenderer({
  precision: 'lowp',
  antialias: true
});
var tweenr = Tweenr({ defaultEase: 'expoOut' });


initializeDomEvents(THREE, THREEx);

camera.position.z = 500;
camera.position.x = 400;
camera.position.y = -400;

renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement);

var canvas = document.querySelector('canvas');
var domEvents = new THREEx.DomEvents(camera, renderer.domElement);

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

    domEvents.addEventListener(mesh, 'mouseover', function(event) {
      // console.log(event.target);
      event.target.material.currentColor = event.target.material.color;
      event.target.material.color = new THREE.Color(40, 5, 0);
      event.target.material.opacity = 0.4;
    }, false);

    domEvents.addEventListener(mesh, 'mouseout', function(event) {
      event.target.material.opacity = 1;
      event.target.material.color = event.target.material.currentColor;
    }, false);

    // domEvents.addEventListener(mesh, 'click', function(event) {
    //   event.target.rotation.x += 0.1;
    //   event.target.rotation.y += 0.3;
    // }, false);

    mesh.position.set(Math.random()*60, -Math.random()*100, -Math.random()*2000);
    mesh.rotation.set(1, 1, 0);
    scene.add(mesh);

    tweenr.to(mesh.position, {
      z: 0,
      y: 0,
      x: 0,
      duration: Math.random()*1.5,
      delay: Math.random()*1.5
    });
    tweenr.to(mesh.rotation, {
      z: 0,
      y: 0,
      x: 0,
      duration: Math.random()*1.5,
      delay: Math.random()*1
    });
  }
});

function debouce(func, wait, immediate){
  var timeout;

  return function() {
    var context = this;
    var args = arguments;

    var later = function() {
      timeout = null;

      if(!immediate) func.apple(context, args);
    };

    var callNow = immediate && !timeout;
    clearTimeout(timeout);

    timeout= setTimeout(later, wait);
    if(callNow) func.apple(context, args);
  };
}

function render() {
  requestAnimationFrame(render);
  renderer.render(scene, camera);
}

function renderOnce() {
  renderer.render(scene, camera);
}

var app = CanvasLoop(canvas, { scale: renderer.devicePixelRatio })
    .start()
    .on('resize', function() {
      resize();
    });

function resize() {
  var width = app.shape[0];
  var height = app.shape[1];
  camera.aspect = width / height;
  renderer.setSize(width, height, false);
  camera.updateProjectionMatrix();
  renderOnce();
}

render();