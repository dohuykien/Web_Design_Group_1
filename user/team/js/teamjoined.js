document.addEventListener('DOMContentLoaded', () => {
  console.log("DOM fully loaded. Initializing joined teams list...");

  // ----- Dữ liệu Người dùng -----
  let userIdString = localStorage.getItem("userProfile_id");
  let userIdInt = Number(userIdString);
  const currentUser = {
    id: userIdInt,
    name: localStorage.getItem("userProfile_username"),
  };

  // ----- Hàm Hỗ trợ: Tải và Phân tích dữ liệu từ localStorage -----
  function loadDataFromLocalStorage(key) {
    const storedData = localStorage.getItem(key);
    let data = [];
    try {
      data = storedData ? JSON.parse(storedData) : [];
      if (!Array.isArray(data)) {
        console.warn(`Invalid data found in localStorage for '${key}', resetting to empty array.`);
        data = [];
      }
    } catch (error) {
      console.error(`Error parsing '${key}' from localStorage:`, error);
      data = [];
    }
    return data;
  }

  // ----- Tải Dữ liệu -----
  const allTeamsData = loadDataFromLocalStorage("teams");
  const allMembersData = loadDataFromLocalStorage("teamMembersData");

  console.log("All Teams Data:", allTeamsData);
  console.log("All Members Data:", allMembersData);

  // ----- Xử lý Dữ liệu -----

  // 1. Tìm ID của các đội mà currentUser đã tham gia
  const joinedTeamIds = new Set();
  allMembersData.forEach(member => {
    if (member && member.userId === currentUser.id && member.teamId) {
      joinedTeamIds.add(member.teamId);
    }
  });
  console.log("User is a member of Team IDs:", joinedTeamIds);

  // 2. Tính tổng số thành viên cho TẤT CẢ các đội
  const memberCountsByTeamId = {};
  allMembersData.forEach(member => {
    if (member && member.teamId) {
      const teamId = member.teamId;
      memberCountsByTeamId[teamId] = (memberCountsByTeamId[teamId] || 0) + 1;
    }
  });
  console.log("Calculated member counts for all teams:", memberCountsByTeamId);

  // 3. Lọc danh sách đội chính để chỉ lấy các đội đã tham gia và thêm số lượng thành viên
  const joinedTeamsDetails = allTeamsData
    .filter(team => team && team.id && joinedTeamIds.has(team.id))
    .map(team => ({
      ...team,
      memberCount: memberCountsByTeamId[team.id] || 0
    }));

  console.log("Details of teams user joined:", joinedTeamsDetails);

  // ----- Logic Hiển thị -----
  function displayJoinedTeams() {
    const container = document.getElementById('team-list-container');
    if (!container) {
      console.error("Team list container not found!");
      return;
    }
    container.innerHTML = '';

    if (joinedTeamsDetails.length === 0) {
      container.innerHTML = '<p style="text-align: center; width: 100%; padding: 20px; color: #666;">Bạn chưa tham gia đội bóng nào.</p>';
      return;
    }

    joinedTeamsDetails.forEach((team) => {
      if (!team || !team.id) {
        console.warn("Skipping invalid joined team data during display:", team);
        return;
      }

      let imgSrc = team.logo || 'images/logo.png';

      if (team.logo && typeof team.logo === 'string' && team.logo.trim() !== '') {
        if (!team.logo.startsWith('data:image') && !team.logo.startsWith('images/')) {
          console.warn(`Team ${team.id} logo format issue. Using placeholder.`);
          imgSrc = 'images/logo.png';
        } else {
          imgSrc = team.logo;
        }
      } else {
        imgSrc = 'images/logo.png';
      }

      const cardHTML = `
        <div class="team-card">
          <img src="${imgSrc}" alt="Logo đội ${team.teamName || 'Không tên'}" class="team-logo" onerror="this.onerror=null; this.src='images/logo.png';">
          <h3 class="team-name">${team.teamName || 'Đội không tên'}</h3>
          <p class="team-members">
            <i class="fa-solid fa-users"></i> ${team.memberCount} Thành viên
          </p>
        </div>
      `;
      container.insertAdjacentHTML('beforeend', cardHTML);
    });
  }

  // --- Gọi Hiển thị Ban đầu ---
  displayJoinedTeams();

}); // End DOMContentLoaded