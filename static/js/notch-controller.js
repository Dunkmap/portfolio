// Hide notch navigation when scrolling past first page
class NotchController {
    constructor() {
        this.notch = document.querySelector('.nav-notch');
        if (!this.notch) return;

        this.init();
    }

    init() {
        window.addEventListener('scroll', () => this.handleScroll(), { passive: true });
        this.handleScroll();
    }

    handleScroll() {
        const scrollY = window.scrollY;
        const windowHeight = window.innerHeight;

        // Hide notch when scrolled past 80% of first page
        if (scrollY > windowHeight * 0.8) {
            this.notch.classList.add('hidden');
        } else {
            this.notch.classList.remove('hidden');
        }
    }
}

// Initialize
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new NotchController();
    });
} else {
    new NotchController();
}
