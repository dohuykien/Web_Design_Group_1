// --- UI Update Functions ---
function isLoggedIn() {
    return !!localStorage.getItem('userProfile_id');
}


function clearUserProfile() {
    localStorage.removeItem('userProfile_id');
    localStorage.removeItem('userProfile_username');
    localStorage.removeItem('userProfile_email');
    localStorage.removeItem('userProfile_firstname');
    localStorage.removeItem('userProfile_lastname');
    localStorage.removeItem('userProfile_address');
    localStorage.removeItem('userProfile_password');
    localStorage.removeItem('userProfile_avatar');
    localStorage.removeItem('userProfile_phone');
}



// Update header based on login status
function updateHeaderUI() {
    const authDropdown = document.getElementById('auth-dropdown');
    const authToggle = document.getElementById('auth-toggle'); // Get the main toggle button
    if (!authDropdown || !authToggle) {
        console.error("Auth dropdown or toggle button not found!");
        return;
    }

    const defaultAvatar = '/images/thanaftai.jpg'; // <<<--- PATH TO YOUR DEFAULT AVATAR

    if (isLoggedIn()) {
        const username = localStorage.getItem('userProfile_username') || 'User';
        const userAvatar = localStorage.getItem('userProfile_avatar'); // Might be null or Base64 string

        // Determine avatar source: use stored Base64 or the default image path
        const avatarSrc = (userAvatar && userAvatar.startsWith('data:image')) ? userAvatar : defaultAvatar;

        // Update the main toggle button text/icon if desired (optional)
        // authToggle.innerHTML = '👤'; // Or potentially the first letter of username

        // Construct the logged-in state HTML
        authDropdown.innerHTML = `
            <span class="user-info">
                <img src="${avatarSrc}" alt="Avatar" class="user-avatar">
                <a href="/user/Dashboard.html">${username}</a>
            </span>
            <button id="logoutBtn">ĐĂNG XUẤT</button>
        `;

        // Add event listener for the newly created logout button
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', handleLogout);
        } else {
            console.error("Logout button could not be found after UI update.");
        }

        const logout2Btn = document.getElementById('logout2Btn');
        if (logout2Btn) {
            logout2Btn.addEventListener('click', handleLogout);
        } else {
            console.error("Logout button could not be found after UI update.");
        }
    } else {
        // Update the main toggle button back to default if you changed it
        authToggle.innerHTML = '<div id="openModal">👤<div>'; // Or your default icon/text

        // Construct the logged-out state HTML
        authDropdown.innerHTML = `
            <button id="openRegisterBtn">ĐĂNG KÝ</button> |
            <button id="openLoginBtn">ĐĂNG NHẬP</button>
        `;

        // Re-attach listeners for modal trigger buttons
        // Ensures they work after being removed and re-added by innerHTML
        attachModalTriggers();
    }
}

function handleLogout() {
    clearUserProfile();
    console.log('User logged out.');
    try { 
        location.reload();
    } catch (e) {
        console.error("Error during location.reload:", e);
    }
}

