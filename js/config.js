/**
 * SITE CONFIG — single source of truth for event facts used across pages.
 * In production, seat counts and payment status MUST come from a verified
 * backend API, never trusted from client state alone. The values below are
 * DEMO/MOCK data for front-end behavior only. See README for backend notes.
 */
window.HACKATHON_CONFIG = {
  eventName: "Agartala AI Website Hackathon 2026",
  tagline: "2 Hours. 1 Challenge. Build with AI.",
  // Demo date/time — update for the real event. ISO with +05:30 (IST) offset.
  eventDateISO: "2026-12-12T17:30:00+05:30",
  eventDisplayDate: "Saturday, 12 December 2026",
  eventDisplayTime: "5:30 PM – 9:00 PM IST",
  format: "Online via Google Meet",
  totalSeats: 50,
  earlyBirdSeats: 5,
  earlyBirdPrice: 299,
  standardPrice: 499,
  currency: "₹",
  // MOCK seat data — a real deployment must fetch this from a backend.
  // registeredCount simulates how many of the 50 seats are filled.
  mockRegisteredCount: 21,
  prizes: {
    first: { amount: 5000, extra: "+ 1 month Claude Pro subscription" },
    second: { amount: 3500 },
    third: { amount: 2000 },
    pool: 10500
  },
  judging: [
    { criterion: "Functionality", points: 25 },
    { criterion: "UI/UX", points: 20 },
    { criterion: "Problem Understanding", points: 15 },
    { criterion: "Creativity", points: 15 },
    { criterion: "AI-Assisted Development", points: 10 },
    { criterion: "Technical Implementation", points: 10 },
    { criterion: "Final Presentation", points: 5 }
  ],
  contact: {
    email: "hello@agartalaaihackathon.example",
    whatsapp: "+91-00000-00000",
    instagram: "https://instagram.com/example",
    linkedin: "https://linkedin.com/company/example"
  }
};
