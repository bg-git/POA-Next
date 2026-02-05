import Link from 'next/link';
import Image from 'next/image';
import { memo, useState, useEffect } from 'react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useFavourites } from '@/context/FavouritesContext';


function Header() {
  const { openDrawer, cartItems } = useCart();
  const { isAuthenticated, user, signOut, loading } = useAuth();
  const [isMounted, setIsMounted] = useState(false);
  const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
const { favourites } = useFavourites();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <>
      {/* Top grey bar */}
      <header
        style={{
          width: '100%',
          background: '#181818',
          borderTop: '1px solid #fff',
          height: '40px',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <div
          style={{
            width: '100%',
            maxWidth: '1400px',
            margin: '0 auto',
            padding: '0 16px',
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center',
            fontSize: '12px',
            color: '#000',
          }}
        >
          {!loading && (
            isMounted && isAuthenticated ? (
              <>
                <Link href="/account" style={{ color: '#fff', textDecoration: 'none', marginRight: '12px' }}>
                  {user?.firstName ? `My Account` : 'My Account'}


                </Link>
                <span style={{ marginRight: '12px' }}>|</span>
                <button 
                  onClick={signOut}
                  style={{ 
                    background: 'none', 
                    border: 'none', 
                    color: '#fff', 
                    cursor: 'pointer',
                    fontSize: '12px',
                    padding: 0
                  }}
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link href="/register" style={{ color: '#fff', textDecoration: 'none', marginRight: '12px' }}>
                  Join Us
                </Link>
                <span style={{ marginRight: '12px' }}>|</span>
                <Link href="/sign-in" style={{ color: '#fff', textDecoration: 'none' }}>
                  Sign In
                </Link>
              </>
            )
          )}
        </div>
      </header>

      {/* Main white bar */}
      <div
        style={{
          width: '100%',
          background: '#181818',
          height: '64px',
          display: 'flex',
          alignItems: 'center',
          borderBottom: '1px solid #fff',
        }}
      >
        <div
          style={{
            width: '100%',
            maxWidth: '1400px',
            margin: '0 auto',
            padding: '0 16px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          {/* Logo */}
          <Link href="/" style={{ display: 'flex', alignItems: 'center' }}>
         
            <Image
              src="/Pierce_of_art_Logo_661612a0-0b7d-4d95-832a-3926ef0d4780.png"
              alt="PIERCE OF ART text logo"
              width={300}
              height={27}
              priority
              style={{ verticalAlign: 'middle', display: 'block' }}
            />
          </Link>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
  <Link
    href="/favourites"
    aria-label="My Favourites"
    style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill={favourites.length > 0 ? 'red' : 'none'}
      viewBox="0 0 24 24"
      stroke="#fff"
      strokeWidth="2"
      width="24"
      height="24"
      style={{ display: 'block' }}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 21c-1.1-1.04-5.55-5.08-7.62-7.51C2.64 11.21 2 9.66 2 8.25 2 5.4 4.4 3 7.25 3c1.49 0 2.94.68 3.75 1.75A5.48 5.48 0 0116.75 3C19.6 3 22 5.4 22 8.25c0 1.41-.64 2.96-2.38 5.24C17.55 15.92 13.1 19.96 12 21z"
      />
    </svg>
  </Link>

  <button
    onClick={openDrawer}
    style={{
      background: 'none',
      border: 'none',
      padding: 0,
      margin: 0,
      fontSize: '14px',
      fontWeight: 500,
      color: '#fff',
      cursor: 'pointer',
      textDecoration: 'none',
    }}
  >
    My Bag{itemCount > 0 ? ` (${itemCount})` : ''}
  </button>
</div>

        </div>
      </div>

      {/* Navigation */}
      <nav
        style={{
          width: '100%',
          background: '#181818',
          borderBottom: '1px solid #ececec',
          overflowX: 'auto',
        }}
      >
        <div
          style={{
            display: 'flex',
            maxWidth: '1400px',
            margin: '0 auto',
            padding: '0 16px',
            whiteSpace: 'nowrap',
          }}
        >
          {[
  { label: 'BOOK A PIERCING', href: '/collections/ends-gems' },
  { label: 'PIERCING PRICE LIST', href: '/information/piercing-price-list' },
  { label: 'ENDS & GEMS', href: '/collections/ends-gems' },
  { label: 'CHAINS & CHARMS', href: '/collections/chains-charms' },
  { label: 'RINGS & HOOPS', href: '/collections/rings-hoops' },
  { label: 'SEARCH', href: '/search' },

].map(({ label, href }) => (
  <Link
    key={label}
    href={href}
    style={{
      padding: '16px 12px',
      fontSize: '16px',
      color: '#fff',
      fontWeight: '600',
      textDecoration: 'none',
      flexShrink: 0,
    }}
  >
    {label}
  </Link>
))}

        </div>
      </nav>
    </>
  );
}

export default memo(Header);

