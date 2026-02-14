/**
 * ═══════════════════════════════════════════════════════════
 *  RATTY RUN — SITE CONTENT
 *  Edit the text and image paths below to update the website.
 *  Images go in the /public folder.
 * ═══════════════════════════════════════════════════════════
 */

export const siteContent = {
  // ── Global ──
  clubName: "Ratty Run",
  tagline: "A community run club based in New York City.",
  instagram: "https://instagram.com/therattyrun",
  instagramHandle: "@therattyrun",
  strava: "https://strava.com",
  location: "NYC",

  // ── Home Page ──
  home: {
    // Replace with your own image path (put the file in /public)
    heroImage: "/hero.jpg",
    weeklyRuns: {
      day: "Every Saturday",
      time: "8:00 AM",
      location: "Central Park, NYC",
    },
    description:
      "A community run club in New York City. All paces welcome. We run together, we grow together.",
  },

  // ── About Page ──
  about: {
    // Replace with your own image path (put the file in /public)
    image: "/about.jpg",
    heading: "About Ratty Run",
    // Add your paragraphs below. Each string becomes its own paragraph.
    paragraphs: [
      "Add your first paragraph here. Tell people what Ratty Run is all about — the mission, the vibe, the community.",
      "Add a second paragraph. Maybe talk about how the club started, who it's for, and what makes it different.",
      "Add a third paragraph if you'd like. Share the vision for the future, upcoming plans, or anything else.",
    ],
    // Optional caption that appears below the image
    imageCaption: "",
  },
};
