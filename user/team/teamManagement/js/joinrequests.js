// --- LOGIC YÊU CẦU THAM GIA ---

const TEAM_MEMBERS_STORAGE_KEY = 'teamMembersData';

// Dữ liệu mẫu
const allJoinRequests = [
  {
    id: 1, userId: 101, teamId: 'team-1', name: 'Khải Dương', dob: '2005-04-05', positionField: 'Tiền vệ', positionRole: 'Cầu thủ',
    jerseyNumber: 7, 
    avatar: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUA...',
    address: '123 Đường ABC, Quận XYZ, TP HCM', phone: '0901234567', facebook: 'khai.duong.fb', email: 'khai2892005@gmail.com',
    requestDate: '2025-04-05', status: 'pending'
  },
  {
    id: 2, userId: 102, teamId: 'team-1', name: 'Trần Văn B', dob: '1999-11-20', positionField: 'Hậu vệ', positionRole: 'Cầu thủ',
    jerseyNumber: 4,
    avatar: 'images/avatar2.png',
    address: '456 Đường DEF, Quận UVW, Hà Nội', phone: '0987654321', facebook: 'tran.van.b', email: 'van.b@email.com',
    requestDate: '2025-04-06', status: 'pending'
  },
  {
    id: 3, userId: 103, teamId: 'team-2', name: 'Lê Thị C', dob: '2001-01-15', positionField: '', positionRole: 'Quản lý',
    jerseyNumber: null, 
    avatar: null,
    address: '789 Đường GHI, Quận RST, Đà Nẵng', phone: '0123456789', facebook: '', email: 'le.thi.c@email.com',
    requestDate: '2025-04-07', status: 'pending'
  },
  {
    id: 4, userId: 104, teamId: 'team-4', name: 'Phạm Văn D', dob: '2003-07-10', positionField: 'Tiền đạo', positionRole: 'Cầu thủ',
    jerseyNumber: 11, 
    avatar: null,
    address: '101 Đường JKL, Quận MNO, TP HCM', phone: '0112233445', facebook: 'pham.van.d', email: 'van.d@email.com',
    requestDate: '2025-04-08', status: 'pending'
  },
  {
    id: 5, userId: 105, teamId: 'team-3', name: 'Hoàng Văn E', dob: '2000-02-29', positionField: 'Thủ môn', positionRole: 'Cầu thủ',
    jerseyNumber: 1, 
    avatar: 'images/avatar5.png',
    address: '202 Đường PQR, Quận STU, Hà Nội', phone: '0556677889', facebook: 'hoang.van.e', email: 'van.e@email.com',
    requestDate: '2025-04-09', status: 'pending'
  }
];

// --- Biến toàn cục để lưu bộ lọc ID đội hiện tại ---
let currentTeamIdFilter = null;

// Phần tử DOM
const tableBody = document.getElementById('joinRequestTableBody');
const modal = document.getElementById('memberDetailsModal');
const modalRequestId = document.getElementById('modal-request-id');
const modalUserId = document.getElementById('modal-user-id');
const modalTeamId = document.getElementById('modal-team-id');
const modalName = document.getElementById('modal-name');
const modalJerseyNumber = document.getElementById('modal-jerseyNumber');
const modalRole = document.getElementById('modal-role');
const modalPositionField = document.getElementById('modal-positionField');
const modalDob = document.getElementById('modal-dob');
const modalPhone = document.getElementById('modal-phone');
const modalAddress = document.getElementById('modal-address');
const modalFacebook = document.getElementById('modal-facebook');
const modalEmail = document.getElementById('modal-email');
const modalAvatarImg = document.getElementById('modal-avatar-img');
const modalAcceptButton = document.getElementById('modalAcceptButton');

// --- Hàm ---

function getTeamIdFromUrl() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('id');
}

function filterRequestsByTeam(teamId) {
  if (!teamId) {
    console.warn("Không tìm thấy teamId trong URL. Không hiển thị yêu cầu nào.");
    return [];
  }
  return allJoinRequests.filter(request => request.teamId === teamId);
}

