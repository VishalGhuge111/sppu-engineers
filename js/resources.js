import { database } from "./firebase-config.js"
import { ref, push, set, onValue, remove } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js"

let editingResourceId = null

document.addEventListener("DOMContentLoaded", () => {
  const resourcesForm = document.getElementById("resources-form")
  const cancelButton = document.getElementById("cancel-resource")

  if (resourcesForm) {
    resourcesForm.addEventListener("submit", handleResourceSubmit)
    if (cancelButton) {
      cancelButton.addEventListener("click", cancelEdit)
    }
    loadResources()
  }
})

async function handleResourceSubmit(e) {
  e.preventDefault()

  const title = document.getElementById("resource-title").value
  const description = document.getElementById("resource-description").value
  const type = document.getElementById("resource-type").value
  const price = type === "paid" ? document.getElementById("resource-price").value : null
  const imageUrl = document.getElementById("resource-image").value
  const link = document.getElementById("resource-link").value

  try {
    const resourceData = {
      title,
      description,
      type,
      price: price || null,
      imageUrl: imageUrl || null,
      link,
      timestamp: Date.now(),
    }

    if (editingResourceId) {
      await set(ref(database, `resources/${editingResourceId}`), resourceData)
      alert("Resource updated successfully!")
    } else {
      await push(ref(database, "resources"), resourceData)
      alert("Resource added successfully!")
    }

    resetForm()
  } catch (error) {
    console.error("Error saving resource:", error)
    alert("Error saving resource. Please try again.")
  }
}

function loadResources() {
  const resourcesRef = ref(database, "resources")
  onValue(
    resourcesRef,
    (snapshot) => {
      const resources = snapshot.val()
      displayResources(resources)
    },
    (error) => {
      console.error("Error loading resources:", error)
      hideResourcesLoading()
      showNoResources()
    },
  )
}

function displayResources(resources) {
  const resourcesList = document.getElementById("resources-list")
  const resourcesLoading = document.getElementById("resources-loading")
  const noResources = document.getElementById("no-resources")

  if (!resourcesList || !resourcesLoading) return

  // Hide loading
  hideResourcesLoading()

  resourcesList.innerHTML = ""

  if (!resources || Object.keys(resources).length === 0) {
    showNoResources()
    return
  }

  // Hide no resources message
  if (noResources) noResources.classList.add("hidden")

  // Show ALL resources
  Object.entries(resources)
    .sort(([, a], [, b]) => b.timestamp - a.timestamp)
    .forEach(([id, resource]) => {
      const resourceCard = document.createElement("div")
      resourceCard.className = "bg-gray-50 p-4 rounded-lg border hover:shadow-md transition-all duration-200"

      const priceDisplay = resource.type === "free" ? "Free" : `₹${resource.price}`

      resourceCard.innerHTML = `
        <div class="flex justify-between items-start mb-3">
          <h4 class="font-semibold text-gray-800 text-sm">${resource.title}</h4>
          <div class="flex space-x-2">
            <button onclick="editResource('${id}')" class="text-blue-600 hover:text-blue-800 text-xs font-medium transition-colors">Edit</button>
            <button onclick="deleteResource('${id}')" class="text-red-600 hover:text-red-800 text-xs font-medium transition-colors">Delete</button>
          </div>
        </div>
        ${resource.imageUrl ? `<img src="${resource.imageUrl}" alt="${resource.title}" class="admin-image mb-3">` : ""}
        <p class="text-gray-600 text-xs mb-3">${resource.description.substring(0, 100)}...</p>
        <div class="flex items-center justify-between">
          <span class="${resource.type === "free" ? "text-green-600" : "text-blue-600"} font-bold text-sm">${priceDisplay}</span>
        </div>
      `
      resourcesList.appendChild(resourceCard)
    })
}

function hideResourcesLoading() {
  const resourcesLoading = document.getElementById("resources-loading")
  const resourcesList = document.getElementById("resources-list")

  if (resourcesLoading) resourcesLoading.classList.add("hidden")
  if (resourcesList) resourcesList.classList.remove("hidden")
}

function showNoResources() {
  const noResources = document.getElementById("no-resources")
  if (noResources) noResources.classList.remove("hidden")
}

window.editResource = (id) => {
  const resourceRef = ref(database, `resources/${id}`)
  onValue(
    resourceRef,
    (snapshot) => {
      const resource = snapshot.val()
      if (resource) {
        document.getElementById("resource-id").value = id
        document.getElementById("resource-title").value = resource.title
        document.getElementById("resource-description").value = resource.description
        document.getElementById("resource-type").value = resource.type || "free"
        document.getElementById("resource-price").value = resource.price || ""
        document.getElementById("resource-image").value = resource.imageUrl || ""
        document.getElementById("resource-link").value = resource.link

        // Toggle price container
        const priceContainer = document.getElementById("resource-price-container")
        if (resource.type === "paid") {
          priceContainer.classList.remove("hidden")
          document.getElementById("resource-price").required = true
        } else {
          priceContainer.classList.add("hidden")
          document.getElementById("resource-price").required = false
        }

        // Update button text
        document.getElementById("resource-submit-text").textContent = "Update Resource"

        editingResourceId = id
      }
    },
    { onlyOnce: true },
  )
}

window.deleteResource = async (id) => {
  if (confirm("Are you sure you want to delete this resource?")) {
    try {
      await remove(ref(database, `resources/${id}`))
      alert("Resource deleted successfully!")
    } catch (error) {
      console.error("Error deleting resource:", error)
      alert("Error deleting resource. Please try again.")
    }
  }
}

function cancelEdit() {
  resetForm()
}

function resetForm() {
  document.getElementById("resources-form").reset()
  document.getElementById("resource-id").value = ""
  document.getElementById("resource-price-container").classList.add("hidden")
  document.getElementById("resource-price").required = false
  document.getElementById("resource-submit-text").textContent = "Save Resource"
  editingResourceId = null
}
