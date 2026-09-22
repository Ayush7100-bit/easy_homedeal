// EasyHome Deals
// Login System

const loginForm =
    document.getElementById("loginForm");

const loginMessage =
    document.getElementById("loginMessage");


loginForm.addEventListener("submit", function (event) {

    event.preventDefault();


    const email =
        document.getElementById("loginEmail").value.trim();

    const password =
        document.getElementById("loginPassword").value;


    // Get registered user

    const storedUser =
        localStorage.getItem("easyHomeUser");


    // Check if user exists

    if (!storedUser) {

        loginMessage.textContent =
            "No account found. Please register first.";

        loginMessage.style.display = "block";

        loginMessage.style.background = "#fdeaea";

        loginMessage.style.color = "#b42318";

        return;
    }


    const user =
        JSON.parse(storedUser);


    // Check email and password

    if (
        email === user.email &&
        password === user.password
    ) {

        localStorage.setItem(
            "easyHomeLoggedIn",
            "true"
        );


        localStorage.setItem(
            "easyHomeUserName",
            user.name
        );


        loginMessage.textContent =
            "Login successful! Welcome, " +
            user.name + ".";

        loginMessage.style.display = "block";

        loginMessage.style.background = "#eaf7ee";

        loginMessage.style.color = "#247a3d";


        loginForm.reset();

    } else {

        loginMessage.textContent =
            "Invalid email or password.";

        loginMessage.style.display = "block";

        loginMessage.style.background = "#fdeaea";

        loginMessage.style.color = "#b42318";

    }

});