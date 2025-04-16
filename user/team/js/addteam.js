// Chức năng Xem trước Hình ảnh
function previewImage(input, previewElementId) {
  const preview = document.getElementById(previewElementId);
  const file = input.files[0];

  if (!preview) {
    console.error("Preview element not found:", previewElementId);
    return;
  }

  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      let imgStyle = `max-width: 100%; display: block; border-radius: 3px; object-fit: contain;`;
      if (previewElementId === 'homeKitPreview' || previewElementId === 'awayKitPreview') {
        imgStyle += ` max-height: 150px;`;
      } else {
        imgStyle += ` max-height: 150px;`;
      }

      preview.innerHTML = `<img src="${e.target.result}" alt="Preview Image" style="${imgStyle}"/>`;
    };
    reader.readAsDataURL(file);
  } else {
    if (previewElementId === 'logoPreview') {
      preview.innerHTML = `<img src="images/logo.png" alt="Default Logo Preview" style="max-width: 150px; max-height: 150px; border-radius: 5px;"/>`;
    } else {
      preview.innerHTML = "";
    }
  }
}

// Gắn các trình lắng nghe sự kiện sau khi DOM được tải
document.addEventListener("DOMContentLoaded", function () {
  const homeKitInput = document.getElementById("homeKitFile");
  const awayKitInput = document.getElementById("awayKitFile");
  const logoInput = document.getElementById("logoFile");
  const coverInput = document.getElementById("coverFile");

  if (homeKitInput) homeKitInput.addEventListener("change", function () { previewImage(this, "homeKitPreview"); });
  if (awayKitInput) awayKitInput.addEventListener("change", function () { previewImage(this, "awayKitPreview"); });
  if (logoInput) logoInput.addEventListener("change", function () { previewImage(this, "logoPreview"); });
  if (coverInput) coverInput.addEventListener("change", function () { previewImage(this, "coverPreview"); });

  // Chức năng nút Đặt lại
  const retryButton = document.querySelector(".retry");
  const form = document.querySelector('form');
  if (retryButton && form) {
    retryButton.addEventListener('click', () => {
      form.reset();
      document.getElementById('homeKitPreview').innerHTML = '';
      document.getElementById('awayKitPreview').innerHTML = '';
      document.getElementById('coverPreview').innerHTML = '';
      document.getElementById('logoPreview').innerHTML = `<img src="images/logo.png" alt="Default Logo Preview" style="max-width: 150px; max-height: 150px; border-radius: 5px;"/>`;
    });
  }
});

document.getElementById("saveButton").addEventListener("click", async function () {
  let teams = JSON.parse(localStorage.getItem("teams")) || [];
  let userIdString = localStorage.getItem("userProfile_id");
  let userIdInt = Number(userIdString);
  const currentUser = {
    id: userIdInt,
    name: localStorage.getItem("userProfile_username"),
  };
  let teamNameInput = document.getElementById("teamName");
  if (teamNameInput.value.trim() === "") {
    alert("Vui lòng nhập tên đội bóng!");
    teamNameInput.focus();
    return;
  }

  const teamData = {
    id: Date.now().toString(),
    userId: currentUser.id,
    teamName: document.getElementById("teamName").value,
    managerName: document.getElementById("managerName").value,
    email: document.getElementById("email").value,
    phone: document.getElementById("phone").value,
    facebook: document.getElementById("facebook").value,
    logo: await getImageData("logoFile"),
    cover: await getImageData("coverFile"),
    homeKit: await getImageData("homeKitFile"),
    awayKit: await getImageData("awayKitFile")
  };

  teams.push(teamData);

  localStorage.setItem("teams", JSON.stringify(teams));

  alert("Đội bóng đã được lưu!");
  resetForm();
});

// Chuyển đổi hình ảnh sang Base64
function getImageData(inputId) {
  return new Promise((resolve) => {
    const fileInput = document.getElementById(inputId);
    if (fileInput.files.length > 0) {
      const file = fileInput.files[0];
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.readAsDataURL(file);
    } else if (inputId === "logoFile") {
      fetch("images/logo.png")
        .then(response => response.blob())
        .then(blob => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.readAsDataURL(blob);
        });
    } else {
      resolve(null);
    }
  });
}

// Hàm để xóa form sau khi lưu
function resetForm() {
  document.querySelector('form').reset();
  ["logoPreview", "coverPreview", "homeKitPreview", "awayKitPreview"].forEach(id => {
    document.getElementById(id).innerHTML = "";
  });
  document.getElementById('logoPreview').innerHTML = `<img src="images/logo.png" alt="Default Logo Preview" style="max-width: 150px; max-height: 150px; border-radius: 5px;"/>`;
}

// Hàm để hiển thị hình ảnh từ Base64
function displayImage(previewElementId, imageData) {
  if (imageData) {
    document.getElementById(previewElementId).innerHTML = `<img src="${imageData}" style="max-width: 150px; max-height: 150px; border-radius: 5px;"/>`;
  }
}