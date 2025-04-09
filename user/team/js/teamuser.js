// ----- User and Global Data -----
const currentUser = { // Keep your currentUser object
    id: 1,
    name: "Nguyen Hai Dang",
};
let teams = []; // Teams managed by the current user
let memberCountsByTeamId = {}; // Object to store member counts { teamId: count }

// ----- Data Loading Functions -----

// Function to load teams filtered for the current user
function loadTeams() {
    const storedTeams = localStorage.getItem("teams");
    let allTeams = [];
    try {
        allTeams = storedTeams ? JSON.parse(storedTeams) : [];
        if (!Array.isArray(allTeams)) {
            console.warn("Invalid data found in localStorage for 'teams', resetting.");
            allTeams = [];
            // Optionally clear the invalid item: localStorage.removeItem("teams");
        }
    } catch (error) {
        console.error("Error parsing 'teams' from localStorage:", error);
        allTeams = [];
    }
    // Filter teams for the current user *after* loading all teams
    teams = allTeams.filter(team => team.userId === currentUser.id);
    console.log("Loaded teams for current user:", teams);
}

// Function to load member data and calculate counts per team
function loadAndProcessMemberData() {
    const storedMembersData = localStorage.getItem("teamMembersData");
    let allMembersData = [];
    memberCountsByTeamId = {}; // Reset counts

    try {
        allMembersData = storedMembersData ? JSON.parse(storedMembersData) : [];
            if (!Array.isArray(allMembersData)) {
            console.warn("Invalid data found in localStorage for 'teamMembersData', resetting.");
            allMembersData = [];
                // Optionally clear the invalid item: localStorage.removeItem("teamMembersData");
        }
    } catch (error) {
        console.error("Error parsing 'teamMembersData' from localStorage:", error);
        allMembersData = [];
    }

    // Calculate counts
    allMembersData.forEach(member => {
        if (member && member.teamId) { // Check if member and teamId exist
            const teamId = member.teamId;
            memberCountsByTeamId[teamId] = (memberCountsByTeamId[teamId] || 0) + 1;
        } else {
            console.warn("Found member data entry without a valid teamId:", member);
        }
    });
    console.log("Calculated member counts by team ID:", memberCountsByTeamId);
}

// Function to save teams (specific to current user's changes)
function saveTeams() {
        // Fetch ALL teams again to avoid overwriting other users' data
    const allTeamsFromStorage = JSON.parse(localStorage.getItem("teams") || '[]');

    // Combine updated user teams with teams from other users
    // Use the globally updated 'teams' array which reflects deletions for the current user
    const teamsToSave = allTeamsFromStorage
        .filter(t => t.userId !== currentUser.id) // Keep other users' teams
        .concat(teams); // Add the current state of this user's teams

    localStorage.setItem("teams", JSON.stringify(teamsToSave));
    console.log("Saved updated teams list to localStorage.");
}


// ----- Display Logic -----

// Function to create and display team cards
function displayTeams() {
    const container = document.getElementById('team-list-container');
    if (!container) {
        console.error("Team list container not found!");
        return;
    }
    container.innerHTML = ''; // Clear existing cards

    if (teams.length === 0) {
        container.innerHTML = '<p style="text-align: center; width: 100%; padding: 20px; color: #666;">Bạn chưa tạo đội bóng nào.</p>';
        return;
    }

    teams.forEach((team) => {
        if (!team || !team.id) {
            console.warn("Skipping invalid team data:", team);
            return; // Skip if team data or team.id is invalid
        }

        let imgSrc = team.logo || 'images/logo.png'; // Default placeholder

        // --- Image Source Handling ---
        if (team.logo && typeof team.logo === 'string' && team.logo.trim() !== '') {
                if (!team.logo.startsWith('data:image') && !team.logo.startsWith('images/')) {
                console.warn(`Team ${team.id} has an unusual logo format. Using placeholder.`);
                imgSrc = 'images/logo.png';
                } else {
                imgSrc = team.logo;
                }
        } else {
            imgSrc = 'images/logo.png';
        }
        // --- End Image Source Handling ---

        // --- Get Member Count ---
        const memberCount = memberCountsByTeamId[team.id] || 0; // Look up count using team.id
        // --- End Get Member Count ---

        const cardHTML = `
            <div class="team-card" data-identifier="${team.id}">
                <img src="${imgSrc}" alt="Logo đội ${team.teamName || 'Không tên'}" class="team-logo" onerror="this.onerror=null; this.src='images/logo.png';">
                <h3 class="team-name">${team.teamName || 'Đội không tên'}</h3>
                <p class="team-members"><i class="fa-solid fa-users"></i> ${memberCount} Thành viên</p> <!-- Use calculated memberCount -->
                <div class="card-actions">
                    <button class="action-btn edit-btn" title="Chỉnh sửa đội ${team.teamName || ''}"><i class="fa-solid fa-gear"></i></button>
                    <button class="action-btn delete-btn" title="Xóa đội ${team.teamName || ''}"><i class="fa-solid fa-trash"></i></button>
                </div>
            </div>
        `;
        container.insertAdjacentHTML('beforeend', cardHTML);
    });
}

