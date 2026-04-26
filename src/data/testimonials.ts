export type Testimonial = {
  quote: string;
  name: string;
  treatment: string;
  rating: number;
};

export const testimonials: Testimonial[] = [
  {
    quote:
      "I had been to three skin doctors for melasma before this. Dr. Subba Reddy was the first to actually explain why it kept coming back — and to give me a plan that worked. Six months in, the difference is real.",
    name: "Lakshmi P.",
    treatment: "Melasma protocol",
    rating: 5,
  },
  {
    quote:
      "Walked in expecting a routine clinic. The setup, the hygiene, the way procedures are explained — it feels like a metro hospital, in Kadapa. Got my mole removed in 20 minutes, no scar.",
    name: "Ravi K.",
    treatment: "Radiofrequency mole removal",
    rating: 5,
  },
  {
    quote:
      "Six laser hair sessions later and I'm finally done shaving every other day. They were honest about what laser can and can't do, which I appreciated.",
    name: "Sneha R.",
    treatment: "Laser hair reduction",
    rating: 5,
  },
  {
    quote:
      "My son's psoriasis used to flare every winter. Phototherapy here changed that completely. Calm, professional staff and very fair pricing.",
    name: "Anitha M.",
    treatment: "Phototherapy",
    rating: 5,
  },
];
