// 3D Laptop Interactive Controller - Enhanced Orbital System
class Laptop3DController {
    constructor() {
        this.laptop = document.querySelector('.laptop-3d');
        this.container = document.querySelector('.laptop-3d-container');
        this.floatingElements = document.querySelectorAll('.floating-chart');

        if (!this.laptop || !this.container) return;

        // Laptop rotation state
        this.isDraggingLaptop = false;
        this.previousMouseX = 0;
        this.previousMouseY = 0;
        this.rotationY = -25;
        this.rotationX = -15;
        this.targetRotationY = -25;
        this.targetRotationX = -15;
        this.autoRotate = true;
        this.autoRotateSpeed = 0.3;
        this.isPaused = false;

        // Orbital system
        this.orbitRadius = 280;
        this.orbitSpeed = 0.8;
        this.orbitAngles = [];
        this.orbitRadii = [];
        this.targetOrbitAngles = [];
        this.targetOrbitRadii = [];

        // Element dragging
        this.draggedElement = null;
        this.dragStartX = 0;
        this.dragStartY = 0;
        this.isDraggingElement = false;

        this.init();
    }

    init() {
        // Setup laptop
        this.container.style.cursor = 'grab';
        this.laptop.style.animation = 'none';

        // Laptop events
        this.container.addEventListener('mousedown', (e) => this.onContainerMouseDown(e));
        document.addEventListener('mousemove', (e) => this.onMouseMove(e));
        document.addEventListener('mouseup', () => this.onMouseUp());

        // Touch support
        this.container.addEventListener('touchstart', (e) => this.onContainerTouchStart(e), { passive: false });
        document.addEventListener('touchmove', (e) => this.onTouchMove(e), { passive: false });
        document.addEventListener('touchend', () => this.onMouseUp());

        // Initialize orbital elements
        this.initOrbitalElements();

        // Start animation
        this.animate();
    }

    initOrbitalElements() {
        this.floatingElements.forEach((element, index) => {
            // Set initial orbit positions (evenly spaced)
            this.orbitAngles[index] = (index * 120) * (Math.PI / 180);
            this.targetOrbitAngles[index] = this.orbitAngles[index];

            // Set initial radius
            this.orbitRadii[index] = this.orbitRadius;
            this.targetOrbitRadii[index] = this.orbitRadius;

            // Make draggable
            element.style.cursor = 'grab';
            element.style.animation = 'none';
            element.style.transition = 'transform 0.3s ease-out';

            // Element-specific events
            element.addEventListener('mousedown', (e) => this.onElementMouseDown(e, index));
            element.addEventListener('touchstart', (e) => this.onElementTouchStart(e, index), { passive: false });
        });
    }

    // Container click - check if laptop or element
    onContainerMouseDown(e) {
        const clickedElement = e.target.closest('.floating-chart');

        if (clickedElement) {
            // Clicking on floating element - don't rotate laptop
            return;
        }

        // Clicking on laptop - start rotation
        this.isDraggingLaptop = true;
        this.autoRotate = false;
        this.previousMouseX = e.clientX;
        this.previousMouseY = e.clientY;
        this.container.style.cursor = 'grabbing';
    }

    onContainerTouchStart(e) {
        const clickedElement = e.target.closest('.floating-chart');
        if (clickedElement) return;

        this.isDraggingLaptop = true;
        this.autoRotate = false;
        const touch = e.touches[0];
        this.previousMouseX = touch.clientX;
        this.previousMouseY = touch.clientY;
    }

    // Element drag start
    onElementMouseDown(e, index) {
        e.stopPropagation();
        e.preventDefault();

        this.draggedElement = index;
        this.isDraggingElement = true;
        this.dragStartX = e.clientX;
        this.dragStartY = e.clientY;

        this.floatingElements[index].style.cursor = 'grabbing';
        this.floatingElements[index].style.transition = 'none'; // Smooth dragging
    }

    onElementTouchStart(e, index) {
        e.stopPropagation();
        e.preventDefault();

        this.draggedElement = index;
        this.isDraggingElement = true;
        const touch = e.touches[0];
        this.dragStartX = touch.clientX;
        this.dragStartY = touch.clientY;

        this.floatingElements[index].style.transition = 'none';
    }

    // Mouse/Touch move
    onMouseMove(e) {
        // Laptop rotation (independent of element dragging)
        if (this.isDraggingLaptop) {
            const deltaX = e.clientX - this.previousMouseX;
            const deltaY = e.clientY - this.previousMouseY;

            this.targetRotationY += deltaX * 0.5;
            this.targetRotationX -= deltaY * 0.3;
            this.targetRotationX = Math.max(-60, Math.min(20, this.targetRotationX));

            this.previousMouseX = e.clientX;
            this.previousMouseY = e.clientY;
        }

        // Element dragging (doesn't affect laptop)
        if (this.isDraggingElement && this.draggedElement !== null) {
            this.dragElement(e.clientX, e.clientY);
        }
    }

