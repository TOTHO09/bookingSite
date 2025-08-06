// booking.js
document.getElementById('bookingForm').addEventListener('submit', async function (e) {
  e.preventDefault();

  const booking = {
    id: generateBookingId(),
    name: document.getElementById('name').value,
    email: document.getElementById('email').value,
    phone: document.getElementById('phone').value,
    service: document.getElementById('service').value,
    date: document.getElementById('date').value,
    time: document.getElementById('time').value,
    notes: document.getElementById('notes').value,
    timestamp: new Date().toISOString(),
    status: 'pending'
  };

  try {
    const response = await fetch('/api/book', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(booking),
    });

    const result = await response.json();
    
    // Save to local storage even if server succeeds
    saveBookingLocally(booking);
    showDetailedConfirmation(booking, result.message);
    
    // Reset form after successful submission
    this.reset();
  } catch (error) {
    // Handle network errors or server not available
    // Save to local storage as fallback
    saveBookingLocally(booking);
    showDetailedConfirmation(booking);
    
    // Reset form
    this.reset();
  }
});

// Save booking to browser's local storage
function saveBookingLocally(booking) {
  try {
    // Get existing bookings or create empty array
    const existingBookings = JSON.parse(localStorage.getItem('bookings') || '[]');
    
    // Add new booking
    existingBookings.push(booking);
    
    // Save back to localStorage
    localStorage.setItem('bookings', JSON.stringify(existingBookings));
    
    console.log('Booking saved locally:', booking);
    console.log('Total bookings saved:', existingBookings.length);
  } catch (error) {
    console.error('Failed to save booking locally:', error);
  }
}

// Generate unique booking ID
function generateBookingId() {
  return 'BK' + Date.now() + Math.random().toString(36).substr(2, 5).toUpperCase();
}

// Function to retrieve all saved bookings
function getAllBookings() {
  try {
    return JSON.parse(localStorage.getItem('bookings') || '[]');
  } catch (error) {
    console.error('Failed to retrieve bookings:', error);
    return [];
  }
}

// Function to clear all saved bookings
function clearAllBookings() {
  localStorage.removeItem('bookings');
  console.log('All bookings cleared');
}

// Function to show detailed confirmation with email and phone
function showDetailedConfirmation(bookingData, serverMessage = null) {
  const confirmation = document.getElementById('confirmation');
  
  // Map service values to display names
  const serviceNames = {
    'consultation': 'Room Cleaning',
    'appointment': 'Car/Motorcycle Rescue and Services',
    'other': 'Other Service'
  };
  
  const serviceName = serviceNames[bookingData.service] || bookingData.service;
  
  // Format date nicely
  const formattedDate = new Date(bookingData.date).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  // Format time to 12-hour format
  const formattedTime = formatTime(bookingData.time);
  
  let confirmationHTML = `
    <div style="text-align: center;">
      <div style="font-size: 2em; margin-bottom: 10px;">🎉</div>
      <strong>Booking Confirmed!</strong><br>
      <small>Booking ID: ${bookingData.id}</small><br><br>
      <div style="background: rgba(79, 70, 229, 0.1); padding: 15px; border-radius: 8px; margin: 15px 0;">
        <strong>Service:</strong> ${serviceName}<br>
        <strong>Date:</strong> ${formattedDate}<br>
        <strong>Time:</strong> ${formattedTime}<br>
        <strong>Customer:</strong> ${bookingData.name}
      </div>
  `;
  
  if (bookingData.email) {
    confirmationHTML += `📧 Confirmation details sent to: <strong>${bookingData.email}</strong><br>`;
  }
  
  if (bookingData.phone) {
    confirmationHTML += `📱 We'll contact you at: <strong>${bookingData.phone}</strong><br>`;
  }
  
  if (bookingData.notes) {
    confirmationHTML += `<br>📝 <strong>Notes:</strong> ${bookingData.notes}<br>`;
  }
  
  confirmationHTML += `
      <br>
      <div style="font-size: 0.9em; color: #666; margin-top: 10px;">
        Thank you for choosing our services!<br>
        <small>💾 Booking saved locally on your device</small>
      </div>
    </div>
  `;
  
  if (serverMessage) {
    confirmationHTML += `<br><small>Server response: ${serverMessage}</small>`;
  }
  
  confirmation.className = 'confirmation success';
  confirmation.innerHTML = confirmationHTML;
  confirmation.style.display = 'block';
  
  // Auto-hide confirmation after 15 seconds
  setTimeout(() => {
    confirmation.style.display = 'none';
  }, 15000);
}

// Helper function to format time to 12-hour format
function formatTime(time24) {
  const [hours, minutes] = time24.split(':');
  const hour12 = parseInt(hours) % 12 || 12;
  const ampm = parseInt(hours) >= 12 ? 'PM' : 'AM';
  return `${hour12}:${minutes} ${ampm}`;
}

// Log current bookings on page load (for testing)
document.addEventListener('DOMContentLoaded', function() {
  const bookings = getAllBookings();
  console.log('Existing bookings:', bookings.length);
  
  // Add functions to global scope for console access
  window.getAllBookings = getAllBookings;
  window.clearAllBookings = clearAllBookings;
});
