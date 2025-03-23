// Matching Form Functionality

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('matching-form');
    const steps = Array.from(document.querySelectorAll('.form-step'));
    const progressFill = document.querySelector('.progress-fill');
    const progressSteps = Array.from(document.querySelectorAll('.progress-step'));
    const nextButtons = document.querySelectorAll('.next-step');
    const prevButtons = document.querySelectorAll('.prev-step');
    
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
            
            // In a real application, this would send the data to the server
            console.log('Form submitted with values:', formValues);
            
            // For prototype purposes, redirect to therapist profile
            window.location.href = 'therapist-profile.html';
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
        
        // Scroll to top of form
        form.scrollIntoView({ behavior: 'smooth' });
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
});