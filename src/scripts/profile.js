/**
 * Profile Page JavaScript
 * 
 * This script handles the therapist profile page functionality:
 * - Loading therapist data
 * - Displaying therapist information
 * - Handling booking process
 * - Processing payments using Stripe
 */

document.addEventListener('DOMContentLoaded', function() {
    // Check if we have a database module loaded
    if (!window.Database) {
        console.error('Database module not found!');
        return;
    }

    // Get therapist ID from URL query parameter or simulated match data
    const params = new URLSearchParams(window.location.search);
    const therapistId = params.get('id') || 't1'; // Default to t1 if no ID provided
    
    // Get matching data from localStorage (from the questionnaire)
    const matchingData = localStorage.getItem('matching_form_data');
    const formData = matchingData ? JSON.parse(matchingData) : null;
    
    // If we have form data but no specific therapist ID, use the matching algorithm
    let therapist;
    if (formData && !params.get('id')) {
        therapist = Database.findBestMatch(formData);
    } else {
        therapist = Database.getTherapistById(therapistId);
    }
    
    if (!therapist) {
        showError('Terapeuta no encontrado. Por favor, intente de nuevo.');
        return;
    }
    
    // Load therapist information into the page
    loadTherapistProfile(therapist);
    
    // Set up booking form event handlers
    setupBookingForm(therapist);
    
    // Initialize Stripe for payment processing (in a real app)
    setupStripePayment(therapist);

    // Add event listeners to the static date options we added to the HTML
    const dateOptions = document.querySelectorAll('.date-option');
    dateOptions.forEach(dateOption => {
        dateOption.addEventListener('click', function() {
            // Clear previous selections
            document.querySelectorAll('.date-option').forEach(el => {
                el.classList.remove('selected');
            });
            
            // Mark this date as selected
            this.classList.add('selected');
            
            // Get the date and times from this option
            const date = this.querySelector('.date').textContent;
            const timesText = this.querySelector('.times').textContent;
            const times = timesText.split('•').map(time => time.trim());
            
            // Show the time selection options
            showTimeSelection(times, date);
        });
    });
});

/**
 * Load therapist information into the profile page
 */
