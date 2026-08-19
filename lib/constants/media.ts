const ACADEMY_IMAGES = "/images/academy";

export const SITE_LOGO_SRC = `${ACADEMY_IMAGES}/SIE.jpg`;

export interface HeroSlide {
  src: string;
  alt: string;
}

/**
 * Verified real SKAFF ACADEMY hero imagery. These are the only 4 assets provided for this
 * placement — displayed with a strong overlay so they read as ambient background texture
 * rather than literal documentary photography. Swap for real campus photography when available.
 */
export const HERO_SLIDES: HeroSlide[] = [
  { src: `${ACADEMY_IMAGES}/sie-bg1.jpg`, alt: "SKAFF ACADEMY — practical, technology-focused training" },
  { src: `${ACADEMY_IMAGES}/sie-bg2.jpg`, alt: "SKAFF ACADEMY — hands-on skills for real work" },
  { src: `${ACADEMY_IMAGES}/sie-bg3.jpg`, alt: "SKAFF ACADEMY — connecting learners to industry practice" },
  { src: `${ACADEMY_IMAGES}/sie-bg4.jpg`, alt: "SKAFF ACADEMY — turning ideas into practical skills" },
];

/**
 * Verified real photos/thumbnails matched to real SKAFF programs by slug. Only programs with a
 * genuinely matching asset are listed here — everything else keeps the neutral ImagePlaceholder.
 * Both program cards and the program detail page read from this single map.
 */
export const PROGRAM_IMAGES: Partial<Record<string, string>> = {
  "full-stack-development": `${ACADEMY_IMAGES}/fulls.jpg`,
  "frontend-development": `${ACADEMY_IMAGES}/frontend.jpg`,
  "backend-development": `${ACADEMY_IMAGES}/backend.jpg`,
  "ui-ux-design": `${ACADEMY_IMAGES}/ui.jpg`,
  "audio-production": `${ACADEMY_IMAGES}/audio.jpg`,
  // background2.jpeg carries SKAFF ACADEMY's own watermark — genuine branded equipment photography.
  "video-production": `${ACADEMY_IMAGES}/background2.jpeg`,
};

/** Real, verified-in-context Academy training photography for the homepage gallery strip. */
export const TRAINING_GALLERY_IMAGES: Partial<Record<string, string>> = {
  "Audio production": `${ACADEMY_IMAGES}/audio.jpg`,
  "Video production": `${ACADEMY_IMAGES}/video.jpg`,
};
