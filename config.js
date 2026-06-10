// ============================================================
//  EDIT YOUR PARTY DETAILS HERE  🐍
//  Change the values below and refresh the page.
// ============================================================
window.PARTY = {
  // The big title at the top. Use the child's name + age.
  title: "Maya is Turning 8!",

  age: "8",

  // Shown in the details list
  guestOfHonor: "Maya",
  when: "Saturday, August 15, 2026 · 2:00 PM",
  where: "Fowler Creek Park\nAltia Ave & Cortona Dr\nSan Jose, CA 95135\n(Evergreen neighborhood)",
  rsvpBy: "Please RSVP by Friday, August 7",

  // Extra notes (allergies-friendly, drop-off, what to bring...). Leave "" to hide.
  notes: "",

  // ---- Add-to-calendar button ----
  // Local times in the format YYYY-MM-DDTHH:MM  (24-hour clock).
  // Leave eventStart "" to hide the calendar + maps buttons.
  eventStart: "2026-08-15T14:00",
  eventEnd: "2026-08-15T16:00", // assumed 2-hour party; change if needed

  // ---- Map / directions button ----
  // A plain address. Used for the "Get directions" button.
  mapAddress: "Fowler Creek Park, San Jose, CA 95135",

  // ---- Gift / wishlist note ----  (leave giftNote "" to hide the section)
  giftNote: "",
  wishlistUrl: "", // optional link, e.g. an Amazon wishlist. "" hides the button.

  // ---- Host contact (tap to text / call / save) ----
  // Leave hostPhone "" to hide this section.
  hostName: "Kody Smith",
  hostPhone: "+15103757852",

  // ---- Where RSVPs are sent ----
  // Paste your Google Apps Script Web App URL here (see README.md, step-by-step).
  // Until you do, RSVPs are saved in the browser so you can still test the form.
  sheetUrl: "https://script.google.com/macros/s/AKfycbwXg4LLOAfwSc-thMLDaosoOL9KBszYiM71jJssnJxSC3-XvKz4nRmELyul9j5a4vWe/exec",
};