function loadTherapistProfile(therapist) {
    // Main profile header - find elements safely
    const nameElement = document.querySelector('.profile-info h1') || 
                        document.querySelector('.therapist-name') ||
                        document.querySelector('.name-rating h1');
    
    const titleElement = document.querySelector('.specialization') || 
                        document.querySelector('.therapist-title');
    
    // Update elements if they exist
    if (nameElement) nameElement.textContent = therapist.name;
    if (titleElement) titleElement.textContent = therapist.title;
    
    // If there's a match score, display it
    if (therapist.matchScore) {
        const matchElement = document.querySelector('.match-score .match-circle span') || 
                            document.querySelector('.match-score');
        if (matchElement) {
            if (matchElement.tagName === 'SPAN') {
                matchElement.textContent = `${therapist.matchScore}%`;
            } else {
                matchElement.textContent = `${therapist.matchScore}% compatibilidad`;
                matchElement.style.display = 'inline-block';
            }
        }
    }
    
    // About section - find first paragraph in profile section about therapist
    const bioElement = document.querySelector('.profile-section p') || 
                      document.querySelector('.therapist-bio');
    if (bioElement) bioElement.textContent = therapist.bio;
    
    // Rest of the function remains the same, but with null checks
    if (therapist.bioExtended) {
        const bioExtended = document.querySelector('.bio-extended');
        if (bioExtended) bioExtended.textContent = therapist.bioExtended;
    }
    
    if (therapist.approachDetails) {
        const approachDetails = document.querySelector('.approach-details');
        if (approachDetails) approachDetails.textContent = therapist.approachDetails;
    }
    
    // Specialties - find tags or create a list
    const specialtiesList = document.querySelector('.specialties-list');
    const tagsContainer = document.querySelector('.tags');
    
    if (specialtiesList && therapist.specialties) {
        specialtiesList.innerHTML = '';
        therapist.specialties.forEach(specialty => {
            const li = document.createElement('li');
            li.textContent = specialty;
            specialtiesList.appendChild(li);
        });
    } else if (tagsContainer && therapist.specialties) {
        // If we have a tags container but no specialties list, update the tags
        tagsContainer.innerHTML = '';
        therapist.specialties.forEach(specialty => {
            const tag = document.createElement('span');
            tag.className = 'tag';
            tag.textContent = specialty;
            tagsContainer.appendChild(tag);
        });
    }
    
    // Languages
    const languagesList = document.querySelector('.languages-list');
    const languageText = document.querySelector('.language');
    
    if (languagesList && therapist.languages) {
        languagesList.innerHTML = '';
        therapist.languages.forEach(language => {
            const li = document.createElement('li');
            li.textContent = language;
            languagesList.appendChild(li);
        });
    } else if (languageText && therapist.languages) {
        languageText.textContent = therapist.languages.join(', ');
    }
    
    // Education
    const educationList = document.querySelector('.education-list') || 
                          document.querySelector('.credentials-list');
    if (educationList && therapist.education) {
        // Keep existing education items if no education data is provided
        if (educationList.children.length === 0 || therapist.education.length > 0) {
            educationList.innerHTML = '';
            therapist.education.forEach(edu => {
                const li = document.createElement('li');
                if (educationList.classList.contains('credentials-list')) {
                    // Format for credentials-list
                    li.innerHTML = `
                        <span class="credential-year">${edu.year}</span>
                        <div class="credential-detail">
                            <h3>${edu.title}</h3>
                            <p>${edu.institution}</p>
                        </div>
                    `;
                } else {
                    // Simple format
                    li.innerHTML = `<strong>${edu.year}</strong>: ${edu.title}, <em>${edu.institution}</em>`;
                }
                educationList.appendChild(li);
            });
        }
    }
    
    // Reviews
    const reviewsList = document.querySelector('.reviews-list') || 
                        document.querySelector('.reviews');
    if (reviewsList && therapist.reviews) {
        // Only update if we have reviews data
        if (therapist.reviews.length > 0) {
            // Clear existing reviews but keep any extra elements like "see more" buttons
            const extraElements = Array.from(reviewsList.children).filter(
                el => !el.classList.contains('review')
            );
            reviewsList.innerHTML = '';
            
            // Add new reviews
            therapist.reviews.forEach(review => {
                const reviewElement = document.createElement('div');
                reviewElement.className = 'review';
                
                // Create rating stars
                const starsHtml = Array(5).fill(0).map((_, i) => 
                    `<span class="star ${i < review.rating ? 'filled' : ''}">★</span>`
                ).join('');
                
                // Check which review format to use
                if (reviewsList.classList.contains('reviews')) {
                    // Format for the reviews container
                    reviewElement.innerHTML = `
                        <div class="review-header">
                            <h3>${review.name}</h3>
                            <span class="review-stars">★★★★★</span>
                        </div>
                        <p class="review-date">${review.date}</p>
                        <p class="review-text">${review.text}</p>
                    `;
                } else {
                    // Original format
                    reviewElement.innerHTML = `
                        <div class="review-header">
                            <span class="reviewer-name">${review.name}</span>
                            <span class="review-date">${review.date}</span>
                        </div>
                        <div class="review-rating">${starsHtml}</div>
                        <p class="review-text">${review.text}</p>
                    `;
                }
                
                reviewsList.appendChild(reviewElement);
            });
            
            // Add back extra elements
            extraElements.forEach(el => reviewsList.appendChild(el));
        }
    }
    
    // Session types
    const sessionTypes = document.querySelector('.session-types');
    if (sessionTypes && therapist.sessionTypes) {
        sessionTypes.innerHTML = '';
        therapist.sessionTypes.forEach((session, index) => {
            const sessionElement = document.createElement('div');
            sessionElement.className = 'session-type';
            
            const priceText = session.price === 0 ? 
                'Gratis' : 
                `${session.price} ${session.currency}`;
            
            sessionElement.innerHTML = `
                <input type="radio" name="session-type" id="session-${session.id}" 
                       value="${session.id}" ${index === 0 ? 'checked' : ''}>
                <label for="session-${session.id}">
                    <h3>${session.name}</h3>
                    <p>${session.duration} • ${priceText}</p>
                </label>
            `;
            
            sessionTypes.appendChild(sessionElement);
        });
    }
    
    // Availability dates
    const availabilityDates = document.querySelector('.availability-dates');
    if (availabilityDates && therapist.availability) {
        availabilityDates.innerHTML = '';
        therapist.availability.forEach(slot => {
            const dateOption = document.createElement('div');
            dateOption.className = 'date-option';
            dateOption.innerHTML = `
                <p class="date">${slot.date}</p>
                <p class="times">${slot.times.join(' • ')}</p>
            `;
            // Add click event to select this date
            dateOption.addEventListener('click', function() {
                document.querySelectorAll('.date-option').forEach(el => {
                    el.classList.remove('selected');
                });
                this.classList.add('selected');
                
                // Show time selection options
                showTimeSelection(slot.times, slot.date);
            });
            
            availabilityDates.appendChild(dateOption);
        });
    }
}

