// pages/index.tsx
import type { GetStaticProps } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import Seo from '@/components/Seo';
import VideoSection from '@/components/VideoSection';
import HomepageContent from '@/components/HomepageContent';

export const getStaticProps: GetStaticProps = async () => {
  return {
    props: {},
    revalidate: 3600, // Revalidate every hour
  };
};


// --- HOMEPAGE CONTENT ---

function HomeContent() {
  return (
    <>
      <Seo
        title="Premium Body Piercing Studio"
        description="Premium body piercing studio with locations in Chesterfield and Leicester. Shop our large selection of high-quality titanium and 14k gold piercing jewellery online with fast delivery."
        schemaType="Organization"
        schemaData={{
          name: "PIERCE OF ART",
          description: "Premium body piercing studio with locations in Chesterfield and Leicester. We offer a large selection of high-quality jewellery available online with fast delivery. All products verified to ASTM standards (F136, F2923, F2999) with independent third-party testing and mill certificates.",
          url: "https://www.pierceofart.co.uk",
          logo: "https://www.pierceofart.co.uk/auricle-logo.png",
          areaServed: ["GB", "US", "AU", "DE", "FR", "IT", "ES", "NL", "BE", "AT", "PL", "SE", "DK", "IE", "PT", "GR", "CZ", "HU"],
          knowsAbout: [
            "ASTM F136 Implant-Grade Titanium",
            "ASTM F2923 Children's Jewellery Safety",
            "ASTM F2999 Adult Jewellery Safety",
            "EU Nickel Release Compliance",
            "Professional Body Piercing",
            "Material Certification",
            "Independent Third-Party Testing",
            "UK & EU Consumer Product Safety",
            "Medical-Grade Jewellery",
            "Professional Body Piercing",
            "High Quality Piercing Jewellery"
          ],
          sameAs: []
        }}
      />

      {/* HERO SECTION - FULL WIDTH */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            DESIGN | CREATE | DEFINE
          </h1>
          <p className="hero-subtitle">
            REBELLING AGAINST THE ORDINARY
          </p>
          <div className="hero-buttons">
            <Link href="/book-a-piercing/chesterfield" className="hero-button">
              BOOK CHESTERFIELD
            </Link>
            <Link href="/book-a-piercing/leicester" className="hero-button">
              BOOK LEICESTER
            </Link>
          </div>
        </div>
      </section>

      {/* VIDEO SECTION */}
      <VideoSection
        videoPath="/piercing-near-me.mp4"
        title="PIERCING JEWELLERY"
        subtitle="PIERCING AGAINST THE ORDINARY"
        description="Explore our full collection of high-quality piercing jewellery, crafted from implant-grade materials and designed for safe, long-term wear."
        buttonText="SHOP PIERCING JEWELLERY"
        buttonLink="/collection"
      />

      {/* HOMEPAGE CONTENT SECTION */}
      <HomepageContent />

      <main className="home-page" style={{ marginTop: '0', paddingTop: '0' }}>
        <section className="custom-grid">
  {/* ENDS & GEMS (above the fold) */}
  <div className="custom-card">
    <div className="image-container">
      <Image
        src="/images/piercing_ends_and_gems_wholesale_uk.jpg"
        alt="Ends & gems"
        fill
        priority
        fetchPriority="high"
        style={{ objectFit: 'cover' }}
        sizes="(max-width: 800px) 50vw, 600px"
      />
      <div className="overlay">
        <h2 className="overlay-title">ENDS & GEMS</h2>
        <p className="overlay-subtitle">View our collection of ends & gems</p>
        <div className="overlay-buttons">
          <Link href="/browse/ends-gems" className="button">
            VIEW ALL ENDS & GEMS &#x27F6;
          </Link>
        </div>
      </div>
    </div>
  </div>

  {/* CHAINS & CHARMS (above the fold) */}
  <div className="custom-card">
    <div className="image-container">
      <Image
        src="/images/piercing_chains_and_charms_wholesale_uk.jpg"
        alt="Chains & Charms"
        fill
        priority
        fetchPriority="high"
        style={{ objectFit: 'cover' }}
        sizes="(max-width: 800px) 50vw, 600px"
      />
      <div className="overlay">
        <h2 className="overlay-title">CHAINS & CHARMS</h2>
        <p className="overlay-subtitle">
          Browse our collection of chains & charms
        </p>
        <div className="overlay-buttons">
          <Link href="/browse/chains-charms" className="button">
            VIEW ALL CHAINS & CHARMS &#x27F6;
          </Link>
        </div>
      </div>
    </div>
  </div>

  {/* RINGS (above the fold) */}
  <div className="custom-card">
    <div className="image-container">
      <Image
        src="/images/Titanium_and_gold_rings_for_piercing.jpg"
        alt="Gold Twist Ring Made from Titanium with pave gems"
        fill
        priority
        style={{ objectFit: 'cover' }}
        sizes="(max-width: 800px) 50vw, 600px"
      />
      <div className="overlay">
        <h2 className="overlay-title">RINGS & HOOPS</h2>
        <p className="overlay-subtitle">View our collection of rings</p>
        <div className="overlay-buttons">
          <Link href="/browse/rings-hoops" className="button">
            VIEW ALL RINGS &#x27F6;
          </Link>
        </div>
      </div>
    </div>
  </div>

  {/* Labrets (below the fold) */}
  <div className="custom-card">
    <div className="image-container">
      <Image
        src="/images/polished-silver-titanium-labret-back-internal-thread-4mm-base-16g-1.2mm.jpg"
        alt="Labrets"
        fill
        style={{ objectFit: 'cover' }}
        sizes="(max-width: 800px) 50vw, 600px"
      />
      <div className="overlay">
        <h2 className="overlay-title">LABRET BARS</h2>
        <p className="overlay-subtitle">
          Browse our collection of labret bars
        </p>
        <div className="overlay-buttons">
          <Link
            href="/item/labret-base-titanium-polished-16-gauge"
            className="button"
          >
            VIEW ALL LABRETS &#x27F6;
          </Link>
        </div>
      </div>
    </div>
  </div>

  {/* Plain Hinged Rings (below the fold) */}
  <div className="custom-card">
    <div className="image-container">
      <Image
        src="/images/polished-silver-titanium-hinged-piercing-ring.jpg"
        alt="Plain Hinged Rings"
        fill
        style={{ objectFit: 'cover' }}
        sizes="(max-width: 800px) 50vw, 600px"
      />
      <div className="overlay">
        <h2 className="overlay-title">PLAIN HINGED RINGS</h2>
        <p className="overlay-subtitle">
          Browse our collection of plain hinged rings
        </p>
        <div className="overlay-buttons">
          <Link
            href="/item/piercing-jewellery-plain-hinged-ring-polished-silver-titanium"
            className="button"
          >
            VIEW ALL PLAIN HINGED RINGS &#x27F6;
          </Link>
        </div>
      </div>
    </div>
  </div>

  {/* Plain Curved Barbells (below the fold) */}
  <div className="custom-card">
    <div className="image-container">
      <Image
        src="/images/16g Titanium Curved Barbell Polished SIlver.jpg"
        alt="Curved Barbells"
        fill
        style={{ objectFit: 'cover' }}
        sizes="(max-width: 800px) 50vw, 600px"
      />
      <div className="overlay">
        <h2 className="overlay-title">CURVED BARBELLS</h2>
        <p className="overlay-subtitle">
          Browse our collection of curved barbells
        </p>
        <div className="overlay-buttons">
          <Link href="/item/curved-barbell-titanium-polished" className="button">
            VIEW ALL CURVED BARBELLS &#x27F6;
          </Link>
        </div>
      </div>
    </div>
  </div>

  {/* Plain Circular Barbells (below the fold) */}
  <div className="custom-card">
    <div className="image-container">
      <Image
        src="/images/16g Internal Thread Titanium Circular Barbell Polished SIlver.jpg"
        alt="Circular Barbells"
        fill
        style={{ objectFit: 'cover' }}
        sizes="(max-width: 800px) 50vw, 600px"
      />
      <div className="overlay">
        <h2 className="overlay-title">CIRCULAR BARBELLS</h2>
        <p className="overlay-subtitle">
          Browse our collection of circular barbells
        </p>
        <div className="overlay-buttons">
          <Link href="/item/circular-barbell-titanium-polished" className="button">
            VIEW ALL CIRCULAR BARBELLS &#x27F6;
          </Link>
        </div>
      </div>
    </div>
  </div>

  {/* Plain Straight Barbells (below the fold) */}
  <div className="custom-card">
    <div className="image-container">
      <Image
        src="/images/16g Titanium Barbell Polished SIlver.jpg"
        alt="Straight Barbells"
        fill
        style={{ objectFit: 'cover' }}
        sizes="(max-width: 800px) 50vw, 600px"
      />
      <div className="overlay">
        <h2 className="overlay-title">STRAIGHT BARBELLS</h2>
        <p className="overlay-subtitle">
          Browse our collection of straight barbells
        </p>
        <div className="overlay-buttons">
          <Link href="/item/barbell-titanium-polished" className="button">
            VIEW ALL STRAIGHT BARBELLS &#x27F6;
          </Link>
        </div>
      </div>
    </div>
  </div>

  {/* Piercing Aftercare (below the fold) */}
  <div className="custom-card">
    <div className="image-container">
      <Image
        src="/images/piercemed-piercing-aftercare-spray.jpg"
        alt="Piercing Aftercare"
        fill
        style={{ objectFit: 'cover' }}
        sizes="(max-width: 800px) 50vw, 600px"
      />
      <div className="overlay">
        <h2 className="overlay-title">PIERCING AFTERCARE</h2>
        <p className="overlay-subtitle">Browse our piercing aftercare</p>
        <div className="overlay-buttons">
          <Link href="/item/piercemed-piercing-aftercare" className="button">
            VIEW PIERCING AFTERCARE &#x27F6;
          </Link>
        </div>
      </div>
    </div>
  </div>
</section>

      </main>
    </>
  );
}

// --- MAIN EXPORT ---

export default function Home() {
  return <HomeContent />;
}
