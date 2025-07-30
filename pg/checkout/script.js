
//loader
function showPaymentLoader() {
  const loader = document.getElementById("payment-loader");
  loader.classList.remove("hidden");

  setTimeout(() => {
    loader.classList.add("hidden");
  }, 5000); // 5 seconds
}

//  SCRIPT TO UPDATE VALUES BASED ON URL 
  const url = new URL(window.location.href);
  const params = url.searchParams;

  const branch = params.get("branch") || "NA";
  const sem = params.get("sem") || "NA";
  const plan = params.get("plan") || "NA";
  
  // Format display values
  const formatBranch = branch.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase());
  const semesterMap = {
    "1": "Semester 1 (1st Year)",
    "2": "Semester 2 (1st Year)",
    "3": "Semester 3 (2nd Year)",
    "4": "Semester 4 (2nd Year)",
    "5": "Semester 5 (3rd Year)",
    "6": "Semester 6 (3rd Year)",
    "7": "Semester 7 (4th Year)",
    "8": "Semester 8 (4th Year)",
  };
  const patternMap = {
    fe2024: "SPPU FE 2024 Pattern",
    se2024: "SPPU SE 2024 Pattern",
    te2019: "SPPU TE 2019 Pattern"
  };

  const paymentLinks = {
    fe2024: "https://payments.cashfree.com/forms/fe2024-sppuengineers",
    se2024: "https://payments.cashfree.com/forms/se2024-sppuengineers",
    te2019: "https://payments.cashfree.com/forms/sppuengineers"
  };

  // Update text on page
  document.getElementById("branch-name").textContent = formatBranch;
  document.getElementById("semester-name").textContent = semesterMap[sem] || "Selected Semester";
  document.getElementById("pattern-name").textContent = patternMap[plan] || "SPPU Pattern";

  // Set Buy button
  const buyBtn = document.getElementById("buy-now-btn");
  const buyText = document.getElementById("buy-now-text");

  buyBtn.href = paymentLinks[plan] || "#";
  buyBtn.target = "_self";
  buyText.textContent = "Pay Now - ₹149";


