import React from 'react';
import type { GetStaticProps } from 'next';
import Head from 'next/head';

export const getStaticProps: GetStaticProps = async () => {
  return {
    props: {},
    revalidate: 86400, // Revalidate once per day
  };
};

export default function BookingPage() {
  return (
    <>
      <Head>
        <title>Book a Piercing - Pierce of Art</title>
        <meta name="description" content="Book your piercing appointment at Pierce of Art" />
      </Head>
      <div>
        <h1>Pierce of Art Booking System</h1>
        <p>Coming soon - Integration in progress</p>
      </div>
    </>
  );
}
