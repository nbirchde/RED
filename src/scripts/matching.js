// Matching Form Functionality

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('matching-form');
    const steps = Array.from(document.querySelectorAll('.form-step'));
    const progressFill = document.querySelector('.progress-fill');
    const progressSteps = Array.from(document.querySelectorAll('.progress-step'));
    const nextButtons = document.querySelectorAll('.next-step');
    const prevButtons = document.querySelectorAll('.prev-step');
    const formContainer = document.querySelector('.matching-container'); // Get the container element
    
    let currentStep = 0;
    
    // Initialize form
    updateProgressBar();
    
    // Next button event listeners
    nextButtons.forEach(button => {
        button.addEventListener('click', () => {
            if (validateStep(currentStep)) {
                currentStep++;
                updateForm();
            }
        });
    });
    
    // Previous button event listeners
    prevButtons.forEach(button => {
        button.addEventListener('click', () => {
            currentStep--;
            updateForm();
        });
    });
    
    // Form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (validateStep(currentStep)) {
            // Collect all form data
            const formData = new FormData(form);
            const formValues = Object.fromEntries(formData.entries());
            
            // For checkbox groups, get all selected values
            const therapyTopics = formData.getAll('therapy-topics');
            formValues['therapy-topics'] = therapyTopics;
            
            // Save form data to localStorage for database simulation
            localStorage.setItem('matching_form_data', JSON.stringify(formValues));
            
            // In a real application, this would send the data to the server
            console.log('Form submitted with values:', formValues);
            
            // Show loading indicator
            showLoadingOverlay('Buscando terapeutas compatibles...');
            
            // Simulate API request with timeout
            setTimeout(() => {
                // Redirect to therapist profile page
                window.location.href = 'therapist-profile.html';
            }, 2000);
        }
    });
    
    // Update form display based on current step
    function updateForm() {
        // Update steps visibility
        steps.forEach((step, index) => {
            step.classList.toggle('active', index === currentStep);
        });
        
        // Update progress bar and steps
        updateProgressBar();
        
        // Scroll to the current step with an offset to account for the fixed header
        // This provides a better user experience with proper spacing
        setTimeout(() => {
            const scrollOptions = { 
                behavior: 'smooth',
                block: 'start' 
            };
            
            // Calculate the offset (height of header + some padding)
            const headerHeight = document.querySelector('.site-header')?.offsetHeight || 80;
            const scrollPadding = 20;
            
            // Scroll to container with offset
            if (formContainer) {
                const containerTop = formContainer.getBoundingClientRect().top + window.pageYOffset;
                window.scrollTo({
                    top: containerTop - headerHeight - scrollPadding,
                    behavior: 'smooth'
                });
            } else {
                // Fallback to scrolling the current step element
                const questionElement = steps[currentStep];
                if (questionElement) {
                    const elementTop = questionElement.getBoundingClientRect().top + window.pageYOffset;
                    window.scrollTo({
                        top: elementTop - headerHeight - scrollPadding,
                        behavior: 'smooth'
                    });
                }
            }
        }, 50); // Small delay to ensure DOM is updated
    }
    
    // Update progress bar and steps indicators
    function updateProgressBar() {
        const progress = ((currentStep + 1) / steps.length) * 100;
        progressFill.style.width = `${progress}%`;
        
        progressSteps.forEach((step, index) => {
            if (index < currentStep) {
                step.classList.add('completed');
                step.classList.remove('active');
            } else if (index === currentStep) {
                step.classList.add('active');
                step.classList.remove('completed');
            } else {
                step.classList.remove('active', 'completed');
            }
        });
    }
    
    // Validate current step before proceeding
    function validateStep(stepIndex) {
        const currentStepElement = steps[stepIndex];
        let isValid = true;
        
        // Validation logic for each step
        switch (stepIndex) {
            case 0:
                // First step - who is therapy for (radio buttons)
                // At least one should be selected by default, so no validation needed
                break;
                
            case 1:
                // Second step - therapy topics (checkboxes)
                const selectedTopics = currentStepElement.querySelectorAll('input[name="therapy-topics"]:checked');
                if (selectedTopics.length === 0) {
                    alert('Por favor, selecciona al menos un tema que te gustaría abordar en terapia.');
                    isValid = false;
                }
                break;
                
            case 2:
                // Third step - therapy approach (radio buttons)
                // At least one should be selected by default, so no validation needed
                break;
                
            case 3:
                // Fourth step - therapist preferences (radio buttons)
                // All have default values, so no validation needed
                break;
                
            case 4:
                // Fifth step - final details (selects and textarea)
                const availability = currentStepElement.querySelector('#availability').value;
                const frequency = currentStepElement.querySelector('#expected-frequency').value;
                const previousTherapy = currentStepElement.querySelector('#previous-therapy').value;
                
                if (!availability || !frequency || !previousTherapy) {
                    alert('Por favor, completa todos los campos requeridos.');
                    isValid = false;
                }
                break;
        }
        
        return isValid;
    }
    
    // Show loading overlay with custom message
    function showLoadingOverlay(message) {
        // Create loading overlay element
        const overlay = document.createElement('div');
        overlay.className = 'loading-overlay';
        
        // Create loading spinner and message
        overlay.innerHTML = `
            <div class="loading-container">
                <div class="loading-spinner"></div>
                <p class="loading-message">${message}</p>
            </div>
        `;
        
        // Add to document
        document.body.appendChild(overlay);
        
        // Add styling if needed
        const style = document.createElement('style');
        style.textContent = `
            .loading-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(255, 255, 255, 0.9);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 9999;
            }
            .loading-container {
                text-align: center;
                padding: 20px;
                border-radius: 10px;
                background-color: white;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
            }
            .loading-spinner {
                margin: 0 auto 15px;
                width: 40px;
                height: 40px;
                border: 4px solid rgba(0, 130, 255, 0.1);
                border-radius: 50%;
                border-top-color: #0082ff;
                animation: spin 1s ease-in-out infinite;
            }
            .loading-message {
                font-size: 18px;
                color: #333;
                margin: 0;
            }
            @keyframes spin {
                to { transform: rotate(360deg); }
            }
        `;
        document.head.appendChild(style);
    }
});