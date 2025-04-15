document.addEventListener("DOMContentLoaded", () => {
  // Tải người dùng từ localStorage, mặc định là một mảng trống nếu không tìm thấy hoặc không hợp lệ
  let users = [];
  try {
    const usersJson = localStorage.getItem("users");
    users = usersJson ? JSON.parse(usersJson) : [];
    if (!Array.isArray(users)) { // Đảm bảo đó là một mảng
      console.error("Loaded 'users' from localStorage is not an array. Resetting.");
      users = [];
      localStorage.setItem("users", JSON.stringify(users)); // Tùy chọn: xóa dữ liệu không hợp lệ
    }
  } catch (e) {
    console.error("Error parsing users from localStorage:", e);
    users = []; // Sử dụng mảng trống khi có lỗi
  }
  console.log("Loaded users:", users); // Ghi log người dùng đã tải để gỡ lỗi

  const urlParams = new URLSearchParams(window.location.search);
  const currentTeamId = urlParams.get('id'); // ví dụ: "team-1"

  if (!currentTeamId) {
    console.error("Team ID not found in URL.");
    // Tùy chọn hiển thị thông báo lỗi cho người dùng
    const contentBox = document.querySelector('.content-box');
    if(contentBox) contentBox.innerHTML = '<p style="color: red; width: 100%;">Lỗi: Không tìm thấy ID đội bóng trong địa chỉ URL.</p>';
    // return; // Dừng thực thi tiếp nếu không có ID đội
  } else {
    console.log("Current Team ID:", currentTeamId);
  }


  // --- Cài đặt localStorage ---
  const STORAGE_KEY = 'teamMembersData';

  function getMembersFromStorage() {
    const membersJson = localStorage.getItem(STORAGE_KEY);
    try {
      return membersJson ? JSON.parse(membersJson) : [];
    } catch (e) {
      console.error("Error parsing members from localStorage:", e);
      return []; // Trả về mảng trống khi có lỗi
    }
  }

  function saveMembersToStorage(members) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(members));
  }

  // --- Các yếu tố Modal ---
  const modal = document.getElementById("addMemberModal");
  const addMemberCardTrigger = document.getElementById("addMemberCardTrigger");
  const addMemberButton = document.getElementById("addMemberButton"); // Nút bên trong thẻ
  const closeModalButton = document.getElementById("closeModalButton");
  const cancelModalButton = document.getElementById("cancelModalButton");
  const memberForm = document.getElementById("addMemberForm");
  const modalTitle = document.getElementById("modalTitle");
  const saveMemberButton = document.getElementById("saveMemberButton");
  const memberIdInput = document.getElementById("memberId");

  // --- Các yếu tố Form (Thêm các yếu tố liên quan đến tìm kiếm) ---
  const tenCauThuInput = document.getElementById('tenCauThu');
  const searchResultsContainer = document.getElementById('searchResultsContainer');
  const selectedUserIdInput = document.getElementById('selectedUserId'); // Input ẩn cho userId
  const emailInput = document.getElementById('email'); // Trường email
  const phoneInput = document.getElementById('dienThoai'); // Trường điện thoại
  const facebookInput = document.getElementById('facebook'); // Trường Facebook
  const addressInput = document.getElementById('diaChi'); // Trường địa chỉ

  const ngoaiBinhToggle = document.getElementById('ngoaiBinhToggle');
  const ngoaiBinhInput = document.getElementById('ngoaiBinh');
  const avatarInput = document.getElementById('anhDaiDienInput');
  const avatarPreview = document.getElementById('avatarPreview');
  const avatarDataUrlInput = document.getElementById('avatarDataUrl');



  // --- Điều khiển Modal ---
  function openModal(mode = 'add', memberData = null) {
    memberForm.reset();
    avatarPreview.style.display = 'none';
    avatarPreview.src = '#';
    avatarDataUrlInput.value = '';
    ngoaiBinhInput.value = 'false';
    ngoaiBinhToggle.textContent = 'Không';
    ngoaiBinhToggle.className = 'ngoai-binh-no';
    selectedUserIdInput.value = ''; // Xóa ID người dùng đã chọn
    searchResultsContainer.style.display = 'none'; // Ẩn kết quả tìm kiếm

    if (mode === 'edit' && memberData) {
      modalTitle.textContent = "Chỉnh sửa thông tin thành viên";
      saveMemberButton.textContent = "Lưu thay đổi";
      memberIdInput.value = memberData.id;

      // Điền vào các trường biểu mẫu
      memberForm.name.value = memberData.name || ''; // Giữ tên từ memberData ban đầu
      memberForm.height.value = memberData.height || '';
      memberForm.shirtSize.value = memberData.shirtSize || '';
      memberForm.jerseyNumber.value = memberData.jerseyNumber || '';
      memberForm.positionRole.value = memberData.positionRole || 'Cầu thủ';
      memberForm.weight.value = memberData.weight || '';
      memberForm.positionField.value = memberData.positionField || '';
      memberForm.dob.value = memberData.dob || '';
      memberForm.address.value = memberData.address || '';
      memberForm.phone.value = memberData.phone || '';
      memberForm.email.value = memberData.email || '';
      memberForm.facebook.value = memberData.facebook || '';

      // --- Tự động điền dựa trên userId hiện có ---
      if (memberData.userId) {
        const linkedUser = users.find(u => u.id === memberData.userId);
        if (linkedUser) {
          // Nếu người dùng vẫn tồn tại trong danh sách của chúng ta, cập nhật các trường
          // *** ĐÃ THAY ĐỔI: Sử dụng linkedUser.username ***
          memberForm.name.value = linkedUser.username; // Sử dụng tên người dùng của người dùng được liên kết
          memberForm.email.value = linkedUser.email || '';
          memberForm.phone.value = linkedUser.phone || memberData.phone || ''; // Ưu tiên dữ liệu người dùng
          // *** ĐÃ THÊM: Tự động điền facebook và địa chỉ từ người dùng nếu có ***
          memberForm.facebook.value = linkedUser.facebook || memberData.facebook || '';
          memberForm.address.value = linkedUser.address || memberData.address || '';
        } else {
           // Người dùng được liên kết trước đó có thể không có trong danh sách `users` hiện tại
           // Giữ tên được lưu trữ trong memberData nếu không tìm thấy người dùng
           memberForm.name.value = memberData.name || '';
        }
        selectedUserIdInput.value = memberData.userId; // Đặt giá trị input ẩn
      } else {
        memberForm.name.value = memberData.name || ''; // Sử dụng tên đã lưu nếu không có userId
        selectedUserIdInput.value = ''; // Đảm bảo input ẩn được xóa
      }
      // --- Kết thúc Tự động điền ---


      const isForeigner = String(memberData.isForeigner) === 'true';
      ngoaiBinhInput.value = isForeigner;
       if (isForeigner) {
         ngoaiBinhToggle.textContent = 'Có';
         ngoaiBinhToggle.className = 'ngoai-binh-yes';
       } else {
         ngoaiBinhToggle.textContent = 'Không';
         ngoaiBinhToggle.className = 'ngoai-binh-no';
       }

       if (memberData.avatar) {
         avatarPreview.src = memberData.avatar;
         avatarPreview.style.display = 'inline-block';
         avatarDataUrlInput.value = memberData.avatar;
       }

    } else {
      modalTitle.textContent = "Thêm thành viên mới";
      saveMemberButton.textContent = "Lưu thành viên";
      memberIdInput.value = '';
      selectedUserIdInput.value = ''; // Đảm bảo xóa sạch cho thành viên mới
    }
    modal.style.display = "block";
  }


  function closeModal() {
    modal.style.display = "none";
    memberForm.reset();
    avatarPreview.style.display = 'none';
    avatarPreview.src = '#';
    avatarDataUrlInput.value = '';
    searchResultsContainer.style.display = 'none'; // Ẩn kết quả tìm kiếm khi đóng
    selectedUserIdInput.value = ''; // Xóa ID người dùng đã chọn
  }

  // --- Logic Tìm kiếm ---
  function displaySearchResults(filteredUsers) {
    searchResultsContainer.innerHTML = ''; // Xóa kết quả trước đó
    if (filteredUsers.length > 0) {
      filteredUsers.forEach(user => {
        const item = document.createElement('div');
        item.classList.add('search-result-item');
        // *** ĐÃ THAY ĐỔI: Sử dụng user.username để hiển thị và dataset.name ***
        item.textContent = `${user.username} (${user.email})`; // Hiển thị tên người dùng và email
        item.dataset.userId = user.id; // Lưu trữ ID
        item.dataset.name = user.username; // Lưu trữ tên người dùng trong dataset.name để nhất quán
        item.dataset.email = user.email || ''; // Lưu trữ email hoặc chuỗi trống
        item.dataset.phone = user.phone || ''; // Lưu trữ số điện thoại hoặc chuỗi trống
        item.dataset.facebook = user.facebook || '';
        item.dataset.address = user.address || '';

        item.addEventListener('click', () => {
          // *** Đọc từ item.dataset.name (hiện đang giữ tên người dùng) ***
          tenCauThuInput.value = item.dataset.name; // Đặt giá trị input thành tên người dùng đã chọn
          selectedUserIdInput.value = item.dataset.userId; // Đặt giá trị input ẩn
          emailInput.value = item.dataset.email; // Tự động điền email
          phoneInput.value = item.dataset.phone; // Tự động điền số điện thoại
          facebookInput.value = item.dataset.facebook;
          addressInput.value = item.dataset.address;

          searchResultsContainer.style.display = 'none'; // Ẩn kết quả
          searchResultsContainer.innerHTML = ''; // Xóa kết quả
        });
        searchResultsContainer.appendChild(item);
      });
      searchResultsContainer.style.display = 'block'; // Hiển thị container
    } else {
      searchResultsContainer.style.display = 'none'; // Ẩn nếu không có kết quả
    }
  }
  // --- Bộ lắng nghe Sự kiện ---
  if (addMemberCardTrigger) {
    addMemberCardTrigger.addEventListener("click", () => openModal('add'));
  } else if(addMemberButton) { // Phương án dự phòng nếu không tìm thấy div kích hoạt nhưng nút thì có
    addMemberButton.addEventListener("click", () => openModal('add'));
  }

  if (closeModalButton) closeModalButton.addEventListener("click", closeModal);
  if (cancelModalButton) cancelModalButton.addEventListener("click", closeModal);

  // Đóng modal nếu nhấp ra bên ngoài nó
  window.addEventListener("click", (event) => {
    if (event.target === modal) {
      closeModal();
    }
  });

  // Bộ lắng nghe nút bật/tắt Ngoại binh
  if (ngoaiBinhToggle) {
    ngoaiBinhToggle.addEventListener('click', () => {
      const currentValue = ngoaiBinhInput.value === 'true';
      const newValue = !currentValue;
      ngoaiBinhInput.value = newValue; // Cập nhật input ẩn
      if (newValue) {
        ngoaiBinhToggle.textContent = 'Có';
        ngoaiBinhToggle.className = 'ngoai-binh-yes';
      } else {
        ngoaiBinhToggle.textContent = 'Không';
        ngoaiBinhToggle.className = 'ngoai-binh-no';
      }
    });
  }

  // Bộ lắng nghe xem trước Avatar
  if (avatarInput) {
    avatarInput.addEventListener('change', function(event) {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
          avatarPreview.src = e.target.result;
          avatarPreview.style.display = 'inline-block';
          avatarDataUrlInput.value = e.target.result; // Lưu trữ URL Dữ liệu Base64
        }
        reader.readAsDataURL(file); // Đọc tệp dưới dạng URL Dữ liệu
      } else {
        // Nếu không có tệp nào được chọn hoặc việc chọn bị hủy
        avatarPreview.style.display = 'none';
        avatarPreview.src = '#';
        avatarDataUrlInput.value = ''; // Xóa nếu không có tệp
      }
    });
  }
  // ** Bộ lắng nghe MỚI/ĐÃ SỬA ĐỔI cho Tìm kiếm **
  if (tenCauThuInput) {
    tenCauThuInput.addEventListener('input', () => {
      const searchTerm = tenCauThuInput.value.trim().toLowerCase();

      if (searchTerm === '') {
        searchResultsContainer.style.display = 'none';
        searchResultsContainer.innerHTML = '';
        // Nếu người dùng xóa input *sau khi* chọn, cũng xóa luôn userId ẩn
        if (selectedUserIdInput.value !== '') {
           selectedUserIdInput.value = '';
           // Tùy chọn xóa các trường được tự động điền:
           // emailInput.value = '';
           // phoneInput.value = '';
           // facebookInput.value = '';
           // addressInput.value = '';
        }
        return;
      }

      // *** ĐÃ THAY ĐỔI: Tìm kiếm trong user.username ***
      const filtered = users.filter(user =>
        (user.username && user.username.toLowerCase().includes(searchTerm)) || // Kiểm tra tên người dùng
        (user.email && user.email.toLowerCase().includes(searchTerm))        // Kiểm tra email
      );
      displaySearchResults(filtered);
    });

     // Ẩn kết quả khi nhấp ra bên ngoài
     document.addEventListener('click', (event) => {
       if (!tenCauThuInput.contains(event.target) && !searchResultsContainer.contains(event.target)) {
         searchResultsContainer.style.display = 'none';
       }
     });
  }

  // ** Bộ lắng nghe gửi Form ĐÃ SỬA ĐỔI **
  if (memberForm) {
    memberForm.addEventListener("submit", (event) => {
      event.preventDefault();

      const members = getMembersFromStorage();
      const editingId = memberIdInput.value;

      // --- Lấy userId từ input ẩn ---
      const selectedUserId = selectedUserIdInput.value ? parseInt(selectedUserIdInput.value) : null;

      const memberData = {
        // Tạo ID mới cho thành viên mới, sử dụng ID hiện có để chỉnh sửa
        id: editingId ? parseInt(editingId) : Date.now(), // Sử dụng dấu thời gian để có ID tiềm năng duy nhất hơn
        teamId: currentTeamId,
        // Sử dụng ID Người dùng đã chọn từ input ẩn
        userId: selectedUserId,
        // Sử dụng tên từ trường input (có thể đã bị ghi đè bởi lựa chọn hoặc nhập thủ công)
        name: memberForm.name.value.trim(),
        height: memberForm.height.value || null,
        shirtSize: memberForm.shirtSize.value.trim() || null,
        jerseyNumber: memberForm.jerseyNumber.value || null,
        positionRole: memberForm.positionRole.value || null,
        weight: memberForm.weight.value || null,
        positionField: memberForm.positionField.value || null,
        dob: memberForm.dob.value || null,
        isForeigner: ngoaiBinhInput.value === 'true',
        avatar: avatarDataUrlInput.value || null,
        // Sử dụng thông tin liên hệ từ các trường biểu mẫu (có thể đã được tự động điền hoặc nhập thủ công)
        address: memberForm.address.value.trim() || null,
        phone: memberForm.phone.value.trim() || null,
        email: memberForm.email.value.trim() || null,
        facebook: memberForm.facebook.value.trim() || null,
      };

      if (!memberData.name) {
        alert("Vui lòng nhập tên cầu thủ.");
        memberForm.name.focus();
        return;
      }

      if (editingId) {
        const memberIndex = members.findIndex(m => m.id === parseInt(editingId));
        if (memberIndex > -1) {
           // Kiểm tra xem tên có cần cập nhật dựa trên userId *nếu* nó đã được chọn không
           // Điều này đảm bảo nếu họ chọn một người dùng, tên sẽ khớp với tên của người dùng đó
           if(memberData.userId) {
              const linkedUser = users.find(u => u.id === memberData.userId);
              // *** ĐÃ THAY ĐỔI: So sánh với linkedUser.username ***
              if(linkedUser && memberData.name !== linkedUser.username) {
                // Tùy chọn: Bạn có thể muốn buộc tên phải khớp với tên người dùng của người dùng đã chọn
                // memberData.name = linkedUser.username;
                // Hoặc chỉ lưu bất cứ thứ gì hiện có trong trường input (hành vi hiện tại)
              }
           }
          // Cập nhật thành viên hiện có, bảo tồn ID gốc
          members[memberIndex] = { ...members[memberIndex], ...memberData }; // Hợp nhất dữ liệu, giữ ID gốc
          console.log("Updating member:", members[memberIndex]);
        } else {
            console.error("Could not find member to update with ID:", editingId);
            alert("Lỗi: Không tìm thấy thành viên để cập nhật.");
            return; // Dừng lại nếu không tìm thấy thành viên
        }
      } else {
           // Thêm thành viên mới - kiểm tra xem tên có cần bị ghi đè bởi người dùng đã chọn không
           if(memberData.userId) {
              const linkedUser = users.find(u => u.id === memberData.userId);
              // *** ĐÃ THAY ĐỔI: So sánh với linkedUser.username ***
              if(linkedUser && memberData.name !== linkedUser.username) {
                 // Ghi đè tùy chọn: memberData.name = linkedUser.username;
              }
           }
          console.log("Adding new member:", memberData);
          members.push(memberData);
      }

      saveMembersToStorage(members);
      displayMembers();
      closeModal();
    });
  }


  // --- Hiển thị Thành viên ---
  function displayMembers() {
    const contentBox = document.querySelector('.content-box');
    if (!contentBox) {
      console.error("Content box element not found!");
      return;
    }

    const members = getMembersFromStorage();
    // Lọc thành viên cho teamId hiện tại (QUAN TRỌNG!)
    const teamMembers = members.filter(member => member.teamId === currentTeamId);

    // Xóa các thẻ thành viên hiện có (giữ lại thẻ "thêm")
    const existingCards = contentBox.querySelectorAll('.member-card');
    existingCards.forEach(card => card.remove());

    // Thêm thẻ "Thêm thành viên" nếu nó chưa có (hoặc đảm bảo nó ở đầu tiên)
    const addCard = document.getElementById('addMemberCardTrigger');
    if (addCard && !contentBox.contains(addCard)) {
      // Nếu bằng cách nào đó bị xóa, hãy thêm lại vào đầu
      contentBox.insertBefore(addCard, contentBox.firstChild);
    } else if (addCard) {
      // Đảm bảo nó là con đầu tiên nếu nó tồn tại
      contentBox.insertBefore(addCard, contentBox.firstChild);
    }


    if (teamMembers.length === 0) {
      // Tùy chọn: Hiển thị thông báo nếu chưa có thành viên nào
      // const noMembersMsg = document.createElement('p');
      // noMembersMsg.textContent = "Chưa có thành viên nào trong đội.";
      // noMembersMsg.style.width = '100%';
      // noMembersMsg.style.textAlign = 'center';
      // contentBox.appendChild(noMembersMsg);
      console.log("No members found for team:", currentTeamId);
    } else {
      teamMembers.forEach(member => {
        const card = document.createElement('div');
        card.classList.add('member-card');
        card.dataset.id = member.id; // Lưu trữ ID thành viên trên thẻ

        // Ảnh đại diện
        const avatarDiv = document.createElement('div');
        avatarDiv.classList.add('member-avatar');
        if (member.avatar) {
          const img = document.createElement('img');
          img.src = member.avatar; // Sử dụng URL dữ liệu Base64 đã lưu
          img.alt = member.name;
          avatarDiv.appendChild(img);
        } else {
          // Ảnh đại diện giữ chỗ
          const placeholder = document.createElement('div');
          placeholder.classList.add('placeholder-avatar');
          placeholder.innerHTML = `<i class="fas fa-user"></i>`;
          avatarDiv.appendChild(placeholder);
        }

        // Tên
        const nameDiv = document.createElement('div');
        nameDiv.classList.add('member-name');
        // *** Hiển thị member.name (có thể là tên người dùng nếu được liên kết, hoặc tên nhập thủ công) ***
        nameDiv.textContent = member.name || 'N/A';

        // Số áo (Số áo đấu hoặc giữ chỗ)
        const numberDiv = document.createElement('div');
        numberDiv.classList.add('member-number');
        numberDiv.textContent = member.jerseyNumber || '0'; // Hiển thị '0' nếu không có số áo

        // Hành động (Sửa/Xóa)
        const actionsDiv = document.createElement('div');
        actionsDiv.classList.add('member-actions');

        const editButton = document.createElement('button');
        editButton.classList.add('edit-btn');
        editButton.innerHTML = '<i class="fas fa-pencil-alt"></i>';
        editButton.title = "Chỉnh sửa";
        editButton.onclick = () => {
          // Tìm dữ liệu thành viên đầy đủ từ bộ nhớ trước khi mở modal
          const allMembers = getMembersFromStorage();
          const memberToEdit = allMembers.find(m => m.id === member.id);
          if(memberToEdit) {
            openModal('edit', memberToEdit);
          } else {
            console.error("Could not find member data for ID:", member.id);
            alert("Lỗi: Không tìm thấy dữ liệu thành viên.");
          }
        };

        const deleteButton = document.createElement('button');
        deleteButton.classList.add('delete-btn');
        deleteButton.innerHTML = '<i class="fas fa-trash-alt"></i>';
        deleteButton.title = "Xóa";
        deleteButton.onclick = () => deleteMember(member.id);


        actionsDiv.appendChild(editButton);
        actionsDiv.appendChild(deleteButton);

        // Lắp ráp Thẻ
        card.appendChild(avatarDiv);
        card.appendChild(nameDiv);
        card.appendChild(numberDiv);
        card.appendChild(actionsDiv);

        contentBox.appendChild(card); // Thêm thẻ vào container
      });
    }
  }

  // --- Xóa Thành viên ---
  function deleteMember(memberId) {
    if (confirm(`Bạn có chắc chắn muốn xóa thành viên này không?`)) {
      let members = getMembersFromStorage();
      members = members.filter(member => member.id !== memberId);
      saveMembersToStorage(members);
      displayMembers(); // Làm mới danh sách
    }
  }

  // --- Tải ban đầu ---
  if (currentTeamId) { // Chỉ hiển thị nếu chúng ta có ID đội
    displayMembers();
  } else {
    console.error("No team ID found. Cannot display members.");
  }
});