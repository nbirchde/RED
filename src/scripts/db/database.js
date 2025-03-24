/**
 * Database Simulation Module
 * This module simulates a database using localStorage for development purposes.
 * In production, this would be replaced with a real database and API calls.
 */

// Create a namespace for our Database functions
const Database = (function() {
    // Database keys
    const THERAPISTS_KEY = 'red_therapists';
    const USERS_KEY = 'red_users';
    const BOOKINGS_KEY = 'red_bookings';
    const MATCHING_DATA_KEY = 'matching_form_data';
    
    // Initialize database with sample data if it doesn't exist
    function init() {
        if (!localStorage.getItem(THERAPISTS_KEY)) {
            // Sample therapist data
            const sampleTherapists = [
                {
                    id: 't1',
                    name: 'Dra. Isabel Méndez',
                    title: 'Psicóloga Clínica',
                    approach: 'Terapia Cognitivo-Conductual',
                    bio: 'Soy psicóloga clínica especializada en terapia cognitivo-conductual con más de 15 años de experiencia. Me apasiona ayudar a las personas a superar la ansiedad, depresión y traumas, construyendo relaciones saludables y descubriendo su mejor versión.',
                    bioExtended: 'Mi enfoque terapéutico se centra en entender tus necesidades únicas y crear un espacio seguro donde puedas explorar tus pensamientos y emociones sin juicio. Trabajo con personas de todas las edades y orígenes, con experiencia especial en la comunidad LGBTQ+.',
                    approachDetails: 'Mi práctica se basa principalmente en la terapia cognitivo-conductual (TCC), que nos ayuda a identificar y cambiar patrones de pensamiento negativos que afectan tus emociones y comportamiento. También incorporo elementos de terapia de aceptación y compromiso (ACT), mindfulness y técnicas de reducción de estrés, terapia centrada en soluciones y terapia narrativa.',
                    experience: '15 años de experiencia',
                    languages: ['Español', 'Inglés'],
                    specialties: ['Ansiedad', 'Depresión', 'Trauma', 'Relaciones', 'LGBTQ+'],
                    education: [
                        {
                            year: '2008',
                            title: 'Doctorado en Psicología Clínica',
                            institution: 'Universidad Autónoma de Madrid'
                        },
                        {
                            year: '2004',
                            title: 'Máster en Terapia Cognitivo-Conductual',
                            institution: 'Universidad Complutense de Madrid'
                        },
                        {
                            year: '2002',
                            title: 'Licenciatura en Psicología',
                            institution: 'Universidad de Barcelona'
                        }
                    ],
                    rating: 4.9,
                    reviews: [
                        {
                            name: 'Carlos R.',
                            rating: 5,
                            date: 'Marzo 2025',
                            text: 'La Dra. Méndez ha sido fundamental en mi proceso de recuperación. Su enfoque y técnicas me han ayudado a manejar mi ansiedad de formas que nunca creí posibles. Siempre me siento escuchado y comprendido.'
                        },
                        {
                            name: 'Laura M.',
                            rating: 5,
                            date: 'Febrero 2025',
                            text: 'Después de años luchando con depresión, finalmente encontré en Isabel una terapeuta que realmente entiende mis necesidades. Su paciencia y perspicacia han sido invaluables en mi camino hacia la salud mental.'
                        },
                        {
                            name: 'Miguel A.',
                            rating: 5,
                            date: 'Enero 2025',
                            text: 'Como persona LGBTQ+, encontrar un terapeuta que realmente entienda ha sido difícil. Isabel crea un espacio increíblemente seguro y acogedor. Su enfoque en TCC me ha dado herramientas prácticas para enfrentar mis problemas diarios.'
                        }
                    ],
                    matchScore: 95,
                    availability: [
                        {
                            date: 'Lunes, 24 Mar',
                            times: ['10:00', '14:30']
                        },
                        {
                            date: 'Martes, 25 Mar',
                            times: ['9:00', '13:00', '17:30']
                        },
                        {
                            date: 'Jueves, 27 Mar',
                            times: ['11:30', '16:00']
                        }
                    ],
                    sessionTypes: [
                        {
                            id: 'intro',
                            name: 'Sesión Introductoria',
                            duration: '30 minutos',
                            price: 0,
                            currency: 'USD'
                        },
                        {
                            id: 'standard',
                            name: 'Sesión Estándar',
                            duration: '50 minutos',
                            price: 60,
                            currency: 'USD'
                        },
                        {
                            id: 'package',
                            name: 'Paquete de 4 Sesiones',
                            duration: '50 minutos/sesión',
                            price: 220,
                            currency: 'USD'
                        }
                    ]
                },
                {
                    id: 't2',
                    name: 'Dr. Alejandro Ruiz',
                    title: 'Psicólogo Clínico',
                    approach: 'Terapia Humanista',
                    bio: 'Psicólogo clínico con 12 años de experiencia en terapia humanista. Me especializo en ayudar a personas que enfrentan crisis existenciales, búsqueda de propósito y transiciones de vida importantes.',
                    experience: '12 años de experiencia',
                    languages: ['Español', 'Francés'],
                    specialties: ['Autoestima', 'Propósito', 'Transiciones', 'Relaciones'],
                    rating: 4.8,
                    matchScore: 82,
                    sessionTypes: [
                        {
                            id: 'intro',
                            name: 'Sesión Introductoria',
                            duration: '30 minutos',
                            price: 0,
                            currency: 'USD'
                        },
                        {
                            id: 'standard',
                            name: 'Sesión Estándar',
                            duration: '50 minutos',
                            price: 55,
                            currency: 'USD'
                        }
                    ]
                },
                {
                    id: 't3',
                    name: 'Dra. Carmen Vega',
                    title: 'Psicoterapeuta',
                    approach: 'Terapia Psicodinámica',
                    bio: 'Psicoterapeuta especializada en terapia psicodinámica con 20 años de experiencia. Trabajo con personas que buscan una comprensión profunda de sus patrones emocionales y relacionales.',
                    experience: '20 años de experiencia',
                    languages: ['Español'],
                    specialties: ['Trauma Infantil', 'Duelo', 'Relaciones', 'Identidad'],
                    rating: 4.9,
                    matchScore: 79,
                    sessionTypes: [
                        {
                            id: 'intro',
                            name: 'Sesión Introductoria',
                            duration: '30 minutos',
                            price: 0,
                            currency: 'USD'
                        },
                        {
                            id: 'standard',
                            name: 'Sesión Estándar',
                            duration: '50 minutos',
                            price: 65,
                            currency: 'USD'
                        }
                    ]
                }
            ];
            
            // Store therapists data
            localStorage.setItem(THERAPISTS_KEY, JSON.stringify(sampleTherapists));
        }
    }
    
    // Initialize on load
    init();
    
    // Public API
    return {
        // Generic CRUD operations
        get: function(key) {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : null;
        },
        
        set: function(key, value) {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        },
        
        remove: function(key) {
            localStorage.removeItem(key);
            return true;
        },
        
        getTherapists: function() {
            return this.get(THERAPISTS_KEY) || [];
        },
        
        getTherapistById: function(id) {
            const therapists = this.getTherapists();
            return therapists.find(therapist => therapist.id === id) || null;
        },
        
        findBestMatch: function(formData) {
            // In a real application, this would be a sophisticated matching algorithm
            // For this simulation, we'll implement a basic matching based on specialties
            const therapists = this.getTherapists();
            
            // Parse therapy topics from form data
            const therapyTopics = formData['therapy-topics'] || [];
            const therapistGender = formData['therapist-gender'] || 'no-preference';
            
            // Score each therapist based on matching criteria
            const scoredTherapists = therapists.map(therapist => {
                let score = 0;
                
                // Match based on specialties/topics
                therapyTopics.forEach(topic => {
                    if (therapist.specialties.some(specialty => 
                        specialty.toLowerCase().includes(topic.toLowerCase()))) {
                        score += 10;
                    }
                });
                
                // Match based on therapist gender preference if specified
                if (therapistGender !== 'no-preference') {
                    // Simple gender check (would be more sophisticated in real app)
                    const isFemale = therapist.name.startsWith('Dra.');
                    if ((therapistGender === 'female' && isFemale) || 
                        (therapistGender === 'male' && !isFemale)) {
                        score += 5;
                    }
                }
                
                // Add a small random factor for variety (1-5 points)
                score += Math.floor(Math.random() * 5) + 1;
                
                // Create a copy with the score
                return {
                    ...therapist,
                    matchScore: score
                };
            });
            
            // Sort by score (highest first)
            scoredTherapists.sort((a, b) => b.matchScore - a.matchScore);
            
            // Return the top match
            return scoredTherapists[0] || null;
        },
        
        saveBooking: function(booking) {
            // Ensure required fields
            if (!booking.therapistId || !booking.date || !booking.time || !booking.sessionType) {
                return false;
            }
            
            // Generate a unique booking ID
            booking.id = 'b' + Date.now();
            booking.createdAt = new Date().toISOString();
            booking.status = booking.status || 'confirmed';
            
            // Save to bookings collection
            const bookings = this.get(BOOKINGS_KEY) || [];
            bookings.push(booking);
            this.set(BOOKINGS_KEY, bookings);
            
            return booking;
        },
        
        getBookings: function() {
            return this.get(BOOKINGS_KEY) || [];
        },
        
        getBookingsByUser: function(userId) {
            const bookings = this.getBookings();
            return bookings.filter(booking => booking.userId === userId);
        },
        
        saveUser: function(user) {
            // Ensure required fields
            if (!user.email) {
                return false;
            }
            
            // Generate a unique user ID if not provided
            if (!user.id) {
                user.id = 'u' + Date.now();
            }
            
            user.createdAt = user.createdAt || new Date().toISOString();
            
            // Save to users collection
            const users = this.get(USERS_KEY) || [];
            
            // Check if user already exists (by email)
            const existingIndex = users.findIndex(u => u.email === user.email);
            if (existingIndex >= 0) {
                // Update existing user
                users[existingIndex] = {...users[existingIndex], ...user};
            } else {
                // Add new user
                users.push(user);
            }
            
            this.set(USERS_KEY, users);
            return user;
        },
        
        getUserById: function(id) {
            const users = this.get(USERS_KEY) || [];
            return users.find(user => user.id === id) || null;
        }
    };
})();

// Make Database available globally
window.Database = Database;