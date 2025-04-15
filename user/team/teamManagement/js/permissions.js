document.addEventListener("DOMContentLoaded", () => {
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

  // 1. Lấy currentTeamId từ URL
  const urlParams = new URLSearchParams(window.location.search);
  const currentTeamId = urlParams.get('id');

  const tableBody = document.getElementById('managerTable')?.querySelector('tbody');
  const addManagerInput = document.getElementById('addManagerInput');
  const userDropdown = document.getElementById('userDropdown'); // Vùng chứa dropdown
  const addManagerBtn = document.getElementById('addManagerBtn');

  // Biến để lưu trữ ID của người dùng được chọn từ dropdown
  let selectedUserIdToAdd = null;

  // --- Các Hàm Hỗ Trợ ---
  function findUserById(userId) {
    // Đảm bảo userId được coi là số để so sánh nếu ID là số
    const numericUserId = parseInt(userId, 10);
    return users.find(user => user.id === numericUserId);
  }
  function getManagersForTeam(teamId) {
    try {
      const allManagersData = JSON.parse(localStorage.getItem('managersData') || '[]');
      // Đảm bảo việc so sánh hoạt động ngay cả khi teamId từ localStorage không khớp về kiểu chuỗi/số
      return allManagersData.filter(m => String(m.teamId) === String(teamId));
    } catch (error) {
      console.error("Error reading managersData from localStorage:", error);
      return [];
    }
  }
  function getTeamsData() {
    try {
      // Đảm bảo ID đội nhất quán (ví dụ: chuỗi) khi so sánh sau này
      const teams = JSON.parse(localStorage.getItem('teams') || '[]');
      return teams.map(team => ({ ...team, id: String(team.id) }));
    } catch (error) {
      console.error("Error reading teams data from localStorage:", error);
      return [];
    }
  }


  // --- Logic Dropdown ---

  function showDropdown(matchingUsers) {
    if (!userDropdown || !addManagerInput) return;

    userDropdown.innerHTML = ''; // Xóa kết quả trước đó
    selectedUserIdToAdd = null; // Đặt lại lựa chọn khi hiển thị kết quả mới
    addManagerInput.removeAttribute('data-selected-user-id'); // Xóa thuộc tính data

    if (matchingUsers.length === 0) {
      userDropdown.innerHTML = '<div class="no-results">Không tìm thấy kết quả</div>';
      userDropdown.style.display = 'block'; // Hiển thị "không tìm thấy kết quả"
      return;
    }

    matchingUsers.forEach(user => {
      const item = document.createElement('div');
      item.className = 'user-dropdown-item';
      item.textContent = `${user.username || 'N/A'} (${user.email || 'N/A'})`; // Hiển thị tên người dùng và email để rõ ràng
      item.setAttribute('data-user-id', user.id);
      // Lưu trữ biểu diễn người dùng đầy đủ trong trường input khi chọn
      item.setAttribute('data-user-display', `${user.username || user.email} (${user.email || 'N/A'})`);
      userDropdown.appendChild(item);
    });

    userDropdown.style.display = 'block'; // Hiển thị dropdown
  }

  function hideDropdown() {
    if (userDropdown) {
      userDropdown.style.display = 'none';
    }
  }

  // Bộ lắng nghe sự kiện cho việc gõ vào input
  addManagerInput.addEventListener('input', () => {
    const searchTerm = addManagerInput.value.trim().toLowerCase();

    if (searchTerm.length < 1) { // Số ký tự tối thiểu để kích hoạt tìm kiếm (tùy chọn)
      hideDropdown();
      selectedUserIdToAdd = null; // Xóa lựa chọn nếu input bị xóa
      addManagerInput.removeAttribute('data-selected-user-id');
      return;
    }

    // Lọc người dùng dựa trên từ khóa tìm kiếm (tên người dùng hoặc email)
    const filteredUsers = users.filter(user =>
      (user.username && user.username.toLowerCase().includes(searchTerm)) ||
      (user.email && user.email.toLowerCase().includes(searchTerm))
    );

    showDropdown(filteredUsers);
  });

  // Bộ lắng nghe sự kiện để chọn một người dùng từ dropdown
  userDropdown.addEventListener('click', (event) => {
    const target = event.target;
    // Kiểm tra xem phần tử được nhấp có phải là một mục dropdown không
    if (target.classList.contains('user-dropdown-item')) {
      selectedUserIdToAdd = target.getAttribute('data-user-id');
      const displayValue = target.getAttribute('data-user-display') || target.textContent; // Lấy văn bản hiển thị

      addManagerInput.value = displayValue; // Đặt giá trị input thành văn bản hiển thị của người dùng đã chọn
      // Lưu trữ ID riêng biệt bằng thuộc tính data trên input (tùy chọn nhưng sạch sẽ)
      addManagerInput.setAttribute('data-selected-user-id', selectedUserIdToAdd);

      hideDropdown();
      addManagerInput.focus(); // Giữ focus trên input (tùy chọn)
    }
  });

  // Ẩn dropdown nếu nhấp ra bên ngoài
  document.addEventListener('click', (event) => {
    if (!addManagerInput.contains(event.target) && !userDropdown.contains(event.target)) {
      hideDropdown();
    }
  });

  // Ẩn dropdown khi input mất focus NẾU không có lựa chọn nào được thực hiện từ dropdown
  addManagerInput.addEventListener('blur', () => {
    // Sử dụng một khoảng thời gian chờ nhỏ vì việc nhấp vào mục dropdown gây ra sự kiện blur TRƯỚC TIÊN
    setTimeout(() => {
      // Kiểm tra xem dropdown có còn hiển thị và phần tử đang được focus KHÔNG nằm trong dropdown không
      if (userDropdown && userDropdown.style.display === 'block' && !userDropdown.contains(document.activeElement)) {
        hideDropdown();
      }
    }, 150); // Điều chỉnh thời gian chờ nếu cần
  });


  // --- Logic Cốt Lõi: Hiển thị Bảng ---
  function renderManagerTable() {
    if (!tableBody) { console.error("Table body not found!"); return; }
    const safeCurrentTeamId = String(currentTeamId); // Đảm bảo kiểu nhất quán để so sánh
    if (!safeCurrentTeamId) { console.error("Team ID not found in URL."); tableBody.innerHTML = '<tr><td colspan="4">Không tìm thấy ID đội bóng.</td></tr>'; return; }

    tableBody.innerHTML = ''; // Xóa nội dung trước đó
    const teamsData = getTeamsData(); // Đã trả về ID dưới dạng chuỗi
    const currentTeam = teamsData.find(team => team.id === safeCurrentTeamId);

    if (!currentTeam) { console.error(`Team with ID ${safeCurrentTeamId} not found.`); tableBody.innerHTML = `<tr><td colspan="4">Không tìm thấy thông tin đội bóng.</td></tr>`; return; }

    let stt = 1;
    const teamUsersToDisplay = [];

    // 1. Thêm Người tạo đội
    // Đảm bảo so sánh sử dụng đúng kiểu (ID người tạo có thể là số hoặc chuỗi)
    const creatorId = typeof currentTeam.userId === 'string' ? parseInt(currentTeam.userId, 10) : currentTeam.userId;
    const creator = findUserById(creatorId);
    if (creator) {
      teamUsersToDisplay.push({ ...creator, role: 'Tài khoản tạo đội', isCreator: true });
    } else {
      console.warn(`Creator user with ID ${currentTeam.userId} not found in users data.`);
    }

    // 2. Thêm Quản lý
    const managerRelations = getManagersForTeam(safeCurrentTeamId); // Truyền ID chuỗi
    managerRelations.forEach(relation => {
      const managerUserId = parseInt(relation.userId, 10); // Đảm bảo ID quản lý là số cho findUserById
      const manager = findUserById(managerUserId);
      // Chỉ thêm nếu tìm thấy quản lý VÀ không giống với người tạo đội
      if (manager && manager.id !== creatorId) {
        teamUsersToDisplay.push({ ...manager, role: 'Quản lý đội', isCreator: false });
      } else if (!manager) {
        console.warn(`Manager user with ID ${relation.userId} not found in users data.`);
      }
    });

    // 3. Hiển thị các hàng
    if (teamUsersToDisplay.length === 0) {
       // Nếu chỉ có người tạo tồn tại (hoặc không có ai), không hiển thị "chưa có quản lý"
       if(managerRelations.length === 0) {
           tableBody.innerHTML = '<tr><td colspan="4">Chưa có quản lý nào được thêm cho đội này.</td></tr>';
       } // Nếu không, hàng của người tạo sẽ được hiển thị bên dưới.
       
    }

    // Tùy chọn: Sắp xếp nếu cần (ví dụ: người tạo trước, sau đó theo tên người dùng)
    teamUsersToDisplay.sort((a, b) => {
      if (a.isCreator) return -1; // Người tạo luôn đứng đầu
      if (b.isCreator) return 1;
      return (a.username || '').localeCompare(b.username || ''); // Sắp xếp theo tên người dùng
    });

    teamUsersToDisplay.forEach(user => {
      const row = tableBody.insertRow();
      row.insertCell(0).textContent = stt++;
      // Hiển thị tên người dùng và email
      const nameDisplay = user.username ? `${user.username} - ${user.email || 'N/A'}` : (user.email || 'N/A');
      row.insertCell(1).textContent = nameDisplay;
      row.insertCell(2).textContent = user.role;

      const actionCell = row.insertCell(3);
      // Chỉ thêm nút xóa cho quản lý không phải là người tạo
      if (!user.isCreator) {
        const deleteButton = document.createElement('button');
        deleteButton.className = 'delete-btn';
        deleteButton.innerHTML = '<i class="fa-solid fa-trash"></i>';
        deleteButton.setAttribute('data-user-id', user.id);
        deleteButton.setAttribute('title', 'Xóa quản lý');
        actionCell.appendChild(deleteButton);
      } else {
        actionCell.textContent = ''; // Không có hành động cho người tạo
      }
    });
  }

  // --- Logic Cốt Lõi: Xóa Quản lý ---
  function handleDeleteUser(event) {
    const target = event.target;
    // Sử dụng closest để xử lý các lần nhấp vào biểu tượng bên trong nút
    const deleteButton = target.closest('.delete-btn');

    if (deleteButton) {
      const userIdToDeleteString = deleteButton.getAttribute('data-user-id');
      if (!userIdToDeleteString) {
        console.error("Delete button clicked, but data-user-id is missing.");
        return;
      }
      const userIdToDelete = parseInt(userIdToDeleteString, 10); // Đảm bảo ID là số
      const safeCurrentTeamId = String(currentTeamId); // Đảm bảo ID là chuỗi để so sánh

      if (userIdToDelete && confirm(`Bạn chắc chắn muốn xóa quản lý?`)) {
        if (!safeCurrentTeamId) {
          console.error("Cannot delete manager: currentTeamId is missing.");
          alert("Lỗi: Không xác định được đội hiện tại.");
          return;
        }
        try {
          let managersData = JSON.parse(localStorage.getItem('managersData') || '[]');
          // Lọc ra mối quan hệ quản lý cụ thể cho đội hiện tại
          const initialLength = managersData.length;
          const updatedManagersData = managersData.filter(m =>
            !(String(m.teamId) === safeCurrentTeamId && parseInt(m.userId, 10) === userIdToDelete)
          );

          if (initialLength === updatedManagersData.length) {
            console.warn(`Manager relationship not found for User ${userIdToDelete} and Team ${safeCurrentTeamId}. No changes made.`);
            // Không cần thông báo cho người dùng trừ khi nó bất ngờ
          } else {
            localStorage.setItem('managersData', JSON.stringify(updatedManagersData));
            console.log(`Manager ${userIdToDelete} removed from team ${safeCurrentTeamId}.`);
            alert(`Đã xóa quản lý.`);
            renderManagerTable(); // Làm mới bảng
          }
        } catch (error) {
          console.error("Error deleting manager:", error);
          alert("Đã xảy ra lỗi khi xóa quản lý.");
        }
      }
    }
  }

  // --- Logic Cốt Lõi: Thêm Quản lý (ĐÃ CẬP NHẬT để sử dụng lựa chọn) ---
  function handleAddManager() {
    const safeCurrentTeamId = String(currentTeamId); // Đảm bảo ID là chuỗi
    if (!safeCurrentTeamId) {
      console.error("Cannot add manager: currentTeamId is missing.");
      alert("Lỗi: Không xác định được đội hiện tại.");
      return;
    }
    // --- SỬ DỤNG ID NGƯỜI DÙNG ĐÃ CHỌN ---
    const userIdToAddString = addManagerInput.getAttribute('data-selected-user-id'); // Lấy từ thuộc tính data

    if (!userIdToAddString) {
      alert("Vui lòng tìm kiếm và chọn một người dùng từ danh sách.");
      addManagerInput.focus(); // Đưa focus trở lại input
      return;
    }

    const userIdToAdd = parseInt(userIdToAddString, 10); // Đảm bảo ID là số
    const userToAdd = findUserById(userIdToAdd);

    if (!userToAdd) {
      alert(`Lỗi: Không tìm thấy thông tin người dùng cho ID: ${userIdToAdd}. Vui lòng chọn lại.`);
      // Xóa lựa chọn có thể không hợp lệ
      addManagerInput.value = '';
      addManagerInput.removeAttribute('data-selected-user-id');
      selectedUserIdToAdd = null;
      return;
    }

    // Tìm đội hiện tại để kiểm tra xem người dùng có phải là người tạo không
    const teamsData = getTeamsData(); // Đã trả về ID dưới dạng chuỗi
    const currentTeam = teamsData.find(team => team.id === safeCurrentTeamId);

    // Quan trọng: Đảm bảo so sánh ID người tạo đội xử lý được sự không khớp kiểu tiềm năng
    const creatorId = typeof currentTeam?.userId === 'string' ? parseInt(currentTeam.userId, 10) : currentTeam?.userId;


    if (currentTeam && userToAdd.id === creatorId) {
      alert("Người dùng này đã là người tạo đội, không thể thêm làm quản lý.");
      return;
    }

    try {
      let managersData = JSON.parse(localStorage.getItem('managersData') || '[]');

      // Kiểm tra xem người dùng này CÓ PHẢI LÀ quản lý của ĐỘI NÀY rồi không
      const alreadyExists = managersData.some(m =>
        String(m.teamId) === safeCurrentTeamId && parseInt(m.userId, 10) === userToAdd.id
      );

      if (alreadyExists) {
        alert(`Người dùng ${userToAdd.username || userToAdd.email} đã là quản lý của đội này.`);
        // Xóa input sau thông báo
        addManagerInput.value = '';
        addManagerInput.removeAttribute('data-selected-user-id');
        selectedUserIdToAdd = null;
        return;
      }

      // Thêm mối quan hệ quản lý mới
      managersData.push({ teamId: safeCurrentTeamId, userId: userToAdd.id }); // Lưu trữ teamId một cách nhất quán (ví dụ: chuỗi)
      localStorage.setItem('managersData', JSON.stringify(managersData));

      console.log(`Added manager relationship: User ${userToAdd.id} for Team ${safeCurrentTeamId}`);
      alert(`Đã thêm ${userToAdd.username || userToAdd.email} làm quản lý.`);

      // Xóa input và trạng thái lựa chọn sau khi thêm thành công
      addManagerInput.value = '';
      addManagerInput.removeAttribute('data-selected-user-id');
      selectedUserIdToAdd = null;

      renderManagerTable(); // Làm mới bảng

    } catch (error) {
      console.error("Error updating managersData:", error);
      alert("Đã xảy ra lỗi khi thêm quản lý.");
    }
  }


  // --- Thiết lập Ban đầu và Bộ lắng nghe Sự kiện ---
  if (tableBody) {
    renderManagerTable();
    // Sử dụng ủy quyền sự kiện trên thân bảng cho các nút xóa
    tableBody.addEventListener('click', handleDeleteUser);
  } else {
    console.error("Could not find table body element (expected ID 'managerTable' with a tbody).");
  }

  if(addManagerBtn) {
    addManagerBtn.addEventListener('click', handleAddManager);
  } else {
    console.error("Could not find Add Manager button (expected ID 'addManagerBtn').");
  }

});

