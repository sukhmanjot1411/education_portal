document.getElementById('btnRegister').addEventListener('click', (event) => {
    let userName = document.forms.register.userName.value;
    let password = document.forms.register.password.value;
    let type = document.forms.register.registerRadioOptions.value;

    // Validate password
    if (!validatePassword(password)) {
        alert("Password must meet the following criteria:\n" +
            "- At least 8 and at most 20 characters\n" +
            "- Contains at least one digit\n" +
            "- Contains at least one uppercase letter\n" +
            "- Contains at least one lowercase letter\n" +
            "- Contains at least one special character (!@#$%&*()-+=^)\n" +
            "- Doesn't contain any white space.");
        return;
    }

    onCustomErrorCheck();
    if (!document.forms.register.checkValidity()) {
        event.preventDefault();
        event.stopPropagation();
        document.forms.register.classList.add('was-validated');
    } else {
        fetch('/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ userName, password, type })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                document.getElementById("registerAlert").classList.remove('d-none');
            } else {
                document.getElementById("registerExitAlert").classList.remove("d-none");
            }
            setTimeout(() => {
                document.getElementById("registerAlert").classList.add("d-none");
                document.getElementById("registerExitAlert").classList.add("d-none");
            }, 2000);
            document.forms.register.reset();
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }
});

document.getElementById('btnLogin').addEventListener('click', (e) => {
    let userName = document.forms.login.loginUserName.value;
    let password = document.forms.login.loginPassword.value;
    let type = document.forms.login.loginRadioOptions.value;
    let loginAlert = document.getElementById("loginAlert").classList;
    const admin = 0;
    const student = 1;

    if (!document.forms.login.checkValidity()) {
        event.preventDefault();
        event.stopPropagation();
        document.forms.login.classList.add('was-validated');
    } else {
        fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ userName, password, type })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                if (data.type == admin) {
                    sessionStorage.setItem('loginUser', JSON.stringify(data.user));
                    location.href = 'admin/index.html';
                }
                if (data.type == student) {
                    sessionStorage.setItem('loginUser', JSON.stringify(data.user));
                    location.href = 'student/index.html';
                }
            } else {
                loginAlert.remove("d-none");
            }
            setTimeout(() => {
                loginAlert.add("d-none");
            }, 2000);
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }
});

function validatePassword(password) {
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%&*()-+=^])(?!.*\s).{8,20}$/;
    return passwordRegex.test(password);
}

function onCustomErrorCheck() {
    let userName = document.forms.register.userName.value;
    let password = document.forms.register.password.value;
    let cPassword = document.forms.register.cPassword.value;
    if (isNaN(userName)) {
        document.forms.register.userName.setCustomValidity('');
    } else {
        document.getElementById('userNameErrorMessage').innerText = 'User Name Must be a string only.';
        document.forms.register.userName.setCustomValidity('User Name Must be a string only.');
    }

    if (cPassword == password) {
        document.forms.register.cPassword.setCustomValidity('');
    } else {
        document.getElementById('cPasswordErrorMessage').innerText = 'Passwords Do Not Match';
        document.forms.register.cPassword.setCustomValidity('Passwords do not match');
    }
}
