/* sidebar.js */

// Function to initialize sidebar interactions
function initializeSidebar() {
    // Lấy tất cả các menu cha within the sidebar context
    // Use a more specific selector if multiple sidebars could exist
    let menuItems = document.querySelectorAll(".sidebar .menu-item");
  
    menuItems.forEach((item) => {
      item.addEventListener("click", function (event) { // Add event parameter
          // Prevent the click from bubbling up if necessary (optional)
          // event.stopPropagation();
  
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
  
  // submenu-user_info
  function toggleDropdown() {
    var menu = document.getElementById("dropdownMenu");
    if (menu) { // Check if the element exists
      menu.style.display = menu.style.display === "block" ? "none" : "block";
    } else {
        console.warn("Element with ID 'dropdownMenu' not found.");
    }
  }
  
  // Ẩn dropdown nếu click ra ngoài
  window.addEventListener("click", function (e) {
    var menu = document.getElementById("dropdownMenu");
    var userInfo = document.querySelector(".user-info");
  
    // Check if both elements exist before proceeding
    if (menu && userInfo) {
        // Check if the click was outside the userInfo element AND outside the dropdown menu itself
        if (!userInfo.contains(e.target) && !menu.contains(e.target)) {
          menu.style.display = "none";
        }
    } else {
        // Optionally log a warning if elements are missing
        // console.warn("Either 'dropdownMenu' or '.user-info' element not found for outside click handler.");
    }
  });
