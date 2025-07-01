// No changes needed to the existing functionality
import { database } from "./firebase-config.js"
import { ref, push, set, onValue, remove } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js"

let editingCompetitionId = null

document.addEventListener("DOMContentLoaded", () => {
  const competitionsForm = document.getElementById("competitions-form")
  const cancelButton = document.getElementById("cancel-competition")

  if (competitionsForm) {
    competitionsForm.addEventListener("submit", handleCompetitionSubmit)
    if (cancelButton) {
      cancelButton.addEventListener("click", cancelEdit)
    }
    loadCompetitions()
  }
})

async function handleCompetitionSubmit(e) {
  e.preventDefault()

  const title = document.getElementById("competition-title").value
  const description = document.getElementById("competition-description").value
  const lastDate = document.getElementById("competition-lastdate").value
  const type = document.getElementById("competition-type").value
  const fee = type === "paid" ? document.getElementById("competition-fee").value : null
  const imageUrl = document.getElementById("competition-image").value
  const link = document.getElementById("competition-link").value

  try {
    const competitionData = {
      title,
      description,
      lastDate,
      type,
      fee: fee || null,
      imageUrl: imageUrl || null,
      link,
      timestamp: Date.now(),
    }

    if (editingCompetitionId) {
      await set(ref(database, `competitions/${editingCompetitionId}`), competitionData)
      alert("Competition updated successfully!")
    } else {
      await push(ref(database, "competitions"), competitionData)
      alert("Competition added successfully!")
    }

    resetForm()
  } catch (error) {
    console.error("Error saving competition:", error)
    alert("Error saving competition. Please try again.")
  }
}

function loadCompetitions() {
  const competitionsRef = ref(database, "competitions")
  onValue(
    competitionsRef,
    (snapshot) => {
      const competitions = snapshot.val()
      displayCompetitions(competitions)
    },
    (error) => {
      console.error("Error loading competitions:", error)
      hideCompetitionsLoading()
      showNoCompetitions()
    },
  )
}

function displayCompetitions(competitions) {
  const competitionsList = document.getElementById("competitions-list")
  const competitionsLoading = document.getElementById("competitions-loading")
  const noCompetitions = document.getElementById("no-competitions")

  if (!competitionsList || !competitionsLoading) return

  hideCompetitionsLoading()
  competitionsList.innerHTML = ""

  if (!competitions || Object.keys(competitions).length === 0) {
    showNoCompetitions()
    return
  }

  if (noCompetitions) noCompetitions.classList.add("hidden")

  Object.entries(competitions)
    .sort(([, a], [, b]) => b.timestamp - a.timestamp)
    .forEach(([id, competition]) => {
      const isExpired = new Date(competition.lastDate) < new Date()
      const competitionCard = document.createElement("div")
      competitionCard.className = "bg-white p-4 rounded-lg shadow border hover:shadow-md transition-all"

      const feeDisplay = competition.type === "free" ? "Free" : `₹${competition.fee}`

      competitionCard.innerHTML = `
        <div class="flex justify-between items-start mb-3">
          <h4 class="font-semibold text-gray-800">${competition.title}</h4>
          <div class="flex space-x-2">
            <button onclick="editCompetition('${id}')" class="text-blue-600 hover:text-blue-800 text-sm font-medium">Edit</button>
            <button onclick="deleteCompetition('${id}')" class="text-red-600 hover:text-red-800 text-sm font-medium">Delete</button>
          </div>
        </div>
        ${competition.imageUrl ? `<img src="${competition.imageUrl}" alt="${competition.title}" class="w-full h-32 object-cover rounded mb-3">` : ""}
        <p class="text-gray-600 text-sm mb-3">${competition.description.substring(0, 100)}...</p>
        <div class="flex items-center justify-between text-sm">
          <span class="${competition.type === "free" ? "text-green-600" : "text-yellow-600"} font-medium">${feeDisplay}</span>
          <span class="${isExpired ? "text-red-600" : "text-blue-600"}">
            ${new Date(competition.lastDate).toLocaleDateString()} ${isExpired ? "(Expired)" : ""}
          </span>
        </div>
      `
      competitionsList.appendChild(competitionCard)
    })
}

function hideCompetitionsLoading() {
  const competitionsLoading = document.getElementById("competitions-loading")
  const competitionsList = document.getElementById("competitions-list")

  if (competitionsLoading) competitionsLoading.classList.add("hidden")
  if (competitionsList) competitionsList.classList.remove("hidden")
}

function showNoCompetitions() {
  const noCompetitions = document.getElementById("no-competitions")
  if (noCompetitions) noCompetitions.classList.remove("hidden")
}

window.editCompetition = (id) => {
  const competitionRef = ref(database, `competitions/${id}`)
  onValue(
    competitionRef,
    (snapshot) => {
      const competition = snapshot.val()
      if (competition) {
        document.getElementById("competition-id").value = id
        document.getElementById("competition-title").value = competition.title
        document.getElementById("competition-description").value = competition.description
        document.getElementById("competition-lastdate").value = competition.lastDate
        document.getElementById("competition-type").value = competition.type || "free"
        document.getElementById("competition-fee").value = competition.fee || ""
        document.getElementById("competition-image").value = competition.imageUrl || ""
        document.getElementById("competition-link").value = competition.link

        const feeContainer = document.getElementById("competition-fee-container")
        if (competition.type === "paid") {
          feeContainer.classList.remove("hidden")
          document.getElementById("competition-fee").required = true
        } else {
          feeContainer.classList.add("hidden")
          document.getElementById("competition-fee").required = false
        }

        document.getElementById("competition-submit-text").textContent = "Update Competition"
        editingCompetitionId = id
      }
    },
    { onlyOnce: true },
  )
}

window.deleteCompetition = async (id) => {
  if (confirm("Are you sure you want to delete this competition?")) {
    try {
      await remove(ref(database, `competitions/${id}`))
      alert("Competition deleted successfully!")
    } catch (error) {
      console.error("Error deleting competition:", error)
      alert("Error deleting competition. Please try again.")
    }
  }
}

function cancelEdit() {
  resetForm()
}

function resetForm() {
  document.getElementById("competitions-form").reset()
  document.getElementById("competition-id").value = ""
  document.getElementById("competition-fee-container").classList.add("hidden")
  document.getElementById("competition-fee").required = false
  document.getElementById("competition-submit-text").textContent = "Save Competition"
  editingCompetitionId = null
}