import { database } from "./firebase-config.js"
import { ref, push, set, onValue, remove } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js"

let editingUpdateId = null

document.addEventListener("DOMContentLoaded", () => {
  const updatesForm = document.getElementById("updates-form")
  const cancelButton = document.getElementById("cancel-update")

  if (updatesForm) {
    updatesForm.addEventListener("submit", handleUpdateSubmit)
    if (cancelButton) {
      cancelButton.addEventListener("click", cancelEdit)
    }
    loadUpdates()
  }
})

async function handleUpdateSubmit(e) {
  e.preventDefault()

  const title = document.getElementById("update-title").value
  const description = document.getElementById("update-description").value
  const date = document.getElementById("update-date").value
  const imageUrl = document.getElementById("update-image").value
  const pdfUrl = document.getElementById("update-pdf").value
  const link = document.getElementById("update-link").value

  try {
    const updateData = {
      title,
      description,
      date,
      imageUrl: imageUrl || null,
      pdfUrl: pdfUrl || null,
      link: link || null,
      timestamp: Date.now(),
    }

    if (editingUpdateId) {
      await set(ref(database, `updates/${editingUpdateId}`), updateData)
      alert("Update updated successfully!")
    } else {
      await push(ref(database, "updates"), updateData)
      alert("Update added successfully!")
    }

    resetForm()
  } catch (error) {
    console.error("Error saving update:", error)
    alert("Error saving update. Please try again.")
  }
}

function loadUpdates() {
  const updatesRef = ref(database, "updates")

  onValue(
    updatesRef,
    (snapshot) => {
      const updates = snapshot.val()
      console.log("Updates loaded:", updates) // Debug log
      displayUpdates(updates)
    },
    (error) => {
      console.error("Error loading updates:", error)
      hideUpdatesLoading()
      showNoUpdates()
    },
  )
}

function displayUpdates(updates) {
  const updatesList = document.getElementById("updates-list")
  const updatesLoading = document.getElementById("updates-loading")
  const noUpdates = document.getElementById("no-updates")

  if (!updatesList || !updatesLoading) return

  // Hide loading
  hideUpdatesLoading()

  updatesList.innerHTML = ""

  if (!updates || Object.keys(updates).length === 0) {
    showNoUpdates()
    return
  }

  // Hide no updates message
  if (noUpdates) noUpdates.classList.add("hidden")

  // Convert to array and sort by timestamp (newest first)
  const updatesArray = Object.entries(updates).sort(([, a], [, b]) => b.timestamp - a.timestamp)

  console.log(`Displaying ${updatesArray.length} updates`) // Debug log

  updatesArray.forEach(([id, update]) => {
    const updateCard = document.createElement("div")
    updateCard.className = "bg-gray-50 p-4 rounded-lg border hover:shadow-md transition-all duration-200"

    updateCard.innerHTML = `
      <div class="flex justify-between items-start mb-3">
        <h4 class="font-semibold text-gray-800 text-sm">${update.title}</h4>
        <div class="flex space-x-2">
          <button onclick="editUpdate('${id}')" class="text-blue-600 hover:text-blue-800 text-xs font-medium transition-colors">Edit</button>
          <button onclick="deleteUpdate('${id}')" class="text-red-600 hover:text-red-800 text-xs font-medium transition-colors">Delete</button>
        </div>
      </div>
      ${update.imageUrl ? `<img src="${update.imageUrl}" alt="${update.title}" class="admin-image mb-3">` : ""}
      <p class="text-gray-600 text-xs mb-2">${update.description.substring(0, 100)}...</p>
      <div class="flex items-center justify-between text-xs text-gray-500">
        <span>${new Date(update.date).toLocaleDateString()}</span>
        <div class="flex space-x-2">
          ${update.pdfUrl ? '<span class="bg-red-100 text-red-600 px-2 py-1 rounded text-xs">PDF</span>' : ""}
          ${update.link ? '<span class="bg-blue-100 text-blue-600 px-2 py-1 rounded text-xs">Link</span>' : ""}
        </div>
      </div>
    `
    updatesList.appendChild(updateCard)
  })
}

function hideUpdatesLoading() {
  const updatesLoading = document.getElementById("updates-loading")
  const updatesList = document.getElementById("updates-list")

  if (updatesLoading) updatesLoading.classList.add("hidden")
  if (updatesList) updatesList.classList.remove("hidden")
}

function showNoUpdates() {
  const noUpdates = document.getElementById("no-updates")
  if (noUpdates) noUpdates.classList.remove("hidden")
}

window.editUpdate = (id) => {
  const updateRef = ref(database, `updates/${id}`)
  onValue(
    updateRef,
    (snapshot) => {
      const update = snapshot.val()
      if (update) {
        document.getElementById("update-id").value = id
        document.getElementById("update-title").value = update.title
        document.getElementById("update-description").value = update.description
        document.getElementById("update-date").value = update.date
        document.getElementById("update-image").value = update.imageUrl || ""
        document.getElementById("update-pdf").value = update.pdfUrl || ""
        document.getElementById("update-link").value = update.link || ""

        // Update button text
        document.getElementById("update-submit-text").textContent = "Update"

        editingUpdateId = id
      }
    },
    { onlyOnce: true },
  )
}

window.deleteUpdate = async (id) => {
  if (confirm("Are you sure you want to delete this update?")) {
    try {
      await remove(ref(database, `updates/${id}`))
      alert("Update deleted successfully!")
    } catch (error) {
      console.error("Error deleting update:", error)
      alert("Error deleting update. Please try again.")
    }
  }
}

function cancelEdit() {
  resetForm()
}

function resetForm() {
  document.getElementById("updates-form").reset()
  document.getElementById("update-id").value = ""
  document.getElementById("update-submit-text").textContent = "Save Update"
  editingUpdateId = null
}
