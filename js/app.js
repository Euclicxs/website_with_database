// app.js
// SUPABASE CRUD — CREATE ACCOUNT + SIGN IN VERIFICATION
// ---------------------------------------------------------
// 1. REPLACE WITH YOUR OWN SUPABASE PROJECT CREDENTIALS ↓
// ---------------------------------------------------------
const SUPABASE_URL = 'https://rqaewfcurntthezqqlnb.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJxYWV3ZmN1cm50dGhlenFxbG5iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA5MjQyMzAsImV4cCI6MjA4NjUwMDIzMH0.YT7eDISWcpWJZ3u1zF8O7H-GfZuqRlpSNPeElfKLcTY';

// ========== SUPABASE INIT ==========
let supabaseClient = null;

function initSupabase() {
    try {
        if (typeof window.supabase !== 'undefined' && window.supabase.createClient) {
            supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
                auth: { persistSession: false }   // no local storage, pure CRUD
            });
            console.log('Supabase initialized successfully');
        } else {
            console.error('Supabase JS library not available (window.supabase is undefined)');
        }
    } catch (err) {
        console.error('Error initializing Supabase client:', err);
    }
}

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

    // --- check if username already exists ---
    if (!supabaseClient) {
        setCreateMessage('✗ database unavailable (Supabase not loaded)', false);
        return;
    }
    const { data: existing, error: fetchError } = await supabaseClient
        .from('accounts')
        .select('username')
        .eq('username', username)
        .maybeSingle();

    if (fetchError) {
        console.error('fetch error:', fetchError);
        if (fetchError.code === 'PGRST301' || fetchError.message.includes('RLS')) {
            setCreateMessage('✗ RLS policy error · disable RLS on accounts table', false);
        } else {
            setCreateMessage('✗ database error · ' + (fetchError.message || 'check connection'), false);
        }
        return;
    }

    if (existing) {
        setCreateMessage('✗ username already exists · choose another', false);
        return;
    }

    // --- insert new account (plain text for demo) ---
    const { error: insertError } = await supabaseClient
        .from('accounts')
        .insert([{ username: username, password: password }]);

    if (insertError) {
        console.error('insert error:', insertError);
        if (insertError.code === '23505') { // unique violation
            setCreateMessage('✗ username taken (conflict)', false);
        } else if (insertError.code === 'PGRST301' || insertError.message.includes('RLS')) {
            setCreateMessage('✗ RLS policy error · disable RLS on accounts table', false);
        } else {
            setCreateMessage('✗ creation failed · ' + (insertError.message || 'try again'), false);
        }
        return;
    }

    // --- SUCCESS: green message, then redirect to sign in ---
    setCreateMessage('✓ account created · redirecting to sign in', true);

    // go back to sign in after 1.6 seconds
    setTimeout(() => {
        showSignInPanel(true);
        // optional: show a small green hint on sign in that account was created?
        // we keep it clean — just redirect.
    }, 1600);
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

    // --- fetch account by username ---
    if (!supabaseClient) {
        setSignInMessage('✗ database unavailable (Supabase not loaded)', false);
        return;
    }
    const { data: user, error } = await supabaseClient
        .from('accounts')
        .select('username, password')
        .eq('username', username)
        .maybeSingle();

    if (error) {
        console.error('signin fetch error:', error);
        if (error.code === 'PGRST301' || error.message.includes('RLS')) {
            setSignInMessage('✗ RLS policy error · disable RLS on accounts table', false);
        } else {
            setSignInMessage('✗ database error · ' + (error.message || 'check connection'), false);
        }
        return;
    }

    // --- CASE 1: username does NOT exist → RED (account not created) ---
    if (!user) {
        setSignInMessage('✗ account has not been created yet', false);
        return;
    }

    // --- CASE 2: username exists, password WRONG → RED (credentials incorrect) ---
    if (user.password !== password) {
        setSignInMessage('✗ credentials incorrect · password is wrong', false);
        return;
    }

    // --- CASE 3: username and password CORRECT → GREEN (success) ---
    setSignInMessage('✓ authentication success · account exists and credentials valid', true);
}

// ========== EVENT LISTENERS ==========
function init() {
    console.log('Initializing event listeners...');
    console.log('signInBtn:', signInBtn);
    console.log('createAccountBtn:', createAccountBtn);
    
    // Sign in
    signInBtn.addEventListener('click', (e) => {
        console.log('Sign in button clicked');
        e.preventDefault();
        handleSignIn();
    });

    // Create account
    createAccountBtn.addEventListener('click', (e) => {
        console.log('Create account button clicked');
        e.preventDefault();
        handleCreateAccount();
    });

    // Toggle panels
    goToCreateBtn.addEventListener('click', (e) => {
        console.log('Go to create button clicked');
        e.preventDefault();
        showCreatePanel();
    });

    backToSignInBtn.addEventListener('click', (e) => {
        console.log('Back to sign in button clicked');
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

// ========== TABLE SETUP CHECK ==========
async function checkAndWarnIfTableMissing() {
    if (!supabaseClient) {
        console.warn('Supabase not initialized, skipping table check');
        return;
    }
    const { error } = await supabaseClient.from('accounts').select('id').limit(1);
    if (error && error.code === '42P01') {
        const warnDiv = document.createElement('div');
        warnDiv.style.background = '#fef2f2';
        warnDiv.style.border = '1px solid #e2b6b6';
        warnDiv.style.borderLeft = '6px solid #c43c3c';
        warnDiv.style.padding = '1rem';
        warnDiv.style.marginTop = '1.2rem';
        warnDiv.style.borderRadius = '12px';
        warnDiv.style.fontSize = '0.85rem';
        warnDiv.style.color = '#5b1e1e';
        warnDiv.innerHTML = `<strong>⛔ supabase table 'accounts' missing</strong><br>
        Go to your Supabase SQL editor and run:<br>
        <code style="background: #fff1f1; padding: 0.3rem 0.6rem; display: inline-block; margin-top: 0.5rem; border-radius: 6px;">
        CREATE TABLE accounts (<br>
        &nbsp;&nbsp;id BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,<br>
        &nbsp;&nbsp;username TEXT UNIQUE NOT NULL,<br>
        &nbsp;&nbsp;password TEXT NOT NULL,<br>
        &nbsp;&nbsp;created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()<br>
        );
        </code>`;
        document.querySelector('.frame').appendChild(warnDiv);
    }
}

// ========== START ==========
// make sure sign in panel is visible and messages hidden
window.onload = function() {
    initSupabase(); // Initialize Supabase first
    showSignInPanel(true);
    init();
    // check if table exists (non-blocking)
    setTimeout(checkAndWarnIfTableMissing, 500);
};

// ------------------------------------------------------------
// YOU MUST CREATE THE 'accounts' TABLE IN SUPABASE SQL EDITOR!
// COPY THE SQL FROM THE WARNING ABOVE, OR FROM HERE:
/*
CREATE TABLE accounts (
    id BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
*/
// ------------------------------------------------------------
