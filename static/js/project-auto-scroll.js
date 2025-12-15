// Infinite Scroll within Fixed Timeline Container
class ProjectTimelineScroll {
    constructor() {
        this.container = document.querySelector('.timeline-scroll-container');
        this.projectsWrapper = document.querySelector('.timeline-projects');
        this.scrollSpeed = 1.5; // Smooth speed
        this.isPaused = false;
        this.scrollPosition = 0;
        this.animationFrame = null;

        if (!this.container || !this.projectsWrapper) return;

        this.init();
    }

    init() {
        // Clone projects for seamless infinite loop
        this.cloneProjects();

        // Start auto-scroll
        this.startAutoScroll();

        // Pause on hover
        this.setupHoverPause();
    }

    cloneProjects() {
        // Get all original projects
        const originalProjects = Array.from(this.projectsWrapper.children);

        // Clone and append for seamless loop
        originalProjects.forEach(project => {
            const clone = project.cloneNode(true);
            this.projectsWrapper.appendChild(clone);
        });

        // Store height for loop calculation
        this.singleSetHeight = originalProjects.reduce((total, project) => {
            return total + project.offsetHeight + 128; // 128 = space-y-32 (8rem)
        }, 0);
    }

    startAutoScroll() {
        const scroll = () => {
            if (!this.isPaused) {
                this.scrollPosition += this.scrollSpeed;

                // Loop back when first set of projects scrolls out
                if (this.scrollPosition >= this.singleSetHeight) {
                    this.scrollPosition = 0;
                }

                // Apply smooth scroll
                this.projectsWrapper.style.transform = `translateY(-${this.scrollPosition}px)`;
            }

            this.animationFrame = requestAnimationFrame(scroll);
        };

        this.animationFrame = requestAnimationFrame(scroll);
    }

    setupHoverPause() {
        // Pause on container hover
        this.container.addEventListener('mouseenter', () => {
            this.isPaused = true;
        });

        this.container.addEventListener('mouseleave', () => {
            this.isPaused = false;
        });
    }

    stop() {
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
        }
    }
}

// Initialize
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new ProjectTimelineScroll();
    });
} else {
    new ProjectTimelineScroll();
}
