// load-components.js
document.addEventListener("DOMContentLoaded", function () {
  // Load header
  fetch('/components/header.html')
  .then(res => res.text())
  .then(html => {
    document.getElementById("header-placeholder").innerHTML = html;
    initNavbarEvents(); // 🟢 Now it will work because DOM exists
  });

  // Load footer
  fetch("/components/footer.html")
    .then(response => response.text())
    .then(data => {
      document.getElementById("footer-placeholder").innerHTML = data;
    });
});
