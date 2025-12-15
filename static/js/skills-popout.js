// 3D Skills Pop-out Effect
class SkillsPopout {
    constructor() {
        this.skillItems = document.querySelectorAll('.skill-item');
        this.init();
    }

    init() {
        this.skillItems.forEach((item, index) => {
            item.addEventListener('mouseenter', () => this.popOut(item));
            item.addEventListener('mouseleave', () => this.popIn(item));
        });
    }

    popOut(item) {
        // Pop out of screen in 3D
        item.style.transform = 'translateZ(100px) scale(1.3)';
        item.style.zIndex = '1000';
        item.style.boxShadow = '0 30px 60px rgba(0, 0, 0, 0.5)';

        // Make background more opaque
        item.style.background = 'rgba(255, 255, 255, 0.25)';
        item.style.backdropFilter = 'blur(15px)';
    }

    popIn(item) {
        // Return to original position
        item.style.transform = '';
        item.style.zIndex = '';
        item.style.boxShadow = '';
        item.style.background = '';
        item.style.backdropFilter = '';
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new SkillsPopout();
    });
} else {
    new SkillsPopout();
}
