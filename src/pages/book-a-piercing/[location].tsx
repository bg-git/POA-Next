import Head from 'next/head';
import Link from 'next/link';
import React from 'react';
import { useRouter } from 'next/router';
import { useState, useEffect, useCallback } from 'react';
import type { GetStaticProps, GetStaticPaths } from 'next';
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

interface BookAPiercingProps {
  initialAvailabilities: Availability[];
}

const BookAPiercing = ({ initialAvailabilities }: BookAPiercingProps) => {
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
  const [availabilities, setAvailabilities] = useState<Availability[]>(initialAvailabilities);
  const [agreeToTos, setAgreeToTos] = useState(false);
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

  // Fetch fresh availability data on client mount
  useEffect(() => {
    if (!isClient || !location) return;

    const fetchAvailability = async () => {
      try {
        const response = await fetch(`/api/booking/availability?location=${location}`);
        if (response.ok) {
          const data = await response.json();
          if (data.availabilities) {
            setAvailabilities(data.availabilities);
          }
        }
      } catch (error) {
        console.error('Error fetching availability:', error);
        // Keep existing availabilities on error
      }
    };

    fetchAvailability();
  }, [isClient, location]);

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

  const handleAuthSuccess = useCallback(() => {
    // After successful authentication, auto-select the date they tried to click
    if (attemptedDate) {
      setSelectedDate(attemptedDate);
      setAttemptedDate(null);
    }
  }, [attemptedDate]);

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
    const days: React.ReactElement[] = [];
    const today = new Date();
    const todayDate = today.getDate();
    const currentMonthNum = today.getMonth();
    const currentYear = today.getFullYear();
    const todayStr = today.toISOString().split('T')[0];

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
      const isPastDate = dateStr < todayStr;
      const isSelected = selectedDate === dateStr;
      const hasAvailability = availability && availability.available && !isPastDate;

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
            <p style={{ margin: '0 0 8px 0' }}>You can book additional appointments - just select another date and time below.</p>
            <p style={{ margin: 0 }}>If you&apos;re trying to book for a friend, they will need to book separately.</p>
          </div>
        )}

        {!isRescheduleMode && (
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

// Days of week that each location is closed (0=Sunday, 1=Monday, etc.)
const CLOSED_DAYS_OF_WEEK: Record<string, number[]> = {
  chesterfield: [0, 1], // Closed on Sunday (0) and Monday (1)
  leicester: [], // Open 7 days a week
};

// Helper function to generate 25-minute appointment slots
function generateTimeSlots(openTime: string, closeTime: string, numSlots: number): Array<{ time: string; slots: number }> {
  const slots: Array<{ time: string; slots: number }> = [];
  
  // Parse open and close times
  const parseTime = (timeStr: string): { hours: number; minutes: number } => {
    const match = timeStr.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/);
    if (!match) return { hours: 0, minutes: 0 };
    let hours = parseInt(match[1]);
    const minutes = parseInt(match[2]);
    const meridiem = match[3];
    if (meridiem === 'PM' && hours !== 12) hours += 12;
    if (meridiem === 'AM' && hours === 12) hours = 0;
    return { hours, minutes };
  };
  
  // Format time to 12-hour format
  const formatTime = (hours: number, minutes: number): string => {
    const meridiem = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    return `${displayHours}:${minutes.toString().padStart(2, '0')} ${meridiem}`;
  };
  
  const open = parseTime(openTime);
  const close = parseTime(closeTime);
  
  let currentMinutes = open.hours * 60 + open.minutes;
  const closeMinutes = close.hours * 60 + close.minutes;
  
  while (currentMinutes < closeMinutes) {
    const hours = Math.floor(currentMinutes / 60);
    const minutes = currentMinutes % 60;
    slots.push({
      time: formatTime(hours, minutes),
      slots: numSlots
    });
    currentMinutes += 25;
  }
  
  return slots;
}

// Operating hours by day of week (0=Sunday, 1=Monday, ..., 6=Saturday)
const LOCATION_HOURS_BY_DAY: Record<string, Record<number, { open: string; close: string; slots: number }>> = {
  chesterfield: {
    2: { open: '10:00 AM', close: '6:00 PM', slots: 2 }, // Tuesday
    3: { open: '10:00 AM', close: '6:00 PM', slots: 2 }, // Wednesday
    4: { open: '10:00 AM', close: '6:00 PM', slots: 2 }, // Thursday
    5: { open: '10:00 AM', close: '6:00 PM', slots: 2 }, // Friday
    6: { open: '9:00 AM', close: '6:00 PM', slots: 2 }, // Saturday
  },
  leicester: {
    0: { open: '11:00 AM', close: '4:00 PM', slots: 1 }, // Sunday
    1: { open: '11:00 AM', close: '6:00 PM', slots: 1 }, // Monday
    2: { open: '11:00 AM', close: '6:00 PM', slots: 1 }, // Tuesday
    3: { open: '11:00 AM', close: '6:00 PM', slots: 1 }, // Wednesday
    4: { open: '11:00 AM', close: '6:00 PM', slots: 1 }, // Thursday
    5: { open: '11:00 AM', close: '6:00 PM', slots: 1 }, // Friday
    6: { open: '10:00 AM', close: '6:00 PM', slots: 1 }, // Saturday
  },
};

// Specific dates when location is closed (holidays, etc.)
const CLOSED_DATES: Record<string, string[]> = {
  chesterfield: [
    '2026-12-25', // Christmas
    '2026-12-26', // Boxing Day
  ],
  leicester: [
    '2026-12-25', // Christmas
    '2026-12-26', // Boxing Day
  ],
};

// Special hours for specific dates
const SPECIAL_HOURS: Record<string, Record<string, Array<{ time: string; slots: number }>>> = {
  chesterfield: {
    '2026-02-13': [ // Valentine's Eve - extended hours
      { time: '09:00 AM', slots: 3 },
      { time: '10:00 AM', slots: 3 },
      { time: '11:00 AM', slots: 3 },
      { time: '02:00 PM', slots: 3 },
      { time: '03:00 PM', slots: 3 },
      { time: '04:00 PM', slots: 2 },
      { time: '05:00 PM', slots: 1 },
    ],
  },
  leicester: {
    // Add any special hours for Leicester here
  },
};

// Helper function to check if a time is at least 1 hour in advance from now
function isAtLeast1HourInAdvance(date: string, timeStr: string): boolean {
  const now = new Date();
  const bookingDateTime = new Date(date + 'T00:00:00');
  
  // Parse time string (e.g., "2:30 PM")
  const match = timeStr.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/);
  if (!match) return false;
  
  let hours = parseInt(match[1]);
  const minutes = parseInt(match[2]);
  const meridiem = match[3];
  
  // Convert to 24-hour format
  if (meridiem === 'PM' && hours !== 12) hours += 12;
  if (meridiem === 'AM' && hours === 12) hours = 0;
  
  bookingDateTime.setHours(hours, minutes, 0, 0);
  
  // Calculate difference in milliseconds
  const differenceMs = bookingDateTime.getTime() - now.getTime();
  const differenceHours = differenceMs / (1000 * 60 * 60);
  
  return differenceHours >= 1;
}