function formatDate(dateString) {
  if (!dateString) return 'N/A';
  try {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    if (isNaN(day) || isNaN(month) || isNaN(year)) return dateString; // Kiểm tra cơ bản
    return `${day}-${month}-${year}`;
  } catch (e) {
    console.error("Lỗi định dạng ngày:", dateString, e);
    return dateString;
  }
}

function renderJoinRequestsTable(requestsToRender) {
  if (!tableBody) return;
  tableBody.innerHTML = '';

  if (!requestsToRender || requestsToRender.length === 0) {
    const row = tableBody.insertRow();
    const cell = row.insertCell();
    cell.colSpan = 5;
    cell.textContent = "Không có yêu cầu tham gia nào cho đội này.";
    cell.style.textAlign = 'center';
    cell.style.padding = '20px';
    cell.style.color = '#666';
    return;
  }

  requestsToRender.forEach((request, index) => {
    const row = tableBody.insertRow();
    row.setAttribute('data-request-id', request.id);

    const cellStt = row.insertCell();
    cellStt.textContent = index + 1;

    const cellName = row.insertCell();
    cellName.textContent = request.name || 'N/A';

    const cellDate = row.insertCell();
    cellDate.textContent = formatDate(request.requestDate);

    const cellStatus = row.insertCell();
    const statusBadge = document.createElement('span');
    statusBadge.classList.add('status-badge');
    if (request.status === 'pending') {
      statusBadge.classList.add('status-pending');
      statusBadge.textContent = 'Đang duyệt';
    } else if (request.status === 'approved') {
      statusBadge.classList.add('status-approved');
      statusBadge.textContent = 'Đã duyệt';
    } else if (request.status === 'rejected') {
      statusBadge.classList.add('status-rejected');
      statusBadge.textContent = 'Từ chối';
    } else {
      statusBadge.textContent = request.status;
    }
    cellStatus.appendChild(statusBadge);

    const cellAction = row.insertCell();
    if (request.status === 'pending') {
      const actionIcon = document.createElement('i');
      actionIcon.className = 'fas fa-eye action-icon';
      actionIcon.title = 'Xem chi tiết';
      actionIcon.onclick = () => openMemberDetailsModal(request.id);
      cellAction.appendChild(actionIcon);
    } else {
      cellAction.textContent = '-';
    }
  });
}

function openMemberDetailsModal(requestId) {
  const request = allJoinRequests.find(req => req.id === requestId);
  if (!request) {
    console.error("Không tìm thấy yêu cầu:", requestId);
    alert("Không thể tải thông tin yêu cầu.");
    return;
  }

  modalRequestId.value = request.id;
  modalUserId.value = request.userId;
  modalTeamId.value = request.teamId;
  modalName.value = request.name || '';
  modalRole.value = request.positionRole || '';
  modalPositionField.value = request.positionField || '';
  modalDob.value = formatDate(request.dob) || '';
  modalPhone.value = request.phone || '';
  modalAddress.value = request.address || '';
  modalFacebook.value = request.facebook || '';
  modalEmail.value = request.email || '';
  modalAvatarImg.src = request.avatar || 'images/placeholder-avatar.png';
  modalJerseyNumber.value = request.jerseyNumber !== null ? request.jerseyNumber : '';

  const modalRejectButton = document.getElementById('modalRejectButton');

  if (request.status === 'pending') {
    if (modalAcceptButton) modalAcceptButton.style.display = 'inline-block';
    if (modalRejectButton) modalRejectButton.style.display = 'inline-block';
  } else {
    if (modalAcceptButton) modalAcceptButton.style.display = 'none';
    if (modalRejectButton) modalRejectButton.style.display = 'none';
  }

  if(modal) {
    modal.style.display = 'flex';
    setTimeout(() => modal.classList.add('show'), 10);
  }
}

function closeModal() {
  if(modal) {
    modal.classList.remove('show');
    setTimeout(() => {
      modal.style.display = 'none';
    }, 300);
  }
}

