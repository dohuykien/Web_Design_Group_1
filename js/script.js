document.getElementById("menu-toggle").addEventListener("click", function () {
    document.querySelector(".navbar-collapse").classList.toggle("active");
  });
  

// -------------------------------- Login Logout -----------------
  const container = document.getElementById('container');
  const registerBtn = document.getElementById('register');
  const loginBtn = document.getElementById('login');
  
  registerBtn.addEventListener('click', () => {
    container.classList.add('active');
  }); 
  
  loginBtn.addEventListener('click', () => {
    container.classList.remove('active');
  }); 
  
// Lấy các phần tử cần thiết
const loginModal = document.getElementById("loginout");
const openLoginBtn = document.getElementById("openLoginBtn");
const closeBtn = document.querySelector(".close-btn");

// Khi bấm nút Đăng Nhập -> Hiện modal
openLoginBtn.addEventListener("click", () => {
    loginModal.style.display = "flex";
});

// Khi bấm nút X -> Ẩn modal
closeBtn.addEventListener("click", () => {
    loginModal.style.display = "none";
});

// Khi click ra ngoài modal -> Ẩn modal
window.addEventListener("click", (event) => {
    if (event.target === loginModal) {
        loginModal.style.display = "none";
    }
});



// -------------------------- Menu Detail ---------------------
document.addEventListener("DOMContentLoaded", function () {
    const menuItems = document.querySelectorAll(".league-menu-item");
    const contentSections = document.querySelectorAll(".content");
    const viewAll = document.getElementById("view-all");
    const sidebar = document.querySelector(".col-4.sidebar");
    
    // Định nghĩa các phần cần hiển thị cho từng menu
    const menuConfig = {
        "Trang Chủ": ["league-logo-slider", "match-detail", "sponsor", "view-all", "media"],
        "LTD - KQ": ["league-logo-slider", "sponsor", "media"],
        "Thống Kê - Xếp Hạng": ["league-logo-slider", "sponsor", "media"],
        "Đội Bóng": ["league-logo-slider", "sponsor", "media"],
        "Bình Chọn": ["league-logo-slider", "sponsor", "media"],
        "Tin Tức": ["league-logo-slider", "sponsor", "media"],
        "Thông Tin Giải": ["infor-league"]
    };
    
    // Các mục con bên trong "view all"
    const viewAllConfig = {
        "LTD - KQ": [0, 1], // Lịch thi đấu, Kết quả
        "Thống Kê - Xếp Hạng": [4], // Thống kê các bảng xếp hạng
        "Đội Bóng": [5], // Danh sách đội bóng
        "Bình Chọn": [6], // Hạng mục bình chọn
        "Tin Tức": [7] // Tin tức
    };

    function updateContent(menuName) {
        // Ẩn toàn bộ nội dung
        if (menuName !== "Trang Chủ") {
            contentSections.forEach(section => section.style.display = "none");
        }
        
        // Hiển thị các phần theo cấu hình
        if (menuConfig[menuName]) {
            menuConfig[menuName].forEach(id => {
                const section = document.getElementById(id);
                if (section) section.style.display = "block";
            });
        }

        if (menuName === "Trang Chủ") {
            const inforLeague = document.getElementById("infor-league");
            if (inforLeague) {
                inforLeague.style.display = "none";
            }
        }

        if (viewAll) {
            if (menuName === "Trang Chủ") {
                viewAll.style.display = "block";
                viewAll.querySelectorAll(".item-center").forEach((item, index) => {
                    // item.style.display = "block"; // Hiển thị tất cả mục trong view all
                    if ([4, 5, 6, 7].includes(index)) {
                        item.style.display = "none";
                    } else {
                        item.style.display = "block"; // Hiển thị các phần còn lại
                    }
                });
            } else if (viewAllConfig[menuName]) {
                viewAll.style.display = "block";
                const items = viewAll.querySelectorAll(".item-center");
                items.forEach((item, index) => {
                    item.style.display = viewAllConfig[menuName].includes(index) ? "block" : "none";
                });
            } else {
                viewAll.style.display = "none";
            }
        }

        // Hiển thị sidebar nếu có trong danh sách
        sidebar.style.display = ["LTD - KQ", "Thống Kê - Xếp Hạng", "Đội Bóng", "Bình Chọn", "Tin Tức"].includes(menuName) ? "block" : "none";
    }

    menuItems.forEach(item => {
        item.addEventListener("click", function () {
            // Xóa class active khỏi tất cả các menu
            menuItems.forEach(menu => menu.classList.remove("active"));
            this.classList.add("active");
            
            // Cập nhật nội dung hiển thị
            updateContent(this.textContent.trim());
        });
    });
    
    // Hiển thị mặc định khi tải trang
    updateContent("Trang Chủ");
});

