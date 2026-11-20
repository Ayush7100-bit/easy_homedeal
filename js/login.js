const loginForm = document.getElementById("loginForm");
const loginMessage = document.getElementById("loginMessage");

loginForm?.addEventListener("submit", event => {
  event.preventDefault();
  const email = document.getElementById("loginEmail").value.trim().toLowerCase();
  const password = document.getElementById("loginPassword").value;
  const storedUser = EH.user();
  const demoUser = { name: "Demo User", email: "demo@easyhome.demo", phone: "+919999999999", password: "demo123" };
  const user = storedUser && storedUser.email.toLowerCase() === email ? storedUser : (email === demoUser.email ? demoUser : null);

  if (!user || user.password !== password) {
    loginMessage.textContent = storedUser ? "Invalid email or password." : "No account found. Use the demo account or register.";
    loginMessage.style.display = "block";
    loginMessage.style.background = "#fdeaea";
    loginMessage.style.color = "#b42318";
    return;
  }
  localStorage.setItem("easyHomeLoggedIn", "true");
  localStorage.setItem("easyHomeUser", JSON.stringify(user));
  loginMessage.textContent = "Login successful! Welcome, " + user.name + ".";
  loginMessage.style.display = "block";
  loginMessage.style.background = "#eaf7ee";
  loginMessage.style.color = "#247a3d";
  EH.toast("Login successful");
  setTimeout(() => window.location.href = "index.html", 700);
});