/**
 * Display time selection options for a selected date
 */
function showTimeSelection(times, date) {
    const timeSelectionDiv = document.querySelector('.time-selection');
    if (!timeSelectionDiv) return;
    
    timeSelectionDiv.innerHTML = `<h3>Horarios Disponibles para ${date}</h3>`;
    
    const timesList = document.createElement('div');
    timesList.className = 'times-list';
    
    times.forEach(time => {
        const timeBtn = document.createElement('button');
        timeBtn.className = 'time-option';
        timeBtn.textContent = time;
        timeBtn.dataset.time = time;
        timeBtn.dataset.date = date;
        
        timeBtn.addEventListener('click', function() {
            document.querySelectorAll('.time-option').forEach(el => {
                el.classList.remove('selected');
            });
            this.classList.add('selected');
            
            // Enable the booking button now that a time is selected
            const bookButton = document.querySelector('#book-button');
            if (bookButton) {
                bookButton.disabled = false;
            }
        });
        
        timesList.appendChild(timeBtn);
    });
    
    timeSelectionDiv.appendChild(timesList);
    timeSelectionDiv.style.display = 'block';
}

/**
 * Set up the booking form and its event handlers
 */
function setupBookingForm(therapist) {
    const bookingForm = document.querySelector('#booking-form');
    if (!bookingForm) return;
    
    const bookButton = document.querySelector('#book-button');
    if (bookButton) {
        bookButton.disabled = true; // Initially disabled until time is selected
        
        bookButton.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Get selected session type
            const selectedSessionType = document.querySelector('input[name="session-type"]:checked');
            if (!selectedSessionType) {
                showError('Por favor, seleccione un tipo de sesión.');
                return;
            }
            
            // Get selected date/time
            const selectedTime = document.querySelector('.time-option.selected');
            if (!selectedTime) {
                showError('Por favor, seleccione un horario para su sesión.');
                return;
            }
            
            const sessionType = therapist.sessionTypes.find(
                type => type.id === selectedSessionType.value
            );
            
            // If free session, complete booking directly
            if (sessionType.price === 0) {
                completeBooking({
                    therapistId: therapist.id,
                    therapistName: therapist.name,
                    sessionType: sessionType.id,
                    sessionName: sessionType.name,
                    duration: sessionType.duration,
                    date: selectedTime.dataset.date,
                    time: selectedTime.dataset.time,
                    price: 0,
                    currency: sessionType.currency
                });
            } else {
                // For paid sessions, show payment form
                showPaymentForm(therapist, {
                    sessionType: sessionType,
                    date: selectedTime.dataset.date,
                    time: selectedTime.dataset.time
                });
            }
        });
    }
}

/**
 * Show payment form for paid sessions
 */
