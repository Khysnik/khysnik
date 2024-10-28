var scene, camera, renderer, container, HEIGHT, WIDTH, fieldOfView, aspectRatio, nearPlane, farPlane, geometry, particleCount, i, h, color, size, windowHalfX, windowHalfY, cameraZ, fogHex, fogDensity, parameterCount, particles, materials = [], mouseX = 0, mouseY = 0, parameters = {};
function init() {
    for (HEIGHT = window.innerHeight,
    WIDTH = window.innerWidth,
    windowHalfX = WIDTH / 2,
    windowHalfY = HEIGHT / 2,
    fieldOfView = 75,
    aspectRatio = WIDTH / HEIGHT,
    nearPlane = 1,
    cameraZ = (farPlane = 3e3) / 3,
    fogHex = 0,
    fogDensity = 7e-4,
    (camera = new THREE.PerspectiveCamera(fieldOfView,aspectRatio,nearPlane,farPlane)).position.z = cameraZ,
    (scene = new THREE.Scene).fog = new THREE.FogExp2(fogHex,fogDensity),
    (container = document.createElement("div")).id = "background",
    container.style.opacity = 0,
    document.body.appendChild(container),
    document.body.style.margin = 0,
    document.body.style.overflow = "hidden",
    geometry = new THREE.Geometry,
    particleCount = 1e3,
    i = 0; i < particleCount; i++) {
        var e = new THREE.Vector3;
        e.x = 2e3 * Math.random() - 1e3,
        e.y = 2e3 * Math.random() - 1e3,
        e.z = 2e3 * Math.random() - 1e3,
        geometry.vertices.push(e)
    }
    for (parameterCount = (parameters = [[[1, 1, .5], 5], [[.95, 1, .5], 4], [[.9, 1, .5], 3], [[.85, 1, .5], 2], [[.8, 1, .5], 1]]).length,
    i = 0; i < parameterCount; i++)
        color = parameters[i][0],
        size = parameters[i][1],
        materials[i] = new THREE.PointCloudMaterial({
            size: size
        }),
        (particles = new THREE.PointCloud(geometry,materials[i])).rotation.x = 6 * Math.random(),
        particles.rotation.y = 6 * Math.random(),
        particles.rotation.z = 6 * Math.random(),
        scene.add(particles);
    (renderer = new THREE.WebGLRenderer({
        alpha: !0
    })).setPixelRatio(window.devicePixelRatio),
    renderer.setSize(WIDTH, HEIGHT),
    container.appendChild(renderer.domElement),
    window.addEventListener("resize", onWindowResize, !1),
    document.addEventListener("mousemove", onDocumentMouseMove, !1),
    document.addEventListener("touchstart", onDocumentTouchStart, !1),
    document.addEventListener("touchmove", onDocumentTouchMove, !1)
}
function animate() {
    requestAnimationFrame(animate),
    render()
}
function render() {
    var e = 5e-5 * Date.now();
    for (camera.position.x += .005 * (mouseX - camera.position.x),
    camera.position.y += .005 * (-mouseY - camera.position.y),
    camera.lookAt(scene.position),
    i = 0; i < scene.children.length; i++) {
        var n = scene.children[i];
        n instanceof THREE.PointCloud && (n.rotation.y = e * (i < 4 ? i + 1 : -(i + 1)))
    }
    for (i = 0; i < materials.length; i++)
        color = parameters[i][0],
        h = 360 * (color[0] + e) % 360 / 360;
    renderer.render(scene, camera)
}
function onDocumentMouseMove(e) {
    mouseX = e.clientX - windowHalfX,
    mouseY = e.clientY - windowHalfY
}
function onDocumentTouchStart(e) {
    1 === e.touches.length && (e.preventDefault(),
    mouseX = e.touches[0].pageX - windowHalfX,
    mouseY = e.touches[0].pageY - windowHalfY)
}
function onDocumentTouchMove(e) {
    1 === e.touches.length && (e.preventDefault(),
    mouseX = e.touches[0].pageX - windowHalfX,
    mouseY = e.touches[0].pageY - windowHalfY)
}
function onWindowResize() {
    windowHalfX = window.innerWidth / 2,
    windowHalfY = window.innerHeight / 2,
    camera.aspect = window.innerWidth / window.innerHeight,
    camera.updateProjectionMatrix(),
    renderer.setSize(window.innerWidth, window.innerHeight)
}
init(),
animate(),
document.addEventListener("DOMContentLoaded", (function() {
    var e = setInterval((function() {
        container.style.opacity = parseFloat(container.style.opacity) + .01,
        container.style.opacity >= 1 && clearInterval(e)
    }
    ), 10)
}
));
