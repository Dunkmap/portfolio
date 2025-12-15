// Cool Word-by-Word Animation for About Section
class WordAnimation {
    constructor() {
        this.animatedTextContainer = document.querySelector('.animated-text');
        if (!this.animatedTextContainer) return;

        this.init();
    }

    init() {
        // Get all paragraphs
        const paragraphs = this.animatedTextContainer.querySelectorAll('p');

        paragraphs.forEach((paragraph, pIndex) => {
            const text = paragraph.textContent.trim();
            const words = text.split(' ');

            // Clear paragraph
            paragraph.textContent = '';

            // Wrap each word in a span
            words.forEach((word, index) => {
                const span = document.createElement('span');
                span.className = 'word';
                span.textContent = word;
                span.style.animationDelay = `${(pIndex * words.length + index) * 0.05}s`;

                paragraph.appendChild(span);

                // Add space after word (except last word)
                if (index < words.length - 1) {
                    paragraph.appendChild(document.createTextNode(' '));
                }
            });
        });

        // Observe when section comes into view
        this.observeSection();
    }

    observeSection() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, {
            threshold: 0.2
        });

        observer.observe(this.animatedTextContainer);
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new WordAnimation();
    });
} else {
    new WordAnimation();
}
