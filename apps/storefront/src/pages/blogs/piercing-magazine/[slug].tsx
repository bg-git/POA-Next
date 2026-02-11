import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import type { GetStaticProps, GetStaticPaths } from 'next';

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

interface Props {
  article: BlogArticle | null;
}

export default function ArticlePage({ article }: Props) {
  if (!article) {
    return (
      <main style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 20px' }}>
        <h1>Article not found</h1>
        <Link href="/blogs/piercing-magazine">
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
        <style>{`
          .article-content h1,
          .article-content h2,
          .article-content h3,
          .article-content h4,
          .article-content h5,
          .article-content h6 {
            margin-top: 1.5em;
            margin-bottom: 0.5em;
          }
          .article-content p {
            margin-bottom: 1em;
          }
          .article-content ul,
          .article-content ol {
            margin-bottom: 1em;
            margin-left: 1.5em;
          }
          .article-content li {
            margin-bottom: 0.5em;
          }
          .article-content img {
            max-width: 100%;
            height: auto;
            margin: 1.5em 0;
          }
          .article-content blockquote {
            border-left: 4px solid #ddd;
            margin: 1.5em 0;
            padding-left: 1em;
            color: #666;
          }
        `}</style>
      </Head>

      <main style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 20px' }}>
        <Link href="/blogs/piercing-magazine" style={{ textDecoration: 'none', color: '#666' }}>
          ← Back to Magazine
        </Link>

        <article style={{ marginTop: '40px' }}>
          <header style={{ marginBottom: '40px' }}>
            <h1 style={{ fontSize: '2.2em', marginBottom: '20px', marginTop: 0 }}>
              {article.title}
            </h1>

            <div
              style={{
                fontSize: '0.95em',
                color: '#666',
                borderTop: '1px solid #e0e0e0',
                borderBottom: '1px solid #e0e0e0',
                paddingTop: '15px',
                paddingBottom: '15px',
              }}
            >
              {new Date(article.publishedAt).toLocaleDateString('en-GB', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </div>
          </header>

          {article.image && (
            <figure style={{ margin: '40px 0', textAlign: 'center' }}>
              <Image
                src={article.image.url}
                alt={article.image.altText || article.title}
                width={800}
                height={400}
                style={{
                  maxWidth: '100%',
                  height: 'auto',
                  borderRadius: '8px',
                }}
              />
            </figure>
          )}

          <div
            className="article-content"
            style={{
              lineHeight: '1.8',
              fontSize: '1.05em',
              color: '#333',
            }}
          >
            {article.content ? (
              <div dangerouslySetInnerHTML={{ __html: article.content }} />
            ) : (
              <p>No content available</p>
            )}
          </div>
        </article>

        <div style={{ marginTop: '60px', paddingTop: '20px', borderTop: '1px solid #e0e0e0' }}>
          <Link href="/blogs/piercing-magazine">
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

export const getStaticPaths: GetStaticPaths = async () => {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/shopify/blog/articles?blog=magazine`);
    
    if (!res.ok) throw new Error('Failed to fetch articles');
    
    const data = await res.json();
    const paths = (data.articles || []).map((article: BlogArticle) => ({
      params: { slug: article.handle },
    }));

    return {
      paths,
      fallback: 'blocking', // Generate on demand if not pre-generated
    };
  } catch (error) {
    console.error('Error generating static paths:', error);
    
    return {
      paths: [],
      fallback: 'blocking',
    };
  }
};

export const getStaticProps: GetStaticProps<Props> = async ({ params }) => {
  try {
    const slug = params?.slug as string;
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/shopify/blog/articles?blog=magazine&handle=${slug}`);
    
    if (!res.ok) throw new Error('Failed to fetch article');
    
    const data = await res.json();
    const article = data.articles?.[0] || null;
    
    return {
      props: {
        article,
      },
      revalidate: 3600, // Revalidate every hour (ISR)
    };
  } catch (error) {
    console.error('Error fetching article:', error);
    
    return {
      props: {
        article: null,
      },
      revalidate: 60, // Retry after 1 minute on error
    };
  }
};