document.addEventListener('DOMContentLoaded', () => {

    // --- localStorage Helper Functions ---

    // Get users array from localStorage
    function getUsers() {
        const usersJson = localStorage.getItem('users');
        try {
            return usersJson ? JSON.parse(usersJson) : [];
        } catch (e) {
            console.error("Error parsing users JSON from localStorage", e);
            return []; // Return empty array on error
        }
    }

    // Save users array to localStorage
    function saveUsers(usersArray) {
        localStorage.setItem('users', JSON.stringify(usersArray));
    }

    // Find user by email
    function findUserByEmail(email, usersArray) {
        return usersArray.find(user => user.email.toLowerCase() === email.toLowerCase());
    }

    // Get the next available user ID
    function getNextUserId(usersArray) {
        if (!usersArray || usersArray.length === 0) {
            return 1;
        }
        // Find the highest existing ID and add 1
        const maxId = usersArray.reduce((max, user) => (user.id > max ? user.id : max), 0);
        return maxId + 1;
    }

    // Store logged-in user's profile info
    function updateUserProfile(user) {
        if (!user) return;
        localStorage.setItem('userProfile_id', user.id);
        localStorage.setItem('userProfile_username', user.username);
        localStorage.setItem('userProfile_email', user.email);
        localStorage.setItem('userProfile_firstname', user.firstname || ''); // Handle potential null
        localStorage.setItem('userProfile_lastname', user.lastname || '');   // Handle potential null
        localStorage.setItem('userProfile_address', user.address || '');     // Handle potential null
        // WARNING: Storing password in localStorage is insecure! Only for demo purposes.
        localStorage.setItem('userProfile_password', user.password);
        localStorage.setItem('userProfile_avatar', user.avatar || '');       // Handle potential null
        // Add phone if available, otherwise empty string
        localStorage.setItem('userProfile_phone', user.phone || '');
    }

    // Clear logged-in user's profile info (on logout)


    // Check if a user is currently logged in

    // --- UI Update Functions ---

     // Helper to display messages within forms
     function displayMessage(formId, message, isError = false) {
        const messageElement = document.getElementById(`${formId}-message`);
        if (messageElement) {
            messageElement.textContent = message;
            messageElement.className = `form-message ${isError ? 'error' : 'success'}`;
             // Clear message after a few seconds
             setTimeout(() => {
                 messageElement.textContent = '';
                 messageElement.className = 'form-message';
             }, 5000); // Clear after 5 seconds
        }
    }


    // --- Event Handlers ---

    // Handle user registration
    function handleRegistration(event) {
        event.preventDefault(); // Prevent default form submission
        const nameInput = document.getElementById('signup-name');
        const emailInput = document.getElementById('signup-email');
        const passwordInput = document.getElementById('signup-password');
        const loginModal = document.getElementById('loginout'); // Get modal element

        const name = nameInput.value.trim();
        const email = emailInput.value.trim();
        const password = passwordInput.value; // Get password as is

        // Basic validation
        if (!name || !email || !password) {
            displayMessage('signup', 'Vui lòng điền đầy đủ thông tin.', true);
            return;
        }
        // Very basic email format check (consider a more robust regex)
        if (!/\S+@\S+\.\S+/.test(email)) {
             displayMessage('signup', 'Định dạng email không hợp lệ.', true);
             return;
        }

        const users = getUsers();
        const existingUser = findUserByEmail(email, users);

        if (existingUser) {
            displayMessage('signup', 'Email này đã được đăng ký.', true);
        } else {
            const nextId = getNextUserId(users);
            const newUser = {
                id: nextId,
                username: name, // Using the 'Name' field as username
                email: email,
                firstname: '', // Set empty initially
                lastname: '',  // Set empty initially
                address: '',   // Set empty initially
                // !!! SECURITY WARNING: Storing plain text passwords is highly insecure!
                // In a real application, ALWAYS hash passwords securely on the server-side.
                password: password,
                avatar: null, // Set to null or a default placeholder base64 string
                phone: ''      // Add phone field, empty initially
            };

            users.push(newUser);
            saveUsers(users);
            console.log('User registered:', newUser);
            displayMessage('signup', 'Đăng ký thành công! Đang đăng nhập...', false);

            // Automatically log in the user
            updateUserProfile(newUser);
            updateHeaderUI();

            // Close modal after a short delay
            setTimeout(() => {
                if (loginModal) loginModal.style.display = 'none';
                 // Clear form fields after successful registration
                 nameInput.value = '';
                 emailInput.value = '';
                 passwordInput.value = '';
                 displayMessage('signup', ''); // Clear message area
            }, 1500); // Wait 1.5 seconds
            location.reload();
        }
    }

    // Handle user login
    function handleLogin(event) {
        event.preventDefault();
        const emailInput = document.getElementById('signin-email');
        const passwordInput = document.getElementById('signin-password');
        const loginModal = document.getElementById('loginout');

        const email = emailInput.value.trim();
        const password = passwordInput.value;

        if (!email || !password) {
             displayMessage('signin', 'Vui lòng nhập email và mật khẩu.', true);
            return;
        }

        const users = getUsers();
        const user = findUserByEmail(email, users);

        // !!! SECURITY WARNING: Comparing plain text passwords. See registration warning.
        if (user && user.password === password) {
            displayMessage('signin', 'Đăng nhập thành công!', false);
            updateUserProfile(user);
            updateHeaderUI();

             // Close modal after a short delay
            setTimeout(() => {
                 if (loginModal) loginModal.style.display = 'none';
                 // Clear form fields
                 emailInput.value = '';
                 passwordInput.value = '';
                 displayMessage('signin', ''); // Clear message area
            }, 1000); // Wait 1 second
            location.reload();
        } else {
            displayMessage('signin', 'Email hoặc mật khẩu không đúng.', true);
             // Optionally clear profile in case of failed login attempt after previous success?
             // clearUserProfile(); // Uncomment if strict logout on failure is desired
             // updateHeaderUI();   // Uncomment if strict logout on failure is desired
        }
    }

    // Handle user logout



    // --- Modal Loading and Initialization ---

    // Function to attach listeners to modal trigger buttons (Login/Register)
    // This needs to be callable after the header UI is updated (e.g., on logout)
    function attachModalTriggers() {
         const openLoginBtn = document.getElementById("openLoginBtn");
         const openRegisterBtn = document.getElementById("openRegisterBtn");
         const loginModal = document.getElementById("loginout");
         const container = document.getElementById('container'); // Needed to set panel
         const openModal = document.getElementById('openModal');

         if (openLoginBtn && loginModal && container) {
            openLoginBtn.addEventListener("click", () => {
                loginModal.style.display = "flex";
                if(container) container.classList.remove("active"); // Show sign-in panel
                 displayMessage('signin', ''); // Clear any previous messages
                 displayMessage('signup', '');
            });
         }
         if (openRegisterBtn && loginModal && container) {
             openRegisterBtn.addEventListener("click", () => {
                 loginModal.style.display = "flex";
                 if(container) container.classList.add("active"); // Show sign-up panel
                 displayMessage('signin', ''); // Clear any previous messages
                 displayMessage('signup', '');
             });
         }
         if (openModal && loginModal && container) {
             openModal.addEventListener("click", () => {
                 loginModal.style.display = "flex";
                 if(container) container.classList.remove("active"); // Show sign-in panel
                 displayMessage('signin', ''); // Clear any previous messages
                 displayMessage('signup', '');
             });
         }
    }


    async function loadLoginModal() {
        try {
            // Ensure the placeholder exists before fetching
            const placeholder = document.getElementById('modal-placeholder');
             if (!placeholder) {
                console.error("Modal placeholder div not found in index.html!");
                return; // Stop if placeholder is missing
             }

            const response = await fetch('login_modal.html'); // Adjust path if needed
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const html = await response.text();

            placeholder.innerHTML = html; // Inject the modal HTML
            console.log("Login modal HTML loaded.");
            initializeLoginModalLogic(); // Initialize listeners AFTER loading
        } catch (error) {
            console.error('Error loading login modal:', error);
        }
    }

    function initializeLoginModalLogic() {
        const container = document.getElementById('container');
        const registerBtn = document.getElementById('register'); // Toggle button inside modal
        const loginBtn = document.getElementById('login');       // Toggle button inside modal
        const loginModal = document.getElementById("loginout");
        const closeBtn = loginModal ? loginModal.querySelector(".close-btn") : null;
        const signUpForm = document.getElementById('signUpForm');
        const signInForm = document.getElementById('signInForm');


        if (!container || !registerBtn || !loginBtn || !loginModal || !closeBtn || !signUpForm || !signInForm) {
            console.error("One or more elements needed for login modal core functionality were not found. Check IDs in login_modal.html.");
            return;
        }
        console.log("Initializing login modal event listeners...");

        // Toggle between Sign In / Sign Up panels
        registerBtn.addEventListener('click', () => container.classList.add('active'));
        loginBtn.addEventListener('click', () => container.classList.remove('active'));

        // Attach form submission handlers
        signUpForm.addEventListener('submit', handleRegistration);
        signInForm.addEventListener('submit', handleLogin);

        // Close modal using the 'X' button
        closeBtn.addEventListener("click", () => {
            loginModal.style.display = "none";
             // Clear messages when closing manually
             displayMessage('signin', '');
             displayMessage('signup', '');
        });

        // Close modal by clicking outside
        window.addEventListener("click", (event) => {
            if (event.target === loginModal) {
                loginModal.style.display = "none";
                 // Clear messages when closing manually
                 displayMessage('signin', '');
                 displayMessage('signup', '');
            }
        });

        // --- ADDED LOGIC: Auto-open modal if not logged in ---
        if (!isLoggedIn()) {
            console.log("User not logged in, automatically opening login modal.");
            loginModal.style.display = "flex"; // Or "block", depending on your CSS for showing it
            // Optional: Ensure the sign-in panel is active by default
            if (container) {
                 container.classList.remove("active");
            }
            // Optional: Clear any stray messages
            displayMessage('signin', '');
            displayMessage('signup', '');
        }
        // --- END ADDED LOGIC ---

        // Attach triggers now that modal exists (important for header buttons)
         attachModalTriggers();

    }

    // --- Initialize Page ---

    loadLoginModal(); // Load the modal HTML first
    updateHeaderUI(); // Set initial header state (logged in or out)

    // --- Other existing page functionalities ---
    // (Your existing code for menus, sliders, etc.)
    // ...

});