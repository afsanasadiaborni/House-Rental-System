
const LS_KEYS = {
  apartments: "hrs_apartments",
  landlords: "hrs_landlords",
  tenants:   "hrs_tenants",
  payments:  "hrs_payments"
};

const demoData = {
  apartments: [
    { id: uid(), number: "101", rooms: 3, address: "Dhaka, Mirpur 1", rent: 18000, photo: "assets/apartment-3r.svg", occupied: false },
    { id: uid(), number: "102", rooms: 2, address: "Dhaka, Mirpur 2", rent: 15000, photo: "assets/apartment-2r.svg", occupied: true },
    { id: uid(), number: "103", rooms: 3, address: "Dhaka, Mirpur 3", rent: 19000, photo: "assets/apartment-3r.svg", occupied: false }
  ],
  landlords: [
    { id: uid(), name: "Rahim Uddin", mobile: "01711111111", apartmentNo: "101", address: "Dhaka, Mirpur 1", rent: 18000 },
    { id: uid(), name: "Karim Ahmed", mobile: "01722222222", apartmentNo: "102", address: "Dhaka, Mirpur 2", rent: 15000 }
  ],
  tenants: [
    { id: uid(), name: "Sumaiya", mobile: "01633333333", gender: "Female", availability: "Assigned", apartmentNo: "102" },
    { id: uid(), name: "Faisal", mobile: "01544444444", gender: "Male", availability: "Looking", apartmentNo: "" }
  ],
  payments: [
    { id: uid(), name: "Sumaiya", mobile: "01633333333", gender: "Female", apartmentNo: "102", amount: 15000, months: 1, date: todayStr() }
  ]
};


function uid(){ return Math.random().toString(36).slice(2)+Date.now().toString(36); }
function todayStr(){ const d=new Date(); return d.toISOString().slice(0,10); }

function load(key){ return JSON.parse(localStorage.getItem(key) || "null"); }
function save(key, val){ localStorage.setItem(key, JSON.stringify(val)); }

function ensureSeed(){
  if(!load(LS_KEYS.apartments)){ save(LS_KEYS.apartments, demoData.apartments); }
  if(!load(LS_KEYS.landlords)){  save(LS_KEYS.landlords,  demoData.landlords); }
  if(!load(LS_KEYS.tenants)){    save(LS_KEYS.tenants,    demoData.tenants); }
  if(!load(LS_KEYS.payments)){   save(LS_KEYS.payments,   demoData.payments); }
}
function resetDemo(){
  Object.entries(demoData).forEach(([k,v])=> save(LS_KEYS[k], v));
  renderAll();
}

document.getElementById("resetDataBtn").addEventListener("click", resetDemo);


const links = document.querySelectorAll("a.nav-link[data-page]");
links.forEach(a=> a.addEventListener("click", (e)=>{
  e.preventDefault();
  const page = a.getAttribute("data-page");
  document.querySelectorAll(".page").forEach(p=> p.classList.add("d-none"));
  document.getElementById("page-"+page).classList.remove("d-none");
  document.querySelectorAll("a.nav-link").forEach(l=> l.classList.remove("active"));
  a.classList.add("active");
  if(page==="dashboard"){ renderDashboard(); }
  if(page==="apartments"){ renderApartments(); }
  if(page==="landlords"){ renderLandlords(); }
  if(page==="tenants"){ renderTenants(); }
  if(page==="rent"){ renderPayments(); }
}));


function renderDashboard(){
  const apartments = load(LS_KEYS.apartments) || [];
  const tenants = load(LS_KEYS.tenants) || [];
  const occupied = apartments.filter(a=> a.occupied).length;
  const available = apartments.length - occupied;
  document.getElementById("statTotalApts").textContent = apartments.length;
  document.getElementById("statOccupied").textContent = occupied;
  document.getElementById("statAvailable").textContent = available;

  const tbody = document.querySelector("#dashboardTenantsTable tbody");
  tbody.innerHTML = "";
  tenants.forEach((t, i)=>{
    const tr = document.createElement("tr");
    tr.innerHTML = `<td>${i+1}</td><td>${t.name}</td><td>${t.mobile}</td><td>${t.gender}</td><td>${t.apartmentNo || "-"}</td>`;
    tbody.appendChild(tr);
  });
}

