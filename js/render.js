import * as THREE from 'three';
console.log(THREE)
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';

const FIELD_OF_VIEW = 20;
const NEAR_PLANE = 0.1;
const FAR_PLANE = 1000;
const LIGHT_INTENSITY = 0;
const ROTATION_INCREMENT = 0.001;
const FONT_URL = 'https://threejs.org/examples/fonts/helvetiker_regular.typeface.json';
const DEBOUNCE_WAIT = 100;
const TEXT = 'World Peace'

export function createThreeScene(container) {
    const ASPECT_RATIO = window.innerWidth / window.innerHeight;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(FIELD_OF_VIEW, ASPECT_RATIO, NEAR_PLANE, FAR_PLANE);
    const renderer = new THREE.WebGLRenderer({ antialias: true });

    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    const light = new THREE.DirectionalLight(0xffffff, LIGHT_INTENSITY);
    light.position.set(0, 1, 1).normalize();
    scene.add(light);

    camera.position.z = 500;

    let textGroup;

    function animate() {
        requestAnimationFrame(animate);
        if (textGroup) {
            textGroup.rotation.y += ROTATION_INCREMENT;
        }
        renderer.render(scene, camera);
    }

    const fontLoader = new FontLoader();
    fontLoader.load(FONT_URL, (font) => {
        const text = createText((TEXT), font);
        scene.add(text);
        textGroup = text;
        animate();
    });

    function createText(message, font) {
        const textGeometry = new TextGeometry(message, {
            font: font,
            size: 200,
            height: 10,
            curveSegments: 12,
            bevelEnabled: true,
            bevelThickness: 2,
            bevelSize: 1,
            bevelOffset: 0,
            bevelSegments: 5,
        });

        const textLength = message.length;
        const radius = textLength * 12;
        bendTextGeometry(textGeometry, radius);

        const textMaterial = new THREE.MeshNormalMaterial({ wireframe: true });
        const textMesh = new THREE.Mesh(textGeometry, textMaterial);
        const { center, size } = getObjectDimensions(textMesh);
        textMesh.position.sub(center);

        const group = new THREE.Group();
        group.add(textMesh);
        const scale = calculateScale(size);
        group.scale.set(scale, scale, scale);

        return group;
    }

    function getObjectDimensions(object) {
        const box = new THREE.Box3().setFromObject(object);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());
        return { center, size };
    }

    function calculateScale(size) {
        const maxDimension = Math.max(size.x, size.y, size.z);
        return Math.min(window.innerWidth, window.innerHeight) / maxDimension / 2;
    }

    function bendTextGeometry(geometry, radius) {
        const position = geometry.attributes.position;
        const vertex = new THREE.Vector3();

        for (let i = 0; i < position.count; i++) {
            vertex.fromBufferAttribute(position, i);
            const theta = vertex.x / radius;
            const sinTheta = Math.sin(theta);
            const cosTheta = Math.cos(theta);

            vertex.x = radius * sinTheta;
            vertex.z = radius * (1 - cosTheta);
            position.setXYZ(i, vertex.x, vertex.y, vertex.z);
        }

        position.needsUpdate = true;
        geometry.computeVertexNormals();
    }

    window.addEventListener('resize', debounce(() => {
        const width = window.innerWidth;
        const height = window.innerHeight;
        renderer.setSize(width, height);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
    }, DEBOUNCE_WAIT));

    function debounce(func, wait) {
        let timeout;
        return function (...args) {
            const later = () => {
                clearTimeout(timeout);
                func.apply(this, args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
}