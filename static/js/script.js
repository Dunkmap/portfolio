document.addEventListener("DOMContentLoaded", () => {

  const toggle = document.getElementById("theme-toggle");
  const navToggle = document.getElementById("nav-toggle");
  const navList = document.getElementById("nav-list");
  const cursorBg = document.getElementById("cursor-bg");
  const yearEl = document.getElementById("year");

  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* -------------------------------------------------------
     THEME TOGGLE
  ------------------------------------------------------- */
  const stored = localStorage.getItem("theme");
  // Default to light theme if no preference is stored
  if (stored === "dark") {
    document.documentElement.setAttribute("data-theme", "dark");
  } else {
    document.documentElement.removeAttribute("data-theme");
    if (!stored) {
      localStorage.setItem("theme", "light");
    }
  }

  function refreshIcon(){
    const icon = toggle.querySelector("i");
    if (document.documentElement.getAttribute("data-theme")==="dark") {
      icon.setAttribute("data-feather","moon");
    } else {
      icon.setAttribute("data-feather","sun");
    }
    lucide.createIcons();
  }
  refreshIcon();

  toggle.addEventListener("click", () => {
    const isDark = document.documentElement.getAttribute("data-theme")==="dark";
    if (isDark){
      document.documentElement.removeAttribute("data-theme");
      localStorage.setItem("theme","light");
    } else {
      document.documentElement.setAttribute("data-theme","dark");
      localStorage.setItem("theme","dark");
    }
    refreshIcon();
  });

  /* -------------------------------------------------------
     MOBILE NAV
  ------------------------------------------------------- */
  navToggle.addEventListener("click", ()=> {
    navList.classList.toggle("open");
  });

  document.querySelectorAll(".nav-list a").forEach(link => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      document.querySelector(link.getAttribute("href"))
        .scrollIntoView({ behavior:"smooth" });
      navList.classList.remove("open");
    });
  });

  /* -------------------------------------------------------
     CURSOR FOLLOW GLOW - DISABLED
  ------------------------------------------------------- */
  /*
  let lx = 0, ly = 0;
  document.addEventListener("mousemove", (e)=>{
    const x = e.clientX - cursorBg.offsetWidth/2;
    const y = e.clientY - cursorBg.offsetHeight/2;
    lx += (x - lx)*0.15;
    ly += (y - ly)*0.15;
    cursorBg.style.transform = `translate(${lx}px,${ly}px)`;
  });
  */

  /* -------------------------------------------------------
     INTERACTIVE CIRCUIT GLOW EFFECT - DISABLED
  ------------------------------------------------------- */
  /*
  const canvas = document.getElementById("glow-canvas");
  const ctx = canvas.getContext("2d");
  
  // Set canvas size
  function resizeCanvas(){
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);

  // Create circuit line particles
  const particles = [];
  const particleCount = 120;
  
  for(let i = 0; i < particleCount; i++){
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.2,
      vy: (Math.random() - 0.5) * 0.2,
      size: Math.random() * 3 + 2,
      glow: 0
    });
  }

  let mouseX = 0, mouseY = 0;
  document.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  // Animation loop
  function animate(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Update and draw particles
    particles.forEach((p, i) => {
      // Move particle
      p.x += p.vx;
      p.y += p.vy;
      
      // Bounce off edges
      if(p.x < 0 || p.x > canvas.width) p.vx *= -1;
      if(p.y < 0 || p.y > canvas.height) p.vy *= -1;
      
      // Calculate distance from cursor
      const dx = mouseX - p.x;
      const dy = mouseY - p.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const maxDist = 200;
      
      // Glow intensity based on proximity to cursor
      if(dist < maxDist){
        p.glow = 1 - (dist / maxDist);
      } else {
        p.glow *= 0.92; // Fade out
      }
      
      // Draw particle with glow
      if(p.glow > 0.01){
        const isDark = document.documentElement.getAttribute("data-theme") === "dark";
        const glowColor = isDark ? "255, 255, 255" : "74, 144, 226";
        
        // Outer glow
        ctx.beginPath();
        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, 30 * p.glow);
        gradient.addColorStop(0, `rgba(${glowColor}, ${p.glow * 0.7})`);
        gradient.addColorStop(1, `rgba(${glowColor}, 0)`);
        ctx.fillStyle = gradient;
        ctx.arc(p.x, p.y, 30 * p.glow, 0, Math.PI * 2);
        ctx.fill();
        
        // Core particle
        ctx.beginPath();
        ctx.fillStyle = `rgba(${glowColor}, ${p.glow})`;
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }
      
      // Draw connecting lines between nearby particles
      particles.forEach((p2, j) => {
        if(i >= j) return;
        const dx2 = p.x - p2.x;
        const dy2 = p.y - p2.y;
        const dist2 = Math.sqrt(dx2 * dx2 + dy2 * dy2);
        
        if(dist2 < 150){
          const isDark = document.documentElement.getAttribute("data-theme") === "dark";
          const lineColor = isDark ? "255, 255, 255" : "74, 144, 226";
          const avgGlow = (p.glow + p2.glow) / 2;
          const opacity = (1 - dist2 / 150) * avgGlow * 0.5;
          
          if(opacity > 0.01){
            ctx.beginPath();
            ctx.strokeStyle = `rgba(${lineColor}, ${opacity})`;
            ctx.lineWidth = 2;
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      });
    });
    
    requestAnimationFrame(animate);
  }
  
  animate();
  */

  /* -------------------------------------------------------
     ScrollReveal
  ------------------------------------------------------- */
  if (window.ScrollReveal){
    ScrollReveal().reveal("[data-section]", {
      distance:"20px",
      opacity:0,
      origin:"bottom",
      duration:600,
      interval:90,
      easing:"cubic-bezier(.2,.9,.3,1)",
      beforeReveal: el => el.classList.add("in-view")
    });
  }

  /* -------------------------------------------------------
     TIMELINE SCROLL ANIMATIONS
  ------------------------------------------------------- */
  const timelineItems = document.querySelectorAll('.timeline-item');
  
  const observerOptions = {
    threshold: 0.2,
    rootMargin: '0px 0px -100px 0px'
  };

  const timelineObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
      }
    });
  }, observerOptions);

  timelineItems.forEach(item => {
    timelineObserver.observe(item);
  });

  /* -------------------------------------------------------
     CONTACT FORM SUBMISSION
  ------------------------------------------------------- */
  const form = document.querySelector(".contact-form");
  if (form){
    form.addEventListener("submit", (e)=>{
      const data = new FormData(form);
      const name = data.get("name").trim();
      const email = data.get("email").trim();
      const message = data.get("message").trim();

      if (!name || !email || !message){
        e.preventDefault();
        alert("Please fill all fields.");
        return;
      }

      // Let the form submit normally to Flask backend
      // Form will POST to /contact route
    });
  }

  lucide.createIcons();
});
