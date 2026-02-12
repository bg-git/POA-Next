import { GetStaticProps, GetStaticPaths } from 'next';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

interface Studio {
  id: number;
  name: string;
  slug: string;
  area: string;
  area_slug: string;
  address?: string;
  phone?: string;
  website?: string;
  instagram?: string;
  facebook?: string;
  logo_url?: string;
}

export const getStaticPaths: GetStaticPaths = async () => {
  const { data: studios } = await supabase.from('studios').select('area_slug, slug');

  const paths = (studios || []).map((studio) => ({
    params: {
      area: studio.area_slug,
      company: studio.slug,
    },
  }));

  return {
    paths,
    fallback: 'blocking',
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const area = params?.area as string;
  const company = params?.company as string;

  const { data: studios } = await supabase
    .from('studios')
    .select('*')
    .eq('area_slug', area)
    .eq('slug', company)
    .limit(1);

  if (!studios || studios.length === 0) {
    return { notFound: true };
  }

  return {
    props: {
      studio: studios[0],
    },
    revalidate: 3600, // Revalidate every hour
  };
};

export default function StudioPage({ studio }: { studio: Studio }) {
  return (
    <div className="studio-page">
      <div className="studio-card">
        <h1 className="studio-name">{studio.name}</h1>

        <img
          src={studio.logo_url || '/default-logo.jpg'}
          alt={`${studio.name} logo`}
          className="studio-logo"
        />

        {studio.address && (
          <p className="studio-detail">
            <strong>Address:</strong> {studio.address}
          </p>
        )}

        {studio.phone && (
          <p className="studio-detail">
            <strong>Phone:</strong> {studio.phone}
          </p>
        )}

        <div className="studio-links">
          {studio.website && (
            <a href={studio.website} target="_blank" rel="noopener noreferrer" className="studio-link">
              Website
            </a>
          )}
          {studio.instagram && (
            <a href={studio.instagram} target="_blank" rel="noopener noreferrer" className="studio-link">
              Instagram
            </a>
          )}
          {studio.facebook && (
            <a href={studio.facebook} target="_blank" rel="noopener noreferrer" className="studio-link">
              Facebook
            </a>
          )}
        </div>

        <div className="studio-claim">
          <p>Own this studio?</p>
          <Link href="/contact" className="claim-button">
            Claim this listing
          </Link>
        </div>
      </div>
    </div>
  );
}
