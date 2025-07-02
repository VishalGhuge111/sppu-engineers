import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
  getDatabase,
  ref,
  onValue,
  remove,
  update
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

// ✅ Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyCd7mmW5FXBgARCMJ3b_yJKQbkRR8VXFi8",
  authDomain: "sppu-engineers-111.firebaseapp.com",
  databaseURL: "https://sppu-engineers-111-default-rtdb.firebaseio.com",
  projectId: "sppu-engineers-111",
  storageBucket: "sppu-engineers-111.firebasestorage.app",
  messagingSenderId: "622650122117",
  appId: "1:622650122117:web:0218bbf87b43cf1168aeec"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const container = document.getElementById("requestContainer");

onValue(ref(db, "competitionRequests"), (snapshot) => {
  container.innerHTML = "";
  if (!snapshot.exists()) {
    container.innerHTML = "<p class='text-center text-gray-500'>No requests found.</p>";
    return;
  }

  snapshot.forEach((child) => {
    const data = child.val();
    const key = child.key;

    const card = document.createElement("div");
    card.className = "bg-white rounded-xl p-6 shadow border border-gray-200";

    card.innerHTML = `
      <div class="flex justify-between items-center mb-3">
        <div class="flex items-center gap-2">
          <h2 class="text-xl font-bold text-sppublue">${data.title}</h2>
          ${copyBtn(data.title)}
        </div>
        <span class="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded">${data.status}</span>
      </div>

      <div class="mb-4 flex items-start gap-2">
        <p class="text-gray-700 text-sm flex-1">${data.description}</p>
        ${copyBtn(data.description)}
      </div>

      <div class="grid sm:grid-cols-2 gap-4 text-sm mb-4">
        ${field("📌 Organizer", data.organizer)}
        ${field("📅 Last Date", data.lastDate)}
        ${field("🎟️ Type", data.type === "Paid" ? `${data.type} - ₹${data.entryFee}` : "Free")}
        ${field("📧 Email", data.email)}
        ${field("📱 Phone", data.phone)}
        ${field("🔗 Registration Link", data.link)}
        ${data.imageUrl ? field("🖼️ Banner", data.imageUrl) : ""}
        ${field("🕒 Submitted", new Date(data.submittedAt).toLocaleString())}
      </div>

      <div class="flex gap-4 mt-4">
        <button onclick="approveRequest('${key}')" class="bg-green-600 hover:bg-green-700 text-white px-4 py-1 rounded text-sm">✅ Approve</button>
        <button onclick="deleteRequest('${key}')" class="bg-red-600 hover:bg-red-700 text-white px-4 py-1 rounded text-sm">🗑 Delete</button>
      </div>
    `;

    container.appendChild(card);
  });
});

// ✅ Render fields with copy icon
function field(label, value) {
  return `
    <div class="bg-gray-50 border p-3 rounded flex justify-between items-start gap-2">
      <div>
        <strong class="block text-gray-600">${label}</strong>
        <span class="text-gray-900 break-words text-sm">${value}</span>
      </div>
      ${copyBtn(value)}
    </div>
  `;
}

// ✅ Copy button with dynamic icon change
function copyBtn(text) {
  const id = Math.random().toString(36).substring(2, 9);
  return `
    <button onclick="copyText('${escapeHTML(text)}', '${id}')" class="text-gray-500 hover:text-blue-600 transition" id="${id}">
      <i class="fas fa-copy"></i>
    </button>
  `;
}

// ✅ Clipboard logic with tick icon on success
window.copyText = async (text, id) => {
  try {
    await navigator.clipboard.writeText(text);
    const iconBtn = document.getElementById(id);
    if (iconBtn) {
      iconBtn.innerHTML = '<i class="fas fa-check text-green-600"></i>';
      setTimeout(() => {
        iconBtn.innerHTML = '<i class="fas fa-copy"></i>';
      }, 2000);
    }
  } catch (err) {
    console.error("Copy failed", err);
  }
};

// ✅ Approve request
window.approveRequest = async (id) => {
  try {
    await update(ref(db, `competitionRequests/${id}`), { status: "approved" });
    alert("✅ Approved!");
  } catch (err) {
    alert("❌ Error approving.");
  }
};

// ✅ Delete request
window.deleteRequest = async (id) => {
  const confirmDelete = confirm("Are you sure you want to delete this request?");
  if (!confirmDelete) return;

  try {
    await remove(ref(db, `competitionRequests/${id}`));
    alert("🗑 Request deleted.");
  } catch (err) {
    alert("❌ Error deleting.");
  }
};

// ✅ Escape HTML
function escapeHTML(str) {
  return str.replace(/`/g, "\\`").replace(/\\/g, "\\\\").replace(/"/g, '&quot;').replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
