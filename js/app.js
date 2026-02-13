// app.js
// PHP/MySQL CRUD — CREATE ACCOUNT + SIGN IN VERIFICATION
// ---------------------------------------------------------

// ========== DOM ELEMENTS ==========
const signInPanel = document.getElementById('signInPanel');
const createPanel = document.getElementById('createPanel');

// Sign in
const signInUsername = document.getElementById('signInUsername');
const signInPassword = document.getElementById('signInPassword');
const signInBtn = document.getElementById('signInBtn');
const signInMsg = document.getElementById('signInMessage');

// Create account
const createUsername = document.getElementById('createUsername');
const createPassword = document.getElementById('createPassword');
const createAccountBtn = document.getElementById('createAccountBtn');
const createMsg = document.getElementById('createMessage');

// Toggle buttons
const goToCreateBtn = document.getElementById('goToCreateBtn');
const backToSignInBtn = document.getElementById('backToSignInBtn');

// ========== HELPER: MESSAGES ==========
function hideAllMessages() {
    signInMsg.style.display = 'none';
    signInMsg.className = 'message';
    signInMsg.innerText = '';
    createMsg.style.display = 'none';
    createMsg.className = 'message';
    createMsg.innerText = '';
}

// Sign in message (green = success, red = error)
function setSignInMessage(text, isSuccess) {
    signInMsg.className = 'message ' + (isSuccess ? 'green' : 'red');
    signInMsg.innerText = text;
    signInMsg.style.display = 'block';
}

// Create account message
function setCreateMessage(text, isSuccess) {
    createMsg.className = 'message ' + (isSuccess ? 'green' : 'red');
    createMsg.innerText = text;
    createMsg.style.display = 'block';
}

// ========== VALIDATION ==========
function isValidUsername(u) {
    return u && u.trim().length >= 1 && /^[a-zA-Z0-9_]+$/.test(u);
}
function isValidPassword(p) {
    return p && p.length >= 4;
}

// ========== UI TOGGLE ==========
function showCreatePanel() {
    hideAllMessages();
    signInPanel.style.display = 'none';
    createPanel.style.display = 'block';
    // clear create fields
    createUsername.value = '';
    createPassword.value = '';
}

function showSignInPanel(clearFields = true) {
    hideAllMessages();
    createPanel.style.display = 'none';
    signInPanel.style.display = 'block';
    if (clearFields) {
        signInUsername.value = '';
        signInPassword.value = '';
    }
}

// ========== 1. CREATE ACCOUNT ==========
async function handleCreateAccount() {
    hideAllMessages();
    const username = createUsername.value.trim();
    const password = createPassword.value.trim();

    // --- validation ---
    if (!username || !isValidUsername(username)) {
        setCreateMessage('✗ username: letters, numbers, underscore only', false);
        return;
    }
    if (!password || !isValidPassword(password)) {
        setCreateMessage('✗ password: at least 4 characters', false);
        return;
    }

    // --- send to PHP backend ---
    try {
        const response = await fetch('create_account.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: username,
                password: password
            })
        });

        const result = await response.json();

        if (result.success) {
            setCreateMessage(result.message, true);
            // Redirect to sign in after 1.6 seconds
            setTimeout(() => {
                showSignInPanel(true);
            }, 1600);
        } else {
            setCreateMessage(result.message, false);
        }
    } catch (error) {
        console.error('Error:', error);
        setCreateMessage('✗ connection error · check if XAMPP is running', false);
    }
}

// ========== 2. SIGN IN ==========
async function handleSignIn() {
    hideAllMessages();
    const username = signInUsername.value.trim();
    const password = signInPassword.value.trim();

    if (!username || !password) {
        setSignInMessage('please enter username and password', false);
        return;
    }

    // --- send to PHP backend ---
    try {
        const response = await fetch('sign_in.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: username,
                password: password
            })
        });

        const result = await response.json();

        if (result.success) {
            setSignInMessage(result.message, true);
        } else {
            setSignInMessage(result.message, false);
        }
    } catch (error) {
        console.error('Error:', error);
        setSignInMessage('✗ connection error · check if XAMPP is running', false);
    }
}

// ========== EVENT LISTENERS ==========
function init() {
    console.log('Initializing event listeners...');
    
    // Sign in
    signInBtn.addEventListener('click', (e) => {
        e.preventDefault();
        handleSignIn();
    });

    // Create account
    createAccountBtn.addEventListener('click', (e) => {
        e.preventDefault();
        handleCreateAccount();
    });

    // Toggle panels
    goToCreateBtn.addEventListener('click', (e) => {
        e.preventDefault();
        showCreatePanel();
    });

    backToSignInBtn.addEventListener('click', (e) => {
        e.preventDefault();
        showSignInPanel(true);
    });

    // Enter key submission
    signInPassword.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleSignIn();
        }
    });
    createPassword.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleCreateAccount();
        }
    });
}

// ========== START ==========
window.onload = function() {
    showSignInPanel(true);
    init();
    console.log('App initialized - using PHP/MySQL backend');
};