function renderApartments(){
  const grid = document.getElementById("apartmentsGrid");
  const apartments = load(LS_KEYS.apartments) || [];
  grid.innerHTML = "";
  apartments.forEach(ap => {
    const col = document.createElement("div");
    col.className = "col-md-6 col-lg-4";
    col.innerHTML = `
      <div class="card shadow-sm mb-3">
        <img src="${ap.photo || "assets/apartment-2r.svg"}" class="card-img-top" alt="Apartment">
        <div class="card-body">
          <div class="d-flex justify-content-between align-items-start">
            <div>
              <h5 class="card-title mb-1">Apt ${ap.number} • ${ap.rooms} rooms</h5>
              <div class="small-muted">${ap.address}</div>
            </div>
            <span class="badge ${ap.occupied? "badge-occupied" : "badge-available"}">${ap.occupied? "Occupied" : "Available"}</span>
          </div>
          <div class="mt-2">Rent: ৳${ap.rent}</div>
          <div class="d-flex gap-2 mt-3">
            <button class="btn btn-sm ${ap.occupied? "btn-success" : "btn-danger"} toggle-occupancy" data-id="${ap.id}">
              ${ap.occupied? "Set Available" : "Set Occupied"}
            </button>
            <button class="btn btn-sm btn-outline-secondary delete-apartment" data-id="${ap.id}">Delete</button>
          </div>
        </div>
      </div>`;
    grid.appendChild(col);
  });

  grid.querySelectorAll(".toggle-occupancy").forEach(btn=>{
    btn.addEventListener("click", ()=>{
      const id = btn.getAttribute("data-id");
      const arr = load(LS_KEYS.apartments) || [];
      const idx = arr.findIndex(a=> a.id===id);
      if(idx>=0){ arr[idx].occupied = !arr[idx].occupied; save(LS_KEYS.apartments, arr); renderApartments(); renderDashboard(); }
    });
  });
  grid.querySelectorAll(".delete-apartment").forEach(btn=>{
    btn.addEventListener("click", ()=>{
      const id = btn.getAttribute("data-id");
      const arr = (load(LS_KEYS.apartments) || []).filter(a=> a.id!==id);
      save(LS_KEYS.apartments, arr);
      renderApartments(); renderDashboard();
    });
  });
}

function renderLandlords(){
  const tbody = document.querySelector("#landlordsTable tbody");
  const arr = load(LS_KEYS.landlords) || [];
  tbody.innerHTML = "";
  arr.forEach((l,i)=>{
    const tr = document.createElement("tr");
    tr.innerHTML = `<td>${i+1}</td><td>${l.name}</td><td>${l.mobile}</td><td>${l.apartmentNo}</td><td>${l.address}</td><td>৳${l.rent}</td>
    <td><button class="btn btn-sm btn-outline-danger del-ll" data-id="${l.id}">Delete</button></td>`;
    tbody.appendChild(tr);
  });
  tbody.querySelectorAll(".del-ll").forEach(btn=>{
    btn.addEventListener("click", ()=>{
      const id = btn.getAttribute("data-id");
      const n = (load(LS_KEYS.landlords)||[]).filter(x=> x.id!==id);
      save(LS_KEYS.landlords, n);
      renderLandlords();
    });
  });
}

