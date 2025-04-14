  // submenu-user_info
  function toggleDropdown() {
    var menu = document.getElementById("dropdownMenu");
    if (menu) {
    // Check if the element exists
    menu.style.display =
        menu.style.display === "block" ? "none" : "block";
    } else {
    console.warn("Element with ID 'dropdownMenu' not found.");
    }
}

// Ẩn dropdown nếu click ra ngoài
window.addEventListener("click", function (e) {
    var menu = document.getElementById("dropdownMenu");
    var userInfo = document.querySelector(".user-info");

    // Check if both elements exist before proceeding
    if (menu && userInfo) {
    // Check if the click was outside the userInfo element AND outside the dropdown menu itself
    if (!userInfo.contains(e.target) && !menu.contains(e.target)) {
        menu.style.display = "none";
    }
    } else {
    // Optionally log a warning if elements are missing
    // console.warn("Either 'dropdownMenu' or '.user-info' element not found for outside click handler.");
    }
});