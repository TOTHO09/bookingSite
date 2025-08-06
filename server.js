// server.js
const express = require('express');
const app = express();
const fs = require('fs');

app.use(express.json());
const PORT = 3000;

app.post('/api/book', (req, res) => {
  const booking = req.body;

  // Store in a JSON file (for simplicity)
  fs.readFile('bookings.json', 'utf8', (err, data) => {
    let bookings = [];
    if (!err && data) bookings = JSON.parse(data);

    // Check for time conflict (optional)
    const conflict = bookings.find(b => b.date === booking.date && b.time === booking.time);
    if (conflict) {
      return res.json({ message: 'Time slot already booked.' });
    }

    bookings.push(booking);
    fs.writeFile('bookings.json', JSON.stringify(bookings, null, 2), () => {
      res.json({ message: 'Booking confirmed!' });
    });
  });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
