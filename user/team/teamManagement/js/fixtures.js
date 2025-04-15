document.addEventListener("DOMContentLoaded", () => {
  // --- Globals and Data ---
  let userIdString = localStorage.getItem("userProfile_id");
  let userIdInt = Number(userIdString);
  const currentUser = {
    id: userIdInt,
    name: localStorage.getItem("userProfile_username"),
  };
  let currentTeam = null;
  let teams = [];
  let fixtures = [];

  // --- DOM Elements ---
  const fixtureListContainer = document.getElementById('fixture-list');
  const createFixtureBtn = document.getElementById('create-fixture-btn');
  const fixtureDialog = document.getElementById('fixture-dialog');
  const closeDialogButtons = document.querySelectorAll('.close-button, .close-dialog-btn');
  const fixtureForm = document.getElementById('fixture-form');
  const dialogTitle = document.getElementById('dialog-title');
  const fixtureFilter = document.getElementById('fixture-filter');

  // Form Fields
  const fixtureIdInput = document.getElementById('fixtureId');
  const matchTypeSelect = document.getElementById('matchType');
  const teamANameInput = document.getElementById('teamAName');
  const teamAIdInput = document.getElementById('teamAId');

  // *** Updated Team B Elements ***
  const teamBWrapper = document.getElementById('teamBWrapper');
  const teamBInternalInput = document.getElementById('teamBInternalInput'); // For internal display
  const teamBSearchInput = document.getElementById('teamBSearchInput'); // For opponent search
  const teamBResultsDropdown = document.getElementById('teamBResultsDropdown'); // Dropdown container
  const teamBIdInput = document.getElementById('teamBId'); // Hidden input for ID

  const scheduleDateTimeInput = document.getElementById('scheduleDateTime');
  const provinceSelect = document.getElementById('province');
  const districtSelect = document.getElementById('district');
  const venueInput = document.getElementById('venue');

  // --- Functions ---

  // Load data (Keep existing loadData and getDefaultTeams)
  function loadData() {
      const storedTeams = localStorage.getItem('teams');
      teams = storedTeams ? JSON.parse(storedTeams) : getDefaultTeams();
      const storedFixtures = localStorage.getItem('fixtures');
      fixtures = storedFixtures ? JSON.parse(storedFixtures) : [];
      if (!storedTeams) { localStorage.setItem('teams', JSON.stringify(teams)); }
  }
  function getDefaultTeams() { /* ... keep existing ... */
      console.warn("Using default team data. Clear localStorage 'teams' to reset if needed.");
      return [
          { id: 'team-1', userId: 1, teamName: 'My Awesome Team', managerName: 'Manager A', email: 'a@t.com', phone: '111', logo: 'https://via.placeholder.com/60/0000FF/FFFFFF?text=MAT', cover: '', homeKit: '', awayKit: '' },
          { id: 'team-2', userId: 2, teamName: 'Rival FC', managerName: 'Manager B', email: 'b@t.com', phone: '222', logo: 'https://via.placeholder.com/60/FF0000/FFFFFF?text=RFC', cover: '', homeKit: '', awayKit: '' },
          { id: 'team-3', userId: 1, teamName: 'Internal Lions', managerName: 'Manager C', email: 'c@t.com', phone: '333', logo: 'https://via.placeholder.com/60/008000/FFFFFF?text=IL', cover: '', homeKit: '', awayKit: '' },
          { id: 'team-4', userId: 3, teamName: 'City Strikers', managerName: 'Manager D', email: 'd@t.com', phone: '444', logo: 'https://via.placeholder.com/60/FFA500/FFFFFF?text=CS', cover: '', homeKit: '', awayKit: '' },
          { id: 'team-5', userId: 4, teamName: 'Saigon United', managerName: 'Manager E', email: 'e@t.com', phone: '555', logo: 'https://via.placeholder.com/60/800080/FFFFFF?text=SU', cover: '', homeKit: '', awayKit: '' },
      ];
  }
  function getCurrentTeamIdFromUrl() { /* ... keep existing ... */
      const urlParams = new URLSearchParams(window.location.search);
      return urlParams.get('id');
  }
  function getTeamById(teamId) { /* ... keep existing ... */
      return teams.find(team => team.id === teamId);
  }
  function formatDateTime(dateTimeString) { /* ... keep existing ... */
      if (!dateTimeString) return { date: 'N/A', time: 'N/A' };
      try {
          const dateObj = new Date(dateTimeString);
          if (isNaN(dateObj)) return { date: 'Invalid Date', time: '' };
          const timeOptions = { hour: '2-digit', minute: '2-digit', hour12: false };
          const dateOptions = { day: '2-digit', month: '2-digit', year: 'numeric' };
          const time = dateObj.toLocaleTimeString('vi-VN', timeOptions);
          const date = dateObj.toLocaleDateString('vi-VN', dateOptions);
          return { date, time };
      } catch (error) { console.error("Error formatting date:", error); return { date: 'Error', time: '' }; }
  }
  function renderFixtures() {
      if (!currentTeam) { fixtureListContainer.innerHTML = '<p>Không tìm thấy thông tin đội bóng.</p>'; return; }
      fixtureListContainer.innerHTML = '';
      const filterValue = fixtureFilter.value;
      const relevantFixtures = fixtures.filter(fixture => {
          const isParticipant = fixture.teamAId === currentTeam.id || fixture.teamBId === currentTeam.id;
          if (!isParticipant) return false;
          if (filterValue === 'internal') return fixture.matchType === 'internal';
          else if (filterValue === 'opponent') return fixture.matchType === 'opponent';
          return true;
      });
      if (relevantFixtures.length === 0) { fixtureListContainer.innerHTML = '<p>Chưa có lịch thi đấu nào.</p>'; return; }

      relevantFixtures.forEach(fixture => {
          const teamA = getTeamById(fixture.teamAId);
          const teamB = getTeamById(fixture.teamBId);
          const { date, time } = formatDateTime(fixture.scheduleDateTime);
          const teamALogo = teamA?.logo || 'https://via.placeholder.com/60/cccccc/FFFFFF?text=N/A';
          const teamAName = teamA?.teamName || 'Không rõ';
          const teamBLogo = teamB?.logo || 'https://via.placeholder.com/60/cccccc/FFFFFF?text=N/A';
          const teamBName = teamB?.teamName || 'Không rõ';

          const card = document.createElement('div');
          card.className = 'fixture-card';

          // *** MODIFIED innerHTML for Stats button link ***
          card.innerHTML = `
              <div class="main-content">
                  <div class="team team-a">
                       <img src="${teamALogo}" alt="${teamAName} logo">
                       <span class="team-name">${teamAName}</span>
                  </div>
                  <div class="match-info">
                       <div class="time">${time}</div>
                       <div class="date">${date}</div>
                       ${fixture.venue ? `<div class="venue"><i class="fa-solid fa-location-dot"></i> ${fixture.venue}</div>` : ''}
                  </div>
                  <div class="team team-b">
                       <img src="${teamBLogo}" alt="${teamBName} logo">
                       <span class="team-name">${teamBName}</span>
                   </div>
               </div>
               <div class="actions">
                  <button
                      class="btn btn-warning edit-btn"
                      data-id="${fixture.id}"
                      title="Sửa lịch thi đấu"
                  >
                      <i class="fa-solid fa-pencil"></i> Sửa
                  </button>
                  <button class="btn btn-danger delete-btn" data-id="${fixture.id}" title="Xóa lịch thi đấu">
                      <i class="fa-solid fa-trash"></i> Xoá
                  </button>
                  <a
                      href="fixturestats.html?fixtureId=${fixture.id}&id=${currentTeam.id}" {/* MODIFIED HERE */}
                      class="btn btn-info stats-btn"
                      title="Xem thông số trận đấu"
                  >
                      <i class="fa-solid fa-chart-simple"></i> Thông số
                  </a>
               </div>`;
          fixtureListContainer.appendChild(card);
      });
  }
  function showDialog() { /* ... keep existing ... */
      fixtureDialog.classList.add('show');
      // Add listener to close dropdown when clicking outside
      document.addEventListener('click', handleOutsideClick, true);
  }
  function closeDialog() { /* ... keep existing ... */
      fixtureDialog.classList.remove('show');
      fixtureForm.reset();
      teamBResultsDropdown.style.display = 'none'; // Ensure dropdown is hidden
      teamBResultsDropdown.innerHTML = '';      // Clear dropdown content
      // Reset Team B input states
      teamBInternalInput.style.display = 'none';
      teamBSearchInput.style.display = 'none';
      teamBIdInput.value = ''; // Clear hidden ID
      // Remove listener for outside clicks
      document.removeEventListener('click', handleOutsideClick, true);
  }

  // *** MODIFIED Function: Update Team B input based on Match Type selection ***
  function updateTeamBInputType() {
      const selectedType = matchTypeSelect.value;
      teamBIdInput.value = ''; // Clear hidden ID whenever type changes
      teamBResultsDropdown.style.display = 'none'; // Hide dropdown

      if (selectedType === 'internal') {
          teamBInternalInput.style.display = 'block';
          teamBSearchInput.style.display = 'none';
          teamBInternalInput.value = teamANameInput.value; // Set to current team name
          teamBIdInput.value = teamAIdInput.value; // Store internal team B id
          teamBIdInput.required = true; // Still technically required
          teamBSearchInput.value = ''; // Clear search input
      } else if (selectedType === 'opponent') {
          teamBInternalInput.style.display = 'none';
          teamBSearchInput.style.display = 'block';
          teamBSearchInput.value = ''; // Clear search input on type change
          teamBIdInput.value = ''; // Clear ID, needs to be selected
          teamBIdInput.required = true; // The ID is required
      } else {
          // Default or placeholder state
          teamBInternalInput.style.display = 'none';
          teamBSearchInput.style.display = 'none';
          teamBSearchInput.value = '';
          teamBIdInput.value = '';
          teamBIdInput.required = false; // Not required if no type selected
      }
  }

  // *** NEW Function: Display search results in the dropdown ***
  function displaySearchResults(results) {
      teamBResultsDropdown.innerHTML = ''; // Clear previous results
      if (results.length === 0) {
          teamBResultsDropdown.innerHTML = '<div class="search-result-item no-results">Không tìm thấy đội nào</div>';
          teamBResultsDropdown.style.display = 'block';
          return;
      }

      results.forEach(team => {
          const item = document.createElement('div');
          item.className = 'search-result-item';
          item.textContent = team.teamName;
          item.dataset.id = team.id; // Store team ID
          item.dataset.name = team.teamName; // Store team name
          teamBResultsDropdown.appendChild(item);
      });

      teamBResultsDropdown.style.display = 'block';
  }

  // *** NEW Function: Handle clicks outside the search input/dropdown ***
  function handleOutsideClick(event) {
      if (!teamBWrapper.contains(event.target)) {
          teamBResultsDropdown.style.display = 'none';
      }
  }


  function openDialogForCreate() { /* ... modified slightly ... */
      if (!currentTeam) return;
      fixtureForm.reset();
      dialogTitle.textContent = 'Tạo trận đấu';
      fixtureIdInput.value = '';
      teamANameInput.value = currentTeam.teamName;
      teamAIdInput.value = currentTeam.id;
      matchTypeSelect.value = 'opponent'; // Default to opponent
      updateTeamBInputType(); // Setup correct Team B input
      showDialog();
  }

  function openDialogForEdit(fixtureId) { /* ... modified ... */
      const fixture = fixtures.find(f => f.id === fixtureId);
      if (!fixture || !currentTeam) return;
      fixtureForm.reset();
      dialogTitle.textContent = 'Sửa lịch thi đấu';
      fixtureIdInput.value = fixture.id;
      teamANameInput.value = currentTeam.teamName; // Assuming Team A is always the 'owner' team editing
      teamAIdInput.value = currentTeam.id;

      matchTypeSelect.value = fixture.matchType;
      scheduleDateTimeInput.value = fixture.scheduleDateTime || '';
      provinceSelect.value = fixture.province || '';
      districtSelect.value = fixture.district || '';
      venueInput.value = fixture.venue || '';

      updateTeamBInputType(); // Set up the correct input/select visibility first

      // Pre-fill Team B based on loaded data
      if (fixture.matchType === 'internal') {
          // teamBInternalInput should be filled by updateTeamBInputType
          teamBIdInput.value = fixture.teamBId; // Ensure hidden ID is set
      } else if (fixture.matchType === 'opponent') {
          const teamB = getTeamById(fixture.teamBId);
          if (teamB) {
              teamBSearchInput.value = teamB.teamName; // Show the name in search input
          } else {
              teamBSearchInput.value = ''; // Clear if team not found (data inconsistency)
              console.warn(`Opponent team with ID ${fixture.teamBId} not found for fixture ${fixture.id}`);
          }
          teamBIdInput.value = fixture.teamBId || ''; // Set the hidden ID
      }
      showDialog();
  }


  function handleFormSubmit(event) { /* ... modified ... */
      event.preventDefault();

      const id = fixtureIdInput.value;
      const matchType = matchTypeSelect.value;
      const teamAId = teamAIdInput.value;
      const teamBId = teamBIdInput.value; // Get ID from the hidden input

      // *** Validation for Team B ***
      if (!matchType) {
          alert('Vui lòng chọn loại trận đấu.');
          return;
      }
      if (!teamBId) {
          if (matchType === 'opponent') {
              alert('Vui lòng tìm và chọn đội đối thủ.');
              teamBSearchInput.focus();
          } else {
              // This case shouldn't happen if logic is correct for internal matches
              alert('Lỗi: Không xác định được đội B.');
          }
          return;
      }
      // Basic check if the selected opponent name matches the hidden ID
      if (matchType === 'opponent') {
          const selectedOpponent = getTeamById(teamBId);
          if (!selectedOpponent || teamBSearchInput.value.trim() !== selectedOpponent.teamName) {
              // If name doesn't match ID, or ID isn't found, force re-selection
              alert('Đội đối thủ không hợp lệ. Vui lòng tìm và chọn lại từ danh sách.');
              teamBIdInput.value = ''; // Clear invalid ID
              teamBSearchInput.value = ''; // Clear input
              teamBSearchInput.focus();
              return;
          }
      }


      const fixtureData = {
          id: id || `fixture-${Date.now()}-${Math.random().toString(16).slice(2)}`,
          matchType: matchType,
          teamAId: teamAId,
          teamBId: teamBId, // Use the value from the hidden input
          scheduleDateTime: scheduleDateTimeInput.value,
          province: provinceSelect.value,
          district: districtSelect.value,
          venue: venueInput.value.trim(),
          scoreA: null, // Or 0
          scoreB: null, // Or 0
          penaltyA: null,
          penaltyB: null,
      };

      if (id) {
          const index = fixtures.findIndex(f => f.id === id);
          if (index > -1) { fixtures[index] = fixtureData; }
          else { console.error("Fixture not found for editing:", id); alert("Lỗi: Không tìm thấy lịch thi đấu."); return; }
      } else {
          fixtures.push(fixtureData);
      }
      localStorage.setItem('fixtures', JSON.stringify(fixtures));
      closeDialog();
      renderFixtures();
  }

  function handleDeleteFixture(fixtureId) { /* ... keep existing ... */
      if (confirm('Bạn có chắc chắn muốn xóa lịch thi đấu này?')) {
          fixtures = fixtures.filter(f => f.id !== fixtureId);
          localStorage.setItem('fixtures', JSON.stringify(fixtures));
          renderFixtures();
      }
  }

  // --- Event Listeners ---

  createFixtureBtn.addEventListener('click', openDialogForCreate);
  closeDialogButtons.forEach(button => button.addEventListener('click', closeDialog));
  fixtureForm.addEventListener('submit', handleFormSubmit);
  matchTypeSelect.addEventListener('change', updateTeamBInputType);
  fixtureFilter.addEventListener('change', renderFixtures);
  fixtureListContainer.addEventListener('click', (event) => {
      const target = event.target;
      const editButton = target.closest('.edit-btn');
      const deleteButton = target.closest('.delete-btn');
      // const statsButton = target.closest('.stats-btn'); // No longer needed for navigation

      if (editButton && !editButton.disabled) { // Check if not disabled before acting
          openDialogForEdit(editButton.getAttribute('data-id'));
      } else if (deleteButton) {
          handleDeleteFixture(deleteButton.getAttribute('data-id'));
      }
       // Clicking .stats-btn (<a> tag) now navigates automatically
  });

  // *** NEW Event Listener for Team B Search Input ***
  teamBSearchInput.addEventListener('input', () => {
      const searchTerm = teamBSearchInput.value.trim().toLowerCase();
      teamBIdInput.value = ''; // Clear hidden ID when user types

      if (!searchTerm) {
          teamBResultsDropdown.style.display = 'none';
          return;
      }

      const filteredTeams = teams.filter(team =>
          team.id !== currentTeam.id && // Exclude current team
          team.teamName.toLowerCase().includes(searchTerm)
      );

      displaySearchResults(filteredTeams);
  });

  // *** NEW Event Listener for Selecting an item from Dropdown ***
  teamBResultsDropdown.addEventListener('click', (event) => {
      const target = event.target;
      if (target.classList.contains('search-result-item') && !target.classList.contains('no-results')) {
          const selectedId = target.dataset.id;
          const selectedName = target.dataset.name;

          teamBSearchInput.value = selectedName; // Set input display value
          teamBIdInput.value = selectedId;     // Set the hidden input's value (crucial!)
          teamBResultsDropdown.style.display = 'none'; // Hide dropdown
          teamBResultsDropdown.innerHTML = ''; // Clear dropdown
      }
  });

  // Prevent dropdown click from triggering the outside click handler immediately
  teamBResultsDropdown.addEventListener('click', (event) => {
      event.stopPropagation();
  });
  teamBSearchInput.addEventListener('click', (event) => {
      // If user clicks back into search input, maybe re-show dropdown if there's text?
      // Or just stop propagation to prevent immediate closing by outside click handler
      event.stopPropagation();
  });


  // --- Initialization ---
  function initialize() { /* ... keep existing ... */
      loadData();
      const teamIdFromUrl = getCurrentTeamIdFromUrl();
      if (teamIdFromUrl) {
          currentTeam = getTeamById(teamIdFromUrl);
          if (!currentTeam) {
              console.error(`Team with ID "${teamIdFromUrl}" not found.`);
              fixtureListContainer.innerHTML = `<p>Lỗi: Không tìm thấy đội với ID ${teamIdFromUrl}.</p>`;
              createFixtureBtn.disabled = true; fixtureFilter.disabled = true;
          } else {
              console.log("Current Team:", currentTeam);
              renderFixtures();
          }
      } else {
          console.error("No team ID found in URL.");
          fixtureListContainer.innerHTML = "<p>Lỗi: Không có ID đội nào được chỉ định trong URL.</p>";
          createFixtureBtn.disabled = true; fixtureFilter.disabled = true;
      }
  }

  initialize();

});