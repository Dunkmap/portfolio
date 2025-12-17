// Manual Scroll for Project Timeline
// Auto-scrolling has been disabled - users can now manually scroll to view projects

class ProjectTimelineScroll {
    constructor() {
        this.container = document.querySelector('.timeline-scroll-container');
        this.projectsWrapper = document.querySelector('.timeline-projects');

        if (!this.container || !this.projectsWrapper) return;

        this.init();
    }

    init() {
        // Enable manual scrolling by adding overflow-y-auto to container
        this.container.style.overflowY = 'auto';
        this.container.style.scrollBehavior = 'smooth';

        // Remove any transform that might have been applied
        this.projectsWrapper.style.transform = 'none';

        // Add custom scrollbar styling
        this.addScrollbarStyles();
    }

    addScrollbarStyles() {
        // Check if style element already exists
        if (document.getElementById('timeline-scrollbar-styles')) return;

        const style = document.createElement('style');
        style.id = 'timeline-scrollbar-styles';
        style.textContent = `
            .timeline-scroll-container::-webkit-scrollbar {
                width: 10px;
            }
            
            .timeline-scroll-container::-webkit-scrollbar-track {
                background: rgba(255, 255, 255, 0.1);
                border-radius: 10px;
            }
            
            .timeline-scroll-container::-webkit-scrollbar-thumb {
                background: rgba(255, 255, 255, 0.3);
                border-radius: 10px;
                border: 2px solid transparent;
                background-clip: padding-box;
            }
            
            .timeline-scroll-container::-webkit-scrollbar-thumb:hover {
                background: rgba(255, 255, 255, 0.5);
                background-clip: padding-box;
            }
        `;
        document.head.appendChild(style);
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
