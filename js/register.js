// EasyHome Deals
// Registration System

const registerForm =
    document.getElementById("registerForm");

const registerMessage =
    document.getElementById("registerMessage");


registerForm.addEventListener("submit", function (event) {

    event.preventDefault();

    const name =
        document.getElementById("registerName").value.trim();

    const email =
        document.getElementById("registerEmail").value.trim();

    const phone =
        document.getElementById("registerPhone").value.trim();

    const password =
        document.getElementById("registerPassword").value;

    const confirmPassword =
        document.getElementById("confirmPassword").value;


    // Check passwords

    if (password !== confirmPassword) {

        registerMessage.textContent =
            "Passwords do not match.";

        registerMessage.style.display = "block";

        registerMessage.style.background = "#fdeaea";

        registerMessage.style.color = "#b42318";

        return;
    }


    // Create user object

    const user = {

        name: name,

        email: email,

        phone: phone,

        password: password

    };


    // Save user in browser storage

    localStorage.setItem(
        "easyHomeUser",
        JSON.stringify(user)
    );


    // Success message

    registerMessage.textContent =
        "Account created successfully! You can now login.";

    registerMessage.style.display = "block";

    registerMessage.style.background = "#eaf7ee";

    registerMessage.style.color = "#247a3d";


    // Clear form

    registerForm.reset();

});