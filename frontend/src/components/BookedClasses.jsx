import { useState, useEffect } from 'react';
import io from 'socket.io-client';

function BookedClasses({ authToken }) {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadBookings = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/bookings');
      const data = await response.json();
      setBookings(data);
    } catch (error) {
      console.error('Error loading bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, []);

  // Listen for real time events and refresh
  useEffect(() => {
    const socket = io('http://localhost:8080');

    socket.on('class_booked', loadBookings);
    socket.on('class_booking_cancelled', loadBookings);

    return () => {
      socket.off('class_booked', loadBookings);
      socket.off('class_booking_cancelled', loadBookings);
      socket.disconnect();
    };
  }, []);

  // Format duration from minutes to readable string
  const formatDuration = (minutes) => {
    if (!minutes) return '';
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    if (h === 0) return `${m} min`;
    if (m === 0) return `${h}h`;
    return `${h}h ${m}min`;
  };

  const handleCancel = async (classCode) => {
    if (!authToken) return;
    try {
      await fetch(`/api/bookings/${classCode}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${authToken}` }
      });
      loadBookings();
    } catch (error) {
      console.error('Error cancelling booking:', error);
    }
  };

  if (loading) {
    return (
      <div className="loading-indicator">
        <span className="spinner" />
        Loading booked classes…
      </div>
    );
  }

  if (bookings.length === 0) {
    return (
      <>
        <h2 className="display-heading">Booked Classes</h2>
        <div className="empty-state">
          <p>You have not booked any classes yet. Browse classes and hit <strong>Book Class</strong> to get started!</p>
        </div>
      </>
    );
  }

  return (
    <>
      <h2 className="display-heading">Booked Classes</h2>
      <div id="classDisplay">
        {bookings.map((booking) => {
          const cls = booking.classDetails;
          if (!cls) return null;
          const imageName = (cls.hasImage ? cls.classCode : 'PlaceholderClass') + '.jpg';
          return (
            <div key={booking._id} className="book-card">
              <img src={`/images/classes/${imageName}`} alt={cls.className} />
              <div className="book-info">
                <p><strong>{cls.className}</strong></p>
                <p>Instructor: {cls.instructor}</p>
                <p>Code: {cls.classCode}</p>
                <p>Duration: {formatDuration(cls.duration)}</p>
                <p>Schedule: {cls.frequency}</p>
                <p className="booking-date">
                  Booked: {new Date(booking.bookedAt).toLocaleDateString()}
                </p>
                {authToken && (
                  <button
                    className="btn-cancel-booking"
                    type="button"
                    onClick={() => handleCancel(cls.classCode)}
                  >
                    Cancel Booking
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}

export default BookedClasses;
