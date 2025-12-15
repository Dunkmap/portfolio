// Simplified 3D Globe with Skills Visualization using Three.js (non-module version)
(function() {
  'use strict';
  
  console.log('Globe script loaded');

  class SkillsGlobe {
    constructor(containerId) {
      console.log('SkillsGlobe constructor called with:', containerId);
      this.container = document.getElementById(containerId);
      if (!this.container) {
        console.error('Container not found:', containerId);
        return;
      }

      console.log('Container found:', this.container);

      // Interactive state
      this.isHovered = false;
      this.targetScale = 1.0;
      this.currentScale = 1.0;
      this.mouse = { x: 0, y: 0 };
      this.targetRotation = { x: 0, y: 0 };
      this.currentRotation = { x: 0, y: 0 };

      // Skills and tools data with positions on globe - redistributed to prevent overlap
      // Only include 'icon' property if a valid Devicon icon exists
      this.skills = [
        { name: 'Python', icon: 'devicon-python-plain colored', color: 0x3776AB, lat: 40, lon: -74 },
        { name: 'Machine Learning', color: 0xFF6F00, lat: 51, lon: 15 },
        { name: 'TensorFlow', icon: 'devicon-tensorflow-original colored', color: 0xFF6F00, lat: -35, lon: -122 },
        { name: 'PyTorch', icon: 'devicon-pytorch-original colored', color: 0xEE4C2C, lat: 48, lon: 85 },
        { name: 'ROS', color: 0x22314E, lat: 20, lon: 139 },
        { name: 'Embedded Systems', color: 0x00979D, lat: -33, lon: 151 },
        { name: 'Arduino', icon: 'devicon-arduino-plain colored', color: 0x00979D, lat: 60, lon: -30 },
        { name: 'Raspberry Pi', icon: 'devicon-raspberrypi-line colored', color: 0xC51A4A, lat: -15, lon: 30 },
        { name: 'OpenCV', icon: 'devicon-opencv-plain colored', color: 0x5C3EE8, lat: 19, lon: 72 },
        { name: 'CAD', color: 0x0696D7, lat: 5, lon: 103 },
        { name: 'Flask', icon: 'devicon-flask-original colored', color: 0xFFFFFF, lat: 55, lon: -95 },
        { name: 'Git', icon: 'devicon-git-plain colored', color: 0xF05032, lat: -40, lon: -46 },
        { name: 'Linux', icon: 'devicon-linux-plain colored', color: 0xFCC624, lat: 65, lon: 50 },
        { name: 'Docker', icon: 'devicon-docker-plain colored', color: 0x2496ED, lat: 35, lon: -150 },
        { name: 'SQL', icon: 'devicon-mysql-plain colored', color: 0x4479A1, lat: -50, lon: 18 },
        { name: 'NumPy', icon: 'devicon-numpy-original colored', color: 0x013243, lat: 28, lon: -10 },
        { name: 'Pandas', icon: 'devicon-pandas-original colored', color: 0x150458, lat: -20, lon: 100 },
        { name: 'SciPy', color: 0x8CAAE6, lat: -5, lon: -70 },
      ];

      // Wait for THREE to be available
      if (typeof THREE === 'undefined') {
        console.error('THREE.js not loaded!');
        this.loadThreeJS();
      } else {
        console.log('THREE.js is available');
        this.init();
      }
    }

    loadThreeJS() {
      console.log('Loading THREE.js...');
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.min.js';
      script.onload = () => {
        console.log('THREE.js loaded successfully');
        // Load CSS2DRenderer for labels
        const labelScript = document.createElement('script');
        labelScript.src = 'https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/renderers/CSS2DRenderer.js';
        labelScript.type = 'module';
        labelScript.onload = () => {
          console.log('CSS2DRenderer loaded');
          this.init();
        };
        labelScript.onerror = () => {
          console.log('CSS2DRenderer failed to load, continuing without labels');
          this.init();
        };
        document.head.appendChild(labelScript);
      };
      script.onerror = () => {
        console.error('Failed to load THREE.js');
      };
      document.head.appendChild(script);
    }

    init() {
      console.log('Initializing globe...');
      
      // Scene setup
      this.scene = new THREE.Scene();
      
      // Camera setup - adjusted to show platform
      const aspect = this.container.offsetWidth / this.container.offsetHeight;
      this.camera = new THREE.PerspectiveCamera(45, aspect, 0.1, 1000);
      this.camera.position.set(0, 30, 400); // Slightly elevated to see platform
      this.camera.lookAt(0, 0, 0);

      // Expose instance globally for debugging
      window.skillsGlobeInstance = this;

      // Renderer setup
      this.renderer = new THREE.WebGLRenderer({ 
        alpha: true, 
        antialias: true 
      });
      this.renderer.setSize(this.container.offsetWidth, this.container.offsetHeight);
      this.renderer.setPixelRatio(window.devicePixelRatio);
      this.container.appendChild(this.renderer.domElement);

      console.log('Renderer created and added to container');

      // Lighting
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
      this.scene.add(ambientLight);

      const pointLight = new THREE.PointLight(0xffffff, 0.8);
      pointLight.position.set(200, 200, 200);
      this.scene.add(pointLight);

      // Create globe
      this.createGlobe();
      
      // Create platform beneath globe
      this.createPlatform();
      
      // Create skill points
      this.createSkillPoints();
      
      // Create connections
      this.createConnections();

      // Start animation
      this.animate();
      
      // Handle resize
      this.handleResize();

      // Add mouse interaction listeners
      this.setupMouseInteraction();

      console.log('Globe initialization complete!');
    }

    createGlobe() {
      // Globe geometry - reduced by 30px
      const geometry = new THREE.IcosahedronGeometry(70, 4);
      
      // Wireframe material - bright cyan for visibility
      const wireframeMaterial = new THREE.MeshBasicMaterial({
        color: 0x00ffff,
        wireframe: true,
        transparent: true,
        opacity: 0.6
      });
      
      this.globeWireframe = new THREE.Mesh(geometry, wireframeMaterial);
      this.scene.add(this.globeWireframe);

      // Solid globe with low opacity - lighter for visibility
      const solidMaterial = new THREE.MeshPhongMaterial({
        color: 0x666666,
        transparent: true,
        opacity: 0.3,
        shininess: 30
      });
      
      this.globeSolid = new THREE.Mesh(geometry, solidMaterial);
      this.scene.add(this.globeSolid);

      // Add atmosphere glow - bright cyan
      const glowGeometry = new THREE.IcosahedronGeometry(75, 4);
      const glowMaterial = new THREE.MeshBasicMaterial({
        color: 0x00ffff,
        transparent: true,
        opacity: 0.15,
        side: THREE.BackSide
      });
      
      this.glow = new THREE.Mesh(glowGeometry, glowMaterial);
      this.scene.add(this.glow);
    }

    createPlatform() {
      // Main circular platform disc - reduced by 30px
      const platformGeometry = new THREE.CylinderGeometry(90, 90, 3, 64);
      const platformMaterial = new THREE.MeshPhongMaterial({
        color: 0x0a1a2a,
        transparent: true,
        opacity: 0.6,
        shininess: 100,
        emissive: 0x001a33,
        emissiveIntensity: 0.3
      });
      
      this.platform = new THREE.Mesh(platformGeometry, platformMaterial);
      this.platform.position.y = -80; // Position below globe
      this.scene.add(this.platform);

      // Glowing ring around platform edge
      const ringGeometry = new THREE.TorusGeometry(90, 2, 16, 100);
      const ringMaterial = new THREE.MeshBasicMaterial({
        color: 0x00ffff,
        transparent: true,
        opacity: 0.8
      });
      
      this.platformRing = new THREE.Mesh(ringGeometry, ringMaterial);
      this.platformRing.position.y = -80;
      this.platformRing.rotation.x = Math.PI / 2;
      this.scene.add(this.platformRing);

      // Inner glowing circle
      const innerRingGeometry = new THREE.TorusGeometry(60, 1.5, 16, 100);
      const innerRingMaterial = new THREE.MeshBasicMaterial({
        color: 0x00ffff,
        transparent: true,
        opacity: 0.5
      });
      
      this.innerRing = new THREE.Mesh(innerRingGeometry, innerRingMaterial);
      this.innerRing.position.y = -79;
      this.innerRing.rotation.x = Math.PI / 2;
      this.scene.add(this.innerRing);

      // Add grid pattern on platform
      const gridHelper = new THREE.PolarGridHelper(90, 16, 8, 64, 0x00ffff, 0x004466);
      gridHelper.position.y = -78.5;
      this.scene.add(gridHelper);

      // Add point light beneath for upward glow
      const platformLight = new THREE.PointLight(0x00ffff, 0.5, 180);
      platformLight.position.set(0, -80, 0);
      this.scene.add(platformLight);
    }

    latLonToVector3(lat, lon, radius) {
      const phi = (90 - lat) * (Math.PI / 180);
      const theta = (lon + 180) * (Math.PI / 180);

      const x = -(radius * Math.sin(phi) * Math.cos(theta));
      const y = radius * Math.cos(phi);
      const z = radius * Math.sin(phi) * Math.sin(theta);

      return new THREE.Vector3(x, y, z);
    }

    createSkillPoints() {
      this.skillPoints = [];
      this.skillLabels = [];
      
      this.skills.forEach(skill => {
        // Create point position for label placement
        const position = this.latLonToVector3(skill.lat, skill.lon, 70);
        
        let element;
        
        // Check if skill has an icon, otherwise use text
        if (skill.icon) {
          // Create icon element
          element = document.createElement('i');
          element.className = skill.icon + ' skill-icon';
          element.title = skill.name; // Tooltip on hover
          element.style.cssText = `
            position: absolute;
            font-size: 24px;
            background: rgba(0, 0, 0, 0.7);
            padding: 8px;
            border-radius: 8px;
            pointer-events: auto;
            filter: drop-shadow(0 0 8px rgba(255, 255, 255, 0.5));
            border: 1px solid rgba(255, 255, 255, 0.2);
            cursor: pointer;
            transition: all 0.3s ease;
          `;
        } else {
          // Create text label element
          element = document.createElement('div');
          element.className = 'skill-label';
          element.textContent = skill.name;
          element.title = skill.name;
          element.style.cssText = `
            position: absolute;
            color: #00ffff;
            font-size: 11px;
            font-weight: 600;
            background: rgba(0, 0, 0, 0.7);
            padding: 4px 8px;
            border-radius: 6px;
            white-space: nowrap;
            pointer-events: auto;
            text-shadow: 0 0 5px rgba(0, 255, 255, 0.8);
            border: 1px solid rgba(0, 255, 255, 0.3);
            cursor: pointer;
            transition: all 0.3s ease;
          `;
        }
        
        // Store position data and element type
        this.skillPoints.push({ position: position.clone(), hasIcon: !!skill.icon });
        this.skillLabels.push({ element: element, position: position.clone(), hasIcon: !!skill.icon });
        
        // Add element to container
        this.container.appendChild(element);
      });
    }


    createConnections() {
      // Connections removed - cleaner globe appearance
    }

    animate() {
      requestAnimationFrame(() => this.animate());
      
      const rotationSpeed = 0.002;
      
      // Smooth scale transition
      const scaleSpeed = 0.05;
      this.currentScale += (this.targetScale - this.currentScale) * scaleSpeed;
      
      // Smooth rotation transition for cursor control
      const rotationDamping = 0.05;
      this.currentRotation.x += (this.targetRotation.x - this.currentRotation.x) * rotationDamping;
      this.currentRotation.y += (this.targetRotation.y - this.currentRotation.y) * rotationDamping;
      
      // Rotate globe (auto-rotation + cursor control)
      if (this.globeWireframe) {
        this.globeWireframe.rotation.y += rotationSpeed + this.currentRotation.y * 0.01;
        this.globeWireframe.rotation.x = this.currentRotation.x * 0.3;
        
        this.globeSolid.rotation.y = this.globeWireframe.rotation.y;
        this.globeSolid.rotation.x = this.globeWireframe.rotation.x;
        
        this.glow.rotation.y = this.globeWireframe.rotation.y;
        this.glow.rotation.x = this.globeWireframe.rotation.x;
        
        // Apply scale to all globe elements
        this.globeWireframe.scale.set(this.currentScale, this.currentScale, this.currentScale);
        this.globeSolid.scale.set(this.currentScale, this.currentScale, this.currentScale);
        this.glow.scale.set(this.currentScale, this.currentScale, this.currentScale);
      }
      
      // Animate platform elements
      const time = Date.now() * 0.001;
      if (this.platform) {
        // Rotate platform at same speed as globe
        this.platform.rotation.y += rotationSpeed;
        
        // Rotate rings in opposite direction for effect
        this.platformRing.rotation.z += rotationSpeed * 0.5;
        this.innerRing.rotation.z -= rotationSpeed * 0.6;
      }
      
      // Update label positions to follow the globe rotation
      if (this.skillLabels && this.camera) {
        this.skillLabels.forEach((label, index) => {
          // Rotate the position vector
          const rotatedPos = label.position.clone();
          rotatedPos.applyAxisAngle(new THREE.Vector3(0, 1, 0), this.globeWireframe.rotation.y);
          rotatedPos.applyAxisAngle(new THREE.Vector3(1, 0, 0), this.globeWireframe.rotation.x);
          
          // Apply scale to position
          rotatedPos.multiplyScalar(this.currentScale);
          
          // Project to screen coordinates
          const vector = rotatedPos.clone().project(this.camera);
          
          // Convert to screen position
          const x = (vector.x * 0.5 + 0.5) * this.container.offsetWidth;
          const y = (vector.y * -0.5 + 0.5) * this.container.offsetHeight;
          
          // Check if label is on the visible side of the globe
          const cameraDirection = new THREE.Vector3(0, 0, 1);
          const labelDirection = rotatedPos.clone().normalize();
          const dotProduct = labelDirection.dot(cameraDirection);
          
          // Update label position and visibility
          if (dotProduct > 0) {
            label.element.style.left = `${x}px`;
            label.element.style.top = `${y}px`;
            
            // Enhanced visibility on hover
            const baseOpacity = Math.min(dotProduct * 1.5, 1);
            const hoverOpacity = this.isHovered ? 1.0 : baseOpacity;
            label.element.style.opacity = hoverOpacity;
            
            // Different hover effects for icons vs text labels
            if (label.hasIcon) {
              // Icon hover effects - use white glow to preserve icon colors
              const baseIconSize = 24;
              const hoverIconSize = this.isHovered ? 32 : baseIconSize;
              label.element.style.fontSize = `${hoverIconSize}px`;
              
              if (this.isHovered) {
                label.element.style.filter = 'drop-shadow(0 0 12px rgba(255, 255, 255, 0.8))';
                label.element.style.background = 'rgba(0, 0, 0, 0.9)';
                label.element.style.transform = 'translate(-50%, -50%) scale(1.1)';
              } else {
                label.element.style.filter = 'drop-shadow(0 0 8px rgba(255, 255, 255, 0.5))';
                label.element.style.background = 'rgba(0, 0, 0, 0.7)';
                label.element.style.transform = 'translate(-50%, -50%) scale(1)';
              }
            } else {
              // Text label hover effects
              const baseTextSize = 11;
              const hoverTextSize = this.isHovered ? 13 : baseTextSize;
              label.element.style.fontSize = `${hoverTextSize}px`;
              
              if (this.isHovered) {
                label.element.style.textShadow = '0 0 10px rgba(0, 255, 255, 1)';
                label.element.style.background = 'rgba(0, 0, 0, 0.9)';
                label.element.style.transform = 'translate(-50%, -50%)';
              } else {
                label.element.style.textShadow = '0 0 5px rgba(0, 255, 255, 0.8)';
                label.element.style.background = 'rgba(0, 0, 0, 0.7)';
                label.element.style.transform = 'translate(-50%, -50%)';
              }
            }
            
            label.element.style.display = 'block';
          } else {
            label.element.style.display = 'none';
          }
        });
      }
      
      // Render
      this.renderer.render(this.scene, this.camera);
    }

    setupMouseInteraction() {
      // Mouse enter/leave for hover effect
      this.container.addEventListener('mouseenter', () => {
        this.isHovered = true;
        // Subtle scale increase to maintain circular shape
        // 1.3x scale = 30% size increase (from radius 100 to 130)
        this.targetScale = 1.3;
      });

      this.container.addEventListener('mouseleave', () => {
        this.isHovered = false;
        this.targetScale = 1.0;
        this.targetRotation.x = 0;
        this.targetRotation.y = 0;
      });

      // Mouse move for cursor-based rotation
      this.container.addEventListener('mousemove', (event) => {
        if (!this.isHovered) return;

        const rect = this.container.getBoundingClientRect();
        
        // Normalize mouse position to -1 to 1
        this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
        
        // Update target rotation based on mouse position
        this.targetRotation.x = this.mouse.y * 2; // Vertical rotation
        this.targetRotation.y = this.mouse.x * 2; // Horizontal rotation
      });
    }

    handleResize() {
      window.addEventListener('resize', () => {
        if (!this.container) return;
        
        const width = this.container.offsetWidth;
        const height = this.container.offsetHeight;
        
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        
        this.renderer.setSize(width, height);
      });
    }
  }

  // Initialize globe when DOM is ready
  function initGlobe() {
    console.log('initGlobe called, readyState:', document.readyState);
    const container = document.getElementById('globe-container');
    if (container) {
      console.log('Globe container found, creating globe...');
      try {
        window.globeInstance = new SkillsGlobe('globe-container');
        console.log('Globe created successfully!');
      } catch (error) {
        console.error('Error creating globe:', error);
      }
    } else {
      console.error('Globe container not found!');
    }
  }

  // Check if DOM is already loaded
  if (document.readyState === 'loading') {
    console.log('DOM still loading, adding event listener');
    document.addEventListener('DOMContentLoaded', initGlobe);
  } else {
    console.log('DOM already loaded, initializing immediately');
    initGlobe();
  }

})();
