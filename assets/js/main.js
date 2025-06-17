function initNavbarEvents() {
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenuIcon = document.getElementById('mobile-menu-icon');
    const mobileMenu = document.getElementById('mobile-menu');

    function closeMobileMenu() {
        mobileMenu.classList.remove('open');
        mobileMenuIcon.classList.remove('fa-times');
        mobileMenuIcon.classList.add('fa-bars');

        document.querySelectorAll('.mobile-dropdown').forEach(dropdown => {
            dropdown.classList.remove('open');
        });
        document.querySelectorAll('#explore-mobile-icon, #more-mobile-icon').forEach(icon => {
            icon.classList.remove('fa-chevron-up');
            icon.classList.add('fa-chevron-down');
        });
    }
    window.closeMobileMenu = closeMobileMenu;

    mobileMenuButton.addEventListener('click', function () {
        mobileMenu.classList.toggle('open');
        mobileMenuIcon.classList.toggle('fa-bars');
        mobileMenuIcon.classList.toggle('fa-times');
    });

    // Dropdown toggles
    document.getElementById('explore-mobile-toggle').addEventListener('click', function () {
        const dropdown = document.getElementById('explore-mobile-dropdown');
        const icon = document.getElementById('explore-mobile-icon');
        dropdown.classList.toggle('open');
        icon.classList.toggle('fa-chevron-down');
        icon.classList.toggle('fa-chevron-up');
    });

    document.getElementById('more-mobile-toggle').addEventListener('click', function () {
        const dropdown = document.getElementById('more-mobile-dropdown');
        const icon = document.getElementById('more-mobile-icon');
        dropdown.classList.toggle('open');
        icon.classList.toggle('fa-chevron-down');
        icon.classList.toggle('fa-chevron-up');
    });

    // Desktop dropdown logic...
    document.querySelectorAll('.dropdown-parent').forEach(parent => {
        let closeTimeout;
        parent.addEventListener('mouseenter', function () {
            if (window.innerWidth >= 768) {
                clearTimeout(closeTimeout);
                document.querySelectorAll('.dropdown-parent.active').forEach(otherParent => {
                    if (otherParent !== this) otherParent.classList.remove('active');
                });
                this.classList.add('active');
            }
        });

        parent.addEventListener('mouseleave', function () {
            if (window.innerWidth >= 768) {
                closeTimeout = setTimeout(() => {
                    this.classList.remove('active');
                }, 200);
            }
        });

        parent.querySelector('button').addEventListener('click', function (e) {
            if (window.innerWidth >= 768) {
                e.preventDefault();
                clearTimeout(closeTimeout);
                parent.classList.toggle('active');
                document.querySelectorAll('.dropdown-parent').forEach(otherParent => {
                    if (otherParent !== parent) {
                        otherParent.classList.remove('active');
                    }
                });
            }
        });
    });

    document.addEventListener('click', function (e) {
        if (window.innerWidth >= 768 && !e.target.closest('.dropdown-parent')) {
            document.querySelectorAll('.dropdown-parent.active').forEach(parent => {
                parent.classList.remove('active');
            });
        }
    });

    window.addEventListener('scroll', function () {
        const navbar = document.getElementById('navbar');
        if (window.scrollY > 10) {
            navbar.classList.add('shadow-sm', 'border-b', 'border-gray-100');
        } else {
            navbar.classList.remove('shadow-sm', 'border-b', 'border-gray-100');
        }
    });

    const track = document.getElementById('testimonialTrack');
    const next = document.getElementById('nextBtn');
    const prev = document.getElementById('prevBtn');

    next?.addEventListener('click', () => {
        track.scrollBy({ left: track.offsetWidth * 0.8, behavior: 'smooth' });
    });
    prev?.addEventListener('click', () => {
        track.scrollBy({ left: -track.offsetWidth * 0.8, behavior: 'smooth' });
    });
}
