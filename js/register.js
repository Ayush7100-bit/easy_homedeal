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


    // Success

    registerMessage.textContent =
        "Account registration successful!";

    registerMessage.style.display = "block";

    registerMessage.style.background = "#eaf7ee";

    registerMessage.style.color = "#247a3d";


    console.log("Name:", name);
    console.log("Email:", email);
    console.log("Phone:", phone);

});