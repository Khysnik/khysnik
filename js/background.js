var scene, camera, renderer, container, HEIGHT, WIDTH, fieldOfView, aspectRatio, nearPlane, farPlane, geometry, particleCount, i, h, color, size, windowHalfX, windowHalfY, cameraZ, fogHex, fogDensity, parameterCount, particles, materials = [], mouseX = 0, mouseY = 0, parameters = {};
function init() {
    HEIGHT = window.innerHeight;
    WIDTH = window.innerWidth;
    windowHalfX = WIDTH / 2;
    windowHalfY = HEIGHT / 2;
    fieldOfView = 75;
    aspectRatio = WIDTH / HEIGHT;
    nearPlane = 1;
    cameraZ = (farPlane = 3000) / 3;
    fogHex = 0x2e004f;
    fogDensity = 0.0007;
    
    camera = new THREE.PerspectiveCamera(fieldOfView, aspectRatio, nearPlane, farPlane);
    camera.position.z = cameraZ;
    
    scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(fogHex, fogDensity);
    
    container = document.createElement("div");
    container.id = "background";
    container.style.opacity = 0;
    document.body.appendChild(container);
    document.body.style.margin = 0;
    document.body.style.overflow = "hidden";
    
    geometry = new THREE.BufferGeometry();
    particleCount = 1000;
    var positions = new Float32Array(particleCount * 3);
    var colors = new Float32Array(particleCount * 3);
    var sizes = new Float32Array(particleCount);
    
    for (i = 0; i < particleCount; i++) {
        var x = 2000 * Math.random() - 1000;
        var y = 2000 * Math.random() - 1000;
        var z = 2000 * Math.random() - 1000;
        
        positions[i * 3] = x;
        positions[i * 3 + 1] = y;
        positions[i * 3 + 2] = z;
        
        var r = Math.random();
        var g = Math.random();
        var b = Math.random();
        
        colors[i * 3] = r;
        colors[i * 3 + 1] = g;
        colors[i * 3 + 2] = b;
        
        sizes[i] = 10;
    }
    
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    
    var material = new THREE.PointsMaterial({
        size: 10,
        vertexColors: true,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending
    });
    
    particles = new THREE.Points(geometry, material);
    scene.add(particles);
    
    renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(WIDTH, HEIGHT);
    container.appendChild(renderer.domElement);
    
    window.addEventListener("resize", onWindowResize, false);
    document.addEventListener("mousemove", onDocumentMouseMove, false);
    document.addEventListener("touchstart", onDocumentTouchStart, false);
    document.addEventListener("touchmove", onDocumentTouchMove, false);
}
function animate() {
    requestAnimationFrame(animate);
    render();
}
function render() {
    var time = Date.now() * 0.00005;
    
    camera.position.x += (mouseX - camera.position.x) * 0.05;
    camera.position.y += (-mouseY - camera.position.y) * 0.05;
    camera.lookAt(scene.position);
    
    particles.rotation.y = time * 0.5;
    
    renderer.render(scene, camera);
}
function onDocumentMouseMove(event) {
    mouseX = event.clientX - windowHalfX;
    mouseY = event.clientY - windowHalfY;
}
function onDocumentTouchStart(event) {
    if (event.touches.length === 1) {
        event.preventDefault();
        mouseX = event.touches[0].pageX - windowHalfX;
        mouseY = event.touches[0].pageY - windowHalfY;
    }
}
function onDocumentTouchMove(event) {
    if (event.touches.length === 1) {
        event.preventDefault();
        mouseX = event.touches[0].pageX - windowHalfX;
        mouseY = event.touches[0].pageY - windowHalfY;
    }
}
function onWindowResize() {
    windowHalfX = window.innerWidth / 2;
    windowHalfY = window.innerHeight / 2;
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}
init();
animate();
document.addEventListener("DOMContentLoaded", function() {
    var fadeIn = setInterval(function() {
        container.style.opacity = parseFloat(container.style.opacity) + 0.01;
        if (container.style.opacity >= 1) clearInterval(fadeIn);
    }, 10);
});
