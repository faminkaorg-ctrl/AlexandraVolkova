import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.170.0/build/three.module.js";
import { prefersReducedMotion } from "./utils.js";

/**
 * Ambient WebGL particles for scenarios section
 */
export function initThreeScene(container) {
  if (!container || prefersReducedMotion()) {
    return { destroy() {} };
  }

  const canvas = document.createElement("canvas");
  canvas.className = "scenarios__canvas";
  container.prepend(canvas);

  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: true,
    powerPreference: "high-performance",
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
  camera.position.z = 14;

  const group = new THREE.Group();
  scene.add(group);

  const geo = new THREE.IcosahedronGeometry(0.35, 1);
  const goldMat = new THREE.MeshPhysicalMaterial({
    color: 0xd4af37,
    metalness: 0.85,
    roughness: 0.15,
    transparent: true,
    opacity: 0.55,
    clearcoat: 1,
    clearcoatRoughness: 0.1,
  });
  const sageMat = new THREE.MeshPhysicalMaterial({
    color: 0x8b9d83,
    metalness: 0.7,
    roughness: 0.25,
    transparent: true,
    opacity: 0.45,
    clearcoat: 0.8,
  });

  const meshes = [];
  for (let i = 0; i < 12; i++) {
    const mesh = new THREE.Mesh(geo, i % 2 === 0 ? goldMat : sageMat);
    const angle = (i / 12) * Math.PI * 2;
    const radius = 4 + Math.random() * 3;
    mesh.position.set(Math.cos(angle) * radius, (Math.random() - 0.5) * 5, Math.sin(angle) * radius - 2);
    mesh.rotation.set(Math.random(), Math.random(), Math.random());
    group.add(mesh);
    meshes.push(mesh);
  }

  const light = new THREE.DirectionalLight(0xf5f2eb, 1.2);
  light.position.set(5, 8, 10);
  scene.add(light);
  scene.add(new THREE.AmbientLight(0x8b9d83, 0.35));

  let width = 0;
  let height = 0;
  let mouseX = 0;
  let mouseY = 0;
  let animationId = null;
  let time = 0;
  let lastFrame = 0;
  let isVisible = false;
  const FRAME_MS = 1000 / 24;

  const resize = () => {
    width = container.clientWidth;
    height = container.clientHeight;
    renderer.setSize(width, height);
    camera.aspect = width / height || 1;
    camera.updateProjectionMatrix();
  };

  const onMouseMove = (e) => {
    const rect = container.getBoundingClientRect();
    mouseX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    mouseY = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
  };

  const render = (timestamp) => {
    animationId = requestAnimationFrame(render);
    if (!isVisible) return;
    if (timestamp - lastFrame < FRAME_MS) return;
    lastFrame = timestamp;

    time = timestamp * 0.001;
    group.rotation.y = time * 0.08 + mouseX * 0.25;
    group.rotation.x = mouseY * 0.15;

    meshes.forEach((mesh, i) => {
      mesh.rotation.x += 0.003 + i * 0.0002;
      mesh.rotation.y += 0.004;
      mesh.position.y += Math.sin(time + i) * 0.002;
    });

    renderer.render(scene, camera);
  };

  const observer = new IntersectionObserver(
    ([entry]) => {
      isVisible = entry.isIntersecting;
      if (isVisible && !animationId) {
        animationId = requestAnimationFrame(render);
      }
    },
    { threshold: 0.05 }
  );

  resize();
  window.addEventListener("resize", resize);
  container.addEventListener("mousemove", onMouseMove);
  observer.observe(container);
  animationId = requestAnimationFrame(render);

  return {
    destroy() {
      observer.disconnect();
      cancelAnimationFrame(animationId);
      animationId = null;
      window.removeEventListener("resize", resize);
      container.removeEventListener("mousemove", onMouseMove);
      renderer.dispose();
      geo.dispose();
      goldMat.dispose();
      sageMat.dispose();
      canvas.remove();
    },
  };
}