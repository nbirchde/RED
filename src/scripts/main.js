// Main JavaScript for RED Platform

document.addEventListener('DOMContentLoaded', function() {
    // Smooth scrolling for anchor links
    const smoothScrollLinks = document.querySelectorAll('a[href^="#"]');
    
    for (const link of smoothScrollLinks) {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80, // Offset for fixed header
                    behavior: 'smooth'
                });
            }
        });
    }
    
    // Mobile navigation toggle (to be implemented with hamburger menu)
    // For now, we'll just set up basic interactive elements
    
    // Add animation class to elements when they come into view
    const animateOnScroll = function() {
        const elements = document.querySelectorAll('.step, .feature-card');
        
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (elementPosition < windowHeight - 100) {
                element.classList.add('animate-in');
            }
        });
    };
    
    // Initialize animations
    window.addEventListener('scroll', animateOnScroll);
    animateOnScroll(); // Run once on page load
    
    // Prototype user interactions - for demonstration purposes
    const authButtons = document.querySelectorAll('.auth-buttons a, .hero-buttons a');
    
    authButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            alert('Esta funcionalidad estará disponible en la versión completa. | This functionality will be available in the full version.');
        });
    });
});