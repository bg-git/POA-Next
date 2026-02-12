import Head from 'next/head';
import Link from 'next/link';
import React from 'react';

export default function BookingComplete() {
  return (
    <>
      <Head>
        <title>Booking Confirmed - Pierce of Art</title>
        <meta name="description" content="Your piercing appointment has been confirmed" />
      </Head>

      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 24px', minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <h1 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '16px', textTransform: 'uppercase' }}>
            Booking Confirmed! ✓
          </h1>
          
          <p style={{ fontSize: '18px', color: '#666', marginBottom: '24px', maxWidth: '600px' }}>
            Thank you for booking your piercing appointment with Pierce of Art. Your appointment details have been sent to your email address. 
          </p>

          <div style={{
            background: '#f5f5f5',
            padding: '24px',
            borderRadius: '4px',
            marginBottom: '32px',
            marginLeft: 'auto',
            marginRight: 'auto',
            maxWidth: '400px'
          }}>
            <p style={{ margin: '8px 0', fontSize: '16px' }}>
              <strong>What happens next:</strong>
            </p>
            <ul style={{ textAlign: 'left', marginTop: '12px', padding: '0 20px' }}>
              <li style={{ margin: '8px 0' }}>You&apos;ll receive a confirmation email with all the details</li>
              <li style={{ margin: '8px 0' }}>Check your appointment in your account dashboard</li>
              <li style={{ margin: '8px 0' }}>Arrive 5-10 minutes early on the day</li>
              <li style={{ margin: '8px 0' }}>Bring a valid ID for verification</li>
            </ul>
          </div>

          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/account">
              <button style={{
                padding: '12px 32px',
                backgroundColor: '#000',
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: '600',
                textTransform: 'uppercase'
              }}>
                View My Appointments
              </button>
            </Link>

            <Link href="/">
              <button style={{
                padding: '12px 32px',
                backgroundColor: '#f5f5f5',
                color: '#000',
                border: '2px solid #000',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: '600',
                textTransform: 'uppercase'
              }}>
                Return to Homepage
              </button>
            </Link>
          </div>

          <p style={{ fontSize: '14px', color: '#999', marginTop: '32px' }}>
            Questions? <Link href="/contact" style={{ color: '#000', textDecoration: 'underline' }}>Contact us</Link>
          </p>
        </div>
      </main>
    </>
  );
}
