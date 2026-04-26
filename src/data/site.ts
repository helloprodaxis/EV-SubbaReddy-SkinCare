/**
 * Single source of truth for clinic info. Edit this file to update
 * the site — name, address, phones, timings, social, doctors.
 */

export const site = {
  name: "Dr. E V Subba Reddy",
  fullName: "Dr. E V Subba Reddy Advanced Skin and Laser Center",
  tagline: "Advanced Skin and Laser Center",
  shortName: "Subba Reddy Skin",
  description:
    "Kadapa's trusted dermatology, cosmetology and laser clinic — led by Dr. E V Subba Reddy, MD, ex-Registrar JIPMER Pondicherry.",
  url: "https://drsubbareddyskin.in",
  city: "Kadapa",
  state: "Andhra Pradesh",
  country: "India",
  established: 1998,

  // ⚠️ TODO: replace with the new building address after the recent shift.
  address: {
    line1: "Advanced Skin and Laser Center",
    line2: "[New building address — Kadapa]",
    area: "Ganagapeta",
    city: "Kadapa",
    pincode: "516001",
    state: "Andhra Pradesh",
    country: "India",
    mapsQuery: "Dr+E+V+Subba+Reddy+Skin+Clinic+Kadapa",
  },

  phones: [
    { label: "Appointments", number: "+91 99858 45089", tel: "+919985845089" },
    { label: "Reception",    number: "+91 95745 75576", tel: "+919574575576" },
  ],

  whatsapp: "+919985845089",
  email: "appointments@drsubbareddyskin.in",

  hours: {
    weekdays: { morning: "9:30 AM – 1:30 PM", evening: "5:00 PM – 8:00 PM" },
    sunday: "Closed",
  },

  social: {
    instagram: "https://instagram.com/",
    facebook: "https://facebook.com/",
    google: "https://g.page/",
  },
} as const;

export type Site = typeof site;
