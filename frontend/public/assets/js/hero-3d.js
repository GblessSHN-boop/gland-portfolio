import * as THREE from "three";
import { FBXLoader } from "https://unpkg.com/three@0.166.1/examples/jsm/loaders/FBXLoader.js";

const stage = document.getElementById("heroThreeCanvas");

if (stage) {
    const MODEL_PATH = "assets/models/web-design/Programming.fbx";
    const TARGET_WORLD_SIZE = 3.6;

    const REST_ROTATION = {
        x: 0.03,
        y: -0.22,
        z: 0
    };

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
        34,
        Math.max(stage.clientWidth, 1) / Math.max(stage.clientHeight, 1),
        0.1,
        1000
    );

    camera.position.set(0, 0, 6.8);

    const renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true
    });

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(stage.clientWidth, stage.clientHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    stage.appendChild(renderer.domElement);

    const pivot = new THREE.Group();
    pivot.position.set(0, -0.05, 0);
    pivot.rotation.set(REST_ROTATION.x, REST_ROTATION.y, REST_ROTATION.z);
    scene.add(pivot);

    const targetRotation = {
        ...REST_ROTATION
    };

    const ambientLight = new THREE.AmbientLight(0xffffff, 2.8);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 3.4);
    keyLight.position.set(4, 6, 8);
    scene.add(keyLight);

    const frontLight = new THREE.DirectionalLight(0xffffff, 2.4);
    frontLight.position.set(0, 2, 8);
    scene.add(frontLight);

    const sideLight = new THREE.DirectionalLight(0xffffff, 1.8);
    sideLight.position.set(-5, 3, 4);
    scene.add(sideLight);

    const loader = new FBXLoader();

    loader.load(
        MODEL_PATH,
        (object) => {
            object.traverse((child) => {
                if (!child.isMesh) return;

                child.castShadow = false;
                child.receiveShadow = false;

                const materials = Array.isArray(child.material)
                    ? child.material
                    : [child.material];

                materials.forEach((material) => {
                    if (!material) return;
                    material.side = THREE.DoubleSide;
                    material.needsUpdate = true;
                });
            });

            object.updateMatrixWorld(true);

            const box = new THREE.Box3().setFromObject(object);
            const center = box.getCenter(new THREE.Vector3());
            const size = box.getSize(new THREE.Vector3());
            const maxAxis = Math.max(size.x, size.y, size.z) || 1;

            const scale = TARGET_WORLD_SIZE / maxAxis;

            object.scale.setScalar(scale);
            object.position.set(
                -center.x * scale,
                -center.y * scale,
                -center.z * scale
            );

            object.rotation.set(0, 0, 0);
            pivot.add(object);
        },
        undefined,
        (error) => {
            console.error("Gagal load model 3D:", error);
        }
    );

    let dragging = false;
    let lastX = 0;
    let lastY = 0;

    function pointerDown(event) {
        dragging = true;
        lastX = event.clientX;
        lastY = event.clientY;
        stage.setPointerCapture?.(event.pointerId);
        event.preventDefault();
    }

    function pointerMove(event) {
        if (!dragging) return;

        const dx = event.clientX - lastX;
        const dy = event.clientY - lastY;

        lastX = event.clientX;
        lastY = event.clientY;

        targetRotation.y += dx * 0.014;
        targetRotation.x += dy * 0.009;
        targetRotation.x = Math.max(-0.6, Math.min(0.6, targetRotation.x));

        event.preventDefault();
    }

    function pointerUp(event) {
        dragging = false;
        stage.releasePointerCapture?.(event.pointerId);
    }

    stage.addEventListener("pointerdown", pointerDown);
    stage.addEventListener("pointermove", pointerMove);
    stage.addEventListener("pointerup", pointerUp);
    stage.addEventListener("pointercancel", pointerUp);
    window.addEventListener("pointerup", pointerUp);

    function resize() {
        const width = Math.max(stage.clientWidth, 1);
        const height = Math.max(stage.clientHeight, 1);

        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
    }

    window.addEventListener("resize", resize);

    function animate(time) {
        requestAnimationFrame(animate);

        const floatY = Math.sin(time * 0.0011) * 0.08;
        const floatZ = Math.sin(time * 0.001) * 0.012;

        if (!dragging) {
            targetRotation.x += (REST_ROTATION.x - targetRotation.x) * 0.03;
            targetRotation.y += (REST_ROTATION.y - targetRotation.y) * 0.03;
            targetRotation.z += (REST_ROTATION.z - targetRotation.z) * 0.03;
        }

        pivot.rotation.x += (targetRotation.x - pivot.rotation.x) * 0.1;
        pivot.rotation.y += (targetRotation.y - pivot.rotation.y) * 0.1;
        pivot.rotation.z += ((targetRotation.z + floatZ) - pivot.rotation.z) * 0.1;

        pivot.position.y += ((-0.05 + floatY) - pivot.position.y) * 0.08;

        renderer.render(scene, camera);
    }

    animate(0);
}
