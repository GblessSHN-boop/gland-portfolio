import * as THREE from "three";

const stage = document.getElementById("cubeCanvas");

if (stage) {
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
        34,
        window.innerWidth / window.innerHeight,
        0.1,
        100
    );

    camera.position.set(0, 0, 7.2);

    const renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true
    });

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    stage.appendChild(renderer.domElement);

    const group = new THREE.Group();
    scene.add(group);

    const whiteMat = new THREE.MeshStandardMaterial({
        color: 0xf5f5f5,
        metalness: 0.1,
        roughness: 0.42
    });

    const darkMat = new THREE.MeshStandardMaterial({
        color: 0x050505,
        metalness: 0.12,
        roughness: 0.5
    });

    const lineMat = new THREE.LineBasicMaterial({
        color: 0x050505,
        transparent: true,
        opacity: 0.24
    });

    function addPanel(width, height, depth, x, y, z, rotationY) {
        const geometry = new THREE.BoxGeometry(width, height, depth, 4, 4, 2);
        const mesh = new THREE.Mesh(geometry, whiteMat);
        mesh.position.set(x, y, z);
        mesh.rotation.y = rotationY;
        group.add(mesh);

        const edges = new THREE.LineSegments(
            new THREE.EdgesGeometry(geometry),
            lineMat
        );

        edges.position.copy(mesh.position);
        edges.rotation.copy(mesh.rotation);
        group.add(edges);

        return mesh;
    }

    const mainPanel = addPanel(3.8, 2.25, 0.08, 0, 0, 0, -0.22);
    addPanel(2.9, 1.65, 0.07, 0.62, -0.38, -0.58, 0.18);
    addPanel(2.2, 1.25, 0.06, -0.74, 0.44, 0.42, -0.36);

    const barGeometry = new THREE.BoxGeometry(3.45, 0.18, 0.09);
    const bar = new THREE.Mesh(barGeometry, darkMat);
    bar.position.set(0.02, 0.88, 0.13);
    bar.rotation.y = -0.22;
    group.add(bar);

    const dotGeometry = new THREE.SphereGeometry(0.075, 20, 20);

    for (let i = 0; i < 3; i++) {
        const dot = new THREE.Mesh(dotGeometry, darkMat);
        dot.position.set(-1.48 + i * 0.22, 0.88, 0.22);
        dot.rotation.y = -0.22;
        group.add(dot);
    }

    const cursorShape = new THREE.Shape();
    cursorShape.moveTo(0, 0.44);
    cursorShape.lineTo(0.64, -0.44);
    cursorShape.lineTo(0.23, -0.34);
    cursorShape.lineTo(0.08, -0.72);
    cursorShape.lineTo(-0.1, -0.65);
    cursorShape.lineTo(0.05, -0.3);
    cursorShape.lineTo(-0.32, -0.1);
    cursorShape.lineTo(0, 0.44);

    const cursorGeometry = new THREE.ExtrudeGeometry(cursorShape, {
        depth: 0.045,
        bevelEnabled: false
    });

    const cursor = new THREE.Mesh(cursorGeometry, darkMat);
    cursor.position.set(1.55, -1.05, 0.72);
    cursor.rotation.set(0.05, -0.35, -0.16);
    group.add(cursor);

    group.position.set(1.9, -0.04, 0);
    group.rotation.set(0.1, -0.42, 0.02);
    group.scale.set(0.72, 0.72, 0.72);

    scene.add(new THREE.AmbientLight(0xffffff, 1.8));

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.4);
    keyLight.position.set(4, 5, 7);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xffffff, 1.2);
    fillLight.position.set(-5, 2, 4);
    scene.add(fillLight);

    const restRotation = {
        x: 0.12,
        y: -0.48,
        z: 0.03
    };

    const targetRotation = {
        ...restRotation
    };

    const drift = {
        x: 0,
        y: 0
    };

    let dragging = false;
    let lastX = 0;
    let lastY = 0;

    function pointerDown(event) {
        dragging = true;
        lastX = event.clientX;
        lastY = event.clientY;
        stage.setPointerCapture?.(event.pointerId);
    }

    function pointerMove(event) {
        if (!dragging) return;

        const dx = event.clientX - lastX;
        const dy = event.clientY - lastY;

        lastX = event.clientX;
        lastY = event.clientY;

        targetRotation.y += dx * 0.0085;
        targetRotation.x += dy * 0.0065;

        targetRotation.x = Math.max(-0.55, Math.min(0.55, targetRotation.x));

        drift.x += dx * 0.0018;
        drift.y -= dy * 0.0018;

        drift.x = Math.max(-0.45, Math.min(0.45, drift.x));
        drift.y = Math.max(-0.36, Math.min(0.36, drift.y));
    }

    function pointerUp(event) {
        dragging = false;
        stage.releasePointerCapture?.(event.pointerId);
    }

    stage.addEventListener("pointerdown", pointerDown);
    stage.addEventListener("pointermove", pointerMove);
    stage.addEventListener("pointerup", pointerUp);
    stage.addEventListener("pointercancel", pointerUp);

    function resize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }

    window.addEventListener("resize", resize);

    function animate(time) {
        requestAnimationFrame(animate);

        const idleX = Math.sin(time * 0.0008) * 0.08;
        const idleY = Math.sin(time * 0.0012) * 0.16;
        const idleZ = Math.sin(time * 0.001) * 0.03;

        if (!dragging) {
            targetRotation.x += (restRotation.x - targetRotation.x) * 0.04;
            targetRotation.y += (restRotation.y - targetRotation.y) * 0.04;
            targetRotation.z += (restRotation.z - targetRotation.z) * 0.04;

            drift.x += (0 - drift.x) * 0.05;
            drift.y += (0 - drift.y) * 0.05;
        }

        group.rotation.x += (targetRotation.x - group.rotation.x) * 0.08;
        group.rotation.y += (targetRotation.y - group.rotation.y) * 0.08;
        group.rotation.z += ((targetRotation.z + idleZ) - group.rotation.z) * 0.08;

        group.position.x += ((1.9 + idleX + drift.x) - group.position.x) * 0.08;
        group.position.y += ((idleY + drift.y) - group.position.y) * 0.08;

        renderer.render(scene, camera);
    }

    animate(0);
}



