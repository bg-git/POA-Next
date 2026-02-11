import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

interface Booking {
  id: string;
  location: string;
  appointment_date: string;
  appointment_time: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  status: string;
  created_at: string;
}

export default function MyAppointments() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    if (!user?.id) return;

    const fetchBookings = async () => {
      try {
        const res = await fetch('/api/bookings/my-appointments', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ customerId: user.id }),
          credentials: 'include',
        });

        const data = await res.json();
        if (data.bookings) {
          setBookings(data.bookings);
        }
      } catch (err) {
        setError('Failed to load appointments');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [user?.id]);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr + 'T00:00:00');
    return new Intl.DateTimeFormat('en-GB', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  };

  const canCancel = (dateStr: string) => {
    const appointmentDate = new Date(dateStr + 'T00:00:00');
    const now = new Date();
    const hoursDiff = (appointmentDate.getTime() - now.getTime()) / (1000 * 60 * 60);
    return hoursDiff > 24; // Can cancel if more than 24 hours away
  };

  if (!user) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <p>Please log in to view your appointments.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <p>Loading your appointments...</p>
      </div>
    );
  }

  const handleCancel = async (id: string, dateStr: string) => {
    if (!canCancel(dateStr)) {
      alert('Cannot cancel within 24 hours of appointment');
      return;
    }

    if (!confirm('Are you sure you want to cancel this appointment?')) return;

    try {
      const res = await fetch('/api/bookings/cancel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookingId: id }),
        credentials: 'include',
      });

      if (res.ok) {
        setBookings(bookings.filter((b) => b.id !== id));
        alert('Appointment cancelled successfully');
      } else {
        alert('Failed to cancel appointment');
      }
    } catch (err) {
      alert('Error cancelling appointment');
      console.error(err);
    }
  };

  if (error) {
    return <div style={{ padding: '20px', color: 'red' }}>{error}</div>;
  }

  if (bookings.length === 0) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <p>You have no appointments booked.</p>
        <Link href="/book-a-piercing/chesterfield">
          <button style={{
            padding: '10px 20px',
            marginTop: '10px',
            backgroundColor: '#000',
            color: '#fff',
            border: 'none',
            cursor: 'pointer',
            borderRadius: '4px',
          }}>
            Book an Appointment
          </button>
        </Link>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px' }}>
      <h3 style={{ marginBottom: '20px' }}>My Appointments</h3>
      
      {bookings.map((booking) => {
        const isPast = new Date(booking.appointment_date + 'T00:00:00') < new Date();
        const canCancelBooking = canCancel(booking.appointment_date);

        return (
          <div
            key={booking.id}
            style={{
              marginBottom: '15px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              overflow: 'hidden',
              opacity: isPast ? 0.6 : 1,
            }}
          >
            <div
              onClick={() => setExpandedId(expandedId === booking.id ? null : booking.id)}
              style={{
                padding: '15px',
                backgroundColor: '#f9f9f9',
                cursor: 'pointer',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div>
                <p style={{ margin: '0 0 5px 0', fontWeight: 'bold' }}>
                  {booking.location}
                </p>
                <p style={{ margin: '0', color: '#666' }}>
                  {formatDate(booking.appointment_date)} at {booking.appointment_time}
                </p>
                <p style={{ margin: '5px 0 0 0', fontSize: '12px', color: '#999' }}>
                  Status: <span style={{ textTransform: 'capitalize' }}>{booking.status}</span>
                  {isPast && ' (Past)'}
                </p>
              </div>
              <span style={{ fontSize: '20px' }}>{expandedId === booking.id ? '−' : '+'}</span>
            </div>

            {expandedId === booking.id && (
              <div style={{ padding: '15px', borderTop: '1px solid #ddd', backgroundColor: '#fff' }}>
                <div style={{ marginBottom: '15px' }}>
                  <p>
                    <strong>Location:</strong> {booking.location}
                  </p>
                  <p>
                    <strong>Date & Time:</strong> {formatDate(booking.appointment_date)} at{' '}
                    {booking.appointment_time}
                  </p>
                  <p>
                    <strong>Booked:</strong> {new Date(booking.created_at).toLocaleDateString()}
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                  <Link href={`/book-a-piercing/${booking.location.toLowerCase()}?reschedule=${booking.id}`}>
                    <button
                      style={{
                        padding: '10px 15px',
                        backgroundColor: '#000',
                        color: '#fff',
                        border: 'none',
                        cursor: 'pointer',
                        borderRadius: '4px',
                        flex: 1,
                      }}
                    >
                      Reschedule
                    </button>
                  </Link>

                  <button
                    onClick={() => handleCancel(booking.id, booking.appointment_date)}
                    disabled={isPast || !canCancelBooking}
                    style={{
                      padding: '10px 15px',
                      backgroundColor: isPast || !canCancelBooking ? '#ccc' : '#d9534f',
                      color: '#fff',
                      border: 'none',
                      cursor: isPast || !canCancelBooking ? 'not-allowed' : 'pointer',
                      borderRadius: '4px',
                      flex: 1,
                    }}
                  >
                    {!canCancelBooking && !isPast ? 'Cancel (24h before)' : 'Cancel'}
                  </button>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