// Availability data generation function
function generateAvailabilities(location: string) {
  const availabilities: Availability[] = [];
  const today = new Date();
  const hoursPerDay = LOCATION_HOURS_BY_DAY[location] || LOCATION_HOURS_BY_DAY.chesterfield;
  const closedDaysOfWeek = CLOSED_DAYS_OF_WEEK[location] || [];
  const closedDates = CLOSED_DATES[location] || [];
  const specialHours = SPECIAL_HOURS[location] || {};
  
  for (let i = 0; i < 30; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() + i);
    
    const dayOfWeek = date.getDay();
    const dateStr = date.toISOString().split('T')[0];
    
    // Skip closed days of week
    if (closedDaysOfWeek.includes(dayOfWeek)) {
      continue;
    }
    
    // Skip closed dates
    if (closedDates.includes(dateStr)) {
      continue;
    }
    
    // Get hours for this day of week
    let hoursForDate: Array<{ time: string; slots: number }> = [];
    
    // Check for special hours first
    if (specialHours[dateStr]) {
      hoursForDate = specialHours[dateStr];
    } else {
      // Use day-of-week hours
      const dayConfig = hoursPerDay[dayOfWeek];
      if (dayConfig) {
        hoursForDate = generateTimeSlots(dayConfig.open, dayConfig.close, dayConfig.slots);
      }
    }
    
    // Skip if no hours configured for this day
    if (hoursForDate.length === 0) {
      continue;
    }
    
    const timeSlots: TimeSlot[] = hoursForDate.map((hour) => ({
      start_time: hour.time,
      formatedTime: hour.time,
      slots: hour.slots,
    }));
    
    availabilities.push({
      date: dateStr,
      available: timeSlots.some(t => t.slots > 0),
      spots: timeSlots
    });
  }
  
  return availabilities;
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [
      { params: { location: 'chesterfield' } },
      { params: { location: 'leicester' } },
    ],
    fallback: 'blocking',
  };
};

export const getStaticProps: GetStaticProps<BookAPiercingProps> = async ({ params }) => {
  const location = params?.location as string;

  try {
    // Try to fetch real availability from API
    const protocol = process.env.VERCEL_URL ? 'https' : 'http';
    const host = process.env.VERCEL_URL || 'localhost:3000';
    const response = await fetch(`${protocol}://${host}/api/booking/availability?location=${location}`);
    
    if (response.ok) {
      const data = await response.json();
      return {
        props: {
          initialAvailabilities: data.availabilities || generateAvailabilities(location),
        },
        revalidate: 300, // Revalidate every 5 minutes
      };
    }
  } catch (error) {
    console.error('Error fetching availability at build time:', error);
  }

  // Fallback to generated availability
  return {
    props: {
      initialAvailabilities: generateAvailabilities(location),
    },
    revalidate: 300, // Revalidate every 5 minutes
  };
};