function renderTenants(){
  const tbody = document.querySelector("#tenantsTable tbody");
  const arr = load(LS_KEYS.tenants) || [];
  tbody.innerHTML = "";
  arr.forEach((t,i)=>{
    const tr = document.createElement("tr");
    tr.innerHTML = `<td>${i+1}</td><td>${t.name}</td><td>${t.mobile}</td><td>${t.gender}</td>
      <td>${t.availability}</td><td>${t.apartmentNo || "-"}</td>
      <td><button class="btn btn-sm btn-outline-danger del-tenant" data-id="${t.id}">Delete</button></td>`;
    tbody.appendChild(tr);
  });
  tbody.querySelectorAll(".del-tenant").forEach(btn=>{
    btn.addEventListener("click", ()=>{
      const id = btn.getAttribute("data-id");
      const n = (load(LS_KEYS.tenants)||[]).filter(x=> x.id!==id);
      save(LS_KEYS.tenants, n);
      renderTenants(); renderDashboard();
    });
  });
}

function renderPayments(){
  const tbody = document.querySelector("#paymentsTable tbody");
  const arr = load(LS_KEYS.payments) || [];
  tbody.innerHTML = "";
  arr.forEach((p,i)=>{
    const tr = document.createElement("tr");
    tr.innerHTML = `<td>${i+1}</td><td>${p.name}</td><td>${p.mobile}</td><td>${p.gender}</td>
      <td>${p.apartmentNo}</td><td>৳${p.amount}</td><td>${p.months}</td><td>${p.date}</td>`;
    tbody.appendChild(tr);
  });
}


document.getElementById("apartmentForm").addEventListener("submit", (e)=>{
  e.preventDefault();
  const fd = new FormData(e.target);
  const ap = {
    id: uid(),
    number: (fd.get("number")||"").trim(),
    rooms: parseInt(fd.get("rooms"),10),
    address: fd.get("address"),
    rent: parseInt(fd.get("rent"),10),
    photo: (fd.get("photo")||"assets/apartment-2r.svg").trim(),
    occupied: false
  };
  const arr = load(LS_KEYS.apartments) || [];
  arr.push(ap); save(LS_KEYS.apartments, arr);
  e.target.reset();
  document.querySelector("#apartmentModal .btn-close").click();
  renderApartments(); renderDashboard();
});

document.getElementById("landlordForm").addEventListener("submit", (e)=>{
  e.preventDefault();
  const fd = new FormData(e.target);
  const l = {
    id: uid(),
    name: fd.get("name").trim(),
    mobile: fd.get("mobile").trim(),
    apartmentNo: fd.get("apartmentNo").trim(),
    address: fd.get("address").trim(),
    rent: parseInt(fd.get("rent"),10)
  };
  const arr = load(LS_KEYS.landlords) || [];
  arr.push(l); save(LS_KEYS.landlords, arr);
  e.target.reset(); renderLandlords();
});

document.getElementById("tenantForm").addEventListener("submit", (e)=>{
  e.preventDefault();
  const fd = new FormData(e.target);
  const t = {
    id: uid(),
    name: fd.get("name").trim(),
    mobile: fd.get("mobile").trim(),
    gender: fd.get("gender"),
    availability: fd.get("availability"),
    apartmentNo: (fd.get("apartmentNo")||"").trim()
  };
  const arr = load(LS_KEYS.tenants) || [];
  arr.push(t); save(LS_KEYS.tenants, arr);
  e.target.reset(); renderTenants(); renderDashboard();
});

document.getElementById("rentForm").addEventListener("submit", (e)=>{
  e.preventDefault();
  const fd = new FormData(e.target);
  const p = {
    id: uid(),
    name: fd.get("name").trim(),
    mobile: fd.get("mobile").trim(),
    gender: fd.get("gender"),
    apartmentNo: fd.get("apartmentNo").trim(),
    amount: parseInt(fd.get("amount"),10),
    months: parseInt(fd.get("months"),10),
    date: todayStr()
  };
  const arr = load(LS_KEYS.payments) || [];
  arr.push(p); save(LS_KEYS.payments, arr);
  e.target.reset(); renderPayments();
});

function renderAll(){
  renderDashboard();
  renderApartments();
  renderLandlords();
  renderTenants();
  renderPayments();
}

ensureSeed();
renderAll();
