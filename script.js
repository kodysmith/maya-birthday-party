(function () {
  "use strict";
  var P = window.PARTY || {};

  // ---- Fill invitation details from config.js ----
  function setText(id, value) {
    var el = document.getElementById(id);
    if (el && value != null && value !== "") el.textContent = value;
  }
  if (P.title) document.getElementById("title").textContent = P.title;
  setText("age", P.age);
  setText("d-name", P.guestOfHonor);
  setText("d-when", P.when);
  setText("d-where", P.where);
  setText("d-rsvp", P.rsvpBy);
  setText("d-notes", P.notes);
  if (P.title) document.title = P.title + " 🐍";

  // ---- Add to calendar + directions ----
  function show(id) { var el = document.getElementById(id); if (el) el.hidden = false; }

  // turn "2026-07-12T14:00" into "20260712T140000" (floating local time)
  function cal(dt) { return (dt || "").replace(/[-:]/g, "").replace(/T(\d{4})$/, "T$100"); }

  if (P.eventStart && P.eventEnd) {
    var start = cal(P.eventStart), end = cal(P.eventEnd);
    var title = encodeURIComponent(P.title || "Birthday Party");
    var loc = encodeURIComponent((P.mapAddress || P.where || "").replace(/\n/g, ", "));
    var det = encodeURIComponent(P.notes || "");

    var gcal = "https://calendar.google.com/calendar/render?action=TEMPLATE&text=" +
      title + "&dates=" + start + "/" + end + "&location=" + loc + "&details=" + det;

    // Build an .ics file for Apple/Outlook as a downloadable data URL.
    var ics = [
      "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//birthday//EN",
      "BEGIN:VEVENT",
      "UID:" + start + "@birthday",
      "DTSTART:" + start, "DTEND:" + end,
      "SUMMARY:" + (P.title || "Birthday Party"),
      "LOCATION:" + (P.mapAddress || P.where || "").replace(/\n/g, ", "),
      "DESCRIPTION:" + (P.notes || ""),
      "END:VEVENT", "END:VCALENDAR",
    ].join("\r\n");
    var icsUrl = "data:text/calendar;charset=utf-8," + encodeURIComponent(ics);

    var calBtn = document.getElementById("btn-calendar");
    calBtn.hidden = false;
    // On a touch device, .ics opens the native calendar; elsewhere use Google.
    var isTouch = window.matchMedia && window.matchMedia("(pointer: coarse)").matches;
    calBtn.href = isTouch ? icsUrl : gcal;
    calBtn.target = isTouch ? "_self" : "_blank";
    if (isTouch) calBtn.setAttribute("download", "party.ics");
    else calBtn.rel = "noopener";
  }

  if (P.mapAddress) {
    var mapBtn = document.getElementById("btn-map");
    mapBtn.hidden = false;
    mapBtn.href = "https://www.google.com/maps/search/?api=1&query=" +
      encodeURIComponent(P.mapAddress);
  }

  // ---- Gift / wishlist ----
  if (P.giftNote) {
    show("gift-block");
    document.getElementById("gift-note").textContent = P.giftNote;
    if (P.wishlistUrl) {
      var wl = document.getElementById("btn-wishlist");
      wl.hidden = false;
      wl.href = P.wishlistUrl;
    }
  }

  // ---- Host contact: text / call / save vCard ----
  if (P.hostPhone) {
    show("host-block");
    if (P.hostName) document.getElementById("host-name").textContent = P.hostName;
    var smsBody = encodeURIComponent("Hi! About " + (P.guestOfHonor || "the") + "'s party — ");
    var textBtn = document.getElementById("btn-text");
    textBtn.hidden = false;
    textBtn.href = "sms:" + P.hostPhone + "?&body=" + smsBody;
    var callBtn = document.getElementById("btn-call");
    callBtn.hidden = false;
    callBtn.href = "tel:" + P.hostPhone;

    // Downloadable contact card.
    var vcard = [
      "BEGIN:VCARD", "VERSION:3.0",
      "FN:" + (P.hostName || "Party Host"),
      "TEL;TYPE=CELL:" + P.hostPhone,
      "NOTE:" + ((P.guestOfHonor || "") + "'s birthday party host"),
      "END:VCARD",
    ].join("\r\n");
    var saveBtn = document.getElementById("btn-save-contact");
    saveBtn.hidden = false;
    saveBtn.href = "data:text/vcard;charset=utf-8," + encodeURIComponent(vcard);
  }

  // ---- RSVP form handling ----
  var form = document.getElementById("rsvp-form");
  var btn = document.getElementById("submit-btn");
  var status = document.getElementById("form-status");
  var section = document.getElementById("rsvp");

  function showStatus(msg, kind) {
    status.textContent = msg;
    status.className = "form-status" + (kind ? " " + kind : "");
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    if (!form.reportValidity()) return;

    var data = Object.fromEntries(new FormData(form).entries());
    data.submittedAt = new Date().toISOString();

    btn.disabled = true;
    showStatus("Sending… 🐍", "");

    send(data)
      .then(function () {
        celebrate(data);
      })
      .catch(function (err) {
        console.error(err);
        btn.disabled = false;
        showStatus("Hmm, that didn't send. Please try again or text us!", "err");
      });
  });

  function send(data) {
    // No backend configured yet → save locally so the form is still testable.
    if (!P.sheetUrl) {
      var saved = JSON.parse(localStorage.getItem("rsvps") || "[]");
      saved.push(data);
      localStorage.setItem("rsvps", JSON.stringify(saved));
      console.info("RSVP saved locally (no sheetUrl set). All RSVPs:", saved);
      return Promise.resolve();
    }
    // POST to Google Apps Script web app. URLSearchParams keeps it a
    // "simple" request so the browser skips the CORS preflight.
    var body = new URLSearchParams();
    Object.keys(data).forEach(function (k) { body.append(k, data[k]); });
    return fetch(P.sheetUrl, { method: "POST", body: body })
      .then(function (r) {
        if (!r.ok) throw new Error("HTTP " + r.status);
        return r.text();
      });
  }

  // ---- Success state + confetti ----
  function celebrate(data) {
    var attending = (data.attending || "").toLowerCase();
    var msg, emoji;
    if (attending === "no") {
      emoji = "💚"; msg = "Thanks for letting us know — we'll miss you!";
    } else if (attending === "maybe") {
      emoji = "🤞"; msg = "Got it — hope you can make it!";
    } else {
      emoji = "🎉🐍"; msg = "You're on the list! See you at the party!";
    }
    section.classList.add("done");
    var thanks = document.createElement("div");
    thanks.className = "thanks";
    thanks.innerHTML =
      '<div class="big">' + emoji + "</div>" +
      "<h3>Thank you, " + escapeHtml(data.parentName || "friend") + "!</h3>" +
      "<p>" + msg + "</p>";
    section.appendChild(thanks);
    if (attending !== "no") confetti();
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  // ---- Tiny confetti (snakes + sparkles) ----
  function confetti() {
    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    var canvas = document.getElementById("confetti");
    var ctx = canvas.getContext("2d");
    var W = (canvas.width = window.innerWidth);
    var H = (canvas.height = window.innerHeight);
    var emojis = ["🐍", "🎉", "💚", "✨", "🎂", "🟢"];
    var bits = [];
    for (var i = 0; i < 70; i++) {
      bits.push({
        x: Math.random() * W,
        y: -20 - Math.random() * H,
        vy: 2 + Math.random() * 4,
        vx: -1 + Math.random() * 2,
        rot: Math.random() * 6.28,
        vr: -0.1 + Math.random() * 0.2,
        s: 16 + Math.random() * 18,
        e: emojis[(Math.random() * emojis.length) | 0],
      });
    }
    var start = Date.now();
    (function frame() {
      ctx.clearRect(0, 0, W, H);
      bits.forEach(function (b) {
        b.x += b.vx; b.y += b.vy; b.rot += b.vr;
        ctx.save();
        ctx.translate(b.x, b.y);
        ctx.rotate(b.rot);
        ctx.font = b.s + "px serif";
        ctx.textAlign = "center";
        ctx.fillText(b.e, 0, 0);
        ctx.restore();
      });
      if (Date.now() - start < 4000) requestAnimationFrame(frame);
      else ctx.clearRect(0, 0, W, H);
    })();
  }
})();
