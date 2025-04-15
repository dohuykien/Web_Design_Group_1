// Tải, chèn và cấu hình thanh điều hướng quản lý đội.
// Hàm này nên được gọi sau khi DOM đã tải hoàn toàn.
// @param {string} containerId ID của phần tử HTML để tải thanh điều hướng vào.
// @param {string} navHtmlPath Đường dẫn đến tệp managementnav.html. Mặc định là 'managementnav.html'.
async function loadAndSetupManagementNav(containerId, navHtmlPath = 'managementNav.html') {
  const container = document.getElementById(containerId);
  if (!container) {
    console.error(`Không tìm thấy container điều hướng quản lý với ID "${containerId}".`);
    return;
  }

  try {
    // 1. Tải HTML điều hướng
    const response = await fetch(navHtmlPath);
    if (!response.ok) {
      throw new Error(`Lỗi HTTP! trạng thái: ${response.status} khi tải ${navHtmlPath}`);
    }
    const navHtml = await response.text();

    // 2. Chèn HTML vào container
    container.innerHTML = navHtml;
    console.log(`Đã tải điều hướng quản lý vào #${containerId}`);

    // 3. Lấy ID Đội từ URL hiện tại
    const urlParams = new URLSearchParams(window.location.search);
    const currentTeamId = urlParams.get('id');

    // 4. Lấy Tên tệp Trang Hiện tại để xác định trạng thái active
    const currentPagePath = window.location.pathname;
    const currentPageFilename = currentPagePath.substring(currentPagePath.lastIndexOf('/') + 1) || 'index.html';
    console.log(`Tên tệp Trang Hiện tại: ${currentPageFilename}, ID Đội: ${currentTeamId}`);

    // 5. Chọn các link trong nav *đã tải* và cấu hình chúng
    const navLinks = container.querySelectorAll('.team-management-nav a.nav-button');

    navLinks.forEach(link => {
      const originalHref = link.getAttribute('href');
      let linkFilename = '';
      let linkUrl = null; // Để lưu trữ đối tượng URL đã phân tích

      if (originalHref && originalHref !== '#' && !originalHref.startsWith('javascript:')) {
        try {
          // Sử dụng URL đầy đủ của trang hiện tại làm cơ sở để giải quyết các liên kết tương đối
          linkUrl = new URL(originalHref, window.location.href);

          linkFilename = linkUrl.pathname.substring(linkUrl.pathname.lastIndexOf('/') + 1) || 'index.html';

          // Cập nhật href với ID Đội (nếu có)
          if (currentTeamId) {
            linkUrl.searchParams.set('id', currentTeamId);
          }
          link.href = linkUrl.toString();
          console.log(`Đã cập nhật link cho ${linkFilename} thành: ${link.href}`);

        } catch (e) {
          console.error(`Lỗi phân tích hoặc cập nhật URL cho link: ${originalHref}`, e);
          // Dự phòng (ít có khả năng hoạt động đúng nếu vấn đề là đường dẫn cơ sở)
          if (currentTeamId) {
            if (originalHref.includes('?')) {
              link.href = `${originalHref}&id=${encodeURIComponent(currentTeamId)}`;
            } else {
              link.href = `${originalHref}?id=${encodeURIComponent(currentTeamId)}`;
            }
          } else {
            link.href = originalHref;
          }
          const pathOnly = link.href.split('?')[0].split('#')[0];
          linkFilename = pathOnly.substring(pathOnly.lastIndexOf('/') + 1) || 'index.html';
        }
      }

      // Thiết lập Trạng thái Active
      if (linkFilename && linkFilename === currentPageFilename) {
        console.log(`Thiết lập trạng thái active cho: ${linkFilename}`);
        link.classList.add('active');
      } else if (!currentTeamId && linkFilename && linkFilename !== currentPageFilename) {
        console.log(`Không tìm thấy ID Đội, có thể vô hiệu hóa link: ${link.href}`);
        // Logic vô hiệu hóa tùy chọn
      }
    });

  } catch (error) {
    console.error("Lỗi tải hoặc thiết lập điều hướng quản lý:", error);
    if (container) {
      container.innerHTML = "<p class='error-message' style='color: red; padding: 10px;'>Lỗi tải menu quản lý đội.</p>";
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  loadAndSetupManagementNav('management-nav-placeholder', 'managementNav.html');
});