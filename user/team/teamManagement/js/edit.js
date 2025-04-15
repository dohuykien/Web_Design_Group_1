document.addEventListener("DOMContentLoaded", () => { 
  const editTeamForm = document.getElementById("editTeamForm");
  const teamNameInput = document.getElementById("teamName");
  const managerNameInput = document.getElementById("managerName");
  const emailInput = document.getElementById("email");
  const phoneInput = document.getElementById("phone");
  const facebookInput = document.getElementById("facebook");

  const logoFileInput = document.getElementById("logoFile");
  const coverFileInput = document.getElementById("coverFile");
  const homeKitFileInput = document.getElementById("homeKitFile");
  const awayKitFileInput = document.getElementById("awayKitFile");

  const logoPreview = document.getElementById("logoPreview");
  const coverPreview = document.getElementById("coverPreview");
  const homeKitPreview = document.getElementById("homeKitPreview");
  const awayKitPreview = document.getElementById("awayKitPreview");

  const logoUploadHeader = document.getElementById("logoUploadHeader");
  const coverUploadHeader = document.getElementById("coverUploadHeader");
  const homeKitUploadHeader = document.getElementById("homeKitUploadHeader");
  const awayKitUploadHeader = document.getElementById("awayKitUploadHeader");

  const resetButton = document.getElementById("resetButton");

  const tabs = document.querySelectorAll('#editTeamTabs .nav-link');
  const tabPanes = document.querySelectorAll('.tab-content .tab-pane');

  let currentTeamId = null;
  let originalTeamData = null; // Lưu trữ dữ liệu gốc để reset

  // --- Hàm Hỗ trợ: Đọc tệp dưới dạng Data URL ---
  function readFileAsDataURL(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  // --- Hàm Hỗ trợ: Lấy Dữ liệu Hình ảnh (trả về base64 hoặc null) ---
  async function getImageData(fileInputId) {
    const fileInput = document.getElementById(fileInputId);
    if (fileInput && fileInput.files && fileInput.files[0]) {
      try {
        return await readFileAsDataURL(fileInput.files[0]);
      } catch (error) {
        console.error("Lỗi đọc tệp:", error);
        return null;
      }
    }
    return null;
  }

  // --- Hàm Hỗ trợ: Hiển thị Xem trước Hình ảnh ---
  function displayImage(previewElement, imageData) {
    previewElement.innerHTML = '';
    if (imageData) {
      const img = document.createElement('img');
      img.src = imageData;
      if (previewElement.id === 'logoPreview') {
        img.style.maxWidth = '150px';
        img.style.maxHeight = '150px';
        img.style.borderRadius = '50%';
        img.style.objectFit = 'cover';
        img.style.border = '1px solid #eee';
      } else if (previewElement.classList.contains('kit-preview')) {
        img.style.maxHeight = '200px';
        img.style.maxWidth = '100%';
        img.style.objectFit = 'contain';
      } else if (previewElement.id === 'coverPreview') {
        img.style.maxHeight = '200px';
        img.style.maxWidth = '100%';
        img.style.objectFit = 'contain';
      }
      previewElement.appendChild(img);
    } else {
      if (previewElement !== logoPreview) {
        previewElement.style.display = 'flex';
      }
    }
  }

  // --- Tải Dữ liệu Đội ---
  function loadTeamData(teamId) {
    const teams = JSON.parse(localStorage.getItem("teams") || "[]");
    const team = teams.find(t => t.id === teamId);

    if (team) {
      originalTeamData = { ...team }; // Lưu một bản sao để reset

      teamNameInput.value = team.teamName || '';
      managerNameInput.value = team.managerName || '';
      emailInput.value = team.email || '';
      phoneInput.value = team.phone || '';
      facebookInput.value = team.facebook || '';

      displayImage(logoPreview, team.logo);
      displayImage(coverPreview, team.cover);
      displayImage(homeKitPreview, team.homeKit);
      displayImage(awayKitPreview, team.awayKit);

    } else {
      console.error("Không tìm thấy đội với ID:", teamId);
      alert("Không tìm thấy thông tin đội bóng!");
    }
  }

  // --- Xử lý Gửi Form (Lưu) ---
  async function handleFormSubmit(event) {
    event.preventDefault();

    if (!currentTeamId) {
      alert("Lỗi: Không xác định được ID đội bóng.");
      return;
    }

    const teams = JSON.parse(localStorage.getItem("teams") || "[]");
    const teamIndex = teams.findIndex(t => t.id === currentTeamId);

    if (teamIndex === -1) {
      alert("Lỗi: Không tìm thấy đội bóng để cập nhật.");
      return;
    }

    const newLogoData = await getImageData("logoFile");
    const newCoverData = await getImageData("coverFile");
    const newHomeKitData = await getImageData("homeKitFile");
    const newAwayKitData = await getImageData("awayKitFile");

    const updatedTeamData = {
      ...originalTeamData,
      teamName: teamNameInput.value,
      managerName: managerNameInput.value,
      email: emailInput.value,
      phone: phoneInput.value,
      facebook: facebookInput.value,
      logo: newLogoData !== null ? newLogoData : originalTeamData.logo,
      cover: newCoverData !== null ? newCoverData : originalTeamData.cover,
      homeKit: newHomeKitData !== null ? newHomeKitData : originalTeamData.homeKit,
      awayKit: newAwayKitData !== null ? newAwayKitData : originalTeamData.awayKit
    };

    teams[teamIndex] = updatedTeamData;

    try {
      localStorage.setItem("teams", JSON.stringify(teams));
      alert("Cập nhật thông tin đội bóng thành công!");
      originalTeamData = { ...updatedTeamData };
      loadTeamData(currentTeamId);
    } catch (e) {
      console.error("Lỗi lưu vào localStorage:", e);
      alert("Có lỗi xảy ra khi lưu thông tin. Vui lòng thử lại.");
    }
  }

  // --- Xử lý Header Tải lên Có thể Click ---
  function setupUploadTrigger(headerElement, fileInputElement) {
    headerElement.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      try {
        fileInputElement.value = null;
      } catch (e) {
        console.warn(`Không thể reset giá trị cho ${fileInputElement.id}:`, e);
      }
      fileInputElement.click();
    });
  }

  // --- Xử lý Thay đổi Input File (Xem trước Trực tiếp) ---
  function setupPreviewListener(fileInput, previewElement) {
    fileInput.addEventListener("change", async (event) => {
      if (event.target.files && event.target.files[0]) {
        try {
          const imageData = await readFileAsDataURL(event.target.files[0]);
          displayImage(previewElement, imageData);
        } catch (error) {
          console.error(`Lỗi xử lý tệp cho ${fileInput.id}:`, error);
          displayImage(previewElement, null);
        }
      } else {
        if (originalTeamData) {
          const originalImageKey = fileInput.id.replace('File', '');
          displayImage(previewElement, originalTeamData[originalImageKey]);
        } else {
          displayImage(previewElement, null);
        }
      }
    });
  }

  // --- Xử lý Chuyển Tab ---
  function handleTabClick(event) {
    tabs.forEach(t => t.classList.remove('active'));
    tabPanes.forEach(p => p.classList.remove('active'));
    event.target.classList.add('active');
    const targetPaneId = event.target.getAttribute('data-bs-target');
    const targetPane = document.querySelector(targetPaneId);
    if (targetPane) {
      targetPane.classList.add('active');
    }
  }

  // --- Hàm cập nhật link điều hướng với ID đội hiện tại ---
  function updateNavLinksWithTeamId(teamId) {
    if (!teamId) {
      console.warn("Không tìm thấy ID Đội, không thể cập nhật link điều hướng.");
      document.querySelectorAll('.team-management-nav a.nav-button').forEach(link => {
        link.style.pointerEvents = 'none';
        link.style.opacity = '0.6';
        link.href = '#';
      });
      return;
    }
    const navLinks = document.querySelectorAll('.team-management-nav a.nav-button');
    navLinks.forEach(link => {
      const originalHref = link.getAttribute('href');
      if (originalHref && originalHref !== '#' && !originalHref.startsWith('javascript:')) {
        try {
          const url = new URL(originalHref, window.location.origin);
          url.searchParams.set('id', teamId);
          link.href = url.toString();
        } catch (e) {
          console.error(`Lỗi phân tích hoặc cập nhật URL cho link: ${originalHref}`, e);
        }
      }
    });
  }

  // --- Khởi tạo ---
  const urlParams = new URLSearchParams(window.location.search);
  currentTeamId = urlParams.get('id');

  if (currentTeamId) {
    loadTeamData(currentTeamId);
    updateNavLinksWithTeamId(currentTeamId);
  } else {
    alert("Không tìm thấy ID đội bóng trong URL!");
    editTeamForm.style.display = 'none';
    updateNavLinksWithTeamId(null);
  }

  editTeamForm.addEventListener("submit", handleFormSubmit);

  setupPreviewListener(logoFileInput, logoPreview);
  setupPreviewListener(coverFileInput, coverPreview);
  setupPreviewListener(homeKitFileInput, homeKitPreview);
  setupPreviewListener(awayKitFileInput, awayKitPreview);

  setupUploadTrigger(logoUploadHeader, logoFileInput);
  setupUploadTrigger(coverUploadHeader, coverFileInput);
  setupUploadTrigger(homeKitUploadHeader, homeKitFileInput);
  setupUploadTrigger(awayKitUploadHeader, awayKitFileInput);

  tabs.forEach(tab => {
    tab.addEventListener('click', handleTabClick);
  });

  resetButton.addEventListener("click", () => {
    if (currentTeamId && originalTeamData) {
      loadTeamData(currentTeamId);
      logoFileInput.value = '';
      coverFileInput.value = '';
      homeKitFileInput.value = '';
      awayKitFileInput.value = '';
    } else {
      editTeamForm.reset();
    }
  });
});