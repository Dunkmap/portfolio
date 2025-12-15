// 3D Laptop Scene with Three.js
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.158.0/build/three.module.js';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.158.0/examples/jsm/controls/OrbitControls.js';

class Laptop3D {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(45, this.container.clientWidth / this.container.clientHeight, 0.1, 1000);
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.objects = [];
    
    this.init();
    this.createLaptop();
    this.createFloatingElements();
    this.addLights();
    this.animate();
  }

  init() {
    // Setup renderer
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setClearColor(0x0a1628, 0);
    this.container.appendChild(this.renderer.domElement);

    // Setup camera
    this.camera.position.set(0, 3, 8);
    this.camera.lookAt(0, 0, 0);

    // Add controls
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.enableZoom = false;
    this.controls.autoRotate = true;
    this.controls.autoRotateSpeed = 1;
    this.controls.maxPolarAngle = Math.PI / 2;
    this.controls.minPolarAngle = Math.PI / 4;

    // Handle resize
    window.addEventListener('resize', () => this.onResize());
  }

  createLaptop() {
    // Laptop base
    const baseGeometry = new THREE.BoxGeometry(4, 0.2, 3);
    const baseMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x2d3748,
      metalness: 0.8,
      roughness: 0.2
    });
    const base = new THREE.Mesh(baseGeometry, baseMaterial);
    base.position.y = 0;
    this.scene.add(base);

    // Keyboard area
    const keyboardGeometry = new THREE.BoxGeometry(3.5, 0.05, 2.5);
    const keyboardMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x1a202c,
      metalness: 0.3,
      roughness: 0.7
    });
    const keyboard = new THREE.Mesh(keyboardGeometry, keyboardMaterial);
    keyboard.position.set(0, 0.13, 0);
    this.scene.add(keyboard);

    // Laptop screen (back panel)
    const screenBackGeometry = new THREE.BoxGeometry(4, 2.5, 0.1);
    const screenBackMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x2d3748,
      metalness: 0.8,
      roughness: 0.2
    });
    const screenBack = new THREE.Mesh(screenBackGeometry, screenBackMaterial);
    screenBack.position.set(0, 1.35, -1.45);
    screenBack.rotation.x = -0.2;
    this.scene.add(screenBack);

    // Screen display with gradient
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 640;
    const ctx = canvas.getContext('2d');
    
    // Create gradient background
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#667eea');
    gradient.addColorStop(0.5, '#764ba2');
    gradient.addColorStop(1, '#f093fb');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Add dashboard elements
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.font = 'bold 48px Arial';
    ctx.fillText('DATA ANALYTICS', 50, 80);
    
    // Draw chart bars
    const barColors = ['#60a5fa', '#a78bfa', '#f472b6', '#34d399'];
    for (let i = 0; i < 4; i++) {
      ctx.fillStyle = barColors[i];
      const height = 100 + Math.random() * 150;
      ctx.fillRect(100 + i * 150, 400 - height, 80, height);
    }

    // Draw line chart
    ctx.strokeStyle = '#60a5fa';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(600, 300);
    for (let i = 0; i < 8; i++) {
      ctx.lineTo(600 + i * 50, 250 + Math.sin(i) * 50);
    }
    ctx.stroke();

    const texture = new THREE.CanvasTexture(canvas);
    const screenGeometry = new THREE.BoxGeometry(3.8, 2.3, 0.05);
    const screenMaterial = new THREE.MeshStandardMaterial({ 
      map: texture,
      emissive: 0x667eea,
      emissiveIntensity: 0.3
    });
    const screen = new THREE.Mesh(screenGeometry, screenMaterial);
    screen.position.set(0, 1.35, -1.4);
    screen.rotation.x = -0.2;
    this.scene.add(screen);
  }

  createFloatingElements() {
    // Create floating 3D bar chart
    const barPositions = [
      { x: -3, y: 1, z: 1, height: 1.5, color: 0xa78bfa },
      { x: -2.5, y: 1, z: 1, height: 2, color: 0xf472b6 },
      { x: -2, y: 1, z: 1, height: 1.2, color: 0x60a5fa }
    ];

    barPositions.forEach(bar => {
      const geometry = new THREE.BoxGeometry(0.3, bar.height, 0.3);
      const material = new THREE.MeshStandardMaterial({ 
        color: bar.color,
        emissive: bar.color,
        emissiveIntensity: 0.5,
        metalness: 0.3,
        roughness: 0.4
      });
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(bar.x, bar.y + bar.height / 2, bar.z);
      this.scene.add(mesh);
      this.objects.push({ mesh, speed: 0.5 + Math.random() * 0.5 });
    });

    // Create floating donut chart (torus)
    const torusGeometry = new THREE.TorusGeometry(0.5, 0.2, 16, 32);
    const torusMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x60a5fa,
      emissive: 0x60a5fa,
      emissiveIntensity: 0.5,
      metalness: 0.5,
      roughness: 0.3
    });
    const torus = new THREE.Mesh(torusGeometry, torusMaterial);
    torus.position.set(-3.5, 2.5, 0);
    torus.rotation.x = Math.PI / 4;
    this.scene.add(torus);
    this.objects.push({ mesh: torus, speed: 0.8 });

    // Create floating data cards
    const cardPositions = [
      { x: 3, y: 2, z: 0.5 },
      { x: 3.5, y: 1.5, z: 1 },
      { x: 2.5, y: 2.5, z: 0 }
    ];

    cardPositions.forEach((pos, i) => {
      const cardGeometry = new THREE.BoxGeometry(0.8, 1.2, 0.05);
      const cardMaterial = new THREE.MeshStandardMaterial({ 
        color: [0x667eea, 0xf093fb, 0x34d399][i],
        emissive: [0x667eea, 0xf093fb, 0x34d399][i],
        emissiveIntensity: 0.3,
        metalness: 0.2,
        roughness: 0.5
      });
      const card = new THREE.Mesh(cardGeometry, cardMaterial);
      card.position.set(pos.x, pos.y, pos.z);
      card.rotation.y = Math.PI / 6;
      this.scene.add(card);
      this.objects.push({ mesh: card, speed: 0.3 + i * 0.2 });
    });

    // Create floating sphere (data point)
    const sphereGeometry = new THREE.SphereGeometry(0.3, 32, 32);
    const sphereMaterial = new THREE.MeshStandardMaterial({ 
      color: 0xfbbf24,
      emissive: 0xfbbf24,
      emissiveIntensity: 0.6,
      metalness: 0.8,
      roughness: 0.2
    });
    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    sphere.position.set(2, 3, -0.5);
    this.scene.add(sphere);
    this.objects.push({ mesh: sphere, speed: 1 });
  }

  addLights() {
    // Ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    this.scene.add(ambientLight);

    // Main directional light
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 5, 5);
    this.scene.add(directionalLight);

    // Accent lights with colors
    const light1 = new THREE.PointLight(0x667eea, 2, 10);
    light1.position.set(-3, 2, 2);
    this.scene.add(light1);

    const light2 = new THREE.PointLight(0xf093fb, 2, 10);
    light2.position.set(3, 2, 2);
    this.scene.add(light2);

    const light3 = new THREE.PointLight(0x60a5fa, 1.5, 10);
    light3.position.set(0, 4, -2);
    this.scene.add(light3);
  }

  animate() {
    requestAnimationFrame(() => this.animate());

    const time = Date.now() * 0.001;

    // Animate floating objects
    this.objects.forEach((obj, index) => {
      obj.mesh.position.y += Math.sin(time * obj.speed + index) * 0.002;
      obj.mesh.rotation.y += 0.005;
      if (obj.mesh.geometry.type === 'TorusGeometry') {
        obj.mesh.rotation.x += 0.01;
      }
    });

    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }

  onResize() {
    this.camera.aspect = this.container.clientWidth / this.container.clientHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new Laptop3D('laptop-3d-container');
  });
} else {
  new Laptop3D('laptop-3d-container');
}
