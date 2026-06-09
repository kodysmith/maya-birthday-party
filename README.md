# 🐍 Birthday Party Invitation & RSVP Site

A cute, snake-themed single-page invitation. Guests RSVP through a form that saves
straight into a Google Sheet you own. It's a plain static site — no build step, no
server to keep running — so it's free to host anywhere.

## Files

| File | What it is |
|------|-----------|
| `index.html` | The page |
| `styles.css` | Snake theme styling |
| `script.js` | Form handling + confetti |
| `config.js` | **👈 Edit your party details here** |
| `google-apps-script.gs` | Paste into Google Sheets to receive RSVPs |

## 1. Edit the party details

Open `config.js` and change the values (name, age, date, location, notes).
Save and refresh — that's it.

## 2. Preview it locally

```bash
npx serve .         # then open the printed http://localhost:... URL
# or
python3 -m http.server 8000   # then open http://localhost:8000
```

Until you connect a Google Sheet, RSVPs are saved in your browser so you can test
the form. (Open the browser console to see them.)

## 3. Connect the Google Sheet (collect RSVPs)

1. Create a new sheet at <https://sheet.new>. Rename the first tab to **RSVPs**.
2. **Extensions ▸ Apps Script**. Delete the sample code and paste all of
   `google-apps-script.gs`.
3. **Deploy ▸ New deployment ▸ Web app**:
   - *Execute as:* **Me**
   - *Who has access:* **Anyone**
4. Authorize when prompted, then **copy the Web app URL** (it ends in `/exec`).
5. Paste that URL into `config.js` → `sheetUrl`.

Submit a test RSVP — it should appear as a new row in your sheet. 🎉

## 4. Deploy free online

Any static host works. Easiest options:

- **Netlify Drop** — go to <https://app.netlify.com/drop> and drag this folder in.
  You instantly get a public link. Done.
- **Vercel** — `npm i -g vercel && vercel` in this folder, follow the prompts.
- **GitHub Pages** — push to a repo, enable Pages on the `main` branch.

Share the link with your guests and watch the RSVPs roll into your sheet.

---

### Notes
- No personal data leaves your control — RSVPs go only to your own Google Sheet.
- To add/remove form fields, edit the `<form>` in `index.html`; the sheet script
  automatically creates a column for any new field name.
