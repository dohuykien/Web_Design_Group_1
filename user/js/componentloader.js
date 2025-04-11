// Function to load HTML components
function loadComponent(url, containerId, callback) {
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
          container.innerHTML = html;
          if (callback) {
            callback(); // Execute callback function after loading
          }
        } else {
          console.error(`Container with ID '${containerId}' not found!`);
        }
      })
      .catch((error) => {
        console.error(`Error loading component from ${url}:`, error);
        const container = document.getElementById(containerId);
        // Ensure container exists before trying to set innerHTML on error display
        if (container) container.innerHTML = `<p style="color: red; text-align: center;">Error loading content from ${url}.</p>`;
      });
  }
  
// Use DOMContentLoaded to ensure placeholders exist before fetching
document.addEventListener('DOMContentLoaded', () => {
    console.log("Component Loader: DOMContentLoaded fired."); // Add a log for debugging

    // Load Header
    loadComponent('/user/userheader.html', 'header-container', () => {
    console.log("Header loaded via componentLoader.js");
    });

    // Load Sidebar
    loadComponent('/user/sidebar.html', 'sidebar-container', () => {
        console.log("Sidebar loaded via componentLoader.js");
        // Check for initializeSidebar ONLY after sidebar HTML is loaded
        if (typeof initializeSidebar === 'function') {
            initializeSidebar();
        } else {
            // This might happen if sidebar.js hasn't loaded or doesn't define the function
            console.warn("initializeSidebar function not found after loading sidebar. Check sidebar.js.");
        }
    });

    // Load Footer
    loadComponent('/user/userfooter.html', 'footer', () => {
        console.log("Footer loaded via componentLoader.js");
    });
});