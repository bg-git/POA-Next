import Link from 'next/link';
import Head from 'next/head';
import type { GetStaticProps } from 'next';

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
  author?: {
    name: string;
  };
}

interface Props {
  articles: BlogArticle[];
}

export default function MagazinePage({ articles }: Props) {

  return (
    <>
      <Head>
        <title>Piercing Magazine - PIERCE OF ART</title>
        <meta 
          name="description" 
          content="Read our latest blog posts about body piercing, jewelry, and piercing studios." 
        />
      </Head>

      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' }}>
        <div style={{ marginBottom: '40px' }}>
          <h1 style={{ fontSize: '2.5em', marginBottom: '10px' }}>Piercing Magazine</h1>
          <p style={{ fontSize: '1.1em', color: '#666' }}>
            Latest insights and articles about professional body piercing
          </p>
        </div>

        {articles.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <p>No articles found.</p>
          </div>
        )}

        {articles.length > 0 && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: '30px',
            }}
          >
            {articles.map((article) => (
              <Link
                key={article.id}
                href={`/blogs/piercing-magazine/${article.handle}`}
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <div
                  style={{
                    border: '1px solid #e0e0e0',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    transition: 'transform 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-5px)';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)';
                  }}
                >
                  {article.image && (
                    <div
                      style={{
                        width: '100%',
                        height: '200px',
                        backgroundColor: '#f0f0f0',
                        overflow: 'hidden',
                      }}
                    >
                      <img
                        src={article.image.url}
                        alt={article.image.altText || article.title}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                        }}
                      />
                    </div>
                  )}

                  <div style={{ padding: '20px' }}>
                    <h2 style={{ fontSize: '1.3em', marginBottom: '10px', marginTop: 0 }}>
                      {article.title}
                    </h2>

                    <p
                      style={{
                        color: '#666',
                        marginBottom: '15px',
                        lineHeight: '1.6',
                      }}
                    >
                      {article.excerpt}
                    </p>

                    <div
                      style={{
                        fontSize: '0.9em',
                        color: '#999',
                      }}
                    >
                      {new Date(article.publishedAt).toLocaleDateString('en-GB', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </>
  );
}

export const getStaticProps: GetStaticProps<Props> = async () => {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/shopify/blog/articles?blog=magazine`);
    
    if (!res.ok) throw new Error('Failed to fetch articles');
    
    const data = await res.json();
    const articles = (data.articles || []).sort((a: BlogArticle, b: BlogArticle) => 
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );
    
    return {
      props: {
        articles,
      },
      revalidate: 3600, // Revalidate every hour (ISR)
    };
  } catch (error) {
    console.error('Error fetching blog articles:', error);
    
    return {
      props: {
        articles: [],
      },
      revalidate: 60, // Retry after 1 minute on error
    };
  }
};
