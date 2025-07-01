// Global variables
let currentFilter = 'All';
let currentProject = null;

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    renderProjects();
    
    // Modal event listeners
    document.getElementById('projectModal').addEventListener('click', function(e) {
        if (e.target === this) closeModal();
    });

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && !document.getElementById('projectModal').classList.contains('hidden')) {
            closeModal();
        }
    });
});

// Get category colors
function getCategoryColor(category) {
    const colors = {
        'Software': 'bg-blue-100 text-blue-800 border-blue-200',
        'AIML': 'bg-purple-100 text-purple-800 border-purple-200',
        'IoT': 'bg-green-100 text-green-800 border-green-200'
    };
    return colors[category] || 'bg-gray-100 text-gray-800 border-gray-200';
}

// Render projects
function renderProjects() {
    const grid = document.getElementById('projectsGrid');
    const filteredProjects = currentFilter === 'All' 
        ? projects 
        : projects.filter(project => project.category === currentFilter);

    grid.innerHTML = filteredProjects.map(project => {
        const categoryColor = getCategoryColor(project.category);
        return `
        <div class="project-card rounded-lg p-4">
            <!-- Header -->
            <div class="flex justify-between items-start mb-3">
                <span class="text-xs font-medium ${categoryColor} px-2 py-1 rounded border">
                    ${project.category}
                </span>
                <span class="text-xs text-gray-500">${project.id}</span>
            </div>
            
            <!-- Title -->
            <h3 class="text-base font-semibold text-gray-900 mb-2 leading-tight">${project.title}</h3>
            
            <!-- Tech Stack -->
            <div class="mb-3">
                <div class="flex flex-wrap gap-2">
                    ${project.stack.slice(0, 3).map(tech => `
                        <span class="tech-badge">
                            <i class="${getTechIcon(tech)} text-xs"></i>
                            ${tech}
                        </span>
                    `).join('')}
                    ${project.stack.length > 3 ? `<span class="tech-badge"><i class="fas fa-plus text-xs"></i>${project.stack.length - 3}</span>` : ''}
                </div>
            </div>
            
            <!-- Description -->
            <p class="text-xs text-gray-600 mb-4 leading-relaxed flex-grow">${project.shortDesc}</p>
            
            <!-- Footer -->
            <div class="flex justify-between items-center pt-3 border-t border-gray-200 mt-auto">
                <span class="text-lg font-bold text-gray-900">₹${project.price}</span>
                <button onclick="openModal('${project.id}')" class="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded text-xs font-medium">
                    View Details
                </button>
            </div>
        </div>
    `;
    }).join('');
}

// Filter projects
function filterProjects(category) {
    currentFilter = category;
    
    // Update button styles
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    document.getElementById(`btn-${category}`).classList.add('active');
    
    renderProjects();
}

// Open modal
function openModal(projectId) {
    currentProject = projects.find(p => p.id === projectId);
    if (!currentProject) return;

    const categoryColor = getCategoryColor(currentProject.category);

    document.getElementById('modalTitle').textContent = currentProject.title;
    document.getElementById('modalId').textContent = currentProject.id;
    document.getElementById('modalCategory').textContent = currentProject.category;
    document.getElementById('modalCategory').className = `px-2 py-1 rounded text-xs font-medium ${categoryColor} border`;
    document.getElementById('modalDesc').textContent = currentProject.desc;
    
    // Tech stack with icons
    document.getElementById('modalStack').innerHTML = currentProject.stack.map(tech => `
        <span class="tech-badge">
            <i class="${getTechIcon(tech)} text-xs"></i>
            ${tech}
        </span>
    `).join('');
    
    document.getElementById('payAdvanceButton').onclick = () => {
    const confirmPurchase = confirm(`Proceed to payment for ${currentProject.title} - ₹500 advance?`);
    if (confirmPurchase) {
        window.open('https://payments.cashfree.com/forms/sppu-projects', '_blank');
    }
};

    
    document.getElementById('contactButton').onclick = () => {
        const message = `Hi! I'm interested in ${currentProject.title} (${currentProject.id}). Please provide more details.`;
        const whatsappUrl = `https://wa.me/${currentProject.wa}?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
    };
    
    document.getElementById('projectModal').classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

// Close modal
function closeModal() {
    document.getElementById('projectModal').classList.add('hidden');
    document.body.style.overflow = 'auto';
    currentProject = null;
}

// Custom project functions
function makeCall() {
    window.location.href = 'tel:+919876543210';
}

function contactCustom() {
    const message = 'Hi! I need a custom project. Can you help me with my specific requirements?';
    const whatsappUrl = `https://wa.me/919876543210?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
}