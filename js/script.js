document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.getElementById('menu-toggle');
    const mainMenu = document.getElementById('main-menu');
    const closeMenu = document.getElementById('close-menu');
    const authToggle = document.getElementById('auth-toggle');
    const authDropdown = document.getElementById('auth-dropdown');
  
    // 👉 Toggle menu trái
    menuToggle.addEventListener('click', () => {
      mainMenu.classList.add('active');
      document.body.classList.add('menu-overlay-active');
    });
  
    closeMenu.addEventListener('click', () => {
      mainMenu.classList.remove('active');
      document.body.classList.remove('menu-overlay-active');
    });
  
    // 👉 Bấm ra ngoài để đóng menu trái
    document.addEventListener('click', function (e) {
      if (
        mainMenu.classList.contains('active') &&
        !mainMenu.contains(e.target) &&
        !menuToggle.contains(e.target)
      ) {
        mainMenu.classList.remove('active');
        document.body.classList.remove('menu-overlay-active');
      }
    });
  
    // 👉 Toggle auth dropdown bên phải
    authToggle.addEventListener('click', () => {
      authDropdown.classList.toggle('active');
    });
  
    // 👉 Bấm ra ngoài để đóng auth menu
    document.addEventListener('click', (e) => {
      if (
        !authToggle.contains(e.target) &&
        !authDropdown.contains(e.target)
      ) {
        authDropdown.classList.remove('active');
      }
    });
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
const openRegisterBtn = document.getElementById("openRegisterBtn");

// Khi bấm nút Đăng Nhập -> Hiện modal
openLoginBtn.addEventListener("click", () => {
    loginModal.style.display = "flex";
    container.classList.remove("active"); // Hiện giao diện Đăng Nhập
});

