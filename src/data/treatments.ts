export type Treatment = {
  slug: string;
  title: string;
  category: "skin" | "laser" | "hair" | "cosmetology" | "general";
  blurb: string;
  duration: string;
  conditions: string[];
};

export const treatments: Treatment[] = [
  {
    slug: "chemical-peels",
    title: "Chemical Peels",
    category: "cosmetology",
    blurb:
      "Medical-grade glycolic, salicylic and TCA peels to renew dull, congested or pigmented skin. Performed in a controlled clinical setting.",
    duration: "30 – 45 min",
    conditions: ["Pigmentation", "Acne marks", "Dull skin", "Melasma"],
  },
  {
    slug: "laser-hair-reduction",
    title: "Laser Hair Reduction",
    category: "laser",
    blurb:
      "Long-pulse Nd:YAG and diode laser sessions for safe, lasting hair reduction across face, underarms, legs and body — calibrated for Indian skin tones.",
    duration: "20 – 90 min",
    conditions: ["Unwanted hair", "PCOS-related hair", "Ingrown hair"],
  },
  {
    slug: "microdermabrasion",
    title: "Microdermabrasion",
    category: "cosmetology",
    blurb:
      "A gentle physical exfoliation that lifts away dead surface cells and reveals a smoother, brighter complexion. Zero downtime.",
    duration: "30 min",
    conditions: ["Dull skin", "Open pores", "Mild acne marks"],
  },
  {
    slug: "phototherapy",
    title: "Phototherapy",
    category: "skin",
    blurb:
      "Narrow-band UVB phototherapy for psoriasis, vitiligo and chronic eczema — administered under direct medical supervision.",
    duration: "5 – 15 min / session",
    conditions: ["Psoriasis", "Vitiligo", "Eczema", "Lichen planus"],
  },
  {
    slug: "electrocautery",
    title: "Electrocautery & Radiofrequency",
    category: "general",
    blurb:
      "Quick, scar-minimising removal of skin tags, warts, moles and DPNs using radiofrequency / electrocautery.",
    duration: "15 – 30 min",
    conditions: ["Skin tags", "Warts", "Moles", "DPN"],
  },
  {
    slug: "scar-reduction",
    title: "Scar & Acne Mark Reduction",
    category: "cosmetology",
    blurb:
      "Combination protocols — microneedling, fractional laser, peels and topical actives — to soften acne scars, surgical scars and stretch marks.",
    duration: "45 – 60 min",
    conditions: ["Acne scars", "Stretch marks", "Surgical scars"],
  },
  {
    slug: "pigmentation",
    title: "Pigmentation & Melasma",
    category: "skin",
    blurb:
      "Personalised regimens combining in-clinic procedures with prescription topicals and strict photoprotection — the only protocol that actually works for melasma.",
    duration: "Consult + plan",
    conditions: ["Melasma", "Sun-induced pigmentation", "PIH"],
  },
  {
    slug: "hair-loss",
    title: "Hair Loss & Restoration",
    category: "hair",
    blurb:
      "Diagnostic-led treatment of male and female pattern hair loss — PRP, mesotherapy, prescription medication and lifestyle protocol.",
    duration: "30 – 60 min",
    conditions: ["Pattern baldness", "Telogen effluvium", "Alopecia areata"],
  },
  {
    slug: "allergy",
    title: "Allergy Evaluation",
    category: "general",
    blurb:
      "Patch testing, prick testing and a structured elimination protocol for chronic urticaria, contact dermatitis and food/drug allergies.",
    duration: "60 min",
    conditions: ["Urticaria", "Contact dermatitis", "Drug allergy"],
  },
  {
    slug: "nail-disorders",
    title: "Nail Disorders",
    category: "general",
    blurb:
      "Diagnosis and treatment of fungal nail infection, psoriatic nails, ingrown nails and pigmentary nail changes.",
    duration: "20 – 45 min",
    conditions: ["Onychomycosis", "Ingrown nails", "Nail psoriasis"],
  },
];

export const treatmentCategories = {
  skin: { label: "Medical Dermatology", color: "var(--color-clay)" },
  laser: { label: "Laser & Light", color: "var(--color-sage)" },
  hair: { label: "Hair", color: "var(--color-gold)" },
  cosmetology: { label: "Cosmetology", color: "var(--color-rose-deep)" },
  general: { label: "General", color: "var(--color-ink-muted)" },
} as const;
