// DOM Content Loaded Event Listener
document.addEventListener('DOMContentLoaded', function() {
    // Set minimum date to today
    const dateInput = document.getElementById('date');
    dateInput.min = new Date().toISOString().split('T')[0];
    
    // Initialize form handlers
    initializeFormHandlers();
    initializeInteractiveEffects();
});

// Form submission handling
function initializeFormHandlers() {
    const bookingForm = document.getElementById('bookingForm');
    
    bookingForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const submitBtn = document.getElementById('submitBtn');
        const btnText = document.getElementById('btnText');
        const confirmation = document.getElementById('confirmation');
        
        // Show loading state
        showLoadingState(submitBtn, btnText);
        
        // Get form data
        const formData = new FormData(this);
        const bookingData = Object.fromEntries(formData);
        
        // Validate form data
        if (!validateBookingData(bookingData)) {
            hideLoadingState(submitBtn, btnText);
            showError(confirmation, 'Please fill in all required fields correctly.');
            return;
        }
        
        // Simulate API call
        processBooking(bookingData, submitBtn, btnText, confirmation, this);
    });
}

// Show loading state
function showLoadingState(submitBtn, btnText) {
    btnText.innerHTML = '<span class="loading"></span> Processing...';
    submitBtn.disabled = true;
}

// Hide loading state
function hideLoadingState(submitBtn, btnText) {
    btnText.textContent = 'Book Now';
    submitBtn.disabled = false;
}

// Validate booking data
function validateBookingData(data) {
    // Check required fields
    const requiredFields = ['name', 'email', 'service', 'date', 'time'];
    
    for (let field of requiredFields) {
        if (!data[field] || data[field].trim() === '') {
            return false;
        }
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
        return false;
    }
    
    // Validate date is not in the past
    const selectedDate = new Date(data.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (selectedDate < today) {
        return false;
    }
    
    return true;
}

// Process booking (simulate API call)
function processBooking(bookingData, submitBtn, btnText, confirmation, form) {
    // Simulate processing time
    setTimeout(() => {
        // Reset button state
        hideLoadingState(submitBtn, btnText);
        
        // Show success message
        showSuccess(confirmation, bookingData);
        
        // Reset form
        resetForm(form);
        
        // Auto-hide confirmation after 10 seconds
        setTimeout(() => {
            hideConfirmation(confirmation);
        }, 10000);
        
    }, 2000); // Simulate 2-second processing time
}

// Show success message
function showSuccess(confirmation, bookingData) {
    confirmation.className = 'confirmation success';
    confirmation.style.display = 'block';
    
    const formattedDate = new Date(bookingData.date).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    
    const formattedTime = formatTime(bookingData.time);
    
    confirmation.innerHTML = `
        <strong>🎉 Booking Confirmed!</strong><br>
        Thank you <strong>${bookingData.name}</strong>! Your ${bookingData.service} appointment is scheduled for<br>
        <strong>${formattedDate}</strong> at <strong>${formattedTime}</strong>
        ${bookingData.email ? `<br><br>📧 A confirmation email will be sent to <strong>${bookingData.email}</strong>` : ''}
        ${bookingData.phone ? `<br>📱 We'll contact you at <strong>${bookingData.phone}</strong> if needed` : ''}
    `;
}

// Show error message
function showError(confirmation, message) {
    confirmation.className = 'confirmation error';
    confirmation.style.display = 'block';
    confirmation.innerHTML = `<strong>❌ Error:</strong> ${message}`;
    
    // Auto-hide error after 5 seconds
    setTimeout(() => {
        hideConfirmation(confirmation);
    }, 5000);
}

// Hide confirmation message
function hideConfirmation(confirmation) {
    confirmation.style.display = 'none';
}

// Reset form
function resetForm(form) {
    form.reset();
    // Reset minimum date
    document.getElementById('date').min = new Date().toISOString().split('T')[0];
}

// Format time to 12-hour format
function formatTime(time24) {
    const [hours, minutes] = time24.split(':');
    const hour12 = parseInt(hours) % 12 || 12;
    const ampm = parseInt(hours) >= 12 ? 'PM' : 'AM';
    return `${hour12}:${minutes} ${ampm}`;
}

// Initialize interactive effects
function initializeInteractiveEffects() {
    const inputs = document.querySelectorAll('input, select');
    
    inputs.forEach(input => {
        // Focus effect
        input.addEventListener('focus', function() {
            this.parentElement.style.transform = 'translateY(-2px)';
            this.parentElement.style.transition = 'transform 0.2s ease';
        });
        
        // Blur effect
        input.addEventListener('blur', function() {
            this.parentElement.style.transform = 'translateY(0)';
        });
        
        // Real-time validation feedback
        input.addEventListener('input', function() {
            validateField(this);
        });
    });
}

// Real-time field validation
function validateField(field) {
    const value = field.value.trim();
    
    // Remove previous validation classes
    field.classList.remove('valid', 'invalid');
    
    // Skip validation for optional fields
    if (!field.required && value === '') {
        return;
    }
    
    let isValid = true;
    
    switch (field.type) {
        case 'email':
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            isValid = emailRegex.test(value);
            break;
        case 'date':
            const selectedDate = new Date(value);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            isValid = selectedDate >= today;
            break;
        default:
            isValid = field.required ? value !== '' : true;
    }
    
    // Add validation class
    field.classList.add(isValid ? 'valid' : 'invalid');
}

// Utility function to get current date in YYYY-MM-DD format
function getCurrentDate() {
    return new Date().toISOString().split('T')[0];
}

// Export functions for potential external use
window.BookingSystem = {
    validateBookingData,
    formatTime,
    getCurrentDate
}; 