function showPaymentForm(therapist, bookingDetails) {
    // In a real application, this would be integrated with Stripe Elements
    // For this demo, we'll use a simple payment form
    
    const paymentContainer = document.querySelector('.payment-container');
    if (!paymentContainer) return;
    
    // Update payment summary
    const summary = paymentContainer.querySelector('.payment-summary');
    if (summary) {
        summary.innerHTML = `
            <h3>Resumen de la Reserva</h3>
            <p><strong>Terapeuta:</strong> ${therapist.name}</p>
            <p><strong>Sesión:</strong> ${bookingDetails.sessionType.name}</p>
            <p><strong>Fecha:</strong> ${bookingDetails.date}</p>
            <p><strong>Hora:</strong> ${bookingDetails.time}</p>
            <p><strong>Duración:</strong> ${bookingDetails.sessionType.duration}</p>
            <p class="payment-amount"><strong>Total:</strong> ${bookingDetails.sessionType.price} ${bookingDetails.sessionType.currency}</p>
        `;
    }
    
    // Show the payment container
    paymentContainer.style.display = 'block';
    
    // Scroll to payment form
    paymentContainer.scrollIntoView({ behavior: 'smooth' });
    
    // Set up payment form submission
    const paymentForm = document.querySelector('#payment-form');
    if (paymentForm) {
        paymentForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // In a real app, we would process the payment with Stripe here
            // For this demo, we'll simulate a successful payment
            
            // Show loading state
            const submitButton = this.querySelector('button[type="submit"]');
            if (submitButton) {
                submitButton.disabled = true;
                submitButton.textContent = 'Procesando...';
            }
            
            // Simulate payment processing delay
            setTimeout(() => {
                // Complete the booking
                completeBooking({
                    therapistId: therapist.id,
                    therapistName: therapist.name,
                    sessionType: bookingDetails.sessionType.id,
                    sessionName: bookingDetails.sessionType.name,
                    duration: bookingDetails.sessionType.duration,
                    date: bookingDetails.date,
                    time: bookingDetails.time,
                    price: bookingDetails.sessionType.price,
                    currency: bookingDetails.sessionType.currency,
                    paymentStatus: 'paid'
                });
            }, 2000);
        });
    }
}

/**
 * Initialize Stripe payment processing
 */
function setupStripePayment(therapist) {
    // In a real application, we would initialize Stripe here
    // For this demo, we'll simulate Stripe integration
    
    // Sample code for reference (would be used in a real implementation):
    /*
    // Initialize Stripe with your publishable key
    const stripe = Stripe('pk_test_your_publishable_key');
    
    // Create Stripe Elements
    const elements = stripe.elements();
    
    // Create card element and mount it
    const cardElement = elements.create('card');
    cardElement.mount('#card-element');
    
    // Handle validation errors
    cardElement.on('change', function(event) {
        const displayError = document.getElementById('card-errors');
        if (event.error) {
            displayError.textContent = event.error.message;
        } else {
            displayError.textContent = '';
        }
    });
    */
}

/**
 * Save booking and display confirmation
 */
function completeBooking(bookingDetails) {
    // In a real app, we would create a proper user first
    // For this demo, we'll create a simple user or use existing
    const user = {
        email: 'cliente@ejemplo.com',
        name: 'Cliente Demo'
    };
    
    // Save user
    const savedUser = Database.saveUser(user);
    
    // Create booking with user ID
    const booking = {
        ...bookingDetails,
        userId: savedUser.id,
        userName: savedUser.name
    };
    
    // Save booking
    Database.saveBooking(booking);
    
    // Hide booking and payment forms
    const bookingContainer = document.querySelector('.booking-card');
    const paymentContainer = document.querySelector('.payment-container');
    
    if (bookingContainer) bookingContainer.style.display = 'none';
    if (paymentContainer) paymentContainer.style.display = 'none';
    
    // Show confirmation
    const confirmation = document.querySelector('.booking-confirmation');
    if (confirmation) {
        confirmation.innerHTML = `
            <div class="confirmation-icon">✓</div>
            <h2>¡Reserva Confirmada!</h2>
            <p>Has reservado una sesión de ${bookingDetails.sessionName} con ${bookingDetails.therapistName}.</p>
            <p><strong>Fecha:</strong> ${bookingDetails.date}</p>
            <p><strong>Hora:</strong> ${bookingDetails.time}</p>
            <p>Recibirás un correo de confirmación con los detalles y el enlace para unirte a la sesión.</p>
            <button class="btn btn-primary" onclick="window.location.href='index.html'">Volver al Inicio</button>
        `;
        
        confirmation.style.display = 'block';
        confirmation.scrollIntoView({ behavior: 'smooth' });
    }
}

/**
 * Display error message to the user
 */
function showError(message) {
    // Create error element if it doesn't exist
    let errorElement = document.querySelector('.error-message');
    
    if (!errorElement) {
        errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        
        // Insert after the booking form
        const bookingForm = document.querySelector('#booking-form');
        if (bookingForm && bookingForm.parentNode) {
            bookingForm.parentNode.insertBefore(errorElement, bookingForm.nextSibling);
        } else {
            // Fallback to body
            document.body.appendChild(errorElement);
        }
    }
    
    // Set error message and show
    errorElement.textContent = message;
    errorElement.style.display = 'block';
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
        errorElement.style.display = 'none';
    }, 5000);
}