# RED Digital Therapy Platform

RED is a digital therapy platform that connects people seeking therapy with qualified therapists. The platform aims to make mental health support accessible to all through a user-friendly, efficient matching system and online therapy sessions.

## Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation and Setup](#installation-and-setup)
- [Development](#development)
- [Testing](#testing)
- [Database](#database)
- [Payment Processing](#payment-processing)
- [Contributing](#contributing)
- [License](#license)

## Features

- **Smart Matching System**: Algorithm that connects clients with compatible therapists based on their needs and preferences
- **Therapist Profiles**: Detailed therapist profiles with specializations, approach, credentials, and reviews
- **Booking System**: Calendar-based booking system with availability management
- **Payment Processing**: Secure payment processing system using Stripe
- **Client Dashboard**: Personal dashboard for managing appointments and therapy progress
- **Video Sessions**: Secure video conferencing for therapy sessions

## Tech Stack

- **Frontend**: HTML, CSS, JavaScript (Vanilla)
- **Database**: Browser localStorage (simulated database for development)
- **Payment Processing**: Stripe API
- **Authentication**: In development

## Project Structure

```
RED/
├── index.html               # Home page
├── matching.html            # Therapist matching questionnaire
├── therapist-profile.html   # Therapist profile and booking
├── README.md                # Project documentation
├── src/
│   ├── images/              # Images and icons
│   ├── scripts/
│   │   ├── main.js          # Main JavaScript file
│   │   ├── matching.js      # Matching form functionality
│   │   ├── profile.js       # Therapist profile functionality
│   │   └── db/              # Database simulation
│   │       └── database.js  # localStorage-based DB functionality
│   └── styles/
│       ├── main.css         # Main stylesheet
│       ├── matching.css     # Matching form styles
│       ├── profile.css      # Therapist profile styles
│       └── reset.css        # CSS reset
```

## Installation and Setup

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/RED.git
   cd RED
   ```

2. Open the project in your preferred code editor

3. To run the project locally, you can use any local server. For example, with Python:
   ```
   # Python 3
   python -m http.server
   
   # Python 2
   python -m SimpleHTTPServer
   ```

4. Open your browser and navigate to http://localhost:8000

## Development

### Client Flow

1. A client visits the home page and learns about the platform
2. They complete the matching questionnaire on `matching.html`
3. The system matches them with the most compatible therapist
4. The client views the therapist's profile on `therapist-profile.html`
5. They book a session (free intro or paid standard session)
6. For paid sessions, they complete the payment process
7. They receive a confirmation of their booking

### Database System

For development, the platform uses a simulation of a database with localStorage:

- `src/scripts/db/database.js` provides CRUD operations
- Data persists between page refreshes but not between browser sessions
- In production, this would be replaced with a real database

### Adding New Features

When adding new features:

1. Create or modify HTML files as needed
2. Add styling in the appropriate CSS file or create a new one
3. Implement functionality in the appropriate JS file or create a new one
4. Update this README if you add new dependencies or change the flow

## Testing

### Manual Testing Checklist

- [ ] Complete the matching form with different selections
- [ ] Verify that the matching algorithm selects an appropriate therapist
- [ ] Test the booking system for both free and paid sessions
- [ ] Verify that Stripe payment form validates input correctly
- [ ] Test responsiveness on various screen sizes
- [ ] Confirm that localStorage saves and retrieves data correctly

### Automated Testing

Automated testing is planned for a future update.

## Database

Currently, the database is simulated using localStorage for development purposes. The database module (`database.js`) provides methods for:

- Storing and retrieving user preferences
- Storing therapist data
- Managing bookings
- Simulating the matching algorithm

In production, this would be replaced with a real database system like PostgreSQL or MongoDB, with proper API endpoints.

## Payment Processing

Payment processing is handled through Stripe:

1. When a user books a paid session, they're presented with a payment form
2. The form collects card information and validates it
3. Upon submission, a payment intent would be created on the server (simulated in this version)
4. After successful payment, the booking is confirmed

In production, the Stripe API calls would be handled on a server to keep API keys secure.

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -m 'Add some feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.