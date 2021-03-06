var loadSvg = require('load-svg');
var parsePath = require('extract-svg-path').parse;
var THREE = require('three');
var Complex = require('three-simplicial-complex')(THREE);
var Tweenr = require('tweenr');
var ajax = require('ajax-request');
var CanvasLoop = require('canvas-loop');
var initializeDomEvents = require('threex-domevents')
var THREEx = {};

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(800, window.innerWidth / window.innerHeight, 0.1, 3000);
var renderer = new THREE.WebGLRenderer({
  precision: 'lowp',
  antialias: true
});
var tweenr = Tweenr({ defaultEase: 'expoOut' });


initializeDomEvents(THREE, THREEx);

camera.position.z = 600;
camera.position.x = innerWidth / 3.4;
camera.position.y = -innerHeight / 2;
camera.lookAt(new THREE.Vector3(500,-500,0));

renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement);

var canvas = document.querySelector('canvas');
var domEvents = new THREEx.DomEvents(camera, renderer.domElement);

var vertexShader;
var fragShader;

var mousePosition = new THREE.Vector2();
var mouseXOnMouseDown;
var mouseYOnMouseDown;

var cameraRotationInitX = camera.rotation.x;
var cameraRotationInitY = camera.rotation.y;
var cameraPositionInitX = camera.position.x;
var cameraPositionInitY = camera.position.y;

var wires = [];
var meshes = [];
var faceIsExploded = true;

ajax({
	url: '/glsl/frag.frag',
	method: 'GET'
	}, function(err, res, body) {
	fragShader = body;
});

ajax({
	url: '/glsl/movement.glsl',
	method: 'GET'
	}, function(err, res, body) {
	vertexShader = body;
	loadSVG();
});


function getRandomIntBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function mouseMoveEvent(event) {
	mouseX = event.clientX - window.innerWidth/2;
	mouseY = event.clientY - window.innerHeight/2;

	camera.rotation.x = cameraRotationInitX - mouseY * 1/2500;
	camera.rotation.y = cameraRotationInitY + mouseX * 1/5000;

	camera.position.x = cameraPositionInitX + mouseX * 1/10;
	camera.position.y = cameraPositionInitY - mouseY * 1/7;
}

document.addEventListener('mousemove', mouseMoveEvent, false);
document.addEventListener('click', explodeFace, false);


function loadSVG() {
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

			// var shape = new THREE.Shape(geo);

			var sampleColor = new THREE.Color(color);

			var material = new THREE.ShaderMaterial({
				side: THREE.DoubleSide,
				vertexShader: vertexShader,
				fragmentShader: fragShader,
				uniforms: {
					color: {
						type: "v3",
						value: new THREE.Vector3(sampleColor.r, sampleColor.g, sampleColor.b)
					},
					mouse_position: {
						type: "v2",
						value: mousePosition
					}
				},
				transparent: true
			});

			var basicMaterial = new THREE.MeshBasicMaterial({
				transparent: true,
				wireframe: true,
				opacity: 1,
				side: THREE.DoubleSide,
				color: color
			});

			var mesh = new THREE.Mesh(geo, material);
			var wire = mesh.clone();
			var wire2 = wire.clone();

			// mesh.position.set(0, 0, 0);
			// mesh.rotation.set(0, 0, 0);

			// Add the first mesh to the scene
			mesh.position.set(Math.random()*window.innerWidth * (Math.round(Math.random())*2 - 1), -Math.random()*window.innerHeight * (Math.round(Math.random())*2 - 1), Math.random()*200 * (Math.round(Math.random())*2 - 1));
			mesh.rotation.set(1, 1, 0);
			scene.add(mesh);
			meshes.push(mesh);

			// Add the clone meshes to the scene for effect
			wire.position.set(Math.random()*window.innerWidth * (Math.round(Math.random())*2 - 1), -Math.random()*window.innerHeight * (Math.round(Math.random())*2 - 1), Math.random()*200 * (Math.round(Math.random())*2 - 1));
			wire.rotation.set(0, 1/getRandomIntBetween(2000, 3000), 1/getRandomIntBetween(2000, 3000));
			wire.material = basicMaterial;
			scene.add(wire);
			wires.push(wire);

			wire2.position.set(Math.random()*window.innerWidth * (Math.round(Math.random())*2 - 1), -Math.random()*window.innerHeight * (Math.round(Math.random())*2 - 1), Math.random()*200 * (Math.round(Math.random())*2 - 1));
			wire2.rotation.set(0, 1/getRandomIntBetween(2000, 3000), 1/getRandomIntBetween(2000, 3000));
			wire2.material = basicMaterial;
			scene.add(wire2);
			wires.push(wire2);

		}
	});
}

function rotateWires() {
	for (var i = 0; i < wires.length; i++) {
		// different direction if odd/even
		if (i % 2) {
			wires[i].rotation.y += 1/getRandomIntBetween(3000, 5000);
			wires[i].rotation.z += 1/getRandomIntBetween(5000, 6000);
		} else {
			wires[i].rotation.y -= 1/getRandomIntBetween(2000, 3000);
			wires[i].rotation.z -= 1/getRandomIntBetween(3000, 4000);
		}
	}
}

function rotateMeshes() {
	if (faceIsExploded) {
		for (var i = 0; i < meshes.length; i++) {
			// different direction if odd/even
			if (i % 2) {
				meshes[i].rotation.y += 1/getRandomIntBetween(2000, 3000);
				meshes[i].rotation.z += 1/getRandomIntBetween(2000, 3000);
			} else {
				meshes[i].rotation.y -= 1/getRandomIntBetween(2000, 3000);
				meshes[i].rotation.z -= 1/getRandomIntBetween(1000, 2000);
			}
		}
	}
}

function explodeFace() {

	if (faceIsExploded) {
		for (var i = 0; i < meshes.length; i++) {
			tweenr.to(meshes[i].position, {
				x: 0,
				y: 0,
				z: 0,
				duration: getRandomIntBetween(1, 4),
				delay: Math.random()*1.5
			});

			tweenr.to(meshes[i].rotation, {
				x: 0,
				y: 0,
				z: 0,
				duration: getRandomIntBetween(1, 2),
				delay: Math.random()*1.5
			});
		}
		faceIsExploded = false;
	} else {
		for (var i = 0; i < meshes.length; i++) {
			tweenr.to(meshes[i].position, {
				x: Math.random()*window.innerWidth * (Math.round(Math.random())*2 - 1),
				y: -Math.random()*window.innerHeight * (Math.round(Math.random())*2 - 1),
				z: Math.random()*200 * (Math.round(Math.random())*2 - 1),
				duration: getRandomIntBetween(1, 4),
				delay: Math.random()*1.5
			});

			tweenr.to(meshes[i].rotation, {
				x: 1,
				y: 1,
				z: 0,
				duration: getRandomIntBetween(1, 2),
				delay: Math.random()*1.5
			});
		}
		faceIsExploded = true;
	}
}

function render() {
	requestAnimationFrame(render);
	renderer.render(scene, camera);

	rotateWires();
	rotateMeshes();
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