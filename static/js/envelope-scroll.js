// Scroll envelope cards left or right
function scrollEnvelopeCards(direction) {
    const container = document.getElementById('envelopeContainer');
    const scrollAmount = 300; // Scroll 300px at a time

    if (direction === 'left') {
        container.scrollBy({
            left: -scrollAmount,
            behavior: 'smooth'
        });
    } else if (direction === 'right') {
        container.scrollBy({
            left: scrollAmount,
            behavior: 'smooth'
        });
    }
}

// Optional: Hide arrows when at start/end
document.addEventListener('DOMContentLoaded', function () {
    const container = document.getElementById('envelopeContainer');
    const leftArrow = document.querySelector('.envelope-scroll-arrow.left');
    const rightArrow = document.querySelector('.envelope-scroll-arrow.right');

    if (container && leftArrow && rightArrow) {
        function updateArrows() {
            // Hide left arrow if at start
            if (container.scrollLeft <= 0) {
                leftArrow.style.opacity = '0.3';
                leftArrow.style.pointerEvents = 'none';
            } else {
                leftArrow.style.opacity = '1';
                leftArrow.style.pointerEvents = 'auto';
            }

            // Hide right arrow if at end
            if (container.scrollLeft >= container.scrollWidth - container.clientWidth - 10) {
                rightArrow.style.opacity = '0.3';
                rightArrow.style.pointerEvents = 'none';
            } else {
                rightArrow.style.opacity = '1';
                rightArrow.style.pointerEvents = 'auto';
            }
        }

        // Update on scroll
        container.addEventListener('scroll', updateArrows);

        // Initial update
        updateArrows();
    }
});
