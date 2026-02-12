import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface ContentBlock {
  image: string;
  altText: string;
  title: string;
  link: string;
  text: string;
  position?: 'left' | 'right';
}

interface HomepageContentProps {
  contentBlocks?: ContentBlock[];
}

const defaultContentBlocks: ContentBlock[] = [
  {
    image: '/images/Childrens_ear_piercing_near_me.jpg',
    altText: 'Close up of young child getting ears pierced',
    title: "CHILDRENS' EAR PIERCING",
    link: '/childrens-ear-piercing',
    text: "We take children's safety seriously. Our piercing jewellery is independently tested to ASTM F2923 children's safety standards, ensuring it meets recognised material and safety requirements for use in young ears.",
    position: 'right',
  },
  // Add more content blocks here as needed
];

export default function HomepageContent({ contentBlocks = defaultContentBlocks }: HomepageContentProps) {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };

    // Set initial value
    handleResize();

    // Add event listener
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Helper to create anchor ID from link
  const createAnchorId = (link: string) => {
    return link.replace(/\//g, '').replace(/-/g, '-').toLowerCase();
  };

  return (
    <div className="black-content">
      {contentBlocks.map((block, index) => (
        <div
          key={index}
          id={createAnchorId(block.link)}
          className={`section ${block.position === 'right' ? 'row-reverse' : ''}`}
        >
          <div className="image-container">
            <Image
              src={block.image}
              alt={block.altText}
              width={800}
              height={800}
              className="content-image"
            />
          </div>
          <div className="text-container">
            <h2 className="text-title">
              <Link href={block.link}>{block.title}</Link>
            </h2>
            <p className="text-subtitle">{block.text}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
