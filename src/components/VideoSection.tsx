import Link from 'next/link';

interface VideoSectionProps {
  videoPath?: string;
  title?: string;
  subtitle?: string;
  description?: string;
  buttonText?: string;
  buttonLink?: string;
}

export default function VideoSection({
  videoPath = '/piercing-near-me.mp4',
  title = 'PIERCING JEWELLERY',
  subtitle = 'PIERCING AGAINST THE ORDINARY',
  description = 'Explore our full collection of high-quality piercing jewellery, crafted from implant-grade materials and designed for safe, long-term wear.',
  buttonText = 'SHOP PIERCING JEWELLERY',
  buttonLink = '/collection',
}: VideoSectionProps) {
  return (
    <section className="video-section">
      <div className="video-container">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="video"
        >
          <source src={videoPath} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>

      <div className="video-content">
        <p className="video-subtitle">{subtitle}</p>
        <h2 className="video-title">{title}</h2>
        <p className="video-description">{description}</p>
        <Link href={buttonLink} className="video-button">
          {buttonText}
        </Link>
      </div>
    </section>
  );
}
