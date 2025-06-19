document.addEventListener('DOMContentLoaded', function() {
    // Get all semester buttons
    const semesterButtons = document.querySelectorAll('.sem-button');
    // Get all semester content sections
    const semesterContents = document.querySelectorAll('[id^="sem"][id$="Content"]');

    // Function to show a specific semester content and highlight the corresponding button
    function showSemester(semId) {
        // Hide all content sections
        semesterContents.forEach(content => {
            content.classList.add('hidden');
        });

        // Show the selected content section
        const selectedContent = document.getElementById(`sem${semId}Content`);
        if (selectedContent) {
            selectedContent.classList.remove('hidden');
        }

        // Remove active styling from all buttons
        semesterButtons.forEach(button => {
            // For mobile buttons
            if (window.innerWidth < 768) {
                button.classList.remove('bg-blue-600', 'text-white', 'border-blue-600');
                button.classList.add('bg-blue-50', 'text-blue-700', 'border-blue-600');
            } 
            // For desktop buttons
            else {
                button.classList.remove('bg-blue-100', 'text-blue-800');
                button.classList.add('text-blue-800', 'hover:bg-blue-100');
            }
        });

        // Add active styling to the clicked button
        semesterButtons.forEach(button => {
            if (button.dataset.sem === String(semId)) {
                // Mobile active state
                if (window.innerWidth < 768) {
                    button.classList.remove('bg-blue-50', 'text-blue-700', 'border-blue-600');
                    button.classList.add('bg-blue-600', 'text-white', 'border-blue-600');
                } 
                // Desktop active state
                else {
                    button.classList.remove('text-blue-800', 'hover:bg-blue-100');
                    button.classList.add('bg-blue-100', 'text-blue-800');
                }
            }
        });
    }

    // Add click event listeners to all semester buttons
    semesterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const semId = this.dataset.sem;
            showSemester(semId);
        });
    });

    // Initially show Semester 3 content on page load
    showSemester(3);

    // Desktop sidebar button styling
    const desktopSidebar = document.querySelector('.md\\:flex');
    if (window.innerWidth >= 768 && desktopSidebar) {
        const buttons = desktopSidebar.querySelectorAll(".sem-button");

        buttons.forEach(btn => {
            btn.addEventListener("click", () => {
                buttons.forEach(b => b.classList.remove("bg-blue-100", "text-blue-800", "shadow", "ring-2", "ring-blue-500"));
                btn.classList.add("bg-blue-100", "text-blue-800", "shadow", "ring-2", "ring-blue-500");
            });
        });

        // Optional: Trigger default (e.g., Semester 3 selected on load)
        const defaultBtn = desktopSidebar.querySelector('[data-sem="3"]');
        if (defaultBtn) defaultBtn.click();
    }
});