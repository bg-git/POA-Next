import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Link from 'next/link';

interface BlogArticle {
  id: string;
  title: string;
  handle: string;
  excerpt: string;
  content: string;
  publishedAt: string;
  image?: {
    url: string;
    altText?: string;
  };
  author?: {
    name: string;
  };
}

export default function ArticlePage() {
  const router = useRouter();
  const { slug } = router.query;
  
  const [article, setArticle] = useState<BlogArticle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!slug) return;

    const fetchArticle = async () => {
      try {
        const res = await fetch(`/api/shopify/blog/articles?blog=magazine&handle=${slug}`);
        if (!res.ok) throw new Error('Article not found');
        
        const data = await res.json();
        if (data.articles && data.articles.length > 0) {
          setArticle(data.articles[0]);
        } else {
          setError('Article not found');
        }
      } catch (err) {
        setError('Failed to load article');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [slug]);

  if (loading) {
    return (
      <main style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 20px' }}>
        <p>Loading article...</p>
      </main>
    );
  }

  if (error || !article) {
    return (
      <main style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 20px' }}>
        <h1>{error || 'Article not found'}</h1>
        <Link href="/blogs/magazine">
          <button style={{
            padding: '10px 20px',
            marginTop: '20px',
            backgroundColor: '#000',
            color: '#fff',
            border: 'none',
            cursor: 'pointer',
            borderRadius: '4px',
          }}>
            Back to Magazine
          </button>
        </Link>
      </main>
    );
  }

  return (
    <>
      <Head>
        <title>{article.title} - PIERCE OF ART</title>
        <meta name="description" content={article.excerpt} />
        <meta property="og:title" content={article.title} />
        <meta property="og:description" content={article.excerpt} />
        {article.image && <meta property="og:image" content={article.image.url} />}
      </Head>

      <main style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 20px' }}>
        <Link href="/blogs/magazine" style={{ textDecoration: 'none', color: '#666' }}>
          ← Back to Magazine
        </Link>

        <article style={{ marginTop: '40px' }}>
          <header style={{ marginBottom: '40px' }}>
            <h1 style={{ fontSize: '2.2em', marginBottom: '20px', marginTop: 0 }}>
              {article.title}
            </h1>

            <div
              style={{
                display: 'flex',
                gap: '20px',
                fontSize: '0.95em',
                color: '#666',
                borderTop: '1px solid #e0e0e0',
                borderBottom: '1px solid #e0e0e0',
                paddingTop: '15px',
                paddingBottom: '15px',
              }}
            >
              {article.author?.name && (
                <span>By {article.author.name}</span>
              )}
              <span>
                {new Date(article.publishedAt).toLocaleDateString('en-GB', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
            </div>
          </header>

          {article.image && (
            <figure style={{ margin: '40px 0', textAlign: 'center' }}>
              <img
                src={article.image.url}
                alt={article.image.altText || article.title}
                style={{
                  maxWidth: '100%',
                  height: 'auto',
                  borderRadius: '8px',
                }}
              />
            </figure>
          )}

          <div
            style={{
              lineHeight: '1.8',
              fontSize: '1.05em',
              color: '#333',
            }}
            dangerouslySetInnerHTML={{ __html: article.content }}
          />
        </article>

        <div style={{ marginTop: '60px', paddingTop: '20px', borderTop: '1px solid #e0e0e0' }}>
          <Link href="/blogs/magazine">
            <button style={{
              padding: '10px 20px',
              backgroundColor: '#000',
              color: '#fff',
              border: 'none',
              cursor: 'pointer',
              borderRadius: '4px',
            }}>
              ← Back to Magazine
            </button>
          </Link>
        </div>
      </main>
    </>
  );
}
