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
  when: "Friday, August 14, 2026 · Time TBD",
  where: "Location TBD",
  rsvpBy: "Please RSVP by Friday, August 7",

  // Extra notes (allergies-friendly, drop-off, what to bring...). Leave "" to hide.
  notes: "",

  // ---- Add-to-calendar button ----
  // Local times in the format YYYY-MM-DDTHH:MM  (24-hour clock).
  // Leave eventStart "" to hide the calendar + maps buttons.
  // (Hidden for now — fill in once the time is set.)
  eventStart: "",
  eventEnd: "",

  // ---- Map / directions button ----
  // A plain address. Used for the "Get directions" button.
  // (Hidden until the location is decided.)
  mapAddress: "",

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
