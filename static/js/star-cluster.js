// Animated Star Cluster Background
class StarCluster {
    constructor() {
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.stars = [];
        this.mouseX = window.innerWidth / 2;
        this.mouseY = window.innerHeight / 2;
        this.targetMouseX = window.innerWidth / 2;
        this.targetMouseY = window.innerHeight / 2;

        this.init();
    }

    init() {
        // Setup canvas - VISIBLE on landing page
        this.canvas.id = 'star-cluster';
        this.canvas.style.position = 'fixed';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.width = '100%';
        this.canvas.style.height = '100%';
        this.canvas.style.zIndex = '1'; // Above background, below content
        this.canvas.style.pointerEvents = 'none';
        this.canvas.style.opacity = '1'; // Fully visible

        // Insert at beginning of body
        document.body.insertBefore(this.canvas, document.body.firstChild);

        // Set canvas size
        this.resize();

        // Create stars
        this.createStars();

        // Event listeners
        window.addEventListener('resize', () => this.resize());
        document.addEventListener('mousemove', (e) => this.onMouseMove(e));

        // Start animation
        this.animate();
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    createStars() {
        const starCount = 250; // More stars for visibility

        for (let i = 0; i < starCount; i++) {
            this.stars.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                size: Math.random() * 2.5 + 0.8, // Larger stars
                speedX: (Math.random() - 0.5) * 0.3,
                speedY: (Math.random() - 0.5) * 0.3,
                opacity: Math.random() * 0.6 + 0.4, // Brighter
                twinkleSpeed: Math.random() * 0.02 + 0.01,
                twinkleOffset: Math.random() * Math.PI * 2,
                depth: Math.random() * 3 + 1
            });
        }
    }

    onMouseMove(e) {
        this.targetMouseX = e.clientX;
        this.targetMouseY = e.clientY;
    }

    animate() {
        requestAnimationFrame(() => this.animate());

        // Smooth mouse movement
        this.mouseX += (this.targetMouseX - this.mouseX) * 0.05;
        this.mouseY += (this.targetMouseY - this.mouseY) * 0.05;

        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        const time = Date.now() * 0.001;

        // Draw stars
        this.stars.forEach(star => {
            // Parallax effect
            const parallaxX = (this.mouseX - this.canvas.width / 2) * (star.depth * 0.015);
            const parallaxY = (this.mouseY - this.canvas.height / 2) * (star.depth * 0.015);

            // Update position
            star.x += star.speedX;
            star.y += star.speedY;

            // Wrap around
            if (star.x < 0) star.x = this.canvas.width;
            if (star.x > this.canvas.width) star.x = 0;
            if (star.y < 0) star.y = this.canvas.height;
            if (star.y > this.canvas.height) star.y = 0;

            // Twinkle
            const twinkle = Math.sin(time * star.twinkleSpeed + star.twinkleOffset) * 0.4 + 0.6;
            const opacity = star.opacity * twinkle;

            const finalX = star.x + parallaxX;
            const finalY = star.y + parallaxY;

            // Draw star with glow
            this.ctx.beginPath();
            this.ctx.arc(finalX, finalY, star.size, 0, Math.PI * 2);

            const gradient = this.ctx.createRadialGradient(
                finalX, finalY, 0,
                finalX, finalY, star.size * 4
            );

            gradient.addColorStop(0, `rgba(255, 255, 255, ${opacity})`);
            gradient.addColorStop(0.4, `rgba(168, 139, 250, ${opacity * 0.6})`);
            gradient.addColorStop(1, 'rgba(168, 139, 250, 0)');

            this.ctx.fillStyle = gradient;
            this.ctx.fill();
        });

        // Draw connections
        this.stars.forEach((star, i) => {
            const parallaxX1 = (this.mouseX - this.canvas.width / 2) * (star.depth * 0.015);
            const parallaxY1 = (this.mouseY - this.canvas.height / 2) * (star.depth * 0.015);

            this.stars.slice(i + 1).forEach(otherStar => {
                const parallaxX2 = (this.mouseX - this.canvas.width / 2) * (otherStar.depth * 0.015);
                const parallaxY2 = (this.mouseY - this.canvas.height / 2) * (otherStar.depth * 0.015);

                const dx = (star.x + parallaxX1) - (otherStar.x + parallaxX2);
                const dy = (star.y + parallaxY1) - (otherStar.y + parallaxY2);
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 120) {
                    this.ctx.beginPath();
                    this.ctx.moveTo(star.x + parallaxX1, star.y + parallaxY1);
                    this.ctx.lineTo(otherStar.x + parallaxX2, otherStar.y + parallaxY2);
                    this.ctx.strokeStyle = `rgba(168, 139, 250, ${(1 - distance / 120) * 0.3})`;
                    this.ctx.lineWidth = 0.8;
                    this.ctx.stroke();
                }
            });
        });
    }
}

// Initialize immediately
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new StarCluster();
    });
} else {
    new StarCluster();
}
