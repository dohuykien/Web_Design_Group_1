// Function to initialize the submenu toggle logic
function initializeSidebarSubmenus() {
    console.log("Attempting to initialize sidebar submenus..."); // Debug log
    let menuItems = document.querySelectorAll(".sidebar .menu-item");
    console.log(`Found ${menuItems.length} menu items.`); // Debug log

    menuItems.forEach((item) => {
        item.addEventListener("click", function (event) {
            let submenu = this.nextElementSibling;
            if (submenu && submenu.classList.contains('submenu')) {
                const isActive = this.classList.contains('active');
                // Optional: Close other open submenus
                // closeAllSubmenus(this);

                if (isActive) {
                    submenu.style.display = "none";
                    this.classList.remove('active');
                } else {
                    submenu.style.display = "block";
                    this.classList.add('active');
                }
            }
        });
    });
     if (menuItems.length > 0) console.log("Submenu listeners attached."); // Debug log
}

// --- Function to initialize the mobile sidebar toggle ---
function initializeMobileSidebarToggle() {
    console.log("Attempting to initialize mobile sidebar toggle..."); // Debug log
    const toggleBtn = document.getElementById('sidebar-toggle-btn');
    const sidebar = document.querySelector('.sidebar'); // Use querySelector for flexibility
    const overlay = document.getElementById('sidebar-overlay');

    // Important: Check if the necessary elements *exist* before adding listeners
    if (!toggleBtn) {
        console.warn("Mobile toggle button ('#sidebar-toggle-btn') not found.");
        // Decide if this is an error or expected (e.g., button might be outside loaded component)
        // If the button is *always* expected to be in the main page, this check is less critical here
        // But if it *could* be part of a loaded component, this check is good.
    }
     if (!sidebar) {
        console.error("Sidebar element ('.sidebar') not found! Cannot initialize mobile toggle.");
        return; // Stop if sidebar isn't there
    }
    // Overlay is optional
     if (!overlay) {
        console.warn("Sidebar overlay ('#sidebar-overlay') not found.");
    }

    // Only add listener to toggleBtn if it exists
    if (toggleBtn) {
        toggleBtn.addEventListener('click', function(event) {
            event.stopPropagation();
            // Make sure sidebar exists before toggling class
            if (sidebar) sidebar.classList.toggle('open');
            if (overlay) overlay.classList.toggle('active');
            console.log("Sidebar toggled via button."); // Debug log
        });
         console.log("Mobile toggle button listener attached."); // Debug log
    }


    // Only add listener to overlay if it exists
    if (overlay) {
        overlay.addEventListener('click', function() {
            // Make sure sidebar exists before removing class
            if (sidebar) sidebar.classList.remove('open');
            overlay.classList.remove('active'); // Overlay definitely exists if we're here
             console.log("Sidebar closed via overlay."); // Debug log
        });
         console.log("Overlay click listener attached."); // Debug log
    }
}
  


