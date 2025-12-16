// Experience Cards Scroll Animation
class ExperienceAnimations {
    constructor() {
        // Select only regular experience cards, not the flip card
        this.cards = document.querySelectorAll('#experience .group:not(.flip-card-container)');
        if (this.cards.length === 0) return;

        this.init();
    }

    init() {
        // Add classes to cards
        this.cards.forEach(card => {
            card.classList.add('experience-card');

            // Add class to content wrapper
            const content = card.querySelector('.relative.z-10');
            if (content) {
                content.classList.add('card-content');
            }

            // Add class to icon
            const icon = card.querySelector('.w-16.h-16');
            if (icon) {
                icon.classList.add('card-icon');
            }

            // Add class to title
            const title = card.querySelector('h4');
            if (title) {
                title.classList.add('card-title');
            }

            // Add class to company name
            const company = card.querySelector('.text-lg.font-semibold');
            if (company) {
                company.classList.add('company-name');
            }

            // Add class to decorative orb
            const orb = card.querySelector('.absolute.top-0');
            if (orb) {
                orb.classList.add('decorative-orb');
            }

            // Add class to skill tags
            const skillTags = card.querySelectorAll('.px-3.py-1');
            skillTags.forEach(tag => {
                tag.classList.add('skill-tag');
            });

            // Add class to responsibility items
            const responsibilities = card.querySelectorAll('ul li');
            responsibilities.forEach(item => {
                item.classList.add('responsibility-item');
            });
        });

        // Observe when cards come into view
        this.observeCards();

        // Add SMOOTH 3D tilt effect on mouse move
        this.addSmooth3DTilt();
    }

    observeCards() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, {
            threshold: 0.2,
            rootMargin: '0px 0px -100px 0px'
        });

        this.cards.forEach(card => {
            observer.observe(card);
        });
    }

    addSmooth3DTilt() {
        this.cards.forEach(card => {
            let currentX = 0;
            let currentY = 0;
            let targetX = 0;
            let targetY = 0;

            // Smooth interpolation
            const lerp = (start, end, factor) => {
                return start + (end - start) * factor;
            };

            const animate = () => {
                // Smooth interpolation for smoother movement
                currentX = lerp(currentX, targetX, 0.1);
                currentY = lerp(currentY, targetY, 0.1);

                card.style.transform = `
          translateY(-10px) 
          scale(1.02) 
          perspective(1000px) 
          rotateX(${currentY}deg) 
          rotateY(${currentX}deg)
        `;

                requestAnimationFrame(animate);
            };

            let animationId = null;

            card.addEventListener('mouseenter', () => {
                if (!animationId) {
                    animationId = requestAnimationFrame(animate);
                }
            });

            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                const centerX = rect.width / 2;
                const centerY = rect.height / 2;

                // Reduced rotation for smoother effect
                targetY = (y - centerY) / 30; // Was /20, now /30 for gentler tilt
                targetX = (centerX - x) / 30; // Was /20, now /30 for gentler tilt
            });

            card.addEventListener('mouseleave', () => {
                targetX = 0;
                targetY = 0;

                // Smooth return to original position
                const resetAnimation = () => {
                    currentX = lerp(currentX, 0, 0.1);
                    currentY = lerp(currentY, 0, 0.1);

                    card.style.transform = `
            perspective(1000px) 
            rotateX(${currentY}deg) 
            rotateY(${currentX}deg)
          `;

                    if (Math.abs(currentX) > 0.01 || Math.abs(currentY) > 0.01) {
                        requestAnimationFrame(resetAnimation);
                    } else {
                        card.style.transform = '';
                        if (animationId) {
                            cancelAnimationFrame(animationId);
                            animationId = null;
                        }
                    }
                };

                resetAnimation();
            });
        });
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new ExperienceAnimations();
    });
} else {
    new ExperienceAnimations();
}
