// Prefilled demo flights
const recent = [
  { airline: "British Airways", code: "BA112", from: "New York", to: "London", when: "Dec 14, 2024", km: 5585, cabin: "economy", co2kg: 1089, type: "long haul" },
  { airline: "Air France", code: "AF1234", from: "Paris", to: "Madrid", when: "Nov 30, 2024", km: 1050, cabin: "economy", co2kg: 210, type: "short haul" },
  { airline: "United Airlines", code: "UA415", from: "San Francisco", to: "Seattle", when: "Nov 22, 2024", km: 1091, cabin: "economy", co2kg: 196, type: "short haul" }
];
const monthly = { labels: ["Sep 2024","Oct 2024","Nov 2024","Dec 2024"], co2kg:[900,2100,4800,1300] };

const sum = a => a.reduce((x,y)=>x+y,0);
const fmt = (n,u="") => `${n.toLocaleString()}${u}`;

const ul = document.getElementById("recentFlights");

function renderKpis(){
  document.getElementById("kpiFlights").textContent = recent.length;
  document.getElementById("kpiCO2").textContent = fmt(sum(recent.map(r=>r.co2kg))," kg");
  document.getElementById("kpiKm").textContent = fmt(sum(recent.map(r=>r.km))," km");
  document.getElementById("kpiTrees").textContent = Math.round(sum(recent.map(r=>r.co2kg))/22);
}
function renderList(){
  ul.innerHTML="";
  recent.forEach(r=>{
    ul.innerHTML += `<li class="flight">
      <div>✈️</div>
      <div>
        <div><strong>${r.airline}</strong> <span class="badge">${r.code}</span> <span class="tag">${r.cabin}</span></div>
        <div class="dim">${r.from} → ${r.to} • ${r.when}</div>
        <div class="dim">${r.km.toLocaleString()} km • ${r.type}</div>
      </div>
      <div><div class="badge">${r.co2kg.toLocaleString()} kg CO₂</div></div>
    </li>`;
  });
}

// Chart
new Chart(document.getElementById("co2Chart"), {
  type: "bar",
  data: { labels: monthly.labels, datasets:[{ label:"CO₂ (kg)", data:monthly.co2kg, borderRadius:10 }]},
  options: { responsive:true, plugins:{ legend:{ display:false }}, scales:{ y:{ beginAtZero:true }}}
});

// View toggles
const dash = document.getElementById("dashboardSection");
const add = document.getElementById("addFlightSection");
document.getElementById("addFlightBtn").onclick = ()=>{ dash.classList.add("hidden"); add.classList.remove("hidden"); };
document.getElementById("dashboardLink").onclick = e=>{ e.preventDefault(); add.classList.add("hidden"); dash.classList.remove("hidden"); };

// Form + estimates
const form = document.getElementById("addFlightForm");
function estimate(){
  const km = +form.km.value||0, cabin=form.cabin.value, ac=form.aircraft.value;
  let f=0.18; if(ac==="wide")f*=1.05; if(cabin==="business")f*=2; if(cabin==="first")f*=3;
  const co2=Math.round(km*f), trees=Math.round(co2/22);
  document.getElementById("estimateCO2").textContent=`${co2.toLocaleString()} kg`;
  document.getElementById("estimateMeta").textContent=`Distance: ${km.toLocaleString()} km • Trees: ${trees}`;
  document.getElementById("perspCar").textContent=Math.round(co2/0.12).toLocaleString();
  document.getElementById("perspTrees").textContent=trees;
  document.getElementById("perspEnergy").textContent=Math.round(co2/300).toLocaleString();
  return co2;
}
form.oninput = estimate;
form.onsubmit = e=>{
  e.preventDefault();
  const co2 = estimate(), km=+form.km.value||0;
  recent.unshift({ airline: form.airline.value||"Airline", code:(form.code.value||"NEW").toUpperCase(),
    from: form.from.value, to: form.to.value, when:new Date(form.date.value).toLocaleDateString(),
    km, co2kg:co2, cabin: form.cabin.value, type: km>3500?"long haul":"short haul" });
  renderKpis(); renderList();
  add.classList.add("hidden"); dash.classList.remove("hidden"); form.reset(); estimate();
};

// Initial render
renderKpis(); renderList(); estimate();
