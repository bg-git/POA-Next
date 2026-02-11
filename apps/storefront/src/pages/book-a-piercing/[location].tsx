import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState, useEffect, useCallback } from 'react';
import BookingAuthModal from '@/components/BookingAuthModal';
import { useAuth } from '@/context/AuthContext';

interface TimeSlot {
  start_time: string;
  formatedTime: string;
  slots: number;
}

interface Availability {
  date: string;
  available: boolean;
  spots: TimeSlot[];
}

const BookAPiercing = () => {
  const router = useRouter();
  const { location, reschedule } = router.query;
  const { isAuthenticated, user, loading: authLoading } = useAuth();
  const rescheduleBookingId = reschedule as string | undefined;
  const isRescheduleMode = !!rescheduleBookingId;
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [attemptedDate, setAttemptedDate] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [availableTimes, setAvailableTimes] = useState<TimeSlot[]>([]);
  const [availabilities, setAvailabilities] = useState<Availability[]>([]);
  const [agreeToTos, setAgreeToTos] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isBooked, setIsBooked] = useState(false);
  const [bookedTime, setBookedTime] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentMonth, setCurrentMonth] = useState<Date | null>(null);

  // Initialize on client side only to prevent hydration issues
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Initialize currentMonth on client side only
  useEffect(() => {
    if (currentMonth === null && isClient) {
      setCurrentMonth(new Date());
    }
  }, [isClient, currentMonth]);

  const locationTitle = location === 'chesterfield' 
    ? 'Chesterfield' 
    : location === 'leicester' 
    ? 'Leicester' 
    : 'Booking';

  const locationMap = {
    chesterfield: { 
      name: 'Chester',
      address: '3 Knifesmithgate', 
      city: 'Chesterfield', 
      postcode: 'S40 1RF', 
      phone: '+44 (0) 1246 555555' 
    },
    leicester: { 
      name: 'Leicester',
      address: '8 Silver Walk, St Martins Square', 
      city: 'Leicester', 
      postcode: 'LE1 5EW', 
      phone: '+44 (0) 116 507 0400' 
    }
  };

  const locationData = location ? locationMap[location as keyof typeof locationMap] : null;

  // Mock data - replace with API call
  const generateMockAvailabilities = () => {
    const availabilities: Availability[] = [];
    const today = new Date();
    
    for (let i = 0; i < 30; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() + i);
      if (date.getDay() === 0) continue; // Skip Sundays
      
      const dateStr = date.toISOString().split('T')[0];
      const timeSlots: TimeSlot[] = [
        { start_time: '09:00 AM', formatedTime: '9:00 AM', slots: 2 },
        { start_time: '10:00 AM', formatedTime: '10:00 AM', slots: 2 },
        { start_time: '11:00 AM', formatedTime: '11:00 AM', slots: i % 2 === 0 ? 1 : 2 },
        { start_time: '02:00 PM', formatedTime: '2:00 PM', slots: 2 },
        { start_time: '03:00 PM', formatedTime: '3:00 PM', slots: 2 },
        { start_time: '04:00 PM', formatedTime: '4:00 PM', slots: i % 3 === 0 ? 0 : 1 },
      ];
      
      availabilities.push({
        date: dateStr,
        available: timeSlots.some(t => t.slots > 0),
        spots: timeSlots
      });
    }
    
    return availabilities;
  };

  const handleAuthSuccess = useCallback(() => {
    // After successful authentication, auto-select the date they tried to click
    if (attemptedDate) {
      setSelectedDate(attemptedDate);
      setAttemptedDate(null);
    }
  }, [attemptedDate]);

  // Initialize availabilities from API on mount
  useEffect(() => {
    const fetchAvailabilities = async () => {
      if (!location) return;
      try {
        const response = await fetch(`/api/booking/availability?location=${location}`);
        if (response.ok) {
          const data = await response.json();
          setAvailabilities(data.availabilities || []);
        } else {
          console.error('Failed to fetch availabilities');
          // Fallback to mock data
          setAvailabilities(generateMockAvailabilities());
        }
      } catch (error) {
        console.error('Error fetching availabilities:', error);
        // Fallback to mock data
        setAvailabilities(generateMockAvailabilities());
      } finally {
        setLoading(false);
      }
    };

    fetchAvailabilities();
  }, [location]);

  // Update available times when date is selected
  useEffect(() => {
    if (selectedDate) {
      const availability = availabilities.find((a) => a.date === selectedDate);
      if (availability) {
        setAvailableTimes(availability.spots.filter((t) => t.slots > 0));
        setSelectedTime(null);
      }
    }
  }, [selectedDate, availabilities]);

  // Auto-select the attempted date after successful authentication
  useEffect(() => {
    if (isClient && isAuthenticated && user?.id && attemptedDate) {
      handleAuthSuccess();
    }
  }, [isClient, isAuthenticated, user?.id, attemptedDate, handleAuthSuccess]);

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const renderCalendar = () => {
    if (!currentMonth) return [];
    const daysInMonth = getDaysInMonth(currentMonth);
    const firstDay = getFirstDayOfMonth(currentMonth);
    const days: JSX.Element[] = [];
    const today = new Date();
    const todayDate = today.getDate();
    const currentMonthNum = today.getMonth();
    const currentYear = today.getFullYear();

    // Empty cells for days before the first day of month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`}></div>);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
      const dateStr = date.toISOString().split('T')[0];
      const availability = availabilities.find((a) => a.date === dateStr);
      const isToday = (day === todayDate && 
                       currentMonth.getMonth() === currentMonthNum && 
                       currentMonth.getFullYear() === currentYear);
      const isPastDate = date < today;
      const isSunday = date.getDay() === 0;
      const isSelected = selectedDate === dateStr;
      const hasAvailability = availability && availability.available && !isPastDate && !isSunday;

      days.push(
        <button
          key={dateStr}
          onClick={() => !authLoading && hasAvailability && handleDateClick(dateStr)}
          disabled={!hasAvailability || authLoading}
          style={{
            padding: '12px',
            fontSize: '14px',
            fontWeight: isToday ? '700' : '500',
            border: isSelected ? 'none' : '1px solid #ddd',
            borderRadius: '4px',
            background: isSelected 
              ? '#000'
              : isToday
              ? '#f0f0f0'
              : '#fff',
            color: isSelected ? '#fff' : '#000',
            cursor: (hasAvailability && !authLoading) ? 'pointer' : 'not-allowed',
            opacity: (!hasAvailability || authLoading) ? 0.5 : 1,
            transition: 'all 0.2s'
          }}
        >
          {day}
        </button>
      );
    }

    return days;
  };

  const handleDateClick = (dateStr: string) => {
    // Wait for auth to load, then check if user is authenticated
    if (!isClient || authLoading) {
      return;
    }
    
    // Check if user is authenticated AND has user data
    const isReallyAuthenticated = isAuthenticated && !!user?.id;
    
    if (!isReallyAuthenticated) {
      // Store the date they tried to click and show auth modal
      setAttemptedDate(dateStr);
      setShowAuthModal(true);
      return;
    }
    // User is authenticated, select the date
    setSelectedDate(dateStr);
  };

  const formatBookingTime = (dateStr: string, timeStr: string) => {
    const date = new Date(dateStr + 'T00:00:00');
    const [time, period] = timeStr.split(' ');
    const [hours, mins] = time.split(':').map(Number);
    
    const adjustedHours = period === 'PM' && hours !== 12 ? hours + 12 : (period === 'AM' && hours === 12 ? 0 : hours);
    date.setHours(adjustedHours, mins);
    
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    
    const dateFormatted = `${day}/${month}/${year}`;
    return `${dateFormatted} ${timeStr}`;
  };

  const handleConfirmBooking = async () => {
    if (!selectedDate || !selectedTime || !agreeToTos) {
      alert('Please select a date, time, and accept terms & conditions');
      return;
    }

    if (!user?.id) {
      alert('You must be logged in to confirm a booking');
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Determine which endpoint to use based on mode
      const endpoint = isRescheduleMode ? '/api/booking/reschedule' : '/api/booking/confirm';
      const payload = isRescheduleMode 
        ? {
            bookingId: rescheduleBookingId,
            location,
            date: selectedDate,
            time: selectedTime,
          }
        : {
            location,
            date: selectedDate,
            time: selectedTime,
            email: user.email || '',
            firstName: user.firstName || 'Guest',
            lastName: user.lastName || '',
            customerId: user.id,
          };

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        if (isRescheduleMode) {
          // Reschedule successful - redirect to account page
          alert('Appointment rescheduled successfully');
          router.push('/account');
        } else {
          // New booking - redirect to checkout
          if (data.checkoutUrl) {
            window.location.href = data.checkoutUrl;
          } else {
            alert(`Booking confirmed for ${formatBookingTime(selectedDate, selectedTime)}`);
            setIsBooked(true);
            setBookedTime(formatBookingTime(selectedDate, selectedTime));
            setSelectedDate(null);
            setSelectedTime(null);
            setAgreeToTos(false);
          }
        }
      } else {
        const errorDetails = data.details ? ` (${data.details})` : '';
        alert(`${isRescheduleMode ? 'Reschedule' : 'Booking'} failed: ${data.error}${errorDetails}`);
      }
    } catch (error) {
      console.error('Booking error:', error);
      alert('Error confirming booking. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  if (loading) {
    return (
      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 24px' }}>
        <Head>
          <title>{`Book a Piercing - ${locationTitle} | Pierce of Art`}</title>
        </Head>
        <div style={{ textAlign: 'center', padding: '40px' }}>Loading availability...</div>
      </main>
    );
  }

  return (
    <>
      <Head>
        <title>{`Book a Piercing - ${locationTitle} | Pierce of Art`}</title>
        <meta name="description" content={`Book your piercing appointment at Pierce of Art ${locationTitle}`} />
      </Head>

      <BookingAuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onAuthSuccess={handleAuthSuccess}
      />

      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 24px' }}>
        <div style={{ textAlign: 'left', marginBottom: '40px' }}>
          <h1 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '8px', textTransform: 'uppercase' }}>
            {isRescheduleMode ? 'RESCHEDULE APPOINTMENT' : isBooked ? 'RE-SCHEDULE' : 'PRIORITY BOOKING'}
          </h1>
          <h3 style={{ fontSize: '24px', fontWeight: '600' }}>
            {locationTitle}
          </h3>
        </div>

        {isRescheduleMode && (
          <div style={{
            background: '#e8f4f8',
            padding: '20px 24px',
            marginBottom: '32px',
            borderRadius: '4px',
            borderLeft: '4px solid #03cb91'
          }}>
            <p style={{ margin: '0' }}>
              <strong>Select a new date and time for your appointment.</strong> No checkout required - your appointment will be updated immediately.
            </p>
          </div>
        )}

        {isBooked && !isRescheduleMode && (
          <div style={{
            background: '#f0f0f0',
            padding: '20px 24px',
            marginBottom: '32px',
            borderRadius: '4px'
          }}>
            <p style={{ margin: '0 0 8px 0' }}>
              <strong>You&apos;ve already got a piercing booked for {bookedTime}</strong>
            </p>
            <p style={{ margin: '0 0 8px 0' }}>Don&apos;t worry though. You can have more than 1 piercing when you arrive.</p>
            <p style={{ margin: 0 }}>If you&apos;re trying to book for a friend, they will need to book separately.</p>
          </div>
        )}

        {!isBooked && (
          <div style={{
            background: '#f9f9f9',
            padding: '40px 24px',
            borderRadius: '8px'
          }}>
            {/* Calendar Section */}
            {currentMonth && (
            <div style={{ marginBottom: '40px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '20px', textTransform: 'uppercase' }}>
                SELECT DATE
              </label>

              <div style={{
                background: '#fff',
                padding: '24px',
                borderRadius: '4px',
                border: '1px solid #ddd'
              }}>
                {/* Month Navigation */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '24px'
                }}>
                  <button
                    onClick={() => currentMonth && setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
                    style={{
                      background: 'none',
                      border: 'none',
                      fontSize: '18px',
                      cursor: 'pointer',
                      color: '#03cb91'
                    }}
                  >
                    ← Prev
                  </button>
                  <h3 style={{ fontSize: '18px', fontWeight: '600', margin: 0 }}>
                    {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                  </h3>
                  <button
                    onClick={() => currentMonth && setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
                    style={{
                      background: 'none',
                      border: 'none',
                      fontSize: '18px',
                      cursor: 'pointer',
                      color: '#03cb91'
                    }}
                  >
                    Next →
                  </button>
                </div>

                {/* Day Headers */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(7, 1fr)',
                  gap: '8px',
                  marginBottom: '12px'
                }}>
                  {dayNames.map((day) => (
                    <div
                      key={day}
                      style={{
                        textAlign: 'center',
                        fontWeight: '600',
                        fontSize: '12px',
                        padding: '8px',
                        color: '#666'
                      }}
                    >
                      {day}
                    </div>
                  ))}
                </div>

                {/* Calendar Days */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(7, 1fr)',
                  gap: '8px'
                }}>
                  {renderCalendar()}
                </div>
              </div>
            </div>
            )}

            {/* Time Picker Section */}
            {selectedDate && (
              <div style={{ marginBottom: '40px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '20px', textTransform: 'uppercase' }}>
                  SELECT TIME
                </label>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                  gap: '12px'
                }}>
                  {availableTimes.length > 0 ? (
                    availableTimes.map((time) => (
                      <button
                        key={time.start_time}
                        onClick={() => setSelectedTime(time.start_time)}
                        style={{
                          padding: '16px 12px',
                          fontSize: '14px',
                          fontWeight: '600',
                          border: selectedTime === time.start_time ? 'none' : '1px solid #ddd',
                          borderRadius: '4px',
                          background: selectedTime === time.start_time 
                            ? '#000'
                            : '#fff',
                          color: selectedTime === time.start_time ? '#fff' : '#000',
                          cursor: 'pointer',
                          transition: 'all 0.2s'
                        }}
                      >
                        <div>{time.formatedTime}</div>
                        <div style={{ fontSize: '12px', marginTop: '4px', opacity: 0.8 }}>
                          {time.slots} slot{time.slots > 1 ? 's' : ''}
                        </div>
                      </button>
                    ))
                  ) : (
                    <div style={{ padding: '20px', color: '#999', gridColumn: '1 / -1' }}>
                      No available times for this date
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Terms & Conditions */}
            {selectedTime && (
              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={agreeToTos}
                    onChange={(e) => setAgreeToTos(e.target.checked)}
                    style={{ cursor: 'pointer', width: '20px', height: '20px' }}
                  />
                  <span style={{ fontSize: '14px' }}>
                    I agree to the <Link href="/information/terms-of-service" style={{ color: '#000', textDecoration: 'underline' }}>terms &amp; conditions</Link>
                  </span>
                </label>
              </div>
            )}

            {/* Location Info */}
            <div style={{
              marginTop: '40px',
              padding: '24px',
              background: '#fff',
              borderRadius: '4px'
            }}>
              <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px' }}>
                {locationTitle} Location
              </h3>
              <p style={{ fontSize: '14px', color: '#666', lineHeight: '1.6', margin: 0 }}>
                {locationData?.address}<br />
                {locationData?.city}<br />
                {locationData?.postcode}<br />
                <br />
                <strong>Phone:</strong> <a href={`tel:${locationData?.phone.replace(/\s/g, '')}`} style={{ color: '#000' }}>{locationData?.phone}</a>
              </p>
            </div>
          </div>
        )}

        {/* Confirm Button */}
        {selectedTime && (
          <div style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            background: '#181818',
            padding: '16px 24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            zIndex: 100
          }}>
            <div style={{
              background: '#fff',
              color: '#000',
              padding: '12px',
              textAlign: 'center',
              fontSize: '16px',
              fontWeight: '600',
              borderRadius: '0'
            }}>
              MY BOOKING: {new Date(selectedDate + 'T00:00:00').toLocaleDateString()} {selectedTime}
            </div>
            <button
              onClick={handleConfirmBooking}
              disabled={!agreeToTos || isLoading}
              style={{
                padding: '16px 24px',
                fontSize: '16px',
                fontWeight: '700',
                background: agreeToTos ? '#000' : '#ccc',
                color: '#fff',
                border: 'none',
                borderRadius: '0',
                cursor: agreeToTos ? 'pointer' : 'not-allowed',
                textTransform: 'uppercase',
                width: '100%',
                opacity: isLoading ? 0.7 : 1
              }}
              title="You must agree to terms & conditions to proceed"
            >
              {isLoading ? 'Processing...' : 'Confirm Booking & Proceed to Checkout (Terms Accepted)'}
            </button>
          </div>
        )}
      </main>
    </>
  );
};

export default BookAPiercing;