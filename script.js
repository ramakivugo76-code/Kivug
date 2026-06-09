// ===========================
// Student Registration System
// ===========================

// Get DOM Elements
const registrationForm = document.getElementById('registrationForm');
const studentsList = document.getElementById('studentsList');

// Initialize - Load students from localStorage
document.addEventListener('DOMContentLoaded', () => {
    loadStudents();
    console.log('✅ Student Registration System Loaded');
});

// ===========================
// Form Validation Functions
// ===========================

function validateFullName(fullName) {
    const nameRegex = /^[a-zA-Z\s]{3,}$/;
    return nameRegex.test(fullName.trim());
}

function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email.trim());
}

function validatePhone(phone) {
    const phoneRegex = /^[0-9]{10}$/;
    return phoneRegex.test(phone.replace(/\s+/g, ''));
}

function validateDateOfBirth(dob) {
    const dobDate = new Date(dob);
    const today = new Date();
    const age = today.getFullYear() - dobDate.getFullYear();
    
    if (age < 15 || age > 100) {
        return false;
    }
    return true;
}

function validateAddress(address) {
    return address.trim().length >= 5;
}

function clearErrors() {
    document.querySelectorAll('.error-message').forEach(error => {
        error.textContent = '';
    });
}

function showError(fieldId, message) {
    const errorElement = document.getElementById(fieldId + 'Error');
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.animation = 'none';
        setTimeout(() => {
            errorElement.style.animation = 'slideInLeft 0.3s ease-out';
        }, 10);
    }
}

// ===========================
// Form Submission Handler
// ===========================

registrationForm.addEventListener('submit', (e) => {
    e.preventDefault();
    clearErrors();

    // Get form values
    const fullName = document.getElementById('fullName').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const dob = document.getElementById('dob').value;
    const course = document.getElementById('course').value;
    const gender = document.querySelector('input[name="gender"]:checked')?.value;
    const address = document.getElementById('address').value;

    // Validation flags
    let isValid = true;

    // Validate Full Name
    if (!validateFullName(fullName)) {
        showError('fullName', 'Jina lazima liwe na angalau herufi 3');
        isValid = false;
    }

    // Validate Email
    if (!validateEmail(email)) {
        showError('email', 'Tafadhali andika email sahihi');
        isValid = false;
    }

    // Check if email already exists
    const students = getStudents();
    if (students.some(student => student.email.toLowerCase() === email.toLowerCase())) {
        showError('email', 'Email hii imesajiliwa tayari');
        isValid = false;
    }

    // Validate Phone
    if (!validatePhone(phone)) {
        showError('phone', 'Nambari ya simu lazima iwe na tarakamu 10');
        isValid = false;
    }

    // Validate Date of Birth
    if (!dob) {
        showError('dob', 'Tafadhali chagua tarehe ya kuzaliwa');
        isValid = false;
    } else if (!validateDateOfBirth(dob)) {
        showError('dob', 'Umri lazima uwe kati ya 15 na 100 miaka');
        isValid = false;
    }

    // Validate Course
    if (!course) {
        showError('course', 'Tafadhali chagua kozi');
        isValid = false;
    }

    // Validate Gender
    if (!gender) {
        showError('gender', 'Tafadhali chagua jinsia');
        isValid = false;
    }

    // Validate Address
    if (!validateAddress(address)) {
        showError('address', 'Anwani lazima iwe na angalau herufi 5');
        isValid = false;
    }

    // If all validations pass, add student
    if (isValid) {
        const student = {
            id: generateId(),
            fullName,
            email,
            phone,
            dob,
            course,
            gender,
            address,
            registrationDate: new Date().toLocaleDateString('sw-TZ')
        };

        addStudent(student);
        registrationForm.reset();
        
        // Show success message
        showSuccessMessage('✅ Wanafunzi amesajiliwa kwa haraka!');
    }
});

// ===========================
// Success Message
// ===========================

