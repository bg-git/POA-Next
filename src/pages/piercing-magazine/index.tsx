import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Seo from '@/components/Seo';

interface BlogArticle {
  id: string;
  title: string;
  handle: string;
  excerpt: string;
  publishedAt: string;
  image?: {
    url: string;
    altText?: string;
  };
}

export default function PiercingMagazineIndex() {
  const [articles, setArticles] = useState<BlogArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const res = await fetch('/api/shopify/blog/articles?blog=magazine');
        if (!res.ok) throw new Error('Failed to fetch articles');
        
        const data = await res.json();
        setArticles(data.articles || []);
      } catch (err) {
        setError('Failed to load articles');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  return (
    <main className="blog-index">
      <Seo
        title="Piercing Magazine | PIERCE OF ART"
        description="Read expert articles about body piercing, aftercare, and jewellery from the PIERCE OF ART team."
      />

      <h1>PIERCING MAGAZINE</h1>

      {loading && (
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <p>Loading articles...</p>
        </div>
      )}

      {error && (
        <div style={{ textAlign: 'center', padding: '40px', color: 'red' }}>
          <p>{error}</p>
        </div>
      )}

      {!loading && articles.length === 0 && (
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <p>No articles found.</p>
        </div>
      )}

      {!loading && articles.length > 0 && (
        <div className="blog-grid">
          {articles.map(({ id, handle, title, excerpt, image }) => (
            <Link key={id} href={`/piercing-magazine/${handle}`} className="blog-preview-card">
              <div className="card-image">
                {image ? (
                  <img
                    src={image.url}
                    alt={image.altText || title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  <div style={{ width: '100%', height: '100%', backgroundColor: '#f0f0f0' }} />
                )}
              </div>
              <div className="card-body">
                <h2>{title}</h2>
                <p>{excerpt}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
