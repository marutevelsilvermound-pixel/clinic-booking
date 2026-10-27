const CLINICS = {
  lagos:   { name: "Harbour Clinic Lagos",   prices: { consultation: 15000, labTest: 8500, vaccination: 25000 } },
  accra:   { name: "Harbour Clinic Accra",   prices: { consultation: 150, labTest: 85.5, vaccination: 250 } },
  abidjan: { name: "Harbour Clinic Abidjan", prices: { consultation: 15000, labTest: 8500, vaccination: 25000 } }
};

const SERVICES = { consultation: "General consultation", labTest: "Blood test", vaccination: "Vaccination" };

const SLOTS = [
  { iso: "2026-11-03T08:00:00Z", left: 0 },
  { iso: "2026-11-03T13:30:00Z", left: 1 },
  { iso: "2026-11-04T09:15:00Z", left: 2 },
  { iso: "2026-11-05T15:45:00Z", left: 5 }
];

function formatDate(iso) {
  const d = new Date(iso);
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const year = d.getFullYear();
  const hours = String(d.getHours()).padStart(2, "0");
  const minutes = String(d.getMinutes()).padStart(2, "0");
  return month + "/" + day + "/" + year + " " + hours + ":" + minutes;
}

function render() {
  const clinicSelect = document.getElementById("clinic");
  const selectedKey = clinicSelect.value;
  const clinic = CLINICS[selectedKey];

  const servicesUl = document.getElementById("services");
  servicesUl.innerHTML = "";
  for (const key in SERVICES) {
    const price = clinic.prices[key];
    const li = document.createElement("li");
    li.textContent = SERVICES[key] + " - $" + price.toFixed(2);
    servicesUl.appendChild(li);
  }

  const slotsUl = document.getElementById("slots");
  slotsUl.innerHTML = "";
  SLOTS.forEach(slot => {
    const li = document.createElement("li");
    li.textContent = formatDate(slot.iso) + " (" + slot.left + " slots left)";
    slotsUl.appendChild(li);
  });
}

const clinicSelect = document.getElementById("clinic");
for (const key in CLINICS) {
  const opt = document.createElement("option");
  opt.value = key;
  opt.textContent = CLINICS[key].name;
  clinicSelect.appendChild(opt);
}

clinicSelect.addEventListener("change", render);

document.getElementById("book").addEventListener("click", function() {
  const nameInput = document.getElementById("name").value;
  const name = nameInput || "Guest";
  document.getElementById("confirm").textContent = "Thank you, " + name + "! Your appointment on " + formatDate(SLOTS[1].iso) + " is confirmed.";
});

render();
