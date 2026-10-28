const CLINICS = {
  "en-NG": { name: "Harbour Clinic Lagos",   prices: { consultation: 15000, labTest: 8500, vaccination: 25000 } },
  "en-GH": { name: "Harbour Clinic Accra",   prices: { consultation: 150, labTest: 85.5, vaccination: 250 } },
  "fr-CI": { name: "Harbour Clinic Abidjan", prices: { consultation: 15000, labTest: 8500, vaccination: 25000 } }
};

const LOCALES = {
  "en-NG": { currency: "NGN", timeZone: "Africa/Lagos" },
  "en-GH": { currency: "GHS", timeZone: "Africa/Accra" },
  "fr-CI": { currency: "XOF", timeZone: "Africa/Abidjan" }
};

const SERVICES = ["consultation", "labTest", "vaccination"];

const SLOTS = [
  { iso: "2026-11-03T08:00:00Z", left: 0 },
  { iso: "2026-11-03T13:30:00Z", left: 1 },
  { iso: "2026-11-04T09:15:00Z", left: 2 },
  { iso: "2026-11-05T15:45:00Z", left: 5 }
];

const params = new URLSearchParams(location.search);
const locale = LOCALES[params.get("lang")] ? params.get("lang") : "en-NG";
const pseudo = params.get("pseudo") === "1";
let messages = {};

function t(key, values) {
  let text = messages[key] || key;
  for (const name in values) text = text.replace("{" + name + "}", values[name]);
  return pseudo ? "[" + text + " " + "~".repeat(Math.ceil(text.length * 0.35)) + "]" : text;
}

function formatDate(iso) {
  return new Intl.DateTimeFormat(locale, { dateStyle: "full", timeStyle: "short", timeZone: LOCALES[locale].timeZone }).format(new Date(iso));
}

function render() {
  const clinic = CLINICS[locale];
  const money = new Intl.NumberFormat(locale, { style: "currency", currency: LOCALES[locale].currency });
  const plural = new Intl.PluralRules(locale);

  const servicesUl = document.getElementById("services");
  servicesUl.innerHTML = "";
  for (const key of SERVICES) {
    const li = document.createElement("li");
    li.textContent = t("service." + key) + " - " + money.format(clinic.prices[key]);
    servicesUl.appendChild(li);
  }

  const slotsUl = document.getElementById("slots");
  slotsUl.innerHTML = "";
  SLOTS.forEach(slot => {
    const li = document.createElement("li");
    li.textContent = formatDate(slot.iso) + " (" + t("slotsLeft." + plural.select(slot.left), { count: slot.left }) + ")";
    slotsUl.appendChild(li);
  });
}

const clinicSelect = document.getElementById("clinic");
for (const key in CLINICS) {
  const opt = document.createElement("option");
  opt.value = key;
  opt.textContent = CLINICS[key].name;
  opt.selected = key === locale;
  clinicSelect.appendChild(opt);
}

clinicSelect.addEventListener("change", function() {
  location.search = "?lang=" + clinicSelect.value + (pseudo ? "&pseudo=1" : "");
});

document.getElementById("book").addEventListener("click", function() {
  const nameInput = document.getElementById("name").value;
  const name = nameInput || "Guest";
  document.getElementById("confirm").textContent = t("confirm.message", { name: name, date: formatDate(SLOTS[1].iso) });
});

fetch("locales/" + locale + ".json")
  .then(response => response.json())
  .then(data => {
    messages = data;
    document.documentElement.lang = locale;
    document.querySelectorAll("[data-i18n]").forEach(el => { el.textContent = t(el.dataset.i18n); });
    document.getElementById("name").placeholder = t("name.label");
    render();
  });
