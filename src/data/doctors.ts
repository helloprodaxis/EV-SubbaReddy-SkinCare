export type Doctor = {
  slug: string;
  name: string;
  qualifications: string;
  role: string;
  specialties: string[];
  bio: string;
  highlights: string[];
};

export const doctors: Doctor[] = [
  {
    slug: "subba-reddy",
    name: "Dr. E.V. Subba Reddy",
    qualifications: "MD, DD",
    role: "Chief Dermatologist & Founder",
    specialties: ["Skin", "Hair", "Nail", "Allergy", "Laser"],
    bio: "Dr. Subba Reddy founded the clinic with the conviction that small-town India deserves the same standard of dermatological care as the metros. He brings two decades of clinical experience and a research-trained eye to every consultation.",
    highlights: [
      "MD, Doctor of Dermatology",
      "Ex-Registrar — JIPMER Hospital, Pondicherry",
      "20+ years in clinical dermatology",
      "Special interest in laser, allergy and hair restoration",
    ],
  },
  {
    slug: "vishnu-priya",
    name: "Dr. B. Vishnu Priya",
    qualifications: "MBBS, MD (DVL)",
    role: "Dermatologist & Cosmetologist",
    specialties: ["Cosmetology", "Skin", "Anti-ageing"],
    bio: "Dr. Vishnu Priya leads the clinic's cosmetology practice — chemical peels, microdermabrasion, pigmentation correction and medically-supervised skin rejuvenation.",
    highlights: [
      "MD in Dermatology, Venereology & Leprosy",
      "Certified in advanced cosmetic procedures",
      "Focus on evidence-based cosmetic dermatology",
    ],
  },
  {
    slug: "siva-sankar-reddy",
    name: "Dr. S. Siva Sankar Reddy",
    qualifications: "MBBS, DDVL",
    role: "Skin & STD Specialist",
    specialties: ["General Dermatology", "STD", "Allergy"],
    bio: "Dr. Siva Sankar Reddy handles general dermatology and confidential STD consultations with a discreet, judgement-free approach.",
    highlights: [
      "Diploma in Dermatology, Venereology & Leprosy",
      "Confidential consultation protocol",
      "Special interest in chronic skin conditions",
    ],
  },
];
