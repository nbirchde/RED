/**
 * RED Platform Test Script
 * 
 * This script directly tests the platform's core functionality
 * and logs the results to the console.
 */

// IIFE to keep test scope clean
(function() {
    console.log('=== RED Platform Direct Test ===');
    
    // Tests results
    const results = {
        passed: 0,
        failed: 0,
        tests: []
    };
    
    function assert(name, condition, details = '') {
        if (condition) {
            console.log(`✓ PASS: ${name}`);
            results.passed++;
            results.tests.push({ name, passed: true, details });
        } else {
            console.error(`✗ FAIL: ${name}`);
            if (details) console.error(`  Details: ${details}`);
            results.failed++;
            results.tests.push({ name, passed: false, details });
        }
    }
    
    // Test 1: Verify Database exists
    assert(
        'Database module exists',
        typeof Database !== 'undefined',
        'Database should be defined as a global object'
    );
    
    // If Database doesn't exist, we can't run the other tests
    if (typeof Database === 'undefined') {
        console.error('Cannot continue testing - Database module not found.');
        return;
    }
    
    // Test 2: Check therapists data
    const therapists = Database.getTherapists();
    assert(
        'Therapists data loaded', 
        therapists && Array.isArray(therapists) && therapists.length > 0,
        `Found ${therapists ? therapists.length : 0} therapist(s)`
    );
    
    // Test 3: Get therapist by ID
    const testId = 't1';
    const therapist = Database.getTherapistById(testId);
    assert(
        'Get therapist by ID',
        therapist && therapist.id === testId,
        therapist ? `Found therapist: ${therapist.name}` : 'Therapist not found'
    );
    
    // Test 4: Matching algorithm
    const testFormData = {
        'therapy-topics': ['anxiety', 'depression'],
        'therapist-gender': 'no-preference'
    };
    
    // Save form data to localStorage
    localStorage.setItem('matching_form_data', JSON.stringify(testFormData));
    
    // Test matching
    const matchedTherapist = Database.findBestMatch(testFormData);
    assert(
        'Matching algorithm',
        matchedTherapist !== null,
        matchedTherapist ? 
            `Matched therapist: ${matchedTherapist.name} with score ${matchedTherapist.matchScore}` : 
            'No match found'
    );
    
    // Test 5: Booking functionality
    try {
        const testBooking = {
            therapistId: 't1',
            date: 'Lunes, 24 Mar',
            time: '10:00',
            sessionType: 'intro'
        };
        
        const savedBooking = Database.saveBooking(testBooking);
        
        assert(
            'Save booking',
            savedBooking && savedBooking.id,
            savedBooking ? `Booking created with ID: ${savedBooking.id}` : 'Failed to create booking'
        );
        
        // Test 6: Retrieve bookings
        const bookings = Database.getBookings();
        assert(
            'Retrieve bookings',
            Array.isArray(bookings) && bookings.length > 0,
            `Found ${bookings.length} booking(s)`
        );
        
        // Find our test booking
        const foundBooking = bookings.find(b => b.therapistId === testBooking.therapistId);
        assert(
            'Retrieve specific booking',
            foundBooking !== undefined,
            foundBooking ? `Found booking for therapist ${foundBooking.therapistId}` : 'Booking not found'
        );
        
    } catch (e) {
        assert('Booking functionality', false, `Error: ${e.message}`);
    }
    
    // Test 7: Date and time selection functionality 
    // (This tests the DOM interaction - only available on therapist profile page)
    if (window.location.pathname.includes('therapist-profile.html')) {
        try {
            // Test availability dates click
            const dateOptions = document.querySelectorAll('.date-option');
            assert(
                'Date options exist',
                dateOptions && dateOptions.length > 0,
                `Found ${dateOptions ? dateOptions.length : 0} date option(s)`
            );
            
            if (dateOptions && dateOptions.length > 0) {
                // Simulate click on first date
                const firstDate = dateOptions[0];
                firstDate.click();
                
                // Check if the date was selected
                assert(
                    'Date selection',
                    firstDate.classList.contains('selected'),
                    'Date should be marked as selected after click'
                );
                
                // Check if time selection appeared
                const timeSelection = document.querySelector('.time-selection');
                assert(
                    'Time selection displayed',
                    timeSelection && timeSelection.style.display !== 'none',
                    'Time selection should be visible after date is selected'
                );
                
                // Check if times were populated
                const timeOptions = document.querySelectorAll('.time-option');
                assert(
                    'Time options populated',
                    timeOptions && timeOptions.length > 0,
                    `Found ${timeOptions ? timeOptions.length : 0} time option(s)`
                );
                
                if (timeOptions && timeOptions.length > 0) {
                    // Simulate click on first time
                    timeOptions[0].click();
                    
                    // Check if time was selected
                    assert(
                        'Time selection',
                        timeOptions[0].classList.contains('selected'),
                        'Time should be marked as selected after click'
                    );
                    
                    // Check if booking button is enabled
                    const bookButton = document.querySelector('#book-button');
                    assert(
                        'Book button enabled',
                        bookButton && !bookButton.disabled,
                        'Book button should be enabled after time selection'
                    );
                }
            }
        } catch (e) {
            assert('UI interaction tests', false, `Error: ${e.message}`);
        }
    } else {
        console.log('Skipping UI tests - not on therapist profile page');
    }
    
    // Print test summary
    console.log('=== Test Summary ===');
    console.log(`Passed: ${results.passed}/${results.passed + results.failed} tests`);
    console.log('=====================');
    
    // Add results to page for visibility
    const resultDiv = document.createElement('div');
    resultDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: white;
        border: 1px solid #ccc;
        border-radius: 5px;
        padding: 20px;
        max-width: 400px;
        z-index: 10000;
        box-shadow: 0 4px 10px rgba(0,0,0,0.1);
        font-family: sans-serif;
    `;
    
    resultDiv.innerHTML = `
        <h2 style="margin-top:0">RED Platform Tests</h2>
        <div style="margin-bottom:15px">
            <div style="font-weight:bold;">Results: ${results.passed}/${results.passed + results.failed} tests passed</div>
        </div>
        <ul style="padding-left:20px;">
            ${results.tests.map(test => `
                <li style="margin-bottom:8px; color:${test.passed ? 'green' : 'red'}">
                    ${test.passed ? '✓' : '✗'} ${test.name}
                    ${test.details ? `<div style="font-size:0.9em; color:#666; margin-top:3px;">${test.details}</div>` : ''}
                </li>
            `).join('')}
        </ul>
        <button onclick="this.parentNode.style.display='none'" style="padding:5px 10px; margin-top:10px; cursor:pointer;">
            Close
        </button>
    `;
    
    document.body.appendChild(resultDiv);
})();