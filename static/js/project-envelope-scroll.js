// Smooth scroll to specific project in timeline when envelope card is clicked
document.addEventListener('DOMContentLoaded', function () {
    // Toggle main projects card expansion
    const mainCard = document.querySelector('.projects-main-card');
    const cardHeader = document.querySelector('.projects-card-header');

    if (cardHeader) {
        cardHeader.addEventListener('click', function (e) {
            // Don't toggle if clicking on an envelope card
            if (!e.target.closest('.project-envelope-card')) {
                mainCard.classList.toggle('expanded');
            }
        });
    }

    // Handle envelope card clicks
    const envelopeCards = document.querySelectorAll('.project-envelope-card');

    envelopeCards.forEach((card) => {
        card.addEventListener('click', function (e) {
            e.stopPropagation(); // Prevent main card toggle

            // Get the project index from data attribute
            const projectIndex = parseInt(card.getAttribute('data-project-index'));

            // Navigate to projects section
            const projectsSection = document.getElementById('projects');
            const targetProject = document.querySelector(`.timeline-project-item[data-project-id="${projectIndex}"]`);

            if (projectsSection && targetProject) {
                // First scroll to projects section
                projectsSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });

                // Then scroll to specific project card after a short delay
                setTimeout(() => {
                    const scrollContainer = document.querySelector('.timeline-scroll-container');

                    if (scrollContainer && targetProject) {
                        // Calculate exact center position
                        const containerHeight = scrollContainer.clientHeight;
                        const projectHeight = targetProject.offsetHeight;

                        // Get project's position relative to the scrollable container
                        const projectOffsetTop = targetProject.offsetTop;

                        // Calculate scroll position to center the card perfectly
                        const centerScrollPosition = projectOffsetTop - (containerHeight / 2) + (projectHeight / 2);

                        // Smooth scroll to center position
                        scrollContainer.scrollTo({
                            top: centerScrollPosition,
                            behavior: 'smooth'
                        });

                        // After scrolling, activate the modal effect
                        setTimeout(() => {
                            activateProjectModal(targetProject, scrollContainer);
                        }, 800);
                    }
                }, 800);
            }
        });
    });

    // Function to activate modal effect
    function activateProjectModal(projectCard, scrollContainer) {
        // Add modal active class
        projectCard.classList.add('project-modal-active');

        // Add blur to background
        scrollContainer.classList.add('timeline-blur-bg');

        // Create and add close button
        const closeBtn = document.createElement('div');
        closeBtn.className = 'project-modal-close';
        closeBtn.innerHTML = '✕';
        projectCard.appendChild(closeBtn);

        let scrollListenerActive = false;
        let autoCloseTimer = null;

        // Function to close modal with flip animation
        function closeModal() {
            // Clear auto-close timer if exists
            if (autoCloseTimer) {
                clearTimeout(autoCloseTimer);
            }

            // Add closing animation
            projectCard.classList.add('project-modal-closing');

            // Remove blur immediately
            scrollContainer.classList.remove('timeline-blur-bg');

            // After animation completes, remove all classes
            setTimeout(() => {
                projectCard.classList.remove('project-modal-active');
                projectCard.classList.remove('project-modal-closing');
                if (closeBtn.parentNode) {
                    closeBtn.remove();
                }
                // Remove scroll listener
                if (scrollListenerActive) {
                    scrollContainer.removeEventListener('scroll', handleScroll);
                }
            }, 800);
        }

        // Handle scroll to close modal
        function handleScroll() {
            if (scrollListenerActive) {
                closeModal();
            }
        }

        // Close on button click
        closeBtn.addEventListener('click', function (e) {
            e.stopPropagation();
            closeModal();
        });

        // Auto-close after 3 seconds
        autoCloseTimer = setTimeout(() => {
            closeModal();
        }, 3000);

        // Enable scroll-to-close after 2 seconds (gives time to view the card)
        setTimeout(() => {
            scrollListenerActive = true;
            scrollContainer.addEventListener('scroll', handleScroll, { once: true });
        }, 2000);

        // Close on ESC key
        function handleEscape(e) {
            if (e.key === 'Escape') {
                closeModal();
                document.removeEventListener('keydown', handleEscape);
            }
        }
        document.addEventListener('keydown', handleEscape);
    }
});
