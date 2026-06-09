/**
 * RSVP collector for the birthday site.
 *
 * SETUP (one time, ~5 min):
 *  1. Make a new Google Sheet (sheet.new). Name the first tab "RSVPs".
 *  2. Extensions ▸ Apps Script. Delete any code, paste THIS whole file.
 *  3. Click Deploy ▸ New deployment ▸ type "Web app".
 *       - Execute as: Me
 *       - Who has access: Anyone
 *     Deploy, authorize, and COPY the Web app URL (ends in /exec).
 *  4. Paste that URL into config.js → sheetUrl.
 *
 * To collect more fields later, just add them to the form; this script
 * writes whatever columns it receives.
 */

var SHEET_NAME = "RSVPs";

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(10000);
  try {
    var sheet = getSheet_();
    var data = (e && e.parameter) || {};

    // Header row defines the column order. Create it on first submit.
    var headers;
    if (sheet.getLastRow() === 0) {
      headers = [
        "submittedAt", "childName", "parentName", "contact",
        "attending", "guestCount", "allergies", "message",
      ];
      sheet.appendRow(headers);
    } else {
      headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    }

    // Add any new keys we haven't seen as columns.
    Object.keys(data).forEach(function (k) {
      if (headers.indexOf(k) === -1) {
        headers.push(k);
        sheet.getRange(1, headers.length).setValue(k);
      }
    });

    var row = headers.map(function (h) { return data[h] || ""; });
    sheet.appendRow(row);

    return json_({ ok: true });
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

function doGet() {
  return json_({ ok: true, msg: "RSVP endpoint is live 🐍" });
}

function getSheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  return ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);
}

function json_(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
