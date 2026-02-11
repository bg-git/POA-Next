import React from 'react';
import Link from 'next/link';
import styles from './BookingLocationsSection.module.scss';

export default function BookingLocationsSection() {
  return (
    <section className={styles.bookingSection}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>Priority Booking</h2>
          <p className={styles.subtitle}>
            Secure your appointment at Pierce of Art with our easy online booking system. Walk-ins are welcome, but we prioritise those with booked appointments to minimise wait times.
          </p>
        </div>

        <div className={styles.buttonGrid}>
          <Link href="/book-a-piercing/chesterfield" className={styles.bookingButton}>
            BOOK CHESTERFIELD
          </Link>

          <Link href="/book-a-piercing/leicester" className={styles.bookingButton}>
            BOOK LEICESTER
          </Link>
        </div>

        <div className={styles.note}>
          <p>Same-day appointments available where possible</p>
        </div>
      </div>
    </section>
  );
}
