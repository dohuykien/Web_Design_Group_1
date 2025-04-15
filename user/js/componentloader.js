// Hàm tải các thành phần HTML
function loadComponent(url, containerId, callback) {
  console.log(`Component Loader: Bắt đầu fetch cho ${url} vào #${containerId}`); // Ghi log bắt đầu
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
        console.log(`Component Loader: Đã nhận HTML cho ${url}. Chèn vào #${containerId}.`); // Ghi log fetch thành công
        container.innerHTML = html;
        if (callback) {
          console.log(`Component Loader: Đang thực thi callback cho ${url}.`); // Ghi log thực thi callback
          // Sử dụng setTimeout để đảm bảo DOM đã cập nhật sau khi gán innerHTML (thường không cần thiết, nhưng an toàn)
          setTimeout(callback, 0);
        }
      } else {
        console.error(`Component Loader: Không tìm thấy vùng chứa có ID '${containerId}' cho ${url}!`);
      }
    })
    .catch((error) => {
      console.error(`Component Loader: Lỗi khi tải thành phần từ ${url}:`, error);
      const container = document.getElementById(containerId);
      if (container) container.innerHTML = `<p style="color: red; text-align: center;">Lỗi khi tải nội dung từ ${url}.</p>`;
    });
}

// Sử dụng DOMContentLoaded để đảm bảo các vùng chứa placeholder tồn tại trước khi fetch
document.addEventListener('DOMContentLoaded', () => {
  console.log("Component Loader: DOMContentLoaded đã kích hoạt.");

  // Tải Header
  loadComponent('/user/userheader.html', 'header-container', () => {
    console.log("Component Loader: Header callback đã thực thi.");
    // Nếu toggleDropdown không có sẵn trên toàn cục hoặc cần thiết lập:
    if (typeof initializeHeaderDropdown === 'function') { // Giả sử bạn tạo hàm này trong userheader.js
       initializeHeaderDropdown();
    } else if (typeof toggleDropdown === 'function'){
       // Nếu toggleDropdown là toàn cục và chỉ cần biết đến, log này sẽ giúp.
       console.log("Hàm toggleDropdown nên có sẵn trên toàn cục.");
    } else {
       console.warn("Không tìm thấy hàm dropdown header (toggleDropdown hoặc một hàm khởi tạo).");
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
      // Logic để toggle sidebar (ví dụ: thêm/xóa class trên body hoặc phần tử sidebar)
      document.body.classList.toggle("sidebar-collapsed"); // Giả sử dùng class trên body
      console.log("Header Script: Nút bật/tắt sidebar đã được nhấp.");
      });
    }
  });

  // Tải Sidebar
  loadComponent('/user/sidebar.html', 'sidebar-container', () => {
    console.log("Component Loader: Sidebar callback đã thực thi.");
    // Khởi tạo các chức năng của sidebar SAU KHI HTML của nó được tải

    // Khởi tạo Submenus
    if (typeof initializeSidebarSubmenus === 'function') {
      try {
        initializeSidebarSubmenus();
        console.log("Component Loader: Đã gọi initializeSidebarSubmenus.");
      } catch (e) {
        console.error("Component Loader: Lỗi khi thực thi initializeSidebarSubmenus:", e);
      }
    } else {
      console.warn("Component Loader: Không tìm thấy hàm initializeSidebarSubmenus. Kiểm tra xem sidebar.js đã tải đúng chưa.");
    }

    // Khởi tạo Mobile Toggle
    if (typeof initializeMobileSidebarToggle === 'function') {
       try {
        initializeMobileSidebarToggle();
        console.log("Component Loader: Đã gọi initializeMobileSidebarToggle.");
       } catch (e) {
        console.error("Component Loader: Lỗi khi thực thi initializeMobileSidebarToggle:", e);
       }
    } else {
      console.warn("Component Loader: Không tìm thấy hàm initializeMobileSidebarToggle. Kiểm tra xem sidebar.js đã tải đúng chưa.");
    }
  });

  // Tải Footer
  loadComponent('/user/userfooter.html', 'footer', () => {
    console.log("Component Loader: Footer callback đã thực thi.");
     // Thêm bất kỳ khởi tạo JS dành riêng cho footer ở đây nếu cần
  });
});