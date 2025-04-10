/* sidebar.js */

function initializeSidebar() {
    // Lấy tất cả các menu cha within the sidebar context
    let menuItems = document.querySelectorAll(".sidebar .menu-item");
  
    menuItems.forEach((item) => {
      item.addEventListener("click", function (event) { // Add event parameter
  
        // Find the next sibling element which is the submenu
        let submenu = this.nextElementSibling;
  
        // Check if the submenu exists and is indeed a submenu
        if (submenu && submenu.classList.contains('submenu')) {
            // Toggle the display style
            submenu.style.display =
                submenu.style.display === "block" ? "none" : "block";
  
            // Optional: Toggle an 'active' class on the menu item for styling (like rotating the chevron)
            this.classList.toggle('active');
        }
      });
    });
  }
  
  // --- Potentially Unrelated Dropdown Logic ---
  // Consider moving this to a different JS file if it's not
  // strictly part of the sidebar component's core functionality.
  