    onTouchMove(e) {
        const touch = e.touches[0];

        if (this.isDraggingLaptop) {
            const deltaX = touch.clientX - this.previousMouseX;
            const deltaY = touch.clientY - this.previousMouseY;

            this.targetRotationY += deltaX * 0.5;
            this.targetRotationX -= deltaY * 0.3;
            this.targetRotationX = Math.max(-60, Math.min(20, this.targetRotationX));

            this.previousMouseX = touch.clientX;
            this.previousMouseY = touch.clientY;
        }

        if (this.isDraggingElement && this.draggedElement !== null) {
            this.dragElement(touch.clientX, touch.clientY);
        }
    }

    onMouseUp() {
        // Release laptop
        if (this.isDraggingLaptop) {
            this.isDraggingLaptop = false;
            this.container.style.cursor = 'grab';

            // Resume auto-rotate after 2 seconds
            setTimeout(() => {
                if (!this.isDraggingLaptop) {
                    this.autoRotate = true;
                }
            }, 2000);
        }

        // Release element
        if (this.isDraggingElement && this.draggedElement !== null) {
            this.floatingElements[this.draggedElement].style.cursor = 'grab';
            this.floatingElements[this.draggedElement].style.transition = 'transform 0.3s ease-out';
            this.isDraggingElement = false;
            this.draggedElement = null;
        }
    }

    // Drag element around orbit
    dragElement(mouseX, mouseY) {
        const rect = this.container.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        // Calculate angle from center
        const dx = mouseX - centerX;
        const dy = mouseY - centerY;
        const angle = Math.atan2(dy, dx);

        // Calculate distance (radius)
        const distance = Math.sqrt(dx * dx + dy * dy);
        const newRadius = Math.min(Math.max(distance * 0.8, 150), 400);

        // Update target position
        this.targetOrbitAngles[this.draggedElement] = angle;
        this.targetOrbitRadii[this.draggedElement] = newRadius;

        // Immediately update for smooth dragging
        this.orbitAngles[this.draggedElement] = angle;
        this.orbitRadii[this.draggedElement] = newRadius;
    }

    // Pause laptop rotation (called when hovering screen)
    pauseRotation() {
        this.isPaused = true;
        this.autoRotate = false;
    }

    // Resume laptop rotation
    resumeRotation() {
        this.isPaused = false;
        setTimeout(() => {
            if (!this.isDraggingLaptop && !this.isPaused) {
                this.autoRotate = true;
            }
        }, 1000);
    }

    // Animation loop
    animate() {
        requestAnimationFrame(() => this.animate());

        const time = Date.now() * 0.001;

        // Auto-rotate laptop (continues even when dragging elements)
        if (this.autoRotate && !this.isDraggingLaptop) {
            this.targetRotationY += this.autoRotateSpeed;
        }

        // Smooth laptop rotation
        this.rotationY += (this.targetRotationY - this.rotationY) * 0.1;
        this.rotationX += (this.targetRotationX - this.rotationX) * 0.1;

        this.laptop.style.transform = `
      rotateX(${this.rotationX}deg) 
      rotateY(${this.rotationY}deg)
      translateY(0px)
    `;

        // Update orbital elements
        this.floatingElements.forEach((element, index) => {
            // Continue orbiting if not being dragged
            if (this.draggedElement !== index) {
                this.targetOrbitAngles[index] += this.orbitSpeed * 0.01;

                // Smooth interpolation
                this.orbitAngles[index] += (this.targetOrbitAngles[index] - this.orbitAngles[index]) * 0.1;
                this.orbitRadii[index] += (this.targetOrbitRadii[index] - this.orbitRadii[index]) * 0.1;
            }

            // Calculate 3D orbital position
            const angle = this.orbitAngles[index];
            const radius = this.orbitRadii[index];

            // Elliptical orbit with 3D depth
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius * 0.4; // Flatten for perspective
            const z = Math.sin(angle) * radius * 0.25; // Add depth

            // Add floating animation (gentle bob)
            const floatY = Math.sin(time * 1.5 + index * 2) * 15;

            // Apply transform
            element.style.transform = `
        translate3d(${x}px, ${y + floatY}px, ${z}px)
      `;

            // Adjust opacity based on Z position (closer = more visible)
            const opacity = 0.7 + (Math.sin(angle) * 0.3);
            element.style.opacity = opacity;
        });
    }
}

// Initialize and expose globally
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.laptopController = new Laptop3DController();
    });
} else {
    window.laptopController = new Laptop3DController();
}
