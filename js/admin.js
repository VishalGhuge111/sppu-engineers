/**
 * @fileoverview Admin panel navigation and form toggle functionality.
 * This script handles sidebar navigation, mobile menu toggling,
 * and dynamic display of form fields based on 'paid'/'free' selections.
 */

// --- Constants for DOM Elements and Classes ---
const SELECTORS = {
  NAV_BUTTON: ".nav-btn",
  SECTION_CONTENT: ".section-content",
  MOBILE_MENU_BTN: "#mobile-menu-btn",
  SIDEBAR: "#sidebar",
  MAIN_CONTENT: "#main-content",
  COMPETITION_TYPE: "#competition-type",
  COMPETITION_FEE_CONTAINER: "#competition-fee-container",
  COMPETITION_FEE_INPUT: "#competition-fee",
  RESOURCE_TYPE: "#resource-type",
  RESOURCE_PRICE_CONTAINER: "#resource-price-container",
  RESOURCE_PRICE_INPUT: "#resource-price",
};

const CLASSES = {
  ACTIVE: "active",
  SIDEBAR_OPEN: "sidebar-open",
  SIDEBAR_ACTIVE: "sidebar-active",
  HIDDEN: "hidden",
};

const VALUES = {
  PAID: "paid",
};

// --- Helper Functions ---

/**
 * Toggles the visibility and required state of a price input field
 * based on the selected type (e.g., 'paid' or 'free').
 * @param {HTMLSelectElement} typeSelectElement - The select element (e.g., competition-type).
 * @param {HTMLElement} priceContainerElement - The container element for the price input.
 * @param {HTMLInputElement} priceInputElement - The price input element itself.
 */
function handlePriceToggle(
  typeSelectElement,
  priceContainerElement,
  priceInputElement
) {
  if (!typeSelectElement || !priceContainerElement || !priceInputElement) {
    console.warn("One or more elements for price toggle are missing.");
    return;
  }

  typeSelectElement.addEventListener("change", (event) => {
    const isPaid = event.target.value === VALUES.PAID;
    priceContainerElement.classList.toggle(CLASSES.HIDDEN, !isPaid);
    priceInputElement.required = isPaid;
    if (!isPaid) {
      priceInputElement.value = ""; // Clear value when not required
    }
  });
}

/**
 * Toggles the mobile sidebar's active state and the main content's overlay.
 * @param {HTMLElement} sidebarElement - The sidebar DOM element.
 * @param {HTMLElement} mainContentElement - The main content DOM element.
 */
function toggleMobileSidebar(sidebarElement, mainContentElement) {
  sidebarElement.classList.toggle(CLASSES.ACTIVE);
  mainContentElement.classList.toggle(CLASSES.SIDEBAR_OPEN);
}

/**
 * Handles the click event for navigation buttons.
 * Updates active button, shows the corresponding section, and closes mobile sidebar if applicable.
 * @param {Event} event - The click event.
 * @param {NodeListOf<Element>} navButtons - All navigation buttons.
 * @param {NodeListOf<Element>} sections - All content sections.
 * @param {HTMLElement} sidebarElement - The sidebar DOM element.
 * @param {HTMLElement} mainContentElement - The main content DOM element.
 */
function handleNavButtonClick(
  event,
  navButtons,
  sections,
  sidebarElement,
  mainContentElement
) {
  event.preventDefault(); // Prevent default link behavior
  const clickedButton = event.currentTarget; // Use currentTarget as event listener is on the button
  const sectionName = clickedButton.dataset.section;

  // Deactivate all nav buttons and activate the clicked one
  navButtons.forEach((btn) => btn.classList.remove(CLASSES.SIDEBAR_ACTIVE));
  clickedButton.classList.add(CLASSES.SIDEBAR_ACTIVE);

  // Hide all sections and show the target section
  sections.forEach((section) => section.classList.add(CLASSES.HIDDEN));
  const targetSection = document.getElementById(`${sectionName}-section`);
  if (targetSection) {
    targetSection.classList.remove(CLASSES.HIDDEN);
  } else {
    console.warn(`Section with ID '${sectionName}-section' not found.`);
  }

  // Close mobile menu if active
  if (window.innerWidth <= 768) {
    sidebarElement.classList.remove(CLASSES.ACTIVE);
    mainContentElement.classList.remove(CLASSES.SIDEBAR_OPEN);
  }
}

// --- Main DOM Content Loaded Handler ---
document.addEventListener("DOMContentLoaded", () => {
  // --- Get DOM Elements ---
  const navButtons = document.querySelectorAll(SELECTORS.NAV_BUTTON);
  const sections = document.querySelectorAll(SELECTORS.SECTION_CONTENT);
  const mobileMenuBtn = document.querySelector(SELECTORS.MOBILE_MENU_BTN);
  const sidebar = document.querySelector(SELECTORS.SIDEBAR);
  const mainContent = document.querySelector(SELECTORS.MAIN_CONTENT);

  // Early exit if crucial elements are missing
  if (!sidebar || !mainContent) {
    console.error(
      "Critical elements (sidebar or main content) not found. Script cannot initialize."
    );
    return;
  }

  // --- Mobile Menu Toggle Functionality ---
  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener("click", () =>
      toggleMobileSidebar(sidebar, mainContent)
    );
  } else {
    console.warn("Mobile menu button not found.");
  }

  // Close sidebar when clicking outside on mobile
  document.addEventListener("click", (e) => {
    // Only apply for smaller screens
    if (window.innerWidth > 768) return;

    // Check if the click target is outside the sidebar and not the mobile menu button itself
    if (
      !sidebar.contains(e.target) &&
      (!mobileMenuBtn || !mobileMenuBtn.contains(e.target))
    ) {
      sidebar.classList.remove(CLASSES.ACTIVE);
      mainContent.classList.remove(CLASSES.SIDEBAR_OPEN);
    }
  });

  // --- Navigation Handling ---
  if (navButtons.length > 0) {
    navButtons.forEach((button) => {
      button.addEventListener("click", (event) =>
        handleNavButtonClick(event, navButtons, sections, sidebar, mainContent)
      );
    });
  } else {
    console.warn("No navigation buttons found.");
  }

  // --- Paid/Free Toggle Handlers ---
  const competitionType = document.querySelector(SELECTORS.COMPETITION_TYPE);
  const competitionFeeContainer = document.querySelector(
    SELECTORS.COMPETITION_FEE_CONTAINER
  );
  const competitionFeeInput = document.querySelector(
    SELECTORS.COMPETITION_FEE_INPUT
  );

  handlePriceToggle(
    competitionType,
    competitionFeeContainer,
    competitionFeeInput
  );

  const resourceType = document.querySelector(SELECTORS.RESOURCE_TYPE);
  const resourcePriceContainer = document.querySelector(
    SELECTORS.RESOURCE_PRICE_CONTAINER
  );
  const resourcePriceInput = document.querySelector(
    SELECTORS.RESOURCE_PRICE_INPUT
  );

  handlePriceToggle(resourceType, resourcePriceContainer, resourcePriceInput);
});