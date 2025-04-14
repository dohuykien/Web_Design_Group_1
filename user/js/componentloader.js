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

        // 1. Cập nhật header lần đầu tiên dựa trên dữ liệu từ localStorage
        const initialData = {
            firstName: localStorage.getItem("userProfile_firstname"),
            lastName: localStorage.getItem("userProfile_lastname"),
            avatar: localStorage.getItem("userProfile_avatar"),
            username: localStorage.getItem("userProfile_username")
        };
        console.log("Header Script: Dữ liệu ban đầu từ localStorage:", initialData);
        updateHeaderDisplay(initialData); // Gọi hàm cập nhật với dữ liệu ban đầu

        // 2. Lắng nghe sự kiện 'profileUpdated' được phát ra từ trang profile
        document.addEventListener("profileUpdated", (event) => {
            console.log(
            "Header Script: Nhận được sự kiện 'profileUpdated'. Dữ liệu:",
            event.detail
            );
            // Gọi hàm cập nhật với dữ liệu mới từ sự kiện
            updateHeaderDisplay(event.detail);
        });

        // 3. Đảm bảo dropdown menu ẩn ban đầu (có thể đã được xử lý bởi CSS, nhưng chắc chắn hơn)
        const menu = document.getElementById("dropdownMenu");
        if (menu) {
            menu.style.display = "none";
        }

        // 4. (Tùy chọn) Thêm các xử lý khác cho header ở đây nếu cần
        // Ví dụ: Gắn sự kiện cho nút toggle sidebar nếu có trong header này
        const sidebarToggleBtn = document.getElementById("sidebar-toggle-btn");
        if (sidebarToggleBtn) {
            sidebarToggleBtn.addEventListener("click", () => {
            // Logic để toggle sidebar (ví dụ: thêm/xóa class trên body hoặc sidebar element)
            document.body.classList.toggle("sidebar-collapsed"); // Giả sử dùng class trên body
            console.log("Header Script: Sidebar toggle button clicked.");
            });
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