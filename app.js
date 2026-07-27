const STORE_KEY = "interntrack_applications_v1";
const RESUME_KEY = "interntrack_resume_v1";

const STATUSES = [
  { key: "applied", label: "Applied", color: "var(--applied)" },
  { key: "assessment", label: "OA / Assessment", color: "var(--assessment)" },
  { key: "interview", label: "Interview", color: "var(--interview)" },
  { key: "offer", label: "Offer", color: "var(--offer)" },
  { key: "rejected", label: "Rejected", color: "var(--rejected)" },
];

let applications = loadApplications();
let currentLetterAppId = null;

function loadApplications() {
  try {
    return JSON.parse(localStorage.getItem(STORE_KEY)) || [];
  } catch {
    return [];
  }
}
function saveApplications() {
  localStorage.setItem(STORE_KEY, JSON.stringify(applications));
}
function loadResume() {
  return localStorage.getItem(RESUME_KEY) || "";
}
function saveResume(text) {
  localStorage.setItem(RESUME_KEY, text);
}

function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

function showToast(msg) {
  const t = document.getElementById("toast");
  t.textContent = msg;
  t.classList.add("show");
  setTimeout(() => t.classList.remove("show"), 2200);
}

function openModal(id) {
  document.getElementById(id).classList.add("open");
}
function closeModal(id) {
  document.getElementById(id).classList.remove("open");
}
document.querySelectorAll("[data-close]").forEach((btn) => {
  btn.addEventListener("click", () => closeModal(btn.dataset.close));
});
document.querySelectorAll(".modal-overlay").forEach((ov) => {
  ov.addEventListener("click", (e) => {
    if (e.target === ov) ov.classList.remove("open");
  });
});

// ---------- Rendering ----------
function render() {
  renderStats();
  renderBoard();
}

function renderStats() {
  const row = document.getElementById("statsRow");
  row.innerHTML = "";
  const total = applications.length;
  const totalPill = document.createElement("div");
  totalPill.className = "stat-pill";
  totalPill.innerHTML = `<b>${total}</b> total applications`;
  row.appendChild(totalPill);

  STATUSES.forEach((s) => {
    const count = applications.filter((a) => a.status === s.key).length;
    const pill = document.createElement("div");
    pill.className = "stat-pill";
    pill.innerHTML = `<span class="dot" style="background:${s.color}"></span> <b>${count}</b> ${s.label}`;
    row.appendChild(pill);
  });
}

function renderBoard() {
  const board = document.getElementById("board");
  board.innerHTML = "";
  STATUSES.forEach((s) => {
    const col = document.createElement("div");
    col.className = "column";

    const items = applications.filter((a) => a.status === s.key);
    col.innerHTML = `
      <div class="column-head">
        <span>${s.label}</span>
        <span class="column-count">${items.length}</span>
      </div>
    `;

    if (items.length === 0) {
      const empty = document.createElement("div");
      empty.className = "empty-col";
      empty.textContent = "Nothing here yet";
      col.appendChild(empty);
    }

    items
      .sort((a, b) => (b.date || "").localeCompare(a.date || ""))
      .forEach((app) => {
        const card = document.createElement("div");
        card.className = "card";
        card.innerHTML = `
          <h3>${escapeHtml(app.company)}</h3>
          <p>${escapeHtml(app.role)}</p>
          <div class="card-meta">
            <span>${app.date || "no date"}</span>
            ${app.link ? `<a href="${escapeAttr(app.link)}" target="_blank" rel="noopener" onclick="event.stopPropagation()">link ↗</a>` : ""}
          </div>
          ${app.jd ? `<button class="ai-btn" type="button">✨ Generate cover letter</button>` : ""}
        `;
        card.addEventListener("click", () => openEdit(app.id));
        const aiBtn = card.querySelector(".ai-btn");
        if (aiBtn) {
          aiBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            openLetterModal(app.id);
          });
        }
        col.appendChild(card);
      });

    board.appendChild(col);
  });
}

function escapeHtml(str = "") {
  return str.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}
