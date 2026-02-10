import Head from 'next/head';

type SeoSchemaData = {
  headline?: string;
  description?: string;
  datePublished?: string;
  dateModified?: string;
  slug?: string;
  region?: string;
  canonicalBase?: string;
};

type SeoOrganizationData = {
  name: string;
  description: string;
  url: string;
  logo?: string;
  sameAs?: string[];
  areaServed?: string[];
  knowsAbout?: string[];
};

type SeoProps = {
  title: string;
  description?: string;
  canonical?: string;
  schemaType?: 'TechArticle' | 'WebPage' | 'Organization';
  schemaData?: SeoSchemaData | SeoOrganizationData;
};

export default function Seo({ title, description, canonical, schemaType = 'WebPage', schemaData }: SeoProps) {
  const schema = schemaData && schemaType === 'TechArticle' ? {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    "@id": `${(schemaData as SeoSchemaData).canonicalBase}/quality-assurance/${(schemaData as SeoSchemaData).slug}#article`,
    "headline": (schemaData as SeoSchemaData).headline,
    "description": (schemaData as SeoSchemaData).description,
    "mainEntityOfPage": `${(schemaData as SeoSchemaData).canonicalBase}/quality-assurance/${(schemaData as SeoSchemaData).slug}`,
    "datePublished": (schemaData as SeoSchemaData).datePublished,
    "dateModified": (schemaData as SeoSchemaData).dateModified,
    "inLanguage": (schemaData as SeoSchemaData).region === 'us' ? "en-US" : "en-GB",
    "keywords": "body piercing jewellery, compliance, UK, EU, ASTM standards",
    "author": {
      "@type": "Organization",
      "name": "PIERCE OF ART",
      "url": "https://www.pierceofart.co.uk"
    },
    "publisher": {
      "@type": "Organization",
      "name": "PIERCE OF ART",
      "url": "https://www.pierceofart.co.uk"
    },
    "isPartOf": {
      "@type": "WebSite",
      "name": "PIERCE OF ART",
      "url": "https://www.pierceofart.co.uk"
    }
  } : schemaData && schemaType === 'Organization' ? {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": (schemaData as SeoOrganizationData).name,
    "description": (schemaData as SeoOrganizationData).description,
    "url": (schemaData as SeoOrganizationData).url,
    "logo": (schemaData as SeoOrganizationData).logo || "https://www.pierceofart.co.uk/auricle-logo.png",
    "image": (schemaData as SeoOrganizationData).logo || "https://www.pierceofart.co.uk/auricle-logo.png",
    "areaServed": (schemaData as SeoOrganizationData).areaServed || ["GB", "EU"],
    "knowsAbout": (schemaData as SeoOrganizationData).knowsAbout || [
      "Body Piercing Jewellery",
      "ASTM F136 Titanium",
      "ASTM F2923",
      "ASTM F2999",
      "EU Nickel Release Compliance",
      "Professional Body Piercing",
      "Jewellery Safety",
      "Material Certification"
    ],
    "sameAs": (schemaData as SeoOrganizationData).sameAs || [],
    "founder": {
      "@type": "Person",
      "name": "PIERCE OF ART Team"
    },
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "GB"
    },
    "priceRange": "£",
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "Customer Support",
      "email": "info@pierceofart.co.uk"
    }
  } : null;

  return (
    <Head>
      <title>{`${title} | PIERCE OF ART`}</title>
      {description && <meta name="description" content={description} />}
      {canonical && <link rel="canonical" href={canonical} />}
      {schema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      )}
    </Head>
  );
}
