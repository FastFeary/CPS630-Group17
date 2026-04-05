import { useState, useEffect } from 'react';
import io from 'socket.io-client';

function DisplayClasses({ refreshTrigger, onBookClass, authToken }) {
  const [classes, setClasses] = useState([]);
  const [bookedCodes, setBookedCodes] = useState(new Set());

  const loadClasses = async () => {
    try {
      const response = await fetch('/api/classes');
      const data = await response.json();
      setClasses(data);
    } catch (error) {
      console.error('Error loading classes:', error);
    }
  };

  const loadBookings = async () => {
    try {
      const response = await fetch('/api/bookings');
      const data = await response.json();
      // Build a Set of booked class codes for O(1) lookup
      setBookedCodes(new Set(data.map(b => b.classCode)));
    } catch (error) {
      console.error('Error loading bookings:', error);
    }
  };

  // Load classes on mount and when refreshTrigger changes
  useEffect(() => {
    loadClasses();
  }, [refreshTrigger]);

  // Load bookings on mount
  useEffect(() => {
    loadBookings();
  }, []);

  // Listen for real time Socket.io events and refresh classes
  useEffect(() => {
    const socket = io('http://localhost:8080');

    const handleClassRefresh = () => loadClasses();
    const handleBookingRefresh = () => loadBookings();

    socket.on('class_created', handleClassRefresh);
    socket.on('class_updated', handleClassRefresh);
    socket.on('class_deleted', handleClassRefresh);
    socket.on('class_booked', handleBookingRefresh);
    socket.on('class_booking_cancelled', handleBookingRefresh);

    return () => {
      socket.off('class_created', handleClassRefresh);
      socket.off('class_updated', handleClassRefresh);
      socket.off('class_deleted', handleClassRefresh);
      socket.off('class_booked', handleBookingRefresh);
      socket.off('class_booking_cancelled', handleBookingRefresh);
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

  if (classes.length === 0) {
    return (
      <>
        <div id="classDisplay">
          <p>No classes found.</p>
        </div>
      </>
    );
  }

  return (
    <>
      <div id="classDisplay">
        {classes.map(cls => {
          const imageName = (cls.hasImage ? cls.classCode : 'PlaceholderClass') + '.jpg';
          const alreadyBooked = bookedCodes.has(cls.classCode);
          return (
            <div key={cls.classCode} className="book-card">
              <img src={`/images/classes/${imageName}`} alt={cls.className} />
              <div className="book-info">
                <p><strong>{cls.className}</strong></p>
                <p>Instructor: {cls.instructor}</p>
                <p>Code: {cls.classCode}</p>
                <p>Duration: {formatDuration(cls.duration)}</p>
                <p>Schedule: {cls.frequency}</p>
                {cls.note && <p>Note: {cls.note}</p>}
                {authToken && (
                  alreadyBooked ? (
                    <button className="btn-book" type="button" disabled>
                      ✓ Already Booked
                    </button>
                  ) : (
                    <button
                      className="btn-book"
                      type="button"
                      onClick={() => onBookClass && onBookClass(cls)}
                    >
                      Book Class
                    </button>
                  )
                )}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}

export default DisplayClasses;