function acceptMember() {
  const requestId = parseInt(modalRequestId.value, 10);
  if (!requestId) {
    alert("Không tìm thấy thông tin yêu cầu.");
    return;
  }

  const requestIndex = allJoinRequests.findIndex(req => req.id === requestId);
  if (requestIndex === -1) {
    alert("Yêu cầu không tồn tại hoặc đã được xử lý.");
    closeModal();
    return;
  }

  const requestData = allJoinRequests[requestIndex];

  const memberData = {
    id: Date.now(),
    teamId: requestData.teamId,
    userId: requestData.userId,
    name: requestData.name,
    dob: requestData.dob,
    positionField: requestData.positionField,
    positionRole: requestData.positionRole,
    avatar: requestData.avatar,
    address: requestData.address,
    phone: requestData.phone,
    facebook: requestData.facebook,
    email: requestData.email,
    height: null,
    weight: null,
    shirtSize: null,
    jerseyNumber: modalJerseyNumber.value !== '' ? parseInt(modalJerseyNumber.value, 10) : null,
    isForeigner: false,
  };

  try {
    const existingMembers = JSON.parse(localStorage.getItem(TEAM_MEMBERS_STORAGE_KEY) || '[]');
    const alreadyExists = existingMembers.some(member => member.userId === memberData.userId && member.teamId === memberData.teamId);

    if (alreadyExists) {
      alert(`Thành viên ${memberData.name} (ID: ${memberData.userId}) đã tồn tại trong đội ${memberData.teamId}. Yêu cầu sẽ được đánh dấu đã duyệt.`);
    } else {
      existingMembers.push(memberData);
      localStorage.setItem(TEAM_MEMBERS_STORAGE_KEY, JSON.stringify(existingMembers));
      console.log('Thành viên đã được thêm vào localStorage:', memberData);
      console.log('teamMembersData đã cập nhật:', existingMembers);
      alert(`Đã duyệt và thêm thành viên "${requestData.name}" vào đội ${requestData.teamId}.`);
    }

    allJoinRequests[requestIndex].status = 'approved';

    const updatedFilteredRequests = filterRequestsByTeam(currentTeamIdFilter);
    renderJoinRequestsTable(updatedFilteredRequests);

  } catch (error) {
    console.error("Lỗi lưu thành viên vào localStorage:", error);
    alert("Có lỗi xảy ra khi lưu thông tin thành viên. Trạng thái yêu cầu chưa được cập nhật.");
  }

  closeModal();
}

function rejectMember() {
  const requestId = parseInt(modalRequestId.value, 10);
  if (!requestId) {
    alert("Không tìm thấy thông tin yêu cầu.");
    return;
  }

  const requestIndex = allJoinRequests.findIndex(req => req.id === requestId);
  if (requestIndex === -1) {
    alert("Yêu cầu không tồn tại hoặc đã được xử lý.");
    closeModal();
    return;
  }

  const requestData = allJoinRequests[requestIndex];
  if (!confirm(`Bạn có chắc chắn muốn từ chối yêu cầu tham gia của "${requestData.name}"?`)) {
    return; // Người dùng hủy
  }

  try {
    allJoinRequests[requestIndex].status = 'rejected'; // Thay đổi trạng thái

    const updatedFilteredRequests = filterRequestsByTeam(currentTeamIdFilter);
    renderJoinRequestsTable(updatedFilteredRequests); // Cập nhật giao diện bảng

    console.log(`Trạng thái yêu cầu ID ${requestId} đã cập nhật thành 'rejected'.`);
    alert(`Đã từ chối yêu cầu tham gia của "${requestData.name}".`);

  } catch (error) {
    console.error("Lỗi cập nhật trạng thái yêu cầu:", error);
    alert("Có lỗi xảy ra khi cập nhật trạng thái yêu cầu.");
  }

  closeModal();
}

// --- Thiết lập Ban đầu ---
document.addEventListener("DOMContentLoaded", () => {
  currentTeamIdFilter = getTeamIdFromUrl();
  const filteredRequests = filterRequestsByTeam(currentTeamIdFilter);

  renderJoinRequestsTable(filteredRequests);

  window.addEventListener('click', (event) => {
    if (event.target == modal) {
      closeModal();
    }
  });
});