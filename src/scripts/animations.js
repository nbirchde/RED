/**
 * Animations for RED Platform - Modern Design
 * 
 * This script handles animations for interactive elements throughout the site
 * to enhance the modern, elegant design.
 */

document.addEventListener('DOMContentLoaded', function() {
    // Reveal animations for step and feature cards
    const animatedElements = document.querySelectorAll('.step, .feature-card');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, { threshold: 0.2 });
    
    animatedElements.forEach(el => {
        observer.observe(el);
    });

    // Smooth hover effects for cards
    const cards = document.querySelectorAll('.feature-card, .step, .sidebar-card, .profile-section');
    
    cards.forEach(card => {
        card.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            // Subtle 3D effect with transform
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const moveX = (x - centerX) / centerX * 3;
            const moveY = (y - centerY) / centerY * 3;
            
            this.style.transform = `translateY(-5px) rotateX(${-moveY}deg) rotateY(${moveX}deg)`;
            this.style.boxShadow = `0 15px 35px rgba(140, 111, 255, 0.15)`;
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = '';
            this.style.boxShadow = '';
        });
    });

    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            
            if (targetId !== '#') {
                e.preventDefault();
                
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - 100,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // Animated gradient background effect for hero section
    const hero = document.querySelector('.hero');
    if (hero) {
        let angle = 135;
        
        setInterval(() => {
            angle = (angle + 1) % 360;
            hero.style.backgroundImage = `linear-gradient(${angle}deg, var(--light), #edeff6)`;
        }, 100);
    }

    // Add floating effect to relevant elements
    const floatingElements = document.querySelectorAll('.match-circle, .step-icon, .confirmation-icon');
    
    floatingElements.forEach(el => {
        // Random starting point for the animation
        const delay = Math.random() * 2;
        el.style.animation = `float 3s ease-in-out ${delay}s infinite`;
    });

    // Add custom animation for the buttons
    const buttons = document.querySelectorAll('.btn');
    
    buttons.forEach(btn => {
        btn.addEventListener('mouseenter', function() {
            this.style.transition = 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
        });
    });

    // Add ripple effect to buttons
    buttons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const ripple = document.createElement('span');
            ripple.classList.add('ripple');
            ripple.style.left = `${x}px`;
            ripple.style.top = `${y}px`;
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
});

// Add keyframe animation for floating effect
const style = document.createElement('style');
style.textContent = `
@keyframes float {
    0% {
        transform: translateY(0);
    }
    50% {
        transform: translateY(-10px);
    }
    100% {
        transform: translateY(0);
    }
}

.ripple {
    position: absolute;
    background-color: rgba(255, 255, 255, 0.7);
    border-radius: 50%;
    transform: scale(0);
    animation: ripple 0.6s linear;
    pointer-events: none;
}

@keyframes ripple {
    to {
        transform: scale(4);
        opacity: 0;
    }
}
`;
document.head.appendChild(style);