// Khi bấm nút Đăng Ký trong dropdown
openRegisterBtn.addEventListener("click", () => {
    loginModal.style.display = "flex";
    container.classList.add("active"); // Hiện giao diện Đăng Ký
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
document.querySelectorAll(".xemChiTiet").forEach(a => {
    a.addEventListener("click", function (event) {
        event.preventDefault();

        const tkxhMenu = Array.from(document.querySelectorAll(".league-menu-item"))
            .find(item => item.textContent.trim() === "Thống Kê - Xếp Hạng");

        if (tkxhMenu) {
            tkxhMenu.click();
            tkxhMenu.scrollIntoView({ behavior: "smooth", block: "center" });
        }
    });
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




function goBack() {
    window.history.back(); // Quay lại trang trước đó
}
// Giả lập dữ liệu đội bóng (sau này có thể lấy từ API hoặc localStorage)
document.addEventListener("DOMContentLoaded", function () {
    const teamInfo = JSON.parse(localStorage.getItem("selectedTeam")) || {
        name: "IT65A",
        coach: "Ngô Hữu Nghĩa",
        members: 13,
        matches: [
            { date: "14-03-2025", time: "08:00", match: "IT65A 4 - 0 CS65", field: "Sân A" },
            { date: "16-03-2025", time: "08:30", match: "IT65B 2 - 4 IT65A", field: "Định Công 2" },
            { date: "14-03-2025", time: "08:00", match: "IT65A 11 - 1 IT66A", field: "Sân B" }
        ]
    };

    document.getElementById("team-name").textContent = teamInfo.name;
    document.getElementById("coach-name").textContent = teamInfo.coach;
    document.getElementById("members-count").textContent = teamInfo.members;

    let matchTable = document.getElementById("match-data");
    matchTable.innerHTML = "";
    teamInfo.matches.forEach(match => {
        let row = `<tr>
            <td>${match.date}</td>
            <td>${match.time}</td>
            <td>${match.match}</td>
            <td>${match.field}</td>
        </tr>`;
        matchTable.innerHTML += row;
    });
});



// 
function saveTeamData(name, coach, members) {
    let teamData = {
        name: name,
        coach: coach,
        members: members,
        matches: [
            { date: "14-03-2025", time: "08:00", match: name + " 4 - 0 CS65", field: "Sân A" },
            { date: "16-03-2025", time: "08:30", match: "IT65B 2 - 4 " + name, field: "Định Công 2" },
            { date: "14-03-2025", time: "08:00", match: name + " 11 - 1 IT66A", field: "Sân B" }
        ]
    };
    localStorage.setItem("selectedTeam", JSON.stringify(teamData));
}




// 
document.addEventListener("DOMContentLoaded", function () {
    const img = document.querySelector(".pull-right img");
    const modal = document.getElementById("modal-nockout");
    const closeButton = document.querySelector(".close");
    const body = document.body;

    if (img && modal) {
        img.addEventListener("click", function () {
            modal.style.display = "block";
            modal.classList.add("show");
            modal.setAttribute("aria-hidden", "false");
            body.classList.add("modal-open"); // Làm mờ nền
            body.style.overflow = "hidden"; // Chặn cuộn trang
        });
    }

    if (closeButton) {
        closeButton.addEventListener("click", function () {
            closeModal();
        });
    }

    // Đóng modal khi nhấp ra ngoài hoặc nhấn phím ESC
    window.addEventListener("click", function (event) {
        if (event.target === modal) {
            closeModal();
        }
    });

    document.addEventListener("keydown", function (event) {
        if (event.key === "Escape") {
            closeModal();
        }
    });

    function closeModal() {
        modal.style.display = "none";
        modal.classList.remove("show");
        modal.setAttribute("aria-hidden", "true");
        body.classList.remove("modal-open"); // Gỡ bỏ hiệu ứng mờ nền
        body.style.overflow = ""; // Khôi phục cuộn trang
    }

    // Thêm CSS để làm mờ nền khi modal mở
    const style = document.createElement("style");
    style.innerHTML = `
        .modal-open::before {
            content: "";
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            z-index: 1040;
        }
    `;
    document.head.appendChild(style);
});


// 
document.addEventListener("DOMContentLoaded", function () {
    const backToTop = document.querySelector(".back-top");

    if (backToTop) {
        // Ẩn nút khi chưa cuộn xuống
        backToTop.style.display = "none";

        // Hiển thị nút khi cuộn xuống
        window.addEventListener("scroll", function () {
            if (window.scrollY > 300) {
                backToTop.style.display = "block";
            } else {
                backToTop.style.display = "none";
            }
        });

        // Cuộn lên đầu khi nhấn vào nút
        backToTop.addEventListener("click", function () {
            window.scrollTo({ top: 0, behavior: "smooth" });
        });
    }
});

// 
document.addEventListener("DOMContentLoaded", function () {
    const citySelect = document.getElementById("city");
    const districtSelect = document.getElementById("district");
    const resetButton = document.getElementById("resetFilter");

    // Danh sách quận/huyện theo từng thành phố
    const districtsData = {
        hanoi: [
            { value: "ba_dinh", text: "Quận Ba Đình" },
            { value: "hoan_kiem", text: "Quận Hoàn Kiếm" },
            { value: "tay_ho", text: "Quận Tây Hồ" },
            { value: "long_bien", text: "Quận Long Biên" },
            { value: "cau_giay", text: "Quận Cầu Giấy" }
        ],
        hcm: [
            { value: "quan_1", text: "Quận 1" },
            { value: "quan_3", text: "Quận 3" },
            { value: "quan_5", text: "Quận 5" },
            { value: "quan_7", text: "Quận 7" },
            { value: "thu_duc", text: "Thành phố Thủ Đức" }
        ]
    };

    // Khi chọn một thành phố
    citySelect.addEventListener("change", function () {
        const selectedCity = citySelect.value;
        districtSelect.innerHTML = '<option value="">Chọn Quận/Huyện</option>'; // Reset danh sách

        if (selectedCity && districtsData[selectedCity]) {
            districtsData[selectedCity].forEach(district => {
                const option = document.createElement("option");
                option.value = district.value;
                option.textContent = district.text;
                districtSelect.appendChild(option);
            });

            resetButton.style.display = "block"; // Hiện nút "Bỏ Lọc"
        } else {
            resetButton.style.display = "none"; // Ẩn nút nếu không chọn gì
        }
    });

    // Khi nhấn nút "Bỏ Lọc"
    resetButton.addEventListener("click", function () {
        citySelect.value = "";
        districtSelect.innerHTML = '<option value="">Chọn Quận/Huyện</option>';
        resetButton.style.display = "none";
    });
});

