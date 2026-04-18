import { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * A floating geometric luxury home — golden wireframe rendered with Three.js.
 * Slowly rotates, gently floats, with subtle ambient particles.
 * Mounted only on the client (parent uses ClientOnly wrapper).
 */
export function HeroScene() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0a0a0f, 0.05);

    const camera = new THREE.PerspectiveCamera(45, mount.clientWidth / mount.clientHeight, 0.1, 1000);
    camera.position.set(7, 5, 10);
    camera.lookAt(0, 1, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    // === Build a stylized luxury house out of wireframes ===
    const group = new THREE.Group();
    const goldMat = new THREE.LineBasicMaterial({ color: 0xc9a84c, transparent: true, opacity: 0.85 });
    const cream = new THREE.LineBasicMaterial({ color: 0xf5f0e8, transparent: true, opacity: 0.35 });

    // Base box
    const baseGeom = new THREE.BoxGeometry(6, 2.4, 4);
    const baseEdges = new THREE.LineSegments(new THREE.EdgesGeometry(baseGeom), goldMat);
    baseEdges.position.y = 1.2;
    group.add(baseEdges);

    // Upper box (cantilever)
    const upGeom = new THREE.BoxGeometry(4.4, 1.8, 3.2);
    const upEdges = new THREE.LineSegments(new THREE.EdgesGeometry(upGeom), goldMat);
    upEdges.position.set(0.6, 3.3, 0);
    group.add(upEdges);

    // Roof (flat parapet)
    const roofGeom = new THREE.BoxGeometry(4.6, 0.15, 3.4);
    const roofEdges = new THREE.LineSegments(new THREE.EdgesGeometry(roofGeom), cream);
    roofEdges.position.set(0.6, 4.27, 0);
    group.add(roofEdges);

    // Pool slab in front
    const poolGeom = new THREE.BoxGeometry(4, 0.05, 2);
    const poolEdges = new THREE.LineSegments(new THREE.EdgesGeometry(poolGeom), cream);
    poolEdges.position.set(0, 0.025, 3.5);
    group.add(poolEdges);

    // Pool water plane (slightly transparent)
    const water = new THREE.Mesh(
      new THREE.PlaneGeometry(3.8, 1.8),
      new THREE.MeshBasicMaterial({ color: 0xc9a84c, transparent: true, opacity: 0.08, side: THREE.DoubleSide }),
    );
    water.rotation.x = -Math.PI / 2;
    water.position.set(0, 0.05, 3.5);
    group.add(water);

    // Window grid lines on lower facade (front)
    for (let i = 1; i < 6; i++) {
      const x = -3 + i;
      const points = [new THREE.Vector3(x, 0.1, 2.01), new THREE.Vector3(x, 2.3, 2.01)];
      const g = new THREE.BufferGeometry().setFromPoints(points);
      group.add(new THREE.Line(g, cream));
    }
    for (let j = 1; j < 3; j++) {
      const y = j * 0.8;
      const points = [new THREE.Vector3(-3, y, 2.01), new THREE.Vector3(3, y, 2.01)];
      const g = new THREE.BufferGeometry().setFromPoints(points);
      group.add(new THREE.Line(g, cream));
    }

    // Vertical support columns
    [-2.8, 2.8].forEach((x) => {
      const pts = [new THREE.Vector3(x, 0, 2), new THREE.Vector3(x, 4.2, 2)];
      const g = new THREE.BufferGeometry().setFromPoints(pts);
      group.add(new THREE.Line(g, goldMat));
    });

    // Ground plane (subtle gold grid)
    const grid = new THREE.GridHelper(40, 40, 0xc9a84c, 0xc9a84c);
    (grid.material as THREE.Material).opacity = 0.06;
    (grid.material as THREE.Material).transparent = true;
    grid.position.y = -0.01;
    scene.add(grid);

    scene.add(group);

    // Floating particles
    const particleCount = 60;
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 30;
      positions[i * 3 + 1] = Math.random() * 10;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 30;
    }
    const pGeom = new THREE.BufferGeometry();
    pGeom.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const particles = new THREE.Points(
      pGeom,
      new THREE.PointsMaterial({ color: 0xc9a84c, size: 0.06, transparent: true, opacity: 0.6 }),
    );
    scene.add(particles);

    // Mouse parallax
    const target = { x: 0, y: 0 };
    const onMove = (e: MouseEvent) => {
      const rect = mount.getBoundingClientRect();
      target.x = ((e.clientX - rect.left) / rect.width - 0.5) * 0.6;
      target.y = ((e.clientY - rect.top) / rect.height - 0.5) * 0.4;
    };
    mount.addEventListener("pointermove", onMove);

    let raf = 0;
    const clock = new THREE.Clock();
    const tick = () => {
      const t = clock.getElapsedTime();
      if (!reduced) {
        group.rotation.y = t * 0.18 + target.x;
        group.position.y = Math.sin(t * 0.6) * 0.18;
        group.rotation.x = target.y * 0.4;
        particles.rotation.y = t * 0.04;
      }
      renderer.render(scene, camera);
      raf = requestAnimationFrame(tick);
    };
    tick();

    const onResize = () => {
      if (!mount) return;
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      mount.removeEventListener("pointermove", onMove);
      renderer.dispose();
      pGeom.dispose();
      baseGeom.dispose();
      upGeom.dispose();
      roofGeom.dispose();
      poolGeom.dispose();
      if (renderer.domElement.parentNode === mount) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={mountRef} className="absolute inset-0" aria-hidden="true" />;
}
