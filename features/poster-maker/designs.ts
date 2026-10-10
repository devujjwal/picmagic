export const posterDesigns = [
  {
    id: "diwali",
    templateId: "70731da7-b45d-44db-a462-7c360c811001",
    slug: "diwali-business-greeting",
    name: "Diwali · pools of light",
    artwork: "/previews/festival-diwali-art.webp",
    background: "#111832",
    accent: "#f6c571",
    en: "Happy Diwali",
    hi: "दीपावली की शुभकामनाएँ",
    messageEn: "May every new beginning shine brighter.",
    messageHi: "हर नई शुरुआत खुशियों से रोशन हो।",
  },
  {
    id: "durga-puja",
    templateId: "70731da7-b45d-44db-a462-7c360c811002",
    slug: "durga-puja-business-greeting",
    name: "Durga Puja · festive togetherness",
    artwork: "/previews/festival-durga-puja-art.webp",
    background: "#641e2c",
    accent: "#ffe1ab",
    en: "Happy Durga Puja",
    hi: "दुर्गा पूजा की शुभकामनाएँ",
    messageEn: "Celebrating strength, hope and togetherness.",
    messageHi: "शक्ति, आशा और खुशियों का उत्सव।",
  },
  {
    id: "dussehra",
    templateId: "70731da7-b45d-44db-a462-7c360c811003",
    slug: "dussehra-business-greeting",
    name: "Dussehra · a brighter beginning",
    artwork: "/previews/festival-dussehra-art.webp",
    background: "#183d37",
    accent: "#ffdc95",
    en: "Happy Dussehra",
    hi: "दशहरा की शुभकामनाएँ",
    messageEn: "A celebration of courage and new beginnings.",
    messageHi: "साहस और नई शुरुआत का उत्सव।",
  },
] as const;
export type DesignId = (typeof posterDesigns)[number]["id"];
export type PosterDesign = (typeof posterDesigns)[number];
export const formats = {
  square: [1080, 1080],
  portrait: [1080, 1350],
  story: [1080, 1920],
} as const;
export type PosterState = {
  design: DesignId;
  language: "en" | "hi";
  format: keyof typeof formats;
  layout: "centered" | "split";
  name: string;
  greeting: string;
  message: string;
  website: string;
  email: string;
  phone: string;
  details: string;
  accent: string;
  photoX: number;
  photoY: number;
  zoom: number;
};
export function getDesign(id: unknown): PosterDesign {
  return posterDesigns.find((d) => d.id === id) ?? posterDesigns[0];
}
export function initialPoster(
  id: unknown = "diwali",
  language: "en" | "hi" = "en",
): PosterState {
  const d = getDesign(id);
  return {
    design: d.id,
    language,
    format: "portrait",
    layout: "centered",
    name: "",
    greeting: d[language],
    message: language === "hi" ? d.messageHi : d.messageEn,
    website: "",
    email: "",
    phone: "",
    details: "",
    accent: d.accent,
    photoX: 50,
    photoY: 50,
    zoom: 1,
  };
}
export const textLimits = {
  name: 60,
  greeting: 90,
  message: 180,
  website: 80,
  email: 80,
  phone: 40,
  details: 120,
} as const;
export function validatePoster(state: PosterState): string[] {
  const errors: string[] = [];
  if (!state.greeting.trim()) errors.push("Add a greeting before downloading.");
  for (const [key, limit] of Object.entries(textLimits)) {
    if (state[key as keyof typeof textLimits].length > limit)
      errors.push(`${key} is too long.`);
  }
  if (!/^#[a-f\d]{6}$/i.test(state.accent))
    errors.push("Choose a valid colour.");
  return errors;
}
