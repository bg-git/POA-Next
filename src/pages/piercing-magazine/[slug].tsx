import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import Seo from '@/components/Seo';

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

export default function BlogPost() {
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
      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '16px' }}>
        <p>Loading article...</p>
      </main>
    );
  }

  if (error || !article) {
    return (
      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '16px' }}>
        <h1>{error || 'Article not found'}</h1>
        <Link href="/piercing-magazine">
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
      <Seo
        title={article.title}
        description={article.excerpt || `Read ${article.title} on the PIERCE OF ART piercing magazine.`}
        canonical={`https://www.pierceofart.co.uk/piercing-magazine/${article.handle}`}
      />
      <Head>
        <meta property="og:type" content="article" />
        <meta property="og:title" content={article.title} />
        <meta property="og:description" content={article.excerpt || ''} />
        {article.image && <meta property="og:image" content={article.image.url} />}
        <meta property="og:url" content={`https://www.pierceofart.co.uk/piercing-magazine/${article.handle}`} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={article.title} />
        <meta name="twitter:description" content={article.excerpt || ''} />
        {article.image && <meta name="twitter:image" content={article.image.url} />}

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "BlogPosting",
              "headline": article.title,
              "description": article.excerpt || `Read ${article.title} on the PIERCE OF ART piercing magazine.`,
              "datePublished": article.publishedAt,
              "dateModified": article.publishedAt,
              "author": {
                "@type": "Person",
                "name": article.author?.name || "PIERCE OF ART"
              },
              "publisher": {
                "@type": "Organization",
                "name": "PIERCE OF ART",
                "logo": {
                  "@type": "ImageObject",
                  "url": "https://www.pierceofart.co.uk/auricle-logo.png"
                }
              },
              "mainEntityOfPage": {
                "@type": "WebPage",
                "@id": `https://www.pierceofart.co.uk/piercing-magazine/${article.handle}`
              },
              ...(article.image && {
                image: {
                  "@type": "ImageObject",
                  "url": article.image.url,
                }
              })
            })
          }}
        />
      </Head>

      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '16px' }}>
        <article className="blog-post">
          <h1>{article.title}</h1>

          <div className="blog-layout">
            {article.image && (
              <div className="blog-image">
                <img
                  src={article.image.url}
                  alt={article.image.altText || article.title}
                  style={{ width: '100%', height: 'auto', objectFit: 'cover' }}
                />
              </div>
            )}

            <div
              className="blog-content"
              dangerouslySetInnerHTML={{ __html: article.content }}
            />
          </div>

          <div style={{ marginTop: '40px', paddingTop: '20px', borderTop: '1px solid #e0e0e0' }}>
            <Link href="/piercing-magazine">
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
        </article>
      </main>
    </>
  );
}
