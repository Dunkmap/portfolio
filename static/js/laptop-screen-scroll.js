// Enhanced Laptop Screen Infinite Scroll & 3D Skills
class LaptopScreenEffects {
    constructor() {
        this.screenContent = document.querySelector('.screen-content');
        this.laptopScreen = document.querySelector('.laptop-screen');
        this.skillsHeader = document.querySelector('.skills-header');
        this.skillsGrid = document.querySelector('.skills-grid');
        this.skillItems = document.querySelectorAll('.skill-item');
        this.scrollPosition = 0;
        this.scrollSpeed = 0.8;
        this.isScrolling = false;
        this.isHoveringScreen = false;

        if (!this.screenContent || !this.skillsGrid) return;

        this.init();
    }

    init() {
        // Clone skills for infinite scroll
        this.createInfiniteScroll();

        // Make header sticky and 3D
        this.setupStickyHeader();

        // Add 3D hover effects to skills
        this.add3DSkillEffects();

        // Add screen hover detection
        this.setupScreenHover();

        // Start scroll animation
        this.animate();
    }

    setupScreenHover() {
        if (!this.laptopScreen) return;

        // Detect when cursor enters/leaves laptop screen
        this.laptopScreen.addEventListener('mouseenter', () => {
            this.isHoveringScreen = true;
            this.isScrolling = true;

            // Stop laptop rotation
            const laptopController = window.laptopController;
            if (laptopController) {
                laptopController.pauseRotation();
            }
        });

        this.laptopScreen.addEventListener('mouseleave', () => {
            this.isHoveringScreen = false;
            this.isScrolling = false;

            // Resume laptop rotation
            const laptopController = window.laptopController;
            if (laptopController) {
                laptopController.resumeRotation();
            }
        });
    }

    setupStickyHeader() {
        if (!this.skillsHeader) return;

        // Make header sticky at top
        this.skillsHeader.style.position = 'sticky';
        this.skillsHeader.style.top = '0';
        this.skillsHeader.style.zIndex = '50';
        this.skillsHeader.style.background = 'rgba(124, 58, 237, 0.3)';
        this.skillsHeader.style.backdropFilter = 'blur(10px)';
        this.skillsHeader.style.transformStyle = 'preserve-3d';
        this.skillsHeader.style.transition = 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)';

        // Add 3D hover effect to header
        this.skillsHeader.addEventListener('mouseenter', () => {
            this.skillsHeader.style.transform = 'translateZ(60px) scale(1.1)';
            this.skillsHeader.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.5)';
            this.skillsHeader.style.background = 'rgba(124, 58, 237, 0.5)';
        });

        this.skillsHeader.addEventListener('mouseleave', () => {
            this.skillsHeader.style.transform = '';
            this.skillsHeader.style.boxShadow = '';
            this.skillsHeader.style.background = 'rgba(124, 58, 237, 0.3)';
        });

        // Dynamic tilt on mouse move
        this.skillsHeader.addEventListener('mousemove', (e) => {
            const rect = this.skillsHeader.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = -(y - centerY) / 10;
            const rotateY = (x - centerX) / 10;

            this.skillsHeader.style.transform = `
        translateZ(60px) 
        scale(1.1)
        rotateX(${rotateX}deg)
        rotateY(${rotateY}deg)
      `;
        });
    }

    createInfiniteScroll() {
        // Clone the skills grid for seamless loop
        const clone = this.skillsGrid.cloneNode(true);
        clone.classList.add('skills-grid-clone');
        this.screenContent.appendChild(clone);

        // Set up container for scrolling
        this.screenContent.style.overflow = 'hidden';
        this.screenContent.style.position = 'relative';

        // Make grids stack vertically
        this.skillsGrid.style.marginBottom = '10px';
        clone.style.marginBottom = '10px';
    }

    add3DSkillEffects() {
        // Add 3D transform to all skill items (including clones)
        const allSkills = document.querySelectorAll('.skill-item');

        allSkills.forEach((skill, index) => {
            skill.style.transformStyle = 'preserve-3d';
            skill.style.transition = 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)';

            // Mouse enter - pop out in 3D
            skill.addEventListener('mouseenter', (e) => {
                const rect = skill.getBoundingClientRect();
                const screenRect = this.screenContent.getBoundingClientRect();

                // Calculate position relative to screen
                const relativeX = rect.left - screenRect.left;
                const relativeY = rect.top - screenRect.top;

                // Pop out effect
                skill.style.transform = `
          translateZ(80px) 
          scale(1.4)
          rotateY(${(relativeX / screenRect.width - 0.5) * 20}deg)
          rotateX(${-(relativeY / screenRect.height - 0.5) * 20}deg)
        `;
                skill.style.zIndex = '100';
                skill.style.boxShadow = '0 40px 80px rgba(0, 0, 0, 0.6)';
                skill.style.background = 'rgba(255, 255, 255, 0.3)';
            });

            // Mouse leave - return to normal
            skill.addEventListener('mouseleave', () => {
                skill.style.transform = '';
                skill.style.zIndex = '';
                skill.style.boxShadow = '';
                skill.style.background = '';
            });

            // Mouse move - dynamic 3D tilt
            skill.addEventListener('mousemove', (e) => {
                const rect = skill.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                const centerX = rect.width / 2;
                const centerY = rect.height / 2;

                const rotateX = -(y - centerY) / 5;
                const rotateY = (x - centerX) / 5;

                skill.style.transform = `
          translateZ(80px) 
          scale(1.4)
          rotateX(${rotateX}deg)
          rotateY(${rotateY}deg)
        `;
            });
        });
    }

    animate() {
        requestAnimationFrame(() => this.animate());

        // Only scroll when hovering over screen
        if (this.isScrolling) {
            // Increment scroll position
            this.scrollPosition += this.scrollSpeed;

            // Get total height of one skills grid
            const gridHeight = this.skillsGrid.offsetHeight + 10;

            // Reset when scrolled past one full grid
            if (this.scrollPosition >= gridHeight) {
                this.scrollPosition = 0;
            }

            // Apply scroll transform
            this.skillsGrid.style.transform = `translateY(-${this.scrollPosition}px)`;

            const clone = document.querySelector('.skills-grid-clone');
            if (clone) {
                clone.style.transform = `translateY(-${this.scrollPosition}px)`;
            }
        }
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.laptopScreenEffects = new LaptopScreenEffects();
    });
} else {
    window.laptopScreenEffects = new LaptopScreenEffects();
}
