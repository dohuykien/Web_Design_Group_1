// Hàm khởi tạo logic bật/tắt submenu
function initializeSidebarSubmenus() {
  console.log("Attempting to initialize sidebar submenus..."); // Ghi log gỡ lỗi
  let menuItems = document.querySelectorAll(".sidebar .menu-item");
  console.log(`Found ${menuItems.length} menu items.`); // Ghi log gỡ lỗi

  menuItems.forEach((item) => {
    item.addEventListener("click", function (event) {
      let submenu = this.nextElementSibling;
      if (submenu && submenu.classList.contains("submenu")) {
        const isActive = this.classList.contains("active");
        // Tùy chọn: Đóng các submenu khác đang mở
        // closeAllSubmenus(this);

        if (isActive) {
          submenu.style.display = "none";
          this.classList.remove("active");
        } else {
          submenu.style.display = "block";
          this.classList.add("active");
        }
      }
    });
  });
  if (menuItems.length > 0) console.log("Submenu listeners attached."); // Ghi log gỡ lỗi
}

// --- Hàm khởi tạo bật/tắt sidebar trên di động ---
function initializeMobileSidebarToggle() {
  console.log("Attempting to initialize mobile sidebar toggle..."); // Ghi log gỡ lỗi
  const toggleBtn = document.getElementById("sidebar-toggle-btn");
  const sidebar = document.querySelector(".sidebar"); // Sử dụng querySelector để linh hoạt hơn
  const overlay = document.getElementById("sidebar-overlay");

  // Quan trọng: Kiểm tra xem các phần tử cần thiết có *tồn tại* trước khi thêm bộ lắng nghe không
  if (!toggleBtn) {
    console.warn("Mobile toggle button ('#sidebar-toggle-btn') not found.");
  }
  if (!sidebar) {
    console.error(
      "Sidebar element ('.sidebar') not found! Cannot initialize mobile toggle."
    );
    return; // Dừng lại nếu không có sidebar
  }
  // Lớp phủ là tùy chọn
  if (!overlay) {
    console.warn("Sidebar overlay ('#sidebar-overlay') not found.");
  }

  // Chỉ thêm bộ lắng nghe vào toggleBtn nếu nó tồn tại
  if (toggleBtn) {
    toggleBtn.addEventListener("click", function (event) {
      event.stopPropagation();
      // Đảm bảo sidebar tồn tại trước khi bật/tắt class
      if (sidebar) sidebar.classList.toggle("open");
      if (overlay) overlay.classList.toggle("active");
      console.log("Sidebar toggled via button."); // Ghi log gỡ lỗi
    });
    console.log("Mobile toggle button listener attached."); // Ghi log gỡ lỗi
  }

  // Chỉ thêm bộ lắng nghe vào overlay nếu nó tồn tại
  if (overlay) {
    overlay.addEventListener("click", function () {
      // Đảm bảo sidebar tồn tại trước khi xóa class
      if (sidebar) sidebar.classList.remove("open");
      overlay.classList.remove("active"); // Lớp phủ chắc chắn tồn tại nếu ở đây
      console.log("Sidebar closed via overlay."); 
    });
    console.log("Overlay click listener attached."); 
  }
}