function showSuccessMessage(message) {
    const messageDiv = document.createElement('div');
    messageDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #16a34a, #15803d);
        color: white;
        padding: 16px 24px;
        border-radius: 8px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        animation: slideInUp 0.4s ease-out;
        z-index: 1000;
        font-weight: 600;
    `;
    messageDiv.textContent = message;
    document.body.appendChild(messageDiv);

    setTimeout(() => {
        messageDiv.style.animation = 'slideInLeft 0.4s ease-out reverse';
        setTimeout(() => messageDiv.remove(), 400);
    }, 3000);
}

// ===========================
// LocalStorage Functions
// ===========================

function generateId() {
    return '_' + Math.random().toString(36).substr(2, 9);
}

function getStudents() {
    const students = localStorage.getItem('students');
    return students ? JSON.parse(students) : [];
}

function addStudent(student) {
    const students = getStudents();
    students.push(student);
    localStorage.setItem('students', JSON.stringify(students));
    loadStudents();
}

function deleteStudent(id) {
    let students = getStudents();
    students = students.filter(student => student.id !== id);
    localStorage.setItem('students', JSON.stringify(students));
    loadStudents();
}

// ===========================
// Display Students
// ===========================

function loadStudents() {
    const students = getStudents();
    studentsList.innerHTML = '';

    if (students.length === 0) {
        studentsList.innerHTML = '<p class="empty-message">Hakuna wanafunzi waliosajiliwa bado</p>';
        return;
    }

    students.forEach((student, index) => {
        const studentCard = createStudentCard(student, index);
        studentsList.appendChild(studentCard);
    });
}

function createStudentCard(student, index) {
    const card = document.createElement('div');
    card.className = 'student-card';
    card.style.animationDelay = `${index * 0.1}s`;

    const courseMap = {
        'web-development': 'Web Development',
        'mobile-app': 'Mobile App Development',
        'data-science': 'Data Science',
        'cybersecurity': 'Cybersecurity',
        'ui-ux': 'UI/UX Design'
    };

    const courseName = courseMap[student.course] || student.course;

    card.innerHTML = `
        <button class="delete-btn" onclick="confirmDelete('${student.id}')">🗑️ Futa</button>
        <div class="student-info">
            <div class="info-item">
                <div class="info-label">📝 Jina</div>
                <div class="info-value">${escapeHtml(student.fullName)}</div>
            </div>
            <div class="info-item">
                <div class="info-label">📧 Email</div>
                <div class="info-value">${escapeHtml(student.email)}</div>
            </div>
            <div class="info-item">
                <div class="info-label">📱 Simu</div>
                <div class="info-value">${escapeHtml(student.phone)}</div>
            </div>
            <div class="info-item">
                <div class="info-label">🎂 Tarehe ya Kuzaliwa</div>
                <div class="info-value">${new Date(student.dob).toLocaleDateString('sw-TZ')}</div>
            </div>
            <div class="info-item">
                <div class="info-label">🎓 Kozi</div>
                <div class="info-value">${courseName}</div>
            </div>
            <div class="info-item">
                <div class="info-label">👤 Jinsia</div>
                <div class="info-value">${student.gender}</div>
            </div>
            <div class="info-item info-item-full">
                <div class="info-label">📍 Anwani</div>
                <div class="info-value">${escapeHtml(student.address)}</div>
            </div>
            <div class="info-item">
                <div class="info-label">📅 Tarehe ya Kusajili</div>
                <div class="info-value">${student.registrationDate}</div>
            </div>
        </div>
    `;

    return card;
}

// ===========================
// Delete Confirmation
// ===========================

function confirmDelete(id) {
    if (confirm('Je, una hakika unataka kufuta wanafunzi huyu?')) {
        deleteStudent(id);
        showSuccessMessage('✅ Wanafunzi amefutwa');
    }
}

// ===========================
// Security Functions
// ===========================

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ===========================
// Real-time Form Validation
// ===========================

document.getElementById('fullName').addEventListener('blur', function() {
    if (this.value && !validateFullName(this.value)) {
        showError('fullName', 'Jina lazima liwe na angalau herufi 3');
    } else {
        document.getElementById('fullNameError').textContent = '';
    }
});

document.getElementById('email').addEventListener('blur', function() {
    if (this.value && !validateEmail(this.value)) {
        showError('email', 'Tafadhali andika email sahihi');
    } else {
        document.getElementById('emailError').textContent = '';
    }
});

document.getElementById('phone').addEventListener('blur', function() {
    if (this.value && !validatePhone(this.value)) {
        showError('phone', 'Nambari ya simu lazima iwe na tarakamu 10');
    } else {
        document.getElementById('phoneError').textContent = '';
    }
});

document.getElementById('dob').addEventListener('blur', function() {
    if (this.value && !validateDateOfBirth(this.value)) {
        showError('dob', 'Umri lazima uwe kati ya 15 na 100 miaka');
    } else {
        document.getElementById('dobError').textContent = '';
    }
});

document.getElementById('address').addEventListener('blur', function() {
    if (this.value && !validateAddress(this.value)) {
        showError('address', 'Anwani lazima iwe na angalau herufi 5');
    } else {
        document.getElementById('addressError').textContent = '';
    }
});

console.log('🚀 Student Registration System - Ready to use!');