// ----- Event Listeners -----

// Function to attach event listeners for card actions (Edit/Delete)
function addActionListeners() {
    const container = document.getElementById('team-list-container');
    if (!container || container.dataset.actionListenerAttached === 'true') {
        return; // Don't attach if container missing or listener already attached
    }
    container.dataset.actionListenerAttached = 'true';

    container.addEventListener('click', function(event) {
        const target = event.target;

        // --- Handle DELETE ---
        const deleteButton = target.closest('.delete-btn');
        if (deleteButton) {
            const card = deleteButton.closest('.team-card');
            if (!card) return;

            const teamId = card.dataset.identifier;
            const teamName = card.querySelector('.team-name')?.textContent || `ID: ${teamId}`;

            if (!teamId) {
                    console.error("Could not find team ID on the card for deletion.");
                    alert("Lỗi: Không thể xác định ID của đội để xóa.");
                    return;
            }

            if (confirm(`Bạn có chắc chắn muốn xóa đội "${teamName}" không? Hành động này không thể hoàn tác.`)) {
                console.log(`Confirmed deletion for team ID: ${teamId}`);

                const initialLength = teams.length;
                // Filter out the team *from the user's filtered list*
                teams = teams.filter(team => team.id !== teamId);

                if (teams.length < initialLength) {
                    saveTeams(); // Save the updated full list (removes team for this user)
                    card.remove(); // Remove the card visually
                    console.log(`Team ID "${teamId}" removed.`);

                    // Update display if list becomes empty
                    if (teams.length === 0) {
                            container.innerHTML = '<p style="text-align: center; width: 100%; padding: 20px; color: #666;">Bạn chưa tạo đội bóng nào.</p>';
                    }
                } else {
                    // This case should ideally not happen if the button exists for a team in the 'teams' array
                    console.warn(`Could not filter out team with ID "${teamId}" during delete confirmation.`);
                }
            } else {
                console.log('Deletion cancelled.');
            }
            return; // Stop further processing
        }

        // --- Handle EDIT ---
        const editButton = target.closest('.edit-btn');
        if (editButton) {
            const card = editButton.closest('.team-card');
            if (!card) return;

            const teamId = card.dataset.identifier;
            if (teamId) {
                console.log(`Redirecting to edit page for team ID: ${teamId}`);
                const editUrl = `./teamManagement/edit.html?id=${encodeURIComponent(teamId)}`;
                window.location.href = editUrl;
            } else {
                console.error("Could not find team ID on the card for editing.");
                alert("Lỗi: Không thể xác định ID của đội để chỉnh sửa.");
            }
            return; // Stop further processing
        }
    });
}

// --- Initial Page Load Logic ---
document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM fully loaded. Initializing team list page...");
    loadTeams();                 // Load user's teams
    loadAndProcessMemberData();  // Load member data & calculate counts
    displayTeams();              // Display cards using team data and member counts
    addActionListeners();        // Attach edit/delete listeners
});