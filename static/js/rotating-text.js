// Rotating Text Animation
document.addEventListener('DOMContentLoaded', function () {
    const rotatingTextElement = document.querySelector('.rotating-text');

    if (!rotatingTextElement) return;

    const words = ['dataset', 'analyst', 'storyteller'];
    let currentIndex = 0;

    function rotateText() {
        // Fade out and slide up
        rotatingTextElement.style.transform = 'translateY(-100%)';
        rotatingTextElement.style.opacity = '0';

        setTimeout(() => {
            // Change text
            currentIndex = (currentIndex + 1) % words.length;
            rotatingTextElement.textContent = words[currentIndex];

            // Reset position (move to bottom)
            rotatingTextElement.style.transition = 'none';
            rotatingTextElement.style.transform = 'translateY(100%)';

            // Force reflow
            rotatingTextElement.offsetHeight;

            // Fade in and slide to center
            rotatingTextElement.style.transition = 'transform 0.6s ease, opacity 0.6s ease';
            rotatingTextElement.style.transform = 'translateY(0)';
            rotatingTextElement.style.opacity = '1';
        }, 600);
    }

    // Start animation - change every 3 seconds
    setInterval(rotateText, 3000);
});
