export interface GalleryItem {
  id: string;
  image: string;
  caption: string;
}

export interface Product {
  id: string;
  name: string;
  subtitle: string;
  price: string;
  mainImage: string;
  images: string[];
}

export interface SiteContent {
  clubName: string;
  tagline: string;
  instagram: string;
  instagramHandle: string;
  strava: string;
  location: string;
  home: {
    heroImage: string;
    logoImage: string;
    logoPosition: { x: number; y: number };
    upcomingRun: { date: string; time: string; location: string; mapEmbedUrl: string };
    description: string;
  };
  about: {
    image: string;
    heading: string;
    paragraphs: string[];
    imageCaption: string;
  };
  gallery: GalleryItem[];
  products: Product[];
}

export async function getContent(): Promise<SiteContent> {
  const fs = await import("fs/promises");
  const path = await import("path");
  const filePath = path.join(process.cwd(), "public", "content.json");
  const data = await fs.readFile(filePath, "utf-8");
  return JSON.parse(data);
}
