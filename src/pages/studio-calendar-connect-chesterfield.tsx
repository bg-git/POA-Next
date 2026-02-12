import { useState } from 'react';
import styles from './studio-calendar-connect.module.scss';

const STUDIO_ID = '40701627-11c0-4dc8-83f6-fcd867519eb4';

export default function StudioCalendarConnectChesterfield() {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'connecting' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleConnect = async () => {
    setLoading(true);
    setStatus('connecting');
    setMessage('Redirecting to Google...');

    try {
      const response = await fetch('/api/bookings/calendar-auth/authorize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studioId: STUDIO_ID }),
      });

      const data = await response.json();

      if (!response.ok) {
        setStatus('error');
        setMessage(`Error: ${data.error}`);
        setLoading(false);
        return;
      }

      // Redirect to Google login
      window.location.href = data.authUrl;
    } catch (error) {
      setStatus('error');
      setMessage(`Failed to connect: ${error}`);
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Connect Studio Calendar</h1>
        
        <div className={styles.studioInfo}>
          <h2 className={styles.studioName}>Chesterfield Studio</h2>
          <p className={styles.studioId}>ID: {STUDIO_ID}</p>
        </div>

        <div className={styles.content}>
          <p className={styles.contentText}>
            Click the button below to connect your Chesterfield studio&apos;s Google Calendar. 
            Your bookings will automatically appear in your calendar.
          </p>

          <div className={styles.steps}>
            <h3 className={styles.stepsTitle}>What happens next:</h3>
            <ol className={styles.stepsList}>
              <li className={styles.stepsItem}>You&apos;ll be redirected to Google Login</li>
              <li className={styles.stepsItem}>Sign in with your Google account (Gmail)</li>
              <li className={styles.stepsItem}>Grant calendar permissions</li>
              <li className={styles.stepsItem}>✅ Your calendar will be connected!</li>
            </ol>
          </div>

          {status && status !== 'idle' && (
            <div className={`${styles.statusMessage} ${styles[status]}`}>
              {message}
            </div>
          )}

          <button
            onClick={handleConnect}
            disabled={loading}
            className={styles.connectButton}
          >
            {loading ? 'Connecting...' : 'Connect Google Calendar'}
          </button>
        </div>

        <div className={styles.info}>
          <p className={styles.infoText}>
            <strong>Note:</strong> You must be using a Gmail account (Google account) 
            to connect your calendar. Make sure you&apos;re logged in with the correct account.
          </p>
        </div>
      </div>
    </div>
  );
}