// ------------------------ --------------------------
document.getElementById("xemChiTiet").addEventListener("click", function (event) {
    event.preventDefault(); // Ngăn hành vi mặc định của thẻ <a>

    // Tìm menu "Thống Kê - Xếp Hạng"
    const tkxhMenu = Array.from(document.querySelectorAll(".league-menu-item"))
        .find(item => item.textContent.trim() === "Thống Kê - Xếp Hạng");

    if (tkxhMenu) {
        tkxhMenu.click(); // Kích hoạt sự kiện click của menu
        tkxhMenu.scrollIntoView({ behavior: "smooth", block: "center" });
    }
});


// ----------------------------------- Slider Logo Detail ---------------------
document.addEventListener("DOMContentLoaded", function () {
  const track = document.querySelector(".logo-track");
  const logos = document.querySelectorAll(".team-logo");
  let index = 0;
  const visibleLogos = 8; // Số logo hiển thị mỗi lần
  const totalLogos = logos.length;

  // Nhân đôi danh sách logo để tránh khoảng trắng
  track.innerHTML += track.innerHTML;
  function slideLogos() {
      index++;
      track.style.transform = `translateX(-${index * (150 + 20)}px)`;
      // Khi đến nửa danh sách, reset về đầu để vòng lặp liên tục
      if (index >= totalLogos) {
          setTimeout(() => {
              track.style.transition = "none"; // Tắt hiệu ứng để reset nhanh
              track.style.transform = "translateX(0)";
              index = 0;
              setTimeout(() => {
                  track.style.transition = "transform 1s ease-in-out";
              }, 50);
          }, 1000);
      }
  }
  setInterval(slideLogos, 5000); // 5 giây lướt 1 lần
});


// 
// Thiết lập thời gian trận đấu tiếp theo
const targetDate = new Date("2025-04-07T08:00:00").getTime();
function updateCountdown() {
    const now = new Date().getTime();
    const timeLeft = targetDate - now;

    if (timeLeft < 0) {
        document.querySelector(".countdown").innerHTML = "<p>Trận đấu đã diễn ra!</p>";
        return;
    }

    // Tính số ngày, giờ, phút, giây
    const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

    // Hiển thị thời gian đếm ngược
    document.querySelector(".countdown").innerHTML = `
        <div class="time-box"><span>${days}</span> Ngày</div>
        <div class="time-box"><span>${hours}</span> Giờ</div>
        <div class="time-box"><span>${minutes}</span> Phút</div>
        <div class="time-box"><span>${seconds}</span> Giây</div>
    `;
}
// Cập nhật mỗi giây
setInterval(updateCountdown, 1000);
updateCountdown();



// 
document.addEventListener("DOMContentLoaded", function () {
    const selectRound = document.querySelector(".select-round-1");
    const matchDivs = document.querySelectorAll(".item-center-match");

    selectRound.addEventListener("change", function () {
        let selectedRound = selectRound.value; // Lấy vòng được chọn

        // Ẩn tất cả các div trận đấu
        matchDivs.forEach(div => div.classList.remove("active"));

        // Hiện div trận đấu tương ứng với vòng được chọn
        let targetDiv = document.querySelector(`.list-match-${selectedRound}`).closest(".item-center-match");
        if (targetDiv) {
            targetDiv.classList.add("active");
        }
    });
});


document.addEventListener("DOMContentLoaded", function () {
    const selectRound = document.querySelector(".round-static");
    const matchDivs = document.querySelectorAll(".item-center-result");

    selectRound.addEventListener("change", function () {
        let selectedRound = selectRound.value; // Lấy vòng được chọn

        // Ẩn tất cả các div trận đấu
        matchDivs.forEach(div => div.classList.remove("active"));

        // Hiện div trận đấu tương ứng với vòng được chọn
        let targetDiv = document.querySelector(`.list-result-${selectedRound}`).closest(".item-center-result");
        if (targetDiv) {
            targetDiv.classList.add("active");
        }
    });
});


document.addEventListener("DOMContentLoaded", function () {
    const selectRound = document.querySelector(".round-statistical");
    const matchDivs = document.querySelectorAll(".content-static-round");

    selectRound.addEventListener("change", function () {
        let selectedRound = selectRound.value; // Lấy vòng được chọn

        // Ẩn tất cả các div trận đấu
        matchDivs.forEach(div => div.classList.remove("active"));

        // Hiện div trận đấu tương ứng với vòng được chọn
        let targetDiv = document.querySelector(`.tbl-statistic-${selectedRound}`).closest(".content-static-round");
        if (targetDiv) {
            targetDiv.classList.add("active");
        }
    });
});

document.addEventListener("DOMContentLoaded", function () {
    const selectRound = document.querySelector(".get-bxh");
    const matchDivs = document.querySelectorAll(".item-center-rank");

    selectRound.addEventListener("change", function () {
        let selectedRound = selectRound.value; // Lấy vòng được chọn

        // Ẩn tất cả các div trận đấu
        matchDivs.forEach(div => div.classList.remove("active"));

        // Hiện div trận đấu tương ứng với vòng được chọn
        let targetDiv = document.querySelector(`.result-get-bxh-${selectedRound}`).closest(".item-center-rank");
        if (targetDiv) {
            targetDiv.classList.add("active");
        }
    });
});




