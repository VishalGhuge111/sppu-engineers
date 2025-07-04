import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

// Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyCd7mmW5FXBgARCMJ3b_yJKQbkRR8VXFi8",
  authDomain: "sppu-engineers-111.firebaseapp.com",
  databaseURL: "https://sppu-engineers-111-default-rtdb.firebaseio.com",
  projectId: "sppu-engineers-111",
  storageBucket: "sppu-engineers-111.appspot.com",
  messagingSenderId: "622650122117",
  appId: "1:622650122117:web:0218bbf87b43cf1168aeec"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// DOM References
const studentList = document.getElementById("studentList");
const orgList = document.getElementById("orgList");
const studentSection = document.getElementById("studentSection");
const orgSection = document.getElementById("orgSection");
const studentTab = document.getElementById("studentTab");
const orgTab = document.getElementById("orgTab");

// Tab switching
studentTab.onclick = () => {
  studentSection.classList.remove("hidden");
  orgSection.classList.add("hidden");
  studentTab.classList.replace("bg-gray-300", "bg-blue-600");
  studentTab.classList.replace("text-gray-800", "text-white");
  orgTab.classList.replace("bg-blue-600", "bg-gray-300");
  orgTab.classList.replace("text-white", "text-gray-800");
};

orgTab.onclick = () => {
  orgSection.classList.remove("hidden");
  studentSection.classList.add("hidden");
  orgTab.classList.replace("bg-gray-300", "bg-blue-600");
  orgTab.classList.replace("text-gray-800", "text-white");
  studentTab.classList.replace("bg-blue-600", "bg-gray-300");
  studentTab.classList.replace("text-white", "text-gray-800");
};

// Utility: Copy Button
function createCopyBtn(value) {
  const button = document.createElement("button");
  button.innerHTML = `<i class="far fa-copy text-gray-500 hover:text-blue-600"></i>`;
  button.className = "ml-2 text-sm";
  button.onclick = async () => {
    await navigator.clipboard.writeText(value);
    button.innerHTML = `<i class="fas fa-check text-green-600"></i>`;
    setTimeout(() => {
      button.innerHTML = `<i class="far fa-copy text-gray-500 hover:text-blue-600"></i>`;
    }, 1500);
  };
  return button;
}

// Card Builder
function createCard(data, isStudent = true) {
  const card = document.createElement("div");
  card.className = "bg-white shadow rounded p-4";

  const field = (label, value) => {
    const row = document.createElement("p");
    row.className = "mb-2 text-sm break-words";
    row.innerHTML = `<span class="font-medium">${label}:</span> ${value}`;
    if (value) row.appendChild(createCopyBtn(value));
    return row;
  };

  card.appendChild(field("Name", data.name || "-"));
  if (isStudent) {
    card.appendChild(field("College", data.college || "-"));
    card.appendChild(field("Branch", data.branch || "-"));
    card.appendChild(field("CGPA", data.cgpa || "-"));
  } else {
    card.appendChild(field("Organization", data.organization || "-"));
  }

  if (data.email) card.appendChild(field("Email", data.email));
  card.appendChild(field("Review", data.review || "-"));

  const date = document.createElement("p");
  date.className = "text-xs text-gray-500 mt-2";
  date.innerText = "Submitted: " + new Date(data.submittedAt || Date.now()).toLocaleString();
  card.appendChild(date);

  return card;
}

// Load Student Feedback
onValue(ref(db, "feedback/student"), (snapshot) => {
  studentList.innerHTML = "";
  const data = snapshot.val();
  console.log("Student Feedback:", data);
  if (data) {
    Object.values(data).reverse().forEach((entry) => {
      studentList.appendChild(createCard(entry, true));
    });
  } else {
    studentList.innerHTML = "<p class='text-center text-gray-500'>No student feedback found.</p>";
  }
}, (error) => {
  console.error("Error loading student feedback:", error);
});

// Load Organization Feedback
onValue(ref(db, "feedback/organization"), (snapshot) => {
  orgList.innerHTML = "";
  const data = snapshot.val();
  console.log("Org Feedback:", data);
  if (data) {
    Object.values(data).reverse().forEach((entry) => {
      orgList.appendChild(createCard(entry, false));
    });
  } else {
    orgList.innerHTML = "<p class='text-center text-gray-500'>No organization feedback found.</p>";
  }
}, (error) => {
  console.error("Error loading organization feedback:", error);
});