function escapeAttr(str = "") {
  return str.replace(/"/g, "&quot;");
}

// ---------- Add / Edit Application ----------
document.getElementById("openAddBtn").addEventListener("click", () => {
  document.getElementById("appForm").reset();
  document.getElementById("appId").value = "";
  document.getElementById("appModalTitle").textContent = "Add Application";
  document.getElementById("deleteAppBtn").style.display = "none";
  document.getElementById("dateInput").value = new Date().toISOString().slice(0, 10);
  openModal("appModalOverlay");
});

function openEdit(id) {
  const app = applications.find((a) => a.id === id);
  if (!app) return;
  document.getElementById("appId").value = app.id;
  document.getElementById("companyInput").value = app.company;
  document.getElementById("roleInput").value = app.role;
  document.getElementById("statusInput").value = app.status;
  document.getElementById("dateInput").value = app.date || "";
  document.getElementById("linkInput").value = app.link || "";
  document.getElementById("jdInput").value = app.jd || "";
  document.getElementById("notesInput").value = app.notes || "";
  document.getElementById("appModalTitle").textContent = "Edit Application";
  document.getElementById("deleteAppBtn").style.display = "inline-block";
  openModal("appModalOverlay");
}

document.getElementById("appForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const id = document.getElementById("appId").value || uid();
  const data = {
    id,
    company: document.getElementById("companyInput").value.trim(),
    role: document.getElementById("roleInput").value.trim(),
    status: document.getElementById("statusInput").value,
    date: document.getElementById("dateInput").value,
    link: document.getElementById("linkInput").value.trim(),
    jd: document.getElementById("jdInput").value.trim(),
    notes: document.getElementById("notesInput").value.trim(),
  };
  const existingIdx = applications.findIndex((a) => a.id === id);
  if (existingIdx >= 0) applications[existingIdx] = data;
  else applications.push(data);
  saveApplications();
  render();
  closeModal("appModalOverlay");
  showToast("Saved");
});

document.getElementById("deleteAppBtn").addEventListener("click", () => {
  const id = document.getElementById("appId").value;
  applications = applications.filter((a) => a.id !== id);
  saveApplications();
  render();
  closeModal("appModalOverlay");
  showToast("Deleted");
});

// ---------- Resume Bullets ----------
document.getElementById("openResumeBtn").addEventListener("click", () => {
  document.getElementById("resumeBullets").value = loadResume();
  openModal("resumeModalOverlay");
});
document.getElementById("saveResumeBtn").addEventListener("click", () => {
  saveResume(document.getElementById("resumeBullets").value.trim());
  closeModal("resumeModalOverlay");
  showToast("Resume bullets saved");
});

// ---------- AI Cover Letter ----------
function openLetterModal(appId) {
  currentLetterAppId = appId;
  const app = applications.find((a) => a.id === appId);
  document.getElementById("letterCompanyRole").textContent = `${app.company} — ${app.role}`;
  document.getElementById("letterBody").style.display = "block";
  document.getElementById("letterOutput").style.display = "none";
  document.getElementById("letterActions").style.display = "none";
  document.getElementById("letterBody").innerHTML = `
    <p class="hint">Generating a tailored cover letter using your saved resume bullets and this job's description...</p>
    <div class="spinner"></div>
  `;
  openModal("letterModalOverlay");
  generateLetter(appId);
}

async function generateLetter(appId) {
  const app = applications.find((a) => a.id === appId);
  const resume = loadResume();

  if (!resume) {
    document.getElementById("letterBody").innerHTML =
      `<p class="hint">You haven't added your resume bullets yet. Click "My Resume Bullets" in the top bar, paste them in, then try again.</p>`;
    return;
  }

  document.getElementById("letterBody").innerHTML = `
    <p class="hint">Generating a tailored cover letter using your saved resume bullets and this job's description...</p>
    <div class="spinner"></div>
  `;
  document.getElementById("letterOutput").style.display = "none";
  document.getElementById("letterActions").style.display = "none";

  try {
    const res = await fetch("/api/generate-letter", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        company: app.company,
        role: app.role,
        jobDescription: app.jd,
        resumeBullets: resume,
      }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `Request failed (${res.status})`);
    }

    const data = await res.json();
    document.getElementById("letterBody").innerHTML = "";
    const output = document.getElementById("letterOutput");
    output.value = data.letter;
    output.style.display = "block";
    document.getElementById("letterActions").style.display = "flex";
  } catch (err) {
    document.getElementById("letterBody").innerHTML = `<p class="hint">Something went wrong: ${escapeHtml(err.message)}. Try again.</p>`;
  }
}

document.getElementById("regenLetterBtn").addEventListener("click", () => {
  if (currentLetterAppId) generateLetter(currentLetterAppId);
});
document.getElementById("copyLetterBtn").addEventListener("click", async () => {
  const text = document.getElementById("letterOutput").value;
  await navigator.clipboard.writeText(text);
  showToast("Copied to clipboard");
});

render();
