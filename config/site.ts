export const site = {
  name: "PicMagic",
  url: "https://picmagic.in",
  social: [
    { label: "Instagram", href: "https://www.instagram.com/picmagic.in/" },
    { label: "Facebook", href: "https://www.facebook.com/picmagic.in/" },
  ],
  title: "PicMagic. AI Photo Ideas, Editing Prompts & Reel Prompts",
  description:
    "Discover beautiful AI photo ideas, enhancement prompts and reel concepts for men, women, couples, kids, weddings, birthdays and more.",
  contact: process.env.NEXT_PUBLIC_CONTACT_EMAIL || "",
  operator: process.env.NEXT_PUBLIC_OPERATOR_NAME || "",
  indexing:
    process.env.NEXT_PUBLIC_INDEXING_ENABLED === "true" &&
    process.env.CONTEXT !== "deploy-preview" &&
    process.env.CONTEXT !== "branch-deploy" &&
    (!process.env.VERCEL_ENV || process.env.VERCEL_ENV === "production"),
};
export const navigation = [
  { href: "/ai-prompts", label: "Explore" },
  { href: "/enhance-photo", label: "Enhance photo" },
  { href: "/reel-prompts", label: "Reels" },
  { href: "/create", label: "Create" },
];
