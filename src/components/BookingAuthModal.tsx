import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';

type BookingAuthModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: () => void;
};

const BookingAuthModal: React.FC<BookingAuthModalProps> = ({
  isOpen,
  onClose,
  onAuthSuccess,
}) => {
  const { signIn } = useAuth();
  const [mode, setMode] = useState<'choose' | 'signin' | 'register'>('choose');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await signIn(email, password);
      if (result.success) {
        setEmail('');
        setPassword('');
        setMode('choose');
        onClose();
        onAuthSuccess();
      } else {
        setError(result.error || 'Sign in failed');
      }
    } catch {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterClick = () => {
    // Open register page in a new tab or modal - for now redirect
    window.open('/account?tab=register', '_blank');
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
    }}>
      <div style={{
        background: '#fff',
        padding: '40px 32px',
        borderRadius: '0',
        maxWidth: '500px',
        width: '90%',
        position: 'relative',
      }}>
        <button
          type="button"
          aria-label="Close"
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: 'none',
            border: 'none',
            fontSize: '28px',
            cursor: 'pointer',
            color: '#000',
            padding: '0',
            width: '40px',
            height: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          ×
        </button>

        {mode === 'choose' && (
          <>
            <h2 style={{
              fontSize: '24px',
              fontWeight: '700',
              marginBottom: '12px',
              textTransform: 'uppercase',
              margin: '0 0 12px 0',
            }}>
              SIGN IN TO BOOK
            </h2>

            <p style={{
              fontSize: '14px',
              color: '#666',
              marginBottom: '32px',
              margin: '0 0 32px 0',
            }}>
              You need to be logged in to book an appointment. Sign in to your account or create a new one.
            </p>

            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
            }}>
              <button
                type="button"
                onClick={() => setMode('signin')}
                style={{
                  padding: '16px 24px',
                  fontSize: '16px',
                  fontWeight: '600',
                  background: '#000',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '0',
                  cursor: 'pointer',
                  textTransform: 'uppercase',
                  width: '100%',
                }}
              >
                Sign In
              </button>

              <button
                type="button"
                onClick={handleRegisterClick}
                style={{
                  padding: '16px 24px',
                  fontSize: '16px',
                  fontWeight: '600',
                  background: '#fff',
                  color: '#000',
                  border: '1px solid #000',
                  borderRadius: '0',
                  cursor: 'pointer',
                  textTransform: 'uppercase',
                  width: '100%',
                }}
              >
                Create Account
              </button>
            </div>

            <p style={{
              fontSize: '12px',
              color: '#999',
              marginTop: '24px',
              textAlign: 'center',
              margin: '24px 0 0 0',
            }}>
              Your booking will be saved to your account and a draft order will be created in Shopify.
            </p>
          </>
        )}

        {mode === 'signin' && (
          <>
            <h2 style={{
              fontSize: '24px',
              fontWeight: '700',
              marginBottom: '24px',
              textTransform: 'uppercase',
              margin: '0 0 24px 0',
            }}>
              SIGN IN
            </h2>

            <form onSubmit={handleSignIn} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '600',
                  marginBottom: '8px',
                  textTransform: 'uppercase',
                }}>
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '12px',
                    fontSize: '14px',
                    border: '1px solid #ddd',
                    borderRadius: '0',
                    boxSizing: 'border-box',
                    fontFamily: 'inherit',
                  }}
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '600',
                  marginBottom: '8px',
                  textTransform: 'uppercase',
                }}>
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '12px',
                    fontSize: '14px',
                    border: '1px solid #ddd',
                    borderRadius: '0',
                    boxSizing: 'border-box',
                    fontFamily: 'inherit',
                  }}
                  placeholder="••••••••"
                />
              </div>

              {error && (
                <div style={{
                  padding: '12px',
                  background: '#fee',
                  color: '#c00',
                  fontSize: '13px',
                  borderRadius: '0',
                }}>
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                style={{
                  padding: '16px 24px',
                  fontSize: '16px',
                  fontWeight: '700',
                  background: '#000',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '0',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  textTransform: 'uppercase',
                  width: '100%',
                  opacity: loading ? 0.7 : 1,
                }}
              >
                {loading ? 'Signing In...' : 'Sign In'}
              </button>
            </form>

            <button
              type="button"
              onClick={() => setMode('choose')}
              style={{
                marginTop: '16px',
                padding: '12px 24px',
                background: 'none',
                border: 'none',
                color: '#666',
                cursor: 'pointer',
                fontSize: '14px',
                width: '100%',
              }}
            >
              ← Back
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default BookingAuthModal;
