const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const vm = require("vm");

const root = path.resolve(__dirname, "..");
const appsScriptPath = path.join(root, "docs", "google-apps-script", "mobilytech-pos-venda.gs");
const outDir = path.join(root, "docs", "email-previews");

fs.rmSync(outDir, { recursive: true, force: true });
fs.mkdirSync(outDir, { recursive: true });

const sent = [];
const sandbox = {
  console,
  Utilities: {
    formatDate(date) {
      const value = date instanceof Date ? date : new Date(date);
      return value.toISOString().slice(0, 10);
    },
    computeHmacSha256Signature(raw, secret) {
      return crypto.createHmac("sha256", secret).update(String(raw)).digest();
    },
    base64EncodeWebSafe(value) {
      return Buffer.from(value).toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
    },
  },
  GmailApp: {
    sendEmail(to, subject, body, options = {}) {
      sent.push({ to, subject, body, htmlBody: options.htmlBody || "" });
    },
  },
  PropertiesService: {
    getScriptProperties() {
      return {
        getProperty() {
          return "";
        },
      };
    },
  },
  SpreadsheetApp: {
    openById() {
      return {};
    },
  },
  ScriptApp: {
    getService() {
      return {
        getUrl() {
          return "https://script.google.com/macros/s/TESTE/exec";
        },
      };
    },
  },
  Session: {
    getEffectiveUser() {
      return {
        getEmail() {
          return "mobilytechbr@gmail.com";
        },
      };
    },
  },
  UrlFetchApp: {
    fetch() {
      throw new Error("UrlFetchApp disabled in preview renderer");
    },
  },
};

vm.createContext(sandbox);
const source = fs.readFileSync(appsScriptPath, "utf8");
vm.runInContext(source, sandbox, { filename: appsScriptPath });
sandbox.sendTestTransactionalEmails();

const slug = (value) =>
  String(value)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 90);

const manifest = sent.map((email, index) => {
  const file = `${String(index + 1).padStart(2, "0")}-${slug(email.subject)}.html`;
  fs.writeFileSync(path.join(outDir, file), email.htmlBody || `<pre>${email.body}</pre>`, "utf8");
  return { file, subject: email.subject, to: email.to };
});

fs.writeFileSync(path.join(outDir, "manifest.json"), JSON.stringify(manifest, null, 2), "utf8");
console.log(`wrote ${manifest.length} email previews`);
