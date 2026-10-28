const CLINICS = {
  "en-NG":   { name: "Harbour Clinic Lagos",   prices: { consultation: 15000, labTest: 8500, vaccination: 25000 } },
  "en-GH":   { name: "Harbour Clinic Accra",   prices: { consultation: 150, labTest: 85.5, vaccination: 250 } },
  "fr-CI": { name: "Harbour Clinic Abidjan", prices: { consultation: 15000, labTest: 8500, vaccination: 25000 } }
};

const LOCALES = {
  "en-NG": { currency: "NGN", timeZone: "Africa/Lagos" },
  "en-GH": { currency: "GHS", timeZone: "Africa/Accra" },
  "fr-CI": { currency: "XOF", timeZone: "Africa/Abidjan" }
};

const SERVICES = { consultation: "General consultation", labTest: "Blood test", vaccination: "Vaccination" };

const SLOTS = [
  { iso: "2026-11-03T08:00:00Z", left: 0 },
  { iso: "2026-11-03T13:30:00Z", left: 1 },
  { iso: "2026-11-04T09:15:00Z", left: 2 },
  { iso: "2026-11-05T15:45:00Z", left: 5 }
];

const pseudo = location.search.includes("pseudo");
let messages = {};

function t(key, values) {
  let text = messages[key] || key;
  for (const name in values) text = text.replace("{" + name + "}", values[name]);
  return pseudo ? "[" + text + " " + "~".repeat(Math.ceil(text.length * 0.35)) + "]" : text;
}

function formatDate(iso, locale) {
  return new Intl.DateTimeFormat(locale, { dateStyle: "full", timeStyle: "short", timeZone: LOCALES[locale].timeZone }).format(new Date(iso));
}

function render() {
  const clinicSelect = document.getElementById("clinic");
  const selectedKey = clinicSelect.value;
  const clinic = CLINICS[selectedKey];

  document.documentElement.lang = selectedKey;
  document.querySelectorAll("[data-i18n]").forEach(el => el.textContent = t(el.dataset.i18n));
  document.getElementById("name").placeholder = t("name.label");

  const servicesUl = document.getElementById("services");
  servicesUl.innerHTML = "";
  for (const key in SERVICES) {
    const price = clinic.prices[key];
    const li = document.createElement("li");
    li.textContent = t("service." + key) + " - " + new Intl.NumberFormat(selectedKey, { style: "currency", currency: LOCALES[selectedKey].currency }).format(price);
    servicesUl.appendChild(li);
  }

  const slotsUl = document.getElementById("slots");
  slotsUl.innerHTML = "";
  SLOTS.forEach(slot => {
    const li = document.createElement("li");
    li.textContent = formatDate(slot.iso, selectedKey) + " (" + t("slotsLeft." + new Intl.PluralRules(selectedKey).select(slot.left), { count: slot.left }) + ")";
    slotsUl.appendChild(li);
  });
}

function loadLocale() {
  fetch("locales/" + clinicSelect.value + ".json").then(r => r.json()).then(data => { messages = data; render(); });
}

const clinicSelect = document.getElementById("clinic");
for (const key in CLINICS) {
  const opt = document.createElement("option");
  opt.value = key;
  opt.textContent = CLINICS[key].name;
  clinicSelect.appendChild(opt);
}

clinicSelect.addEventListener("change", loadLocale);

document.getElementById("book").addEventListener("click", function() {
  const nameInput = document.getElementById("name").value;
  const name = nameInput || "Guest";
  document.getElementById("confirm").textContent = t("confirm.message", { name: name, date: formatDate(SLOTS[1].iso, clinicSelect.value) });
});

loadLocale();
