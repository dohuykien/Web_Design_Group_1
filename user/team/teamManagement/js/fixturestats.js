document.addEventListener("DOMContentLoaded", () => {
  let currentFixture = null; 
  let teamA = null; 
  let viewingTeamId = null; 
  let allPlayers = []; 
  let allFixtures = []; 
  let allScores = []; 

  // --- DOM Elements (Phần tử DOM) ---
  const backButton = document.getElementById('back-to-fixtures'); 
  const scoreHeader = document.getElementById('score-header'); 
  const teamANameEl = document.getElementById('teamAName'); 
  const teamALogoEl = document.getElementById('teamALogo'); 
  const scoreAInput = document.getElementById('scoreA'); 
  const teamBNameEl = document.getElementById('teamBName'); 
  const teamBLogoEl = document.getElementById('teamBLogo'); 
  const scoreBInput = document.getElementById('scoreB'); 
  const penaltyAInput = document.getElementById('penaltyA');
  const penaltyBInput = document.getElementById('penaltyB'); 
  const teamAStatsHeaderEl = document.getElementById('teamAStatsHeader'); 
  const teamBStatsHeaderEl = document.getElementById('teamBStatsHeader'); 
  const teamAScoresContainer = document.getElementById('teamAScoresContainer');
  const teamBScoresContainer = document.getElementById('teamBScoresContainer');
  const statsInputArea = document.getElementById('stats-input-area'); 
  const saveStatsBtn = document.getElementById('saveStatsBtn'); 
  const statRowTemplate = document.getElementById('stat-row-template'); 

  // --- Functions (Hàm) ---

  // Tải dữ liệu cần thiết từ localStorage
  function loadData() {
    const storedTeams = localStorage.getItem('teams');
    const storedFixtures = localStorage.getItem('fixtures');
    const storedPlayers = localStorage.getItem('teamMembersData');
    const storedScores = localStorage.getItem('scores');

    // Phân tích JSON hoặc khởi tạo mảng rỗng nếu không có dữ liệu
    teams = storedTeams ? JSON.parse(storedTeams) : [];
    allFixtures = storedFixtures ? JSON.parse(storedFixtures) : [];
    allPlayers = storedPlayers ? JSON.parse(storedPlayers) : [];
    allScores = storedScores ? JSON.parse(storedScores) : [];

    // Kiểm tra cơ bản xem dữ liệu có tồn tại không
    if (teams.length === 0) console.warn("LocalStorage 'teams' is empty.");
    if (allFixtures.length === 0) console.warn("LocalStorage 'fixtures' is empty.");
    if (allPlayers.length === 0) console.warn("LocalStorage 'teamMembersData' is empty.");
    // scores có thể trống ban đầu
  }

  // Tìm đội theo ID trong mảng teams đã tải
  function getTeamById(id) {
    return teams.find(t => t.id === id);
  }

  // Tìm lịch thi đấu theo ID trong mảng allFixtures đã tải
  function getFixtureById(id) {
    return allFixtures.find(f => f.id === id);
  }

  // Lọc danh sách cầu thủ thuộc một đội cụ thể
  function getPlayersByTeamId(teamId) {
    return allPlayers.filter(p => p.teamId === teamId);
  }

  // Điền danh sách cầu thủ vào thẻ select dropdown
  function populatePlayerSelect(selectElement, teamId, includeAssistNone = false) {
    const players = getPlayersByTeamId(teamId); // Lấy danh sách cầu thủ của đội
    // Xóa các option hiện có trừ option đầu tiên (thường là placeholder "Chọn cầu thủ")
    const firstOption = selectElement.options[0];
    selectElement.innerHTML = '';
    selectElement.appendChild(firstOption);

    // Thêm tùy chọn "Không có" cho Kiến tạo nếu được yêu cầu
    if (includeAssistNone) {
      const noneOption = document.createElement('option');
      noneOption.value = ""; // Giá trị rỗng đại diện cho không có kiến tạo
      noneOption.textContent = "Không có";
      selectElement.appendChild(noneOption);
    }

    // Sắp xếp cầu thủ theo tên
    players.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
    // Thêm từng cầu thủ vào danh sách
    players.forEach(player => {
      const option = document.createElement('option');
      option.value = player.id; // Giá trị là ID của cầu thủ
      option.textContent = `${player.name || 'N/A'} (${player.jerseyNumber || '?'})`; // Hiển thị tên và số áo
      selectElement.appendChild(option);
    });
  }

  // Thêm một hàng nhập liệu thống kê bàn thắng mới vào container của đội A hoặc B
  function addStatRow(team, scoreData = null) {
    const teamId = (team === 'A') ? teamA.id : teamB.id; // Xác định ID đội
    const container = (team === 'A') ? teamAScoresContainer : teamBScoresContainer; // Xác định container tương ứng

    // Sao chép nội dung từ template HTML
    const templateContent = statRowTemplate.content.cloneNode(true);
    const newRow = templateContent.querySelector('.stat-row'); // Lấy phần tử hàng mới

    // Lấy các element input/select bên trong hàng mới
    const scorerSelect = newRow.querySelector('select[name="scorer"]');
    const assistSelect = newRow.querySelector('select[name="assist"]');
    const timeInput = newRow.querySelector('input[name="time"]');
    const typeSelect = newRow.querySelector('select[name="goalType"]');
    const removeBtn = newRow.querySelector('.remove-row-btn');

    // Điền danh sách cầu thủ vào các select dropdown
    populatePlayerSelect(scorerSelect, teamId);
    populatePlayerSelect(assistSelect, teamId, true); // Bao gồm tùy chọn "Không có" cho kiến tạo

    // Nếu có dữ liệu bàn thắng (khi tải lại từ localStorage), điền vào các trường
    if (scoreData) {
      // *** SỬA ĐỔI: Chuyển đổi ID số thành chuỗi để gán giá trị cho select ***
      scorerSelect.value = String(scoreData.scorerId || ""); // Xử lý trường hợp null/undefined
      assistSelect.value = String(scoreData.assistId || ""); // Chuỗi rỗng đại diện cho "Không có" hoặc null kiến tạo
      timeInput.value = scoreData.time || "";
      typeSelect.value = scoreData.type || "Bàn thắng"; // Mặc định là "Bàn thắng"
    }

    // Gắn sự kiện click cho nút xóa hàng
    removeBtn.addEventListener('click', () => removeStatRow(removeBtn));

    // Thêm hàng mới vào container
    container.appendChild(newRow);
  }

  // Xóa một hàng nhập liệu thống kê khỏi DOM
  function removeStatRow(buttonElement) {
    const rowToRemove = buttonElement.closest('.stat-row'); // Tìm phần tử cha là .stat-row
    if (rowToRemove) {
      rowToRemove.remove(); // Xóa khỏi DOM
    }
  }

  // Tải và hiển thị chi tiết của trận đấu hiện tại lên giao diện
  function loadFixtureDetails() {
    if (!currentFixture || !teamA || !teamB) {
      scoreHeader.innerHTML = "<p style='color: red;'>Lỗi: Không thể tải thông tin trận đấu.</p>";
      return;
    }

    // Điền thông tin vào phần Header tỷ số
    teamANameEl.textContent = teamA.teamName;
    teamALogoEl.src = teamA.logo || 'https://via.placeholder.com/50/cccccc/FFFFFF?text=A'; // Logo mặc định nếu không có
    teamALogoEl.alt = `${teamA.teamName} Logo`;
    scoreAInput.value = currentFixture.scoreA ?? ''; // Sử dụng ?? để xử lý null/undefined

    teamBNameEl.textContent = teamB.teamName;
    teamBLogoEl.src = teamB.logo || 'https://via.placeholder.com/50/cccccc/FFFFFF?text=B';
    teamBLogoEl.alt = `${teamB.teamName} Logo`;
    scoreBInput.value = currentFixture.scoreB ?? '';

    penaltyAInput.value = currentFixture.penaltyA ?? '';
    penaltyBInput.value = currentFixture.penaltyB ?? '';

    // Cập nhật tiêu đề cột thống kê
    teamAStatsHeaderEl.textContent = `Thống kê ${teamA.teamName}`;
    teamBStatsHeaderEl.textContent = `Thống kê ${teamB.teamName}`;

    // Tải các hàng sự kiện ghi bàn đã có từ localStorage
    teamAScoresContainer.innerHTML = ''; // Xóa các hàng cũ
    teamBScoresContainer.innerHTML = '';
    const fixtureScores = allScores.filter(s => s.fixtureId === currentFixture.id); // Lọc các sự kiện của trận này

    // Thêm lại các hàng dựa trên dữ liệu đã lưu
    fixtureScores.forEach(score => {
      if (score.teamId === teamA.id) {
        addStatRow('A', score);
      } else if (score.teamId === teamB.id) {
        addStatRow('B', score);
      }
    });

    // Thêm một hàng trống nếu đội chưa có bàn thắng nào được nhập
    if (teamAScoresContainer.children.length === 0) {
      addStatRow('A');
    }
    if (teamBScoresContainer.children.length === 0) {
      addStatRow('B');
    }
  }

  // Xử lý sự kiện khi nhấn nút Lưu
  function handleSaveStats() {
    if (!currentFixture) {
      alert("Lỗi: Không tìm thấy thông tin trận đấu để lưu.");
      return;
    }

    // 1. Lưu Tỷ số Chung cuộc (không cần thay đổi ở đây)
    const fixtureIndex = allFixtures.findIndex(f => f.id === currentFixture.id); // Tìm index của trận đấu trong mảng
    if (fixtureIndex === -1) {
      alert("Lỗi nghiêm trọng: Không tìm thấy trận đấu trong danh sách.");
      return;
    }
    // Cập nhật tỷ số và penalty vào đối tượng fixture trong mảng
    allFixtures[fixtureIndex].scoreA = parseInt(scoreAInput.value, 10) || 0;
    allFixtures[fixtureIndex].scoreB = parseInt(scoreBInput.value, 10) || 0;
    allFixtures[fixtureIndex].penaltyA = penaltyAInput.value !== '' ? parseInt(penaltyAInput.value, 10) : null; // Chuyển thành số hoặc null
    allFixtures[fixtureIndex].penaltyB = penaltyBInput.value !== '' ? parseInt(penaltyBInput.value, 10) : null;

    // 2. Thu thập các Sự kiện Ghi bàn Chi tiết
    const newScoresForFixture = []; // Mảng tạm để lưu các sự kiện mới của trận này

    // Hàm xử lý các hàng nhập liệu của một đội
    const processTeamScores = (container, teamId) => {
      const rows = container.querySelectorAll('.stat-row'); // Lấy tất cả các hàng nhập liệu
      rows.forEach(row => {
        const scorerValue = row.querySelector('select[name="scorer"]').value;
        const assistValue = row.querySelector('select[name="assist"]').value; // Sẽ là chuỗi hoặc chuỗi rỗng ""
        const time = row.querySelector('input[name="time"]').value.trim();
        const type = row.querySelector('select[name="goalType"]').value;

        // *** SỬA ĐỔI: Chuyển đổi giá trị chuỗi đã chọn thành số ***
        const scorerId = scorerValue ? parseInt(scorerValue, 10) : null;
        // Chuyển đổi giá trị kiến tạo: chuỗi rỗng "" thành null, ngược lại parse thành int
        const assistId = assistValue ? parseInt(assistValue, 10) : null;

        // Chỉ lưu hàng nếu có ID cầu thủ ghi bàn hợp lệ được phân tích
        if (scorerId !== null && !isNaN(scorerId)) { // Kiểm tra scorerId có phải là số hợp lệ không
          newScoresForFixture.push({
            scoreId: `score-${Date.now()}-${Math.random().toString(16).slice(2)}`, // Tạo ID duy nhất
            fixtureId: currentFixture.id,
            teamId: teamId,
            scorerId: scorerId, // Lưu dưới dạng số
            assistId: (assistId !== null && !isNaN(assistId)) ? assistId : null, // Lưu kiến tạo dưới dạng số hoặc null
            time: time,
            type: type
          });
        } else if (scorerValue) {
          // Tùy chọn: Ghi log cảnh báo nếu có giá trị được chọn nhưng không phân tích được
          console.warn(`Không thể phân tích ID cầu thủ ghi bàn: '${scorerValue}' trong đội ${teamId}`);
        }
      });
    };

    // Xử lý cho cả hai đội
    processTeamScores(teamAScoresContainer, teamA.id);
    processTeamScores(teamBScoresContainer, teamB.id);

    // 3. Cập nhật Mảng Scores Toàn cục (không cần thay đổi ở đây)
    // Xóa các sự kiện cũ của trận này khỏi mảng toàn cục
    allScores = allScores.filter(s => s.fixtureId !== currentFixture.id);
    // Thêm các sự kiện mới đã thu thập vào mảng toàn cục
    allScores.push(...newScoresForFixture);

    // 4. Lưu vào LocalStorage (không cần thay đổi ở đây)
    try {
      localStorage.setItem('fixtures', JSON.stringify(allFixtures)); // Lưu lại toàn bộ danh sách lịch thi đấu đã cập nhật
      localStorage.setItem('scores', JSON.stringify(allScores)); // Lưu lại toàn bộ danh sách sự kiện ghi bàn đã cập nhật
      alert("Đã lưu thông số trận đấu thành công!");
    } catch (error) {
      console.error("Lỗi khi lưu vào LocalStorage:", error);
      alert("Đã xảy ra lỗi khi lưu dữ liệu.");
    }
  }

  // Hàm khởi tạo chính, chạy khi DOM đã sẵn sàng
  function initialize() {
    loadData(); // Tải tất cả dữ liệu cần thiết

    // Lấy ID trận đấu và ID đội xem từ tham số URL
    const urlParams = new URLSearchParams(window.location.search);
    const fixtureId = urlParams.get('fixtureId');
    viewingTeamId = urlParams.get('id'); // ID của đội đã nhấn vào link

    // Kiểm tra xem có đủ ID không
    if (!fixtureId || !viewingTeamId) {
      document.querySelector('.content-box').innerHTML = '<p style="color:red; text-align:center;">Thiếu thông tin trận đấu hoặc đội trong URL (cần fixtureId và teamId).</p>';
      return;
    }

    // Thiết lập link cho nút Quay lại
    backButton.href = `fixtures.html?id=${viewingTeamId}`;

    // Lấy thông tin trận đấu hiện tại
    currentFixture = getFixtureById(fixtureId);
    if (!currentFixture) {
      document.querySelector('.content-box').innerHTML = `<p style="color:red; text-align:center;">Không tìm thấy trận đấu với ID: ${fixtureId}.</p>`;
      return;
    }

    // Lấy thông tin hai đội tham gia
    teamA = getTeamById(currentFixture.teamAId);
    teamB = getTeamById(currentFixture.teamBId);

    if (!teamA || !teamB) {
      document.querySelector('.content-box').innerHTML = `<p style="color:red; text-align:center;">Không tìm thấy thông tin đầy đủ của các đội tham gia.</p>`;
      return;
    }

    // Tải và hiển thị chi tiết lên giao diện
    loadFixtureDetails();

    // Gắn các trình lắng nghe sự kiện
    saveStatsBtn.addEventListener('click', handleSaveStats); // Nút Lưu

    // Sử dụng event delegation cho các nút "Thêm hàng"
    statsInputArea.addEventListener('click', (event) => {
      if (event.target.closest('.add-row-btn')) { // Nếu click vào nút thêm hàng
        const team = event.target.closest('.add-row-btn').dataset.team; // Lấy 'A' hoặc 'B' từ data-team
        addStatRow(team); // Gọi hàm thêm hàng
      }
    });
  }

  // Bắt đầu quá trình khởi tạo
  initialize();
}); // Kết thúc DOMContentLoaded

