const registerForm = document.getElementById("registerForm");
const registerMessage = document.getElementById("registerMessage");

registerForm?.addEventListener("submit", event => {
  event.preventDefault();
  const name = document.getElementById("registerName").value.trim();
  const email = document.getElementById("registerEmail").value.trim().toLowerCase();
  const phone = document.getElementById("registerPhone").value.trim();
  const password = document.getElementById("registerPassword").value;
  const confirmPassword = document.getElementById("confirmPassword").value;

  if (name.length < 2) return showRegisterError("Please enter your full name.");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return showRegisterError("Please enter a valid email address.");
  if (!/^\+?\d[\d\s-]{8,14}$/.test(phone)) return showRegisterError("Please enter a valid phone number.");
  if (password.length < 6) return showRegisterError("Password must be at least 6 characters.");
  if (password !== confirmPassword) return showRegisterError("Passwords do not match.");

  localStorage.setItem("easyHomeUser", JSON.stringify({ name, email, phone, password }));
  registerMessage.textContent = "Account created successfully! You can now login.";
  registerMessage.style.display = "block";
  registerMessage.style.background = "#eaf7ee";
  registerMessage.style.color = "#247a3d";
  EH.toast("Account created");
  registerForm.reset();
});

function showRegisterError(message) {
  registerMessage.textContent = message;
  registerMessage.style.display = "block";
  registerMessage.style.background = "#fdeaea";
  registerMessage.style.color = "#b42318";
}
