// Function to load HTML components
function loadComponent(url, containerId, callback) {
    console.log(`Component Loader: Initiating fetch for ${url} into #${containerId}`); // Log start
    fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status} for ${url}`);
        }
        return response.text();
      })
      .then((html) => {
        const container = document.getElementById(containerId);
        if (container) {
          console.log(`Component Loader: Received HTML for ${url}. Injecting into #${containerId}.`); // Log success fetch
          container.innerHTML = html;
          if (callback) {
            console.log(`Component Loader: Executing callback for ${url}.`); // Log callback execution
            // Use setTimeout to ensure DOM has updated after innerHTML assignment (usually not needed, but safe)
            setTimeout(callback, 0);
          }
        } else {
          console.error(`Component Loader: Container with ID '${containerId}' not found for ${url}!`);
        }
      })
      .catch((error) => {
        console.error(`Component Loader: Error loading component from ${url}:`, error);
        const container = document.getElementById(containerId);
        if (container) container.innerHTML = `<p style="color: red; text-align: center;">Error loading content from ${url}.</p>`;
      });
}

// Use DOMContentLoaded to ensure placeholder containers exist before fetching
document.addEventListener('DOMContentLoaded', () => {
    console.log("Component Loader: DOMContentLoaded fired.");

    // Load Header
    loadComponent('/user/userheader.html', 'header-container', () => {
        console.log("Component Loader: Header callback executed.");
        // If toggleDropdown isn't globally available or needs setup:
        if (typeof initializeHeaderDropdown === 'function') { // Assume you create this func in userheader.js
             initializeHeaderDropdown();
        } else if (typeof toggleDropdown === 'function'){
             // If toggleDropdown is global and just needs to be known, this log helps.
             console.log("toggleDropdown function should be available globally.");
        } else {
             console.warn("Header dropdown function (toggleDropdown or an initializer) not found.");
        }
    });

    // Load Sidebar
    loadComponent('/user/sidebar.html', 'sidebar-container', () => {
        console.log("Component Loader: Sidebar callback executed.");
        // Initialize sidebar functionalities AFTER its HTML is loaded

        // Initialize Submenus
        if (typeof initializeSidebarSubmenus === 'function') {
            try {
                initializeSidebarSubmenus();
                console.log("Component Loader: Called initializeSidebarSubmenus.");
            } catch (e) {
                console.error("Component Loader: Error executing initializeSidebarSubmenus:", e);
            }
        } else {
            console.warn("Component Loader: initializeSidebarSubmenus function not found. Check if sidebar.js loaded correctly.");
        }

        // Initialize Mobile Toggle
        if (typeof initializeMobileSidebarToggle === 'function') {
             try {
                initializeMobileSidebarToggle();
                console.log("Component Loader: Called initializeMobileSidebarToggle.");
             } catch (e) {
                console.error("Component Loader: Error executing initializeMobileSidebarToggle:", e);
             }
        } else {
            console.warn("Component Loader: initializeMobileSidebarToggle function not found. Check if sidebar.js loaded correctly.");
        }
    });

    // Load Footer
    loadComponent('/user/userfooter.html', 'footer', () => {
        console.log("Component Loader: Footer callback executed.");
       // Add any footer-specific JS initialization here if needed
    });
});