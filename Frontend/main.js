// Configuration
const API_BASE = window.location.hostname === 'localhost' ? 'http://localhost:3000/api' : '/api';

// Global variables
let registrations = [];
let users = [];
let attendanceRecords = [];
let currentUser = null;
let currentEditId = null;
let editingUserId = null;

// DOM Elements
const loginScreen = document.getElementById('loginScreen');
const appContainer = document.getElementById('appContainer');
const loginForm = document.getElementById('loginForm');
const registrationForm = document.getElementById('registrationForm');
const recentDataDisplay = document.getElementById('recentDataDisplay');
const fullDataDisplay = document.getElementById('fullDataDisplay');
const submitBtn = document.getElementById('submitBtn');
const cancelEdit = document.getElementById('cancelEdit');
const exportSearchInput = document.getElementById('exportSearchInput');
const exportSectionSelect = document.getElementById('exportSectionSelect');
const exportFileName = document.getElementById('exportFileName');
const currentUserSpan = document.getElementById('currentUser');
const userRoleSpan = document.getElementById('userRole');
const totalHouseholdsSpan = document.getElementById('totalHouseholds');
const currentSectionHouseholdsSpan = document.getElementById('currentSectionHouseholds');
const currentSectionLabelSpan = document.getElementById('currentSectionLabel');
const sectionNameSelect = document.getElementById('sectionName');
const kebelleSelect = document.getElementById('kebelle');
const userManagementNav = document.getElementById('userManagementNav');
const userManagementPage = document.getElementById('userManagementPage');
const userListBody = document.getElementById('userListBody');
const addUserForm = document.getElementById('addUserForm');
const passwordError = document.getElementById('passwordError');
const passwordInput = document.getElementById('password');
const successMessage = document.getElementById('successMessage');
const successText = document.getElementById('successText');
const attendanceDate = document.getElementById('attendanceDate');
const attendanceDataContainer = document.getElementById('attendanceDataContainer');
const attendanceDataDisplay = document.getElementById('attendanceDataDisplay');
const attendanceSearchInput = document.getElementById('attendanceSearchInput');
const exportAttendanceFileName = document.getElementById('exportAttendanceFileName');

// Initialize the application
async function init() {
    try {
        // Load initial data
        const [regs, usersData] = await Promise.all([
            fetchRegistrations(),
            fetchUsers()
        ]);
        
        registrations = regs;
        users = usersData;
        
        updateSectionDropdown();
        renderRecentData();
        renderFullData();
        updateStats();
        
        // Set up section and kebelle auto-selection for users
        if (currentUser && currentUser.section) {
            const sectionNumber = currentUser.section.split(' ')[1];
            sectionNameSelect.value = currentUser.section;
            kebelleSelect.value = sectionNumber;
            
            if (currentUser.role !== "admin") {
                sectionNameSelect.disabled = true;
                kebelleSelect.disabled = true;
            }
        }
        
        // Show user management section for admin
        if (currentUser && currentUser.role === "admin") {
            userManagementNav.classList.remove('hidden');
            renderUserList();
        } else {
            userManagementNav.classList.add('hidden');
        }
    } catch (error) {
        console.error("Initialization error:", error);
        showErrorMessage("Failed to load application data");
    }
}

// API Functions
async function fetchRegistrations() {
    const response = await fetch(`${API_BASE}/registrations`);
    if (!response.ok) throw new Error("Failed to fetch registrations");
    return await response.json();
}

async function saveRegistration(data) {
    const method = data.id ? 'PUT' : 'POST';
    const url = data.id ? `${API_BASE}/registrations/${data.id}` : `${API_BASE}/registrations`;
    
    const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error("Failed to save registration");
    return await response.json();
}

async function deleteRegistration(id) {
    const response = await fetch(`${API_BASE}/registrations/${id}`, {
        method: 'DELETE'
    });
    if (!response.ok) throw new Error("Failed to delete registration");
    return await response.json();
}

async function fetchUsers() {
    const response = await fetch(`${API_BASE}/users`);
    if (!response.ok) throw new Error("Failed to fetch users");
    return await response.json();
}

async function saveUser(data) {
    const method = data.username ? 'PUT' : 'POST';
    const url = data.username ? `${API_BASE}/users/${data.username}` : `${API_BASE}/users`;
    
    const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error("Failed to save user");
    return await response.json();
}

async function deleteUser(username) {
    const response = await fetch(`${API_BASE}/users/${username}`, {
        method: 'DELETE'
    });
    if (!response.ok) throw new Error("Failed to delete user");
    return await response.json();
}

async function fetchAttendance(date) {
    const response = await fetch(`${API_BASE}/attendance?date=${date}`);
    if (!response.ok) throw new Error("Failed to fetch attendance");
    return await response.json();
}

async function saveAttendanceRecords(date, presentIds) {
    const response = await fetch(`${API_BASE}/attendance`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date, registrationIds: presentIds })
    });
    if (!response.ok) throw new Error("Failed to save attendance");
    return await response.json();
}

// (All other functions from previous versions, modified to use API calls)

// Initialize on page load
if (document.readyState === 'complete') {
    init();
} else {
    window.addEventListener('load', init);
}