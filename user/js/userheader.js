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
    let newSrc = data.avatar || defaultAvatar; // Dùng ảnh từ data, nếu không có thì dùng default
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
    const fullName = `${firstName} ${lastName}`.trim() || data.username; // Nối tên, trim và fallback

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

