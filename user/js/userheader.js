// --- submenu-user_info ---
function toggleDropdown() {
  var menu = document.getElementById("dropdownMenu");
  if (menu) {
    // Check if the element exists
    menu.style.display = menu.style.display === "block" ? "none" : "block";
  } else {
    console.warn("Element with ID 'dropdownMenu' not found for toggle.");
  }
}

// --- Ẩn dropdown nếu click ra ngoài ---
window.addEventListener("click", function (e) {
  var menu = document.getElementById("dropdownMenu");
  var userInfo = document.querySelector(".user-info"); // Selector cho div bao quanh avatar và tên

  // Check if both elements exist before proceeding
  if (menu && userInfo) {
    // Chỉ ẩn nếu click ra ngoài CẢ userInfo VÀ menu
    if (!userInfo.contains(e.target) && !menu.contains(e.target)) {
      menu.style.display = "none";
    }
  }
});

// ---  Xử lý cập nhật thông tin header !!! ---

/**
 * Cập nhật hiển thị avatar và tên người dùng trong header dựa trên dữ liệu được cung cấp.
 * @param {object} data - Dữ liệu chứa { firstName, lastName, avatarSrc }.
 */
function updateHeaderDisplay(data) {
  console.log("Header Script: Hàm updateHeaderDisplay được gọi với:", data);
  if (!data) {
    console.warn(
      "Header Script: updateHeaderDisplay nhận được data null hoặc undefined."
    );
    return;
  }

  // Tìm các element trong cấu trúc HTML header của bạn
  const headerImage = document.querySelector(".user-info img");
  const headerNameSpan = document.querySelector(".user-info span"); // Span chứa cả tên và icon
  const defaultAvatar = "/user/images/dhk.jpg"; // *** THAY ĐỔI NẾU CẦN: Đường dẫn ảnh mặc định của bạn

  // --- Cập nhật Avatar ---
  if (headerImage) {
    let newSrc = data.avatarSrc || defaultAvatar; // Dùng ảnh từ data, nếu không có thì dùng default
    // Chỉ cập nhật DOM nếu src thực sự thay đổi
    if (headerImage.getAttribute("src") !== newSrc) {
      console.log(
        "Header Script: Đang cập nhật header avatar src thành:",
        newSrc
      );
      headerImage.src = newSrc; // Set src mới
    }

    // Luôn gắn onerror để xử lý nếu ảnh (kể cả ảnh mới hoặc ảnh từ LS) bị lỗi
    headerImage.onerror = function () {
      // Chỉ fallback về default nếu ảnh hiện tại *không phải* là default (tránh lặp vô hạn)
      if (this.getAttribute("src") !== defaultAvatar) {
        console.warn(
          `Header Script: Lỗi tải ảnh "${this.src}". Sử dụng ảnh mặc định.`
        );
        this.src = defaultAvatar;
      }
      this.onerror = null; // Quan trọng: Xóa handler sau khi đã xử lý để tránh gọi lại nếu default cũng lỗi
    };
    // Trigger check lỗi cho ảnh hiện tại nếu nó chưa load xong (trường hợp ảnh từ LS bị lỗi ngay từ đầu)
    if (!headerImage.complete || headerImage.naturalWidth === 0) {
    }
  } else {
    console.warn(
      "Header Script: Không tìm thấy element '.user-info img' để cập nhật avatar."
    );
  }

  // --- Cập nhật Tên ---
  if (headerNameSpan) {
    // Tìm icon caret bên trong span tên
    const caretIconElement = headerNameSpan.querySelector(
      "i.fa-solid.fa-caret-down"
    );
    // Lấy HTML của icon nếu tìm thấy, nếu không thì dùng chuỗi mặc định
    const caretIconHTML = caretIconElement
      ? caretIconElement.outerHTML
      : '<i class="fa-solid fa-caret-down"></i>';

    // Xây dựng tên đầy đủ, có fallback là 'Người dùng'
    const firstName = data.firstName || ""; // Lấy từ data, fallback là chuỗi rỗng
    const lastName = data.lastName || ""; // Lấy từ data, fallback là chuỗi rỗng
    const fullName = `${firstName} ${lastName}`.trim() || "Người dùng"; // Nối tên, trim và fallback

    // Tạo nội dung HTML mới cho span, bao gồm tên và icon
    const newHTML = `${fullName} ${caretIconHTML}`; // Thêm khoảng trắng giữa tên và icon

    // Chỉ cập nhật DOM nếu nội dung thực sự thay đổi
    if (headerNameSpan.innerHTML !== newHTML) {
      console.log(
        "Header Script: Đang cập nhật header name span thành:",
        newHTML
      );
      headerNameSpan.innerHTML = newHTML;
    }
  } else {
    console.warn(
      "Header Script: Không tìm thấy element '.user-info span' để cập nhật tên."
    );
  }
}

// --- Xử lý khi trang (hoặc component header) được load xong ---
document.addEventListener("DOMContentLoaded", () => {
  console.log("Header Script: DOMContentLoaded - Bắt đầu khởi tạo header.");

  // 1. Cập nhật header lần đầu tiên dựa trên dữ liệu từ localStorage
  const initialData = {
    firstName: localStorage.getItem("userProfile_firstName"),
    lastName: localStorage.getItem("userProfile_lastName"),
    avatarSrc: localStorage.getItem("userProfile_avatarSrc"),
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

  console.log("Header Script: Khởi tạo header hoàn tất.");
});
