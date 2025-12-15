// Project Title Word Animation - Trigger on Scroll
class ProjectTitleAnimation {
    constructor() {
        this.title = document.getElementById('project-title');
        this.projectsSection = document.getElementById('projects');
        this.hasAnimated = false;

        if (!this.title || !this.projectsSection) return;

        this.init();
    }

    init() {
        // Hide words initially
        const words = this.title.querySelectorAll('.word-animate');
        words.forEach(word => {
            word.style.opacity = '0';
        });

        // Setup Intersection Observer
        this.setupObserver();
    }

    setupObserver() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                // Trigger animation when section comes into view
                if (entry.isIntersecting && !this.hasAnimated) {
                    this.hasAnimated = true;
                    this.startAnimation();
                }
            });
        }, {
            threshold: 0.3, // Trigger when 30% visible
            rootMargin: '0px'
        });

        observer.observe(this.projectsSection);
    }

    startAnimation() {
        // Remove initial opacity override
        const words = this.title.querySelectorAll('.word-animate');
        words.forEach(word => {
            word.style.opacity = '';
        });

        // Wait for words to appear, then start glitch effects
        setTimeout(() => {
            this.title.classList.add('animated');
        }, 4000); // After both words appear (3s + 1s animation)
    }
}

// Initialize
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new ProjectTitleAnimation();
    });
} else {
    new ProjectTitleAnimation();
}
