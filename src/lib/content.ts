export interface SiteContent {
  clubName: string;
  tagline: string;
  instagram: string;
  instagramHandle: string;
  strava: string;
  location: string;
  home: {
    heroImage: string;
    weeklyRuns: { day: string; time: string; location: string };
    description: string;
  };
  about: {
    image: string;
    heading: string;
    paragraphs: string[];
    imageCaption: string;
  };
}

export async function getContent(): Promise<SiteContent> {
  const fs = await import("fs/promises");
  const path = await import("path");
  const filePath = path.join(process.cwd(), "public", "content.json");
  const data = await fs.readFile(filePath, "utf-8");
  return JSON.parse(data